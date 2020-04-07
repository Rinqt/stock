using Stock.Application.Infrastructure.Persistence.UnitOfWork;
using Stock.Domain.Entities;

namespace Stock.Persistence.UnitOfWork
{
    public class ArticlesCollectionContext : CollectionContext<Article>, IArticlesCollectionContext
    {
        public ArticlesCollectionContext(IDbContext context)
            : base(context)
        {
        }
    }
}
