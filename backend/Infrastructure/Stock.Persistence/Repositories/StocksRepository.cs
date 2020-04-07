using Stock.Application.Infrastructure.Persistence.Repositories;
using Stock.Application.Infrastructure.Persistence.UnitOfWork;

namespace Stock.Persistence.Repositories
{
    public sealed class StocksRepository : Repository<Domain.Entities.Stock>, IStocksRepository
    {
        public StocksRepository(IStocksCollectionContext context)
            : base(context)
        {
        }
    }
}
