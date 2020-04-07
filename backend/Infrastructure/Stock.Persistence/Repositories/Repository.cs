using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FuncSharp;
using MongoDB.Driver;
using Stock.Application.Check;
using Stock.Application.Exceptions;
using Stock.Application.Infrastructure.Persistence.Repositories;
using Stock.Application.Infrastructure.Persistence.UnitOfWork;
using Stock.Domain.Entities.Interfaces;
using Stock.Domain.Entities.Validations;
using Stock.Utilities.Exceptions;
using Stock.Utilities.Extensions;
using Stock.Utilities.Helpers.Functions;

namespace Stock.Persistence.Repositories
{
    public abstract class Repository<TEntity> : IRepository<TEntity>
        where TEntity : class, IEntity
    {
        private readonly ICollectionContext<TEntity> _context;

        protected Repository(ICollectionContext<TEntity> context)
        {
            _context = context;
        }

        public virtual async Task<ITry<Guid>> TryAddAsync(IClientSessionHandle session, Func<Unit, TEntity> action)
        {
            return await Actions.TryActionAsync(async _ =>
            {
                var item = action(Unit.Value);
                item.Validate();
                await _context.Collection.InsertOneAsync(session, item.ToOption().Get(e => 
                    new BusinessException(BusinessErrorType.InvalidRequest, "Item cannot be null."))
                );

                return item.Id;
            });
        }

        public virtual async Task<ITry<IEnumerable<Guid>>> TryAddManyAsync(IClientSessionHandle session, Func<Unit, ICollection<TEntity>> action)
        {
            return await Actions.TryActionAsync(async _ =>
            {
                var collection = action(Unit.Value);
                collection.Validate();
                var nonEmptyCollection = collection.ToNonEmptyOption().Get(e =>
                    new BusinessException(BusinessErrorType.InvalidRequest, "Collection needs to contain at least one item.")
                );
                Business.Check(nonEmptyCollection.All(e => e.SafeNotEquals(default)), BusinessErrorType.InvalidRequest, "Item cannot be null.");
                await _context.Collection.InsertManyAsync(session, nonEmptyCollection);

                return collection.Select(c => c.Id);
            });
        }

        public virtual async Task<IOption<TEntity>> GetAsync(
            IClientSessionHandle session,
            Func<FilterDefinitionBuilder<TEntity>, FilterDefinition<TEntity>> filterDefinitionPredicate,
            Func<ProjectionDefinitionBuilder<TEntity>, ProjectionDefinition<TEntity>> projectionDefinitionPredicate = null
        )
        {
            var result = await GetManyAsync(session, filterDefinitionPredicate, projectionDefinitionPredicate);
            var entity = result.Map(e => e.FirstOrDefault());

            return entity;
        }

        public virtual async Task<IOption<IEnumerable<TEntity>>> GetManyAsync(
            IClientSessionHandle session, 
            Func<FilterDefinitionBuilder<TEntity>, FilterDefinition<TEntity>> filterDefinitionPredicate = null,
            Func<ProjectionDefinitionBuilder<TEntity>, ProjectionDefinition<TEntity>> projectionDefinitionPredicate = null
        )
        {
            var result = projectionDefinitionPredicate.ToOption().Match(
                p => filterDefinitionPredicate.ToOption().Match(
                    f => _context.Collection.Find(session, filterDefinitionPredicate(Builders<TEntity>.Filter)).Project<TEntity>(projectionDefinitionPredicate(Builders<TEntity>.Projection)), 
                    _ => _context.Collection.Find(session, Builders<TEntity>.Filter.Where(e => true)).Project<TEntity>(projectionDefinitionPredicate(Builders<TEntity>.Projection))
                ),
                _ => filterDefinitionPredicate.ToOption().Match(
                    f => _context.Collection.Find(session, filterDefinitionPredicate(Builders<TEntity>.Filter)), 
                    __ => _context.Collection.Find(session, Builders<TEntity>.Filter.Where(e => true))
                )
            );
            var entities = await result.ToListAsync();

            return entities.ToNonEmptyOption();
        }

        public virtual async Task<ITry<Guid>> TryUpdateAsync(
            IClientSessionHandle session,
            Func<FilterDefinitionBuilder<TEntity>, FilterDefinition<TEntity>> filterDefinitionPredicate,
            Func<UpdateDefinitionBuilder<TEntity>, UpdateDefinition<TEntity>> updateDefinitionPredicate
        )
        {
            return await Actions.TryActionAsync(async _ =>
            {
                var item = await GetAsync(session, filterDefinitionPredicate);
                
                return await item.Map(async e =>
                {
                    var updateResult = await _context.Collection.UpdateOneAsync(
                        session,
                        filterDefinitionPredicate(Builders<TEntity>.Filter) & Builders<TEntity>.Filter.Eq(en => en.Version, e.Version),
                        updateDefinitionPredicate(Builders<TEntity>.Update).Set(en => en.Version, Guid.NewGuid()),
                        new UpdateOptions { IsUpsert = false }
                    );

                    Business.Check(updateResult.ModifiedCount.SafeNotEquals(0), BusinessErrorType.UnsuccessfulOperation, "Update operation unsuccessful.");

                    var findResult = await GetAsync(session, filterDefinitionPredicate);
                    var updatedEntity = findResult.Get(__ => throw new InternalException(InternalErrorType.IncorrectBehavior, "Item cannot be null."));
                    updatedEntity.Validate();

                    return updatedEntity.Id;
                }).Get(__ => throw new BusinessException(BusinessErrorType.ItemNotExists, "Item not found."));
            });
        }

        public virtual async Task<ITry<Unit>> TryDeleteAsync(
            IClientSessionHandle session,
            Func<FilterDefinitionBuilder<TEntity>, FilterDefinition<TEntity>> filterDefinitionPredicate
        )
        {
            return await DeleteAsync(c => c.DeleteOneAsync(session, filterDefinitionPredicate(Builders<TEntity>.Filter)));
        }

        public virtual async Task<ITry<Unit>> TryDeleteManyAsync(
            IClientSessionHandle session,
            Func<FilterDefinitionBuilder<TEntity>, FilterDefinition<TEntity>> filterDefinitionPredicate
        )
        {
            return await DeleteAsync(c => c.DeleteManyAsync(session, filterDefinitionPredicate(Builders<TEntity>.Filter)));
        }

        private async Task<ITry<Unit>> DeleteAsync(Func<IMongoCollection<TEntity>, Task<DeleteResult>> deleteAction)
        {
            return await Actions.TryActionAsync(async _ =>
            {
                var result = await deleteAction(_context.Collection);

                Business.Check(result.DeletedCount.SafeNotEquals(0), BusinessErrorType.UnsuccessfulOperation, "Delete operation unsuccessful.");

                return Unit.Value;
            });
        }
    }
}