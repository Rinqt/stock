using Stock.Application.Infrastructure.Persistence.UnitOfWork;
using Stock.Domain.Entities;

namespace Stock.Persistence.UnitOfWork
{
    public class CompaniesCollectionContext : CollectionContext<Company>, ICompaniesCollectionContext
    {
        public CompaniesCollectionContext(IDbContext context)
            : base(context)
        {
        }
    }
}
