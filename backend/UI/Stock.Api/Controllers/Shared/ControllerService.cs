using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Amazon.CognitoIdentityProvider.Model;
using Amazon.Runtime.Internal;
using AutoMapper;
using FluentValidation;
using FuncSharp;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using MongoDB.Driver;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Serialization;
using Stock.Api.Http;
using Stock.Application.Exceptions;
using Stock.Application.Infrastructure.Components.Auth;
using Stock.Application.Infrastructure.Components.Business;
using Stock.Application.Infrastructure.Components.Interfaces;
using Stock.Application.Infrastructure.Persistence.UnitOfWork.Transactions;
using Stock.Utilities.Check;
using Stock.Utilities.Enumerations;
using Stock.Utilities.Exceptions;
using Stock.Utilities.Extensions;
using Stock.Utilities.Globalization;
using Stock.Utilities.Globalization.Keys;

namespace Stock.Api.Controllers.Shared
{
    [ApiController]
    public abstract class ControllerService : ControllerBase
    {
        private readonly ITransaction _transaction;
        private readonly IMapper _mapper;
        private readonly ILogger _errorLogger;

        protected ControllerService(ITransaction transaction, ILoggerFactory loggerFactory)
        {
            _transaction = transaction;
            _errorLogger = loggerFactory.CreateLogger("Error");
        }

        protected ControllerService(ITransaction transaction, IMapper mapper, ILoggerFactory loggerFactory)
        {
            _transaction = transaction;
            _mapper = mapper;
            _errorLogger = loggerFactory.CreateLogger("Error");
        }

        protected async Task<IActionResult> AuthorizedAuthOnlyAction<TResult>(Func<IAuthComponent, Headers, Task<TResult>> action)
        {
            return await HandledAction(async _ => Ok(await action(_transaction.BusinessContext.Auth, GetHeaders().Get(__ => new BusinessException(BusinessErrorType.InvalidRequest, Localization.Get(Keys.TokenError, Language.En))))));
        }

        protected async Task<IActionResult> AuthOnlyAction<TResult>(Func<IAuthComponent, Task<TResult>> action)
        {
            return await HandledAction(async _ => Ok(await action(_transaction.BusinessContext.Auth)));
        }

        protected async Task<IActionResult> AuthorizedTransaction<TResult>(Func<IBusinessContext, IClientSessionHandle, Headers, Task<TResult>> action)
        {
            return await HandledAction(async _ =>
            {
                var result = await _transaction.TryTransactionAsync(s => action(_transaction.BusinessContext, s, GetHeaders().Get(__ => new BusinessException(BusinessErrorType.InvalidRequest, Localization.Get(Keys.TokenError, Language.En)))));

                return Ok(result.Get(e => e.First()));
            });
        }

        protected async Task<IActionResult> UserTransaction<TResult>(Func<IBusinessContext, IClientSessionHandle, string, Task<TResult>> action)
        {
            return await AuthorizedTransaction(async (c, s, h) => await action(c, s, await c.Auth.GetUsernameAsync(h.AccessToken)));
        }

        protected async Task<IActionResult> Transaction<TResult>(Func<IBusinessContext, IClientSessionHandle, Task<TResult>> action)
        {
            return await HandledAction(async _ =>
            {
                var result = await _transaction.TryTransactionAsync(s => action(_transaction.BusinessContext, s));

                return Ok(result.Get(e => e.First()));
            });
        }

        protected async Task<IActionResult> OptionalAuthorizedTransaction<TResult>(Func<IBusinessContext, IClientSessionHandle, IOption<Headers>, Task<TResult>> action)
        {
            return await HandledAction(async _ =>
            {
                var result = await _transaction.TryTransactionAsync(s => action(_transaction.BusinessContext, s, GetHeaders()));

                return Ok(result.Get(e => e.First()));
            });
        }

        protected TDestination MapResponse<TDestination>(IOption<object> source) where TDestination : class, IMappable
        {
            CheckMapper();

            return _mapper.Map<TDestination>(source.Get(_ =>
                throw new InternalException(InternalErrorType.IncorrectBehavior, Localization.Get(Keys.InvalidCoproduct))
            ));
        }

        protected TDestination MapResponse<TDestination>(object source) where TDestination : class, IMappable
        {
            CheckMapper();

            return _mapper.Map<TDestination>(source);
        }

        protected IEnumerable<TDestination> MapResponse<TDestination>(IEnumerable<object> source) where TDestination : class, IMappable
        {
            CheckMapper();

            return _mapper.Map<IEnumerable<TDestination>>(source);
        }

        protected IEnumerable<TDestination> MapRequest<TSource, TDestination>(IEnumerable<TSource> source) where TSource : class, IMappable
        {
            CheckMapper();

            return _mapper.Map<IEnumerable<TDestination>>(source);
        }

        protected TDestination MapRequest<TSource, TDestination>(TSource source) where TSource : class, IMappable
        {
            CheckMapper();

            return _mapper.Map<TDestination>(source);
        }

        private void CheckMapper()
        {
            Internal.Check(_mapper.SafeNotEquals(default), InternalErrorType.InvalidOperation, Localization.Get(Keys.MapperError));
        }

        private IOption<Headers> GetHeaders()
        {
            var accessTokenSuccess = HttpContext.Request.Headers.TryGetValue("AccessToken", out var accessTokenValues);
            var languageSuccess = HttpContext.Request.Headers.TryGetValue("Language", out var languageValues);
            var language = languageSuccess.Match(
                t => languageValues.First().GetEnum(Language.En),
                f => Language.En
            );
            
            return accessTokenSuccess.ToTrueOption().Map(
                t => new Headers(accessTokenValues.First(), language)
            );
        }

        private async Task<IActionResult> HandledAction(Func<Unit, Task<IActionResult>> action)
        {
            try
            {
                return await action(Unit.Value);
            }
            catch (Exception e)
            {
                return HandleError(e);
            }
        }

        private IActionResult HandleError(Exception e)
        {
            return e.GetType().Match(
                typeof(BusinessException), _ =>
                {
                    var businessException = (BusinessException) e;
                    
                    return businessException.ErrorType.Match(
                        BusinessErrorType.InvalidRequest, __ => BadRequest(ToError(e.Message)),
                        BusinessErrorType.ItemNotExists, __ => NotFound(ToError(e.Message)),
                        BusinessErrorType.ItemExists, __ => Conflict(ToError(e.Message)),
                        BusinessErrorType.UnsuccessfulOperation, __ => StatusCode((int)HttpStatusCode.PreconditionFailed, ToError(e.Message)),
                        __ =>
                        {
                            LogError(e);
                            return StatusCode((int) HttpStatusCode.InternalServerError, ToError("Failure occured in external resources."));
                        }
                    );
                },
                ex =>
                {
                    return ex.Match(
                        typeof(ValidationException), __ => BadRequest(ToError(e.Message)),
                        typeof(InternalException), __ =>
                        {
                            LogError(e);
                            return StatusCode((int) HttpStatusCode.InternalServerError, ToError("Operation failed."));
                        },
                        typeof(NotAuthorizedException), __ => StatusCode((int) HttpStatusCode.Unauthorized, ToError(e.Message)),
                        typeof(JsonSerializationException), __ =>
                        {
                            LogError(e);
                            return BadRequest(e.InnerException.ToOption().Match(
                                exe => ToError(exe.Message),
                                ___ => ToError(e.InnerException?.Message))
                            );
                        },
                        typeof(HttpErrorResponseException), __ =>
                        {
                            var responseEx = (HttpErrorResponseException)e;
                            return StatusCode((int) responseEx.Response.StatusCode, ToError(responseEx.Message));
                        },
                        typeof(JsonReaderException), __ =>
                        {
                            LogError(e);
                            return BadRequest(ToError(e.Message));
                        },
                        typeof(LimitExceededException), __ => StatusCode((int) HttpStatusCode.TooManyRequests, ToError("Too many requests in a short amount of time. Please try later.")),
                        typeof(CodeMismatchException), __ => StatusCode((int) HttpStatusCode.Forbidden, ToError("Invalid verification code.")),
                        typeof(UserNotFoundException), __ => StatusCode((int) HttpStatusCode.NotFound, ToError("User with this username does not exist.")),
                        typeof(UsernameExistsException), __ => StatusCode((int) HttpStatusCode.Conflict, ToError("Username already exists.")),
                        __ =>
                        {
                            LogError(e);
                            return StatusCode((int) HttpStatusCode.InternalServerError, ToError("Unexpected failure."));
                        }
                    );
                }
            );
        }

        private static JObject ToError(object message)
        {
            return JObject.FromObject(
                new Error
                {
                    Errors = message
                }, 
                new JsonSerializer
                {
                    ContractResolver = new CamelCasePropertyNamesContractResolver()
                }
            );
        }

        private class Error
        {
            public object Errors { get; set; }
        }

        private void LogError(Exception e)
        {
            _errorLogger.LogError(e.Message);
            _errorLogger.LogError(e.InnerException?.Message);
            _errorLogger.LogError(JsonConvert.SerializeObject(e.StackTrace, Formatting.Indented));
        }
    }
}