using Stock.Application.Infrastructure.Persistence.Repositories;
using Stock.Application.Infrastructure.Persistence.UnitOfWork;
using Stock.Domain.Entities;

namespace Stock.Persistence.Repositories
{
    public sealed class MlModelsRepository : Repository<MlModel>, IMlModelsRepository
    {
        public MlModelsRepository(IMlModelsCollectionContext context)
            : base(context)
        {
        }
    }
}
