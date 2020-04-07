using Hangfire;
using Stock.Application.Infrastructure.Jobs.Articles;
using Stock.Application.Infrastructure.Persistence.UnitOfWork.Transactions;

namespace Stock.Jobs.Articles
{
    public class ArticlesJob : JobBase, IArticlesJob
    {
        public ArticlesJob(ITransaction transaction)
            : base(transaction)
        {
        }

        public void Create()
        {
            RecurringJob.AddOrUpdate(() => AddArticles(), Cron.Hourly);
        }

        public void AddArticles()
        {
            Transaction((c, s) =>
            {
                c.Articles.AddNewAsync(s).GetAwaiter().GetResult();
            });
        }
    }
}
