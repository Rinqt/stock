using Stock.Application.Infrastructure.Persistence.Repositories;
using Stock.Application.Infrastructure.Persistence.UnitOfWork;
using Stock.Domain.Entities;

namespace Stock.Persistence.Repositories
{
    public sealed class CompaniesRepository : Repository<Company>, ICompaniesRepository
    {
        public CompaniesRepository(ICompaniesCollectionContext context)
            : base(context)
        {
        }
    }
}