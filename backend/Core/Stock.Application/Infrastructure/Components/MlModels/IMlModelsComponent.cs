using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FuncSharp;
using MongoDB.Driver;
using Newtonsoft.Json.Linq;
using Stock.Application.Infrastructure.Components.MlModels.Dtos;
using Stock.Domain.Entities;
using Stock.Domain.Entities.MlModelParameters.Interfaces;

namespace Stock.Application.Infrastructure.Components.MlModels
{
    public interface IMlModelsComponent
    {
        Task<MlModel> GetAsync(IClientSessionHandle session, Guid userId, Guid id);

        Task<MlModel> GetAsync(IClientSessionHandle session, Guid id);

        Task<IEnumerable<MlModel>> GetDefaultModelsAsync(IClientSessionHandle session);

        Task<IEnumerable<SimpleMlModelResponse>> GetManyAsync(IClientSessionHandle session, Guid userId);

        Task<AddMlModelResponse> AddAsync(IClientSessionHandle session, MlModel mlModel);

        Task AddDefaultModelsAsync(IClientSessionHandle session, ICollection<MlModel> mlModels);

        Task UpdateAsync(IClientSessionHandle session, Guid id, ITry<JObject> buildResult);

        Task<ITry<JObject>> BuildModelAsync(string modelType, IMlModelParameters parameters);

        Task<string> DeleteAsync(IClientSessionHandle session, Guid id, Guid userId);

        Task DeleteManyAsync(IClientSessionHandle session, Guid userId);
    }
}
