using Microsoft.Extensions.Options;
using MongoDB.Driver;
using Stock.Application.Infrastructure.Persistence.UnitOfWork;
using Stock.Persistence.Database.Configuration;

namespace Stock.Persistence.UnitOfWork
{
    public sealed class DbContext : IDbContext
    {
        public IMongoClient Client { get; }

        public IMongoDatabase Database { get; }

        public DbContext(IOptions<Mongo> config)
        {
            var mongo = config.Value;
            Client = new MongoClient($"{mongo.Connection}");
            Database = Client.GetDatabase(mongo.Database)
                .WithReadPreference(ReadPreference.Primary)
                .WithReadConcern(ReadConcern.Snapshot)
                .WithWriteConcern(WriteConcern.WMajority);
        }
    }
}
