using MongoDB.Driver;
using Stock.Domain.Entities;

namespace Stock.Persistence.Database
{
    public static class DatabaseMigrator
    {
        public static void Execute(string connection, string database)
        {
            Mongo.Initialize(connection, database, d =>
            {
                d.GetCollection<Article>(nameof(Article), c =>
                {
                    c.DefineIndex("GetMany", false, b => b.Ascending(a => a.CompanySymbol).Ascending(a => a.CreatedAt));
                });
                d.GetCollection<Company>(nameof(Company), c =>
                {
                    c.DefineIndex("Get", true, b => b.Ascending(co => co.Symbol));
                });
                d.GetCollection<MlModel>(nameof(MlModel), c =>
                {
                    c.DefineIndex("Get", true, b => b.Ascending(m => m.Id).Ascending(m => m.CreatedBy));
                    c.DefineIndex("GetMany", false, b => b.Ascending(m => m.CreatedBy));
                });
                d.GetCollection<Domain.Entities.Stock>(nameof(Domain.Entities.Stock), c =>
                {
                    c.DefineIndex("GetMany", true, b => b.Ascending(s => s.CompanySymbol).Ascending(s => s.CreatedAt));
                });
                d.GetCollection<User>(nameof(User), c =>
                {
                    c.DefineIndex("Get", true, b => b.Ascending(u => u.Username));
                });
            });
        }
    }
}
