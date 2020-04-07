using Stock.Domain.Entities;

namespace Stock.Application.Infrastructure.Persistence.UnitOfWork
{
    public interface ICompaniesCollectionContext : ICollectionContext<Company>
    {
    }
}
