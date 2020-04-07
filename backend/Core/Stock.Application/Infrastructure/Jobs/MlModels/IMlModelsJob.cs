using System;

namespace Stock.Application.Infrastructure.Jobs.MlModels
{
    public interface IMlModelsJob : IJob
    {
        void Create(Guid id, TimeSpan delay, string username);
    }
}
