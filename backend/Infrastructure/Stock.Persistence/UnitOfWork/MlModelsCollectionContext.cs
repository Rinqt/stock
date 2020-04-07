using Stock.Application.Infrastructure.Persistence.UnitOfWork;
using Stock.Domain.Entities;

namespace Stock.Persistence.UnitOfWork
{
    public class MlModelsCollectionContext : CollectionContext<MlModel>, IMlModelsCollectionContext
    {
        public MlModelsCollectionContext(IDbContext context)
            : base(context)
        {
        }
    }
}
