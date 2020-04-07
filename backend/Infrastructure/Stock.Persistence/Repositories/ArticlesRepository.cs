using Stock.Application.Infrastructure.Persistence.Repositories;
using Stock.Application.Infrastructure.Persistence.UnitOfWork;
using Stock.Domain.Entities;

namespace Stock.Persistence.Repositories
{
    public sealed class ArticlesRepository : Repository<Article>, IArticlesRepository
    {
        public ArticlesRepository(IArticlesCollectionContext context)
            : base(context)
        {
        }
    }
}
