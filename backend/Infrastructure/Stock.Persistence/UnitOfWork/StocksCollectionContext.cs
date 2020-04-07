using Stock.Application.Infrastructure.Persistence.UnitOfWork;

namespace Stock.Persistence.UnitOfWork
{
    public class StocksCollectionContext : CollectionContext<Domain.Entities.Stock>, IStocksCollectionContext
    {
        public StocksCollectionContext(IDbContext context)
            : base(context)
        {
        }
    }
}
