using MongoDB.Driver;
using Stock.Application.Infrastructure.Persistence.UnitOfWork;
using Stock.Domain.Entities.Interfaces;

namespace Stock.Persistence.UnitOfWork
{
    public abstract class CollectionContext<TEntity> : ICollectionContext<TEntity> 
        where TEntity : class, IEntity
    {
        public IMongoCollection<TEntity> Collection { get; }

        protected CollectionContext(IDbContext context)
        {
            Collection = context.Database.GetCollection<TEntity>(typeof(TEntity).Name)
                .WithReadPreference(ReadPreference.Primary)
                .WithReadConcern(ReadConcern.Snapshot)
                .WithWriteConcern(WriteConcern.WMajority);
        }
    }
}
