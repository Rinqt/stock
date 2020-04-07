using System;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using FuncSharp;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Linq;
using Stock.Api.Configuration;
using Stock.Api.Controllers.Shared;
using Stock.Api.Mappers;
using Stock.Api.Models.Dtos.MlModels;
using Stock.Application.Check;
using Stock.Application.Exceptions;
using Stock.Application.Infrastructure.Jobs.MlModels;
using Stock.Application.Infrastructure.Persistence.UnitOfWork.Transactions;
using Stock.Utilities.Exceptions;
using Stock.Utilities.Extensions;
using Stock.Utilities.Globalization;
using Stock.Utilities.Globalization.Keys;
using User = Stock.Application.Infrastructure.Components.Users.Dtos.User;

namespace Stock.Api.Controllers
{
    [Authorize(Policy = Policies.AllAllowed)]
    [Route(Routes.BaseRoute + Routes.MlModels.Route)]
    public class MlModelsController : ControllerService
    {
        private readonly IMlModelsJob _job;

        public MlModelsController(ITransaction transaction, IMlModelsJob job, IMapper mapper, ILoggerFactory loggerFactory)
            : base(transaction, mapper, loggerFactory)
        {
            _job = job;
        }

        /// <summary>
        /// Requires access token.
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<IActionResult> Add([FromBody] AddModelRequest model)
        {
            return await UserTransaction(async (c, s, u) =>
            {
                Business.Check(model.Parameters.SafeNotEquals(default), BusinessErrorType.InvalidRequest, "Parameters cannot be null.");
                var user = (await c.Users.GetAsync<User>(s, u)).User.Get(_ =>
                    throw new InternalException(InternalErrorType.IncorrectBehavior, Localization.Get(Keys.InvalidCoproduct))
                );
                var result = Domain.Entities.MlModel.TryCreate(model.Name, model.Type, user.Id, JObject.FromObject(model.Parameters).Map(model.Type));
                var mlModel = result.Get(e => e.First());
                var addResult = await c.MlModels.AddAsync(s, mlModel);
                _job.Create(addResult.Id, addResult.Delay, u);

                return MapResponse<AddMlModelResponse>(addResult);
            });
        }

        /// <summary>
        /// Requires access token.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] Guid id)
        {
            return await UserTransaction(async (c, s, u) =>
            {
                var user = (await c.Users.GetAsync<User>(s, u)).User.Get(_ =>
                    throw new InternalException(InternalErrorType.IncorrectBehavior, Localization.Get(Keys.InvalidCoproduct))
                );

                return MapResponse<MlModel>(await c.MlModels.GetAsync(s, user.Id, id));
            });
        }

        [AllowAnonymous]
        [HttpGet]
        [Route(Routes.MlModels.Default)]
        public async Task<IActionResult> GetDefault([FromQuery] string companySymbol)
        {
            return await Transaction(async (c, s) =>
            {
                var models = await c.MlModels.GetDefaultModelsAsync(s);
                return models.FirstOption(m => m.Parameters.CompanySymbol.SafeEquals(companySymbol)).Get(_ =>
                    throw new BusinessException(BusinessErrorType.ItemNotExists, "Model for provided company is not available.")
                ).Result;
            });
        }

        /// <summary>
        /// Requires access token.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route(Routes.MlModels.All)]
        public async Task<IActionResult> GetAll()
        {
            return await UserTransaction(async (c, s, u) =>
            {
                var user = (await c.Users.GetAsync<User>(s, u)).User.Get(_ =>
                    throw new InternalException(InternalErrorType.IncorrectBehavior, Localization.Get(Keys.InvalidCoproduct))
                );

                return await c.MlModels.GetManyAsync(s, user.Id);
            });
        }

        /// <summary>
        /// Requires access token.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete]
        public async Task<IActionResult> Delete([FromQuery] Guid id)
        {
            return await UserTransaction(async (c, s, u) =>
            {
                var user = (await c.Users.GetAsync<User>(s, u)).User.Get(_ =>
                    throw new InternalException(InternalErrorType.IncorrectBehavior, Localization.Get(Keys.InvalidCoproduct))
                );

                return await c.MlModels.DeleteAsync(s, id, user.Id);
            });
        }
    }
}