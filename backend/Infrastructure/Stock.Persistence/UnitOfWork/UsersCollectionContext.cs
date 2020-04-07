using Stock.Application.Infrastructure.Persistence.UnitOfWork;
using Stock.Domain.Entities;

namespace Stock.Persistence.UnitOfWork
{
    public class UsersCollectionContext : CollectionContext<User>, IUsersCollectionContext
    {
        public UsersCollectionContext(IDbContext context)
            : base(context)
        {
        }
    }
}
