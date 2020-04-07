using Stock.Application.Infrastructure.Persistence.Repositories;
using Stock.Application.Infrastructure.Persistence.UnitOfWork;
using Stock.Domain.Entities;

namespace Stock.Persistence.Repositories
{
    public sealed class UsersRepository : Repository<User>, IUsersRepository
    {
        public UsersRepository(IUsersCollectionContext context)
            : base(context)
        {
        }
    }
}
