using MongoDB.Driver;
using Stock.Domain.Entities.Interfaces;

namespace Stock.Application.Infrastructure.Persistence.UnitOfWork
{
    /// <summary>
    /// Represents the unit of work (UoW) for a single repository in a lifetime of a single transaction.
    /// </summary>
    public interface ICollectionContext<TEntity> 
        where TEntity : class, IEntity
    {
        IMongoCollection<TEntity> Collection { get; }
    }
}
