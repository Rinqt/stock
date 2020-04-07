using FuncSharp;
using Newtonsoft.Json.Linq;
using Stock.Application.Exceptions;
using Stock.Domain.Entities;
using Stock.Domain.Entities.MlModelParameters.DTrees;
using Stock.Domain.Entities.MlModelParameters.Interfaces;
using Stock.Domain.Entities.MlModelParameters.Regression;
using Stock.Domain.Entities.MlModelParameters.Rnn;
using Stock.Utilities.Extensions;

namespace Stock.Api.Mappers
{
    public static class MlModelParametersMapper
    {
        public static IMlModelParameters Map(this JObject modelParameters, string modelType)
        {
            return modelType.Match<string, IMlModelParameters>(
                MlModelType.LinearRegression.GetDescription(), _ => modelParameters.ToObject<LinearRegressionParameters>(),
                MlModelType.ElasticRegression.GetDescription(), _ => modelParameters.ToObject<ElasticRegressionParameters>(),
                MlModelType.LassoRegression.GetDescription(), _ => modelParameters.ToObject<LassoRegressionParameters>(),
                MlModelType.LassoLarsRegression.GetDescription(), _ => modelParameters.ToObject<LassoLarsRegressionParameters>(),
                MlModelType.RidgeRegression.GetDescription(), _ => modelParameters.ToObject<RidgeRegressionParameters>(),
                MlModelType.BayesianRidgeRegression.GetDescription(), _ => modelParameters.ToObject<BayesianRidgeRegressionParameters>(),
                MlModelType.AdamRnn.GetDescription(), _ => modelParameters.ToObject<AdamRnnParameters>(),
                MlModelType.AdamaxRnn.GetDescription(), _ => modelParameters.ToObject<AdamaxRnnParameters>(),
                MlModelType.NadamRnn.GetDescription(), _ => modelParameters.ToObject<NadamRnnParameters>(),
                MlModelType.AdadeltaRnn.GetDescription(), _ => modelParameters.ToObject<AdadeltaRnnParameters>(),
                MlModelType.RmsPropRnn.GetDescription(), _ => modelParameters.ToObject<RmsPropRnnParameters>(),
                MlModelType.DecisionTree.GetDescription(), _ => modelParameters.ToObject<DecisionTreeParameters>(),
                MlModelType.RandomForest.GetDescription(), _ => modelParameters.ToObject<RandomForestParameters>(),
                MlModelType.SgdRnn.GetDescription(), _ => modelParameters.ToObject<SgdRnnParameters>(),
                _ => throw new BusinessException(BusinessErrorType.InvalidRequest, "Model type not supported.")
            );
        }
    }
}
