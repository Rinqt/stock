using Hangfire;
using Stock.Application.Infrastructure.Jobs.Companies;
using Stock.Application.Infrastructure.Persistence.UnitOfWork.Transactions;

namespace Stock.Jobs.Companies
{
    public class CompaniesJob : JobBase, ICompaniesJob
    {
        public CompaniesJob(ITransaction transaction)
            : base(transaction)
        {
        }

        public void Create()
        {
            RecurringJob.AddOrUpdate(() => AddCompanies(), Cron.Never);
        }

        public void AddCompanies()
        {
            Transaction((c, s) =>
            {
                c.Companies.AddManyAsync(s).GetAwaiter().GetResult();
            });
        }
    }
}
