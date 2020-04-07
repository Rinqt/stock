using Stock.Domain.Entities;

namespace Stock.Application.Infrastructure.Persistence.UnitOfWork
{
    public interface IUsersCollectionContext : ICollectionContext<User>
    {
    }
}
