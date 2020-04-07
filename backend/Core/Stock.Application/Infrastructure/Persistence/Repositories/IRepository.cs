using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FuncSharp;
using MongoDB.Driver;
using Stock.Domain.Entities.Interfaces;

namespace Stock.Application.Infrastructure.Persistence.Repositories
{
    public interface IRepository<TEntity>
        where TEntity : class, IEntity
    {
        /// <summary>
        /// Returns ITry of Guid. If successful, ITry contains Guid of added object. Otherwise, ITry contains errors happened during the operation.
        /// </summary>
        /// <param name="session"></param>
        /// <param name="action"></param>
        /// <returns></returns>
        Task<ITry<Guid>> TryAddAsync(
            IClientSessionHandle session,
            Func<Unit, TEntity> action
        );

        /// <summary>
        /// Returns ITry of collection of Guid. If successful, ITry contains collection of Guid of added objects. Otherwise, ITry contains errors happened during the operation.
        /// </summary>
        /// <param name="session"></param>
        /// <param name="action"></param>
        /// <returns></returns>
        Task<ITry<IEnumerable<Guid>>> TryAddManyAsync(
            IClientSessionHandle session,
            Func<Unit, ICollection<TEntity>> action
        );

        /// <summary>
        /// Returns IOption of entity object. If there is no object under specified condition, IOption will be empty.
        /// Internally, it calls GetManyAsync and returns the first or default item (null).
        /// If you want to retrieve a collection instead of one item, use GetManyAsync instead.
        /// </summary>
        /// <param name="session"></param>
        /// <param name="filterDefinitionPredicate"></param>
        /// <param name="projectionDefinitionPredicate"></param>
        /// <returns></returns>
        Task<IOption<TEntity>> GetAsync(
            IClientSessionHandle session,
            Func<FilterDefinitionBuilder<TEntity>, FilterDefinition<TEntity>> filterDefinitionPredicate,
            Func<ProjectionDefinitionBuilder<TEntity>, ProjectionDefinition<TEntity>> projectionDefinitionPredicate = null
        );

        /// <summary>
        /// Returns IOption of collection of entity objects. If there are no objects under specified condition, IOption will be empty.
        /// </summary>
        /// <param name="session"></param>
        /// <param name="filterDefinitionPredicate"></param>
        /// <param name="projectionDefinitionPredicate"></param>
        /// <returns></returns>
        Task<IOption<IEnumerable<TEntity>>> GetManyAsync(
            IClientSessionHandle session, 
            Func<FilterDefinitionBuilder<TEntity>, FilterDefinition<TEntity>> filterDefinitionPredicate = null,
            Func<ProjectionDefinitionBuilder<TEntity>, ProjectionDefinition<TEntity>> projectionDefinitionPredicate = null
        );

        /// <summary>
        /// Returns ITry of Guid. If successful, ITry contains Guid of the updated object. Otherwise, ITry contains errors happened during the operation.
        /// </summary>
        /// <param name="session"></param>
        /// <param name="filterDefinitionPredicate"></param>
        /// <param name="updateDefinitionPredicate"></param>
        /// <returns></returns>
        Task<ITry<Guid>> TryUpdateAsync(
            IClientSessionHandle session,
            Func<FilterDefinitionBuilder<TEntity>, FilterDefinition<TEntity>> filterDefinitionPredicate,
            Func<UpdateDefinitionBuilder<TEntity>, UpdateDefinition<TEntity>> updateDefinitionPredicate
        );

        /// <summary>
        /// Returns ITry of Unit (logical true -> success). If successful, ITry contains Unit. Otherwise, ITry contains errors happened during the operation.
        /// </summary>
        /// <param name="session"></param>
        /// <param name="filterDefinitionPredicate"></param>
        /// <returns></returns>
        Task<ITry<Unit>> TryDeleteAsync(
            IClientSessionHandle session,
            Func<FilterDefinitionBuilder<TEntity>, FilterDefinition<TEntity>> filterDefinitionPredicate
        );

        /// <summary>
        /// Returns ITry of Unit (logical true -> success). If successful, ITry contains Unit. Otherwise, ITry contains errors happened during the operation.
        /// </summary>
        /// <param name="session"></param>
        /// <param name="filterDefinitionPredicate"></param>
        /// <returns></returns>
        Task<ITry<Unit>> TryDeleteManyAsync(
            IClientSessionHandle session,
            Func<FilterDefinitionBuilder<TEntity>, FilterDefinition<TEntity>> filterDefinitionPredicate
        );
    }
}
