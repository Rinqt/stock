using MongoDB.Driver;

namespace Stock.Application.Infrastructure.Persistence.UnitOfWork
{
    /// <summary>
    /// Represents the unit of work (UoW) shared by multiple repositories in a lifetime of a single transaction.
    /// </summary>
    public interface IDbContext
    {
        IMongoClient Client { get; }

        IMongoDatabase Database { get; }
    }
}
