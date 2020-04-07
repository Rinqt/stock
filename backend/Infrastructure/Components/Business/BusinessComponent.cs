using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using FluentValidation;
using FuncSharp;
using MongoDB.Driver;
using Newtonsoft.Json;
using Stock.Application.Exceptions;
using Stock.Application.Infrastructure.Persistence.Repositories;
using Stock.Components.Static;
using Stock.Domain.Entities.Interfaces;

namespace Stock.Components.Business
{
    public abstract class BusinessComponent<TEntity>
        where TEntity : class, IEntity
    {
        private readonly IRepository<TEntity> _repository;

        protected BusinessComponent(IRepository<TEntity> repository)
        {
            _repository = repository;
        }

        protected async Task<Guid> AddAsync(IClientSessionHandle session, Func<Unit, TEntity> action)
        {
            return await BusinessActionAsync(async _ =>
            {
                var response = await _repository.TryAddAsync(session, action);

                return response.Get(e => e.First());
            });
        }

        protected async Task AddManyAsync(IClientSessionHandle session, Func<Unit, ICollection<TEntity>> action)
        {
            await BusinessActionAsync(async _ =>
            {
                var response = await _repository.TryAddManyAsync(session, action);

                return response.Get(e => e.First());
            });
        }

        protected async Task<TEntity> GetAsync(
            IClientSessionHandle session,
            Func<FilterDefinitionBuilder<TEntity>, FilterDefinition<TEntity>> filterDefinitionPredicate,
            Func<ProjectionDefinitionBuilder<TEntity>, ProjectionDefinition<TEntity>> projectionDefinitionPredicate = null
        )
        {
            return await BusinessActionAsync(async _ =>
            {
                var response = await _repository.GetAsync(session, filterDefinitionPredicate, projectionDefinitionPredicate);

                return response.Get(__ => throw new BusinessException(BusinessErrorType.ItemNotExists, "Item not found."));
            });
        }

        protected async Task<IEnumerable<TEntity>> GetManyAsync(
            IClientSessionHandle session,
            Func<FilterDefinitionBuilder<TEntity>, FilterDefinition<TEntity>> filterDefinitionPredicate = null,
            Func<ProjectionDefinitionBuilder<TEntity>, ProjectionDefinition<TEntity>> projectionDefinitionPredicate = null
        )
        {
            return await BusinessActionAsync(async _ =>
            {
                var response = await _repository.GetManyAsync(session, filterDefinitionPredicate, projectionDefinitionPredicate);

                return response.Get(__ => throw new BusinessException(BusinessErrorType.ItemNotExists, "There are no items."));
            });
        }

        protected async Task<Guid> UpdateAsync(
            IClientSessionHandle session,
            Func<FilterDefinitionBuilder<TEntity>, FilterDefinition<TEntity>> filterDefinitionPredicate,
            Func<UpdateDefinitionBuilder<TEntity>, UpdateDefinition<TEntity>> updateDefinitionPredicate
        )
        {
            return await BusinessActionAsync(async _ =>
            {
                var response = await _repository.TryUpdateAsync(session, filterDefinitionPredicate, updateDefinitionPredicate);

                return response.Get(e => e.First());
            });
        }

        protected async Task<Unit> DeleteAsync(
            IClientSessionHandle session,
            Func<FilterDefinitionBuilder<TEntity>, FilterDefinition<TEntity>> filterDefinitionPredicate
        )
        {
            return await BusinessActionAsync(async _ =>
            {
                var response = await _repository.TryDeleteAsync(session, filterDefinitionPredicate);

                return response.Get(e => e.First());
            });
        }

        protected async Task<Unit> DeleteManyAsync(
            IClientSessionHandle session,
            Func<FilterDefinitionBuilder<TEntity>, FilterDefinition<TEntity>> filterDefinitionPredicate
        )
        {
            return await BusinessActionAsync(async _ =>
            {
                var response = await _repository.TryDeleteManyAsync(session, filterDefinitionPredicate);

                return response.Get(e => e.First());
            });
        }

        protected async Task<ITry<TDeserializedResponse>> GetDeserializedIexHttpResponse<TDeserializedResponse>(string baseUrl, string path, string token, Optimization optimization = Optimization.Memory)
        {
            return await Utilities.Helpers.Functions.Actions.TryActionAsync(async _ =>
            {
                var uriBuilder = new UriBuilder($"{baseUrl}{path}");
                var query = HttpUtility.ParseQueryString(uriBuilder.Query);
                query["token"] = token;
                uriBuilder.Query = query.ToString();
                using var response = await Http.GetAsync(new Uri(uriBuilder.ToString()), optimization);
                response.EnsureSuccessStatusCode();
                var result = await response.Content.ReadAsStringAsync();
                
                return JsonConvert.DeserializeObject<TDeserializedResponse>(result);
            });
        }

        protected static async Task<TResult> BusinessActionAsync<TResult>(Func<Unit, Task<TResult>> action)
        {
            try
            {
                return await action(Unit.Value);
            }
            catch (BusinessException)
            {
                throw;
            }
            catch (ValidationException e)
            {
                throw new BusinessException(BusinessErrorType.InvalidRequest, e.Message);
            }
            catch (Exception e)
            {
                throw new BusinessException(BusinessErrorType.Failure, e.Message);
            }
        }
    }
}
