using Hangfire;
using Microsoft.Extensions.Options;
using Stock.Application.Infrastructure.Jobs.Platform.Database;
using Stock.Persistence.Database;
using Mongo = Stock.Persistence.Database.Configuration.Mongo;

namespace Stock.Jobs.Platform.Database
{
    public class DatabaseJob : IDatabaseJob
    {
        private readonly Mongo _mongo;

        public DatabaseJob(IOptions<Mongo> mongo)
        {
            _mongo = mongo.Value;
        }

        public void Create()
        {
            BackgroundJob.Enqueue(() => DatabaseMigrator.Execute(_mongo.Connection, _mongo.Database));
            RecurringJob.AddOrUpdate(() => DatabaseMigrator.Execute(_mongo.Connection, _mongo.Database), Cron.Never);
        }
    }
}
