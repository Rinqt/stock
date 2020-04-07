using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using FuncSharp;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Serialization;
using Stock.Application.Exceptions;
using Stock.Application.Infrastructure.Components.MlModels;
using Stock.Application.Infrastructure.Components.MlModels.Dtos;
using Stock.Application.Infrastructure.Persistence.Repositories;
using Stock.Components.Business;
using Stock.Components.MlModels.Configuration;
using Stock.Components.Static;
using Stock.Domain.Entities;
using Stock.Domain.Entities.MlModelParameters.Interfaces;
using Stock.Utilities.Attributes;
using Stock.Utilities.Exceptions;
using Stock.Utilities.Extensions;
using Stock.Utilities.Globalization;
using Stock.Utilities.Globalization.Keys;
using Stock.Utilities.Helpers.Functions;

namespace Stock.Components.MlModels
{
    public class MlModelsComponent : BusinessComponent<MlModel>, IMlModelsComponent
    {
        private readonly Ml _ml;

        public MlModelsComponent(IMlModelsRepository mlModels, IOptions<Ml> ml)
            : base(mlModels)
        {
            _ml = ml.Value;
        }

        public async Task<MlModel> GetAsync(IClientSessionHandle session, Guid userId, Guid id)
        {
            return await GetAsync(session, b => b.Where(m => m.Id == id && m.CreatedBy == userId));
        }

        public async Task<MlModel> GetAsync(IClientSessionHandle session, Guid id)
        {
            return await GetAsync(session, f => f.Eq(m => m.Id, id));
        }

        public async Task<IEnumerable<MlModel>> GetDefaultModelsAsync(IClientSessionHandle session)
        {
            return await GetManyAsync(session, b => b.Eq(m => m.Type, MlModelType.Default.GetDescription()));
        }

        public async Task<IEnumerable<SimpleMlModelResponse>> GetManyAsync(IClientSessionHandle session, Guid userId)
        {
            var result = await GetManyAsync(session, b => b.Eq(m => m.CreatedBy, userId));

            return result.Select(m => new SimpleMlModelResponse
            {
                Id = m.Id,
                CreatedAt = m.CreatedAt,
                Name = m.Name,
                CompanySymbol = m.Parameters.CompanySymbol,
                State = m.State,
                Type = m.Type
            }).OrderByDescending(m => m.CreatedAt);
        }

        public async Task<AddMlModelResponse> AddAsync(IClientSessionHandle session, MlModel mlModel)
        {
            var actionResult = await Actions.Throws<List<MlModel>, BusinessException>(async _ => (await GetManyAsync(session)).ToList());

            return await actionResult.Throws.Match(
                async t =>
                {
                    var id = await AddAsync(session, _ => mlModel);

                    return new AddMlModelResponse
                    {
                        Id = id,
                        Delay = new TimeSpan(0, 0, 0)
                    };
                },
                async f =>
                {
                    var duplicateMessage = IsDuplicate(actionResult.Value, mlModel);
                    duplicateMessage.Match(m => throw new BusinessException(BusinessErrorType.ItemExists, m));
                    var runningModelsCount = actionResult.Value.Where(m => m.State.SafeEquals(StateType.Pending.GetDescription())).ToList().Count;
                    var delay = new TimeSpan(0, runningModelsCount.Match(0, _ => 0, 1, _ => 1, 2, _ => 2, _ => runningModelsCount * 2), 0);
                    var id = await AddAsync(session, _ => mlModel);

                    return new AddMlModelResponse
                    {
                        Id = id,
                        Delay = delay
                    };
                }
            );
        }

        public async Task AddDefaultModelsAsync(IClientSessionHandle session, ICollection<MlModel> mlModels)
        {
            var actionResult = await Actions.Throws<List<MlModel>, BusinessException>(async _ => (await GetManyAsync(session, f => f.Eq(m => m.Type, MlModelType.Default.GetDescription()))).ToList());
            if (actionResult.Throws.SafeEquals(true))
            {
                await AddManyAsync(session, _ => mlModels);
            }
        }

        public async Task UpdateAsync(IClientSessionHandle session, Guid id, ITry<JObject> buildResult)
        {
            await buildResult.Success.Match(
                async o =>
                {
                    await UpdateAsync(
                        session,
                        f => f.Eq(m => m.Id, id),
                        u => u.Set(m => m.Result, JsonConvert.SerializeObject(o)).Set(m => m.State, StateType.Created.GetDescription())
                    );
                },
                async _ =>
                {
                    await UpdateAsync(
                        session,
                        f => f.Eq(m => m.Id, id),
                        u => u.Set(m => m.Result, null).Set(m => m.State, StateType.Failed.GetDescription())
                    );
                }
            );
        }

        public async Task<ITry<JObject>> BuildModelAsync(string modelType, IMlModelParameters parameters)
        {
            return await Actions.TryActionAsync(async _ =>
            {
                var path = GetPath(modelType);
                var request = new HttpRequestMessage(HttpMethod.Get, $"{_ml.BaseUrl}{path}")
                {
                    Content = new StringContent(
                        JsonConvert.SerializeObject(
                            new MlModelBuildRequestObject
                            {
                                Params = parameters
                            },
                            new JsonSerializerSettings
                            {
                                ContractResolver = new CamelCasePropertyNamesContractResolver()
                            }
                        ),
                        Encoding.UTF8, "application/json"
                    )
                };
                var response = await Http.SendAsync(request, Optimization.Memory);
                response.EnsureSuccessStatusCode();
                var result = await response.Content.ReadAsStringAsync();

                return JObject.Parse(result);
            });
        }

        public async Task<string> DeleteAsync(IClientSessionHandle session, Guid id, Guid userId)
        {
            var result = await DeleteAsync(session, b => b.Where(m => m.Id == id && m.CreatedBy == userId));

            return result.Match(Unit.Value, _ => "Delete model successful.");
        }

        public async Task DeleteManyAsync(IClientSessionHandle session, Guid userId)
        {
            await DeleteManyAsync(session, b => b.Eq(m => m.CreatedBy, userId));
        }

        private static IOption<string> IsDuplicate(IEnumerable<MlModel> models, MlModel model)
        {
            var existingModels = models.Where(m => m.CreatedBy.SafeEquals(model.CreatedBy) && m.State.SafeNotEquals(StateType.Failed.GetDescription())).ToList().ToNonEmptyOption();

            return existingModels.FlatMap(m =>
            {
                var equalities = m.Select(mo =>
                    (mo.Name.SafeEquals(model.Name), Localization.Get(Keys.DuplicateModel, "name"))
                );

                return equalities.Where(e => e.Item1.SafeEquals(true)).ToNonEmptyOption().Map(e =>
                    e.Distinct().Select(eq => eq.Item2).Aggregate((a, b) => $"{a} {b}")
                );
            });
        }

        private static string GetPath(string modelType)
        {
            return modelType.Match(
                MlModelType.LinearRegression.GetDescription(), _ => MlEndpoints.Linear.GetDescription(),
                MlModelType.ElasticRegression.GetDescription(), _ => MlEndpoints.Elastic.GetDescription(),
                MlModelType.LassoRegression.GetDescription(), _ => MlEndpoints.Lasso.GetDescription(),
                MlModelType.LassoLarsRegression.GetDescription(), _ => MlEndpoints.Lars.GetDescription(),
                MlModelType.RidgeRegression.GetDescription(), _ => MlEndpoints.Ridge.GetDescription(),
                MlModelType.BayesianRidgeRegression.GetDescription(), _ => MlEndpoints.Bayesian.GetDescription(),
                MlModelType.AdamRnn.GetDescription(), _ => MlEndpoints.Rnn.GetDescription(),
                MlModelType.AdamaxRnn.GetDescription(), _ => MlEndpoints.Rnn.GetDescription(),
                MlModelType.NadamRnn.GetDescription(), _ => MlEndpoints.Rnn.GetDescription(),
                MlModelType.AdadeltaRnn.GetDescription(), _ => MlEndpoints.Rnn.GetDescription(),
                MlModelType.RmsPropRnn.GetDescription(), _ => MlEndpoints.Rnn.GetDescription(),
                MlModelType.SgdRnn.GetDescription(), _ => MlEndpoints.Rnn.GetDescription(),
                MlModelType.DecisionTree.GetDescription(), _ => MlEndpoints.Decision.GetDescription(),
                MlModelType.RandomForest.GetDescription(), _ => MlEndpoints.Forest.GetDescription(),
                MlModelType.Default.GetDescription(), _ => MlEndpoints.Default.GetDescription(),
                _ => throw new InternalException(InternalErrorType.IncorrectBehavior, "Invalid model type.")
            );
        }

        private class MlModelBuildRequestObject
        {
            public IMlModelParameters Params { get; set; }
        }
    }

    internal enum MlEndpoints
    {
        [FieldDescription("default_predictor")]
        Default,
        [FieldDescription("lr_default_model")]
        Linear,
        [FieldDescription("lr_elastic_model")]
        Elastic,
        [FieldDescription("lr_lasso_model")]
        Lasso,
        [FieldDescription("lr_lasso_lars_model")]
        Lars,
        [FieldDescription("lr_ridge_model")]
        Ridge,
        [FieldDescription("lr_bayesian_ridge_model")]
        Bayesian,
        [FieldDescription("random_forest_model")]
        Forest,
        [FieldDescription("decision_tree_model")]
        Decision,
        [FieldDescription("rnn_lstm_model")]
        Rnn
    }
}
