using Stock.Domain.Entities;

namespace Stock.Application.Infrastructure.Persistence.UnitOfWork
{
    public interface IArticlesCollectionContext : ICollectionContext<Article>
    {
    }
}
