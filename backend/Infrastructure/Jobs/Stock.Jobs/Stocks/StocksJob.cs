using Hangfire;
using Stock.Application.Infrastructure.Components.Stocks;
using Stock.Application.Infrastructure.Jobs.Stocks;
using Stock.Application.Infrastructure.Persistence.UnitOfWork.Transactions;

namespace Stock.Jobs.Stocks
{
    public class StocksJob : JobBase, IStocksJob
    {
        public StocksJob(ITransaction transaction)
            : base(transaction)
        {
        }

        public void Create()
        {
            RecurringJob.AddOrUpdate(() => AddHistoricalStocks(), Cron.Never);
            RecurringJob.AddOrUpdate(() => AddDailyStocks(), Cron.Daily(23));
        }

        public void AddHistoricalStocks()
        {
            Transaction((c, s) =>
            {
                c.Stocks.AddNewAsync(s, Range.Historical).GetAwaiter().GetResult();
            });
        }

        public void AddDailyStocks()
        {
            Transaction((c, s) =>
            {
                c.Stocks.AddNewAsync(s, Range.Daily).GetAwaiter().GetResult();
            });
        }
    }
}
