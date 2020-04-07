using System;
using FluentValidation;
using FuncSharp;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Stock.Domain.Entities.Interfaces;
using Stock.Domain.Entities.MlModelParameters.Interfaces;
using Stock.Domain.Entities.Validations;
using Stock.Utilities.Attributes;
using Stock.Utilities.Extensions;
using Stock.Utilities.Helpers.Functions;

namespace Stock.Domain.Entities
{
    public sealed class MlModel : IEntity
    {
        [BsonId]
        [BsonRepresentation(BsonType.String)]
        public Guid Id { get; private set; }

        public DateTime CreatedAt { get; private set; }

        [BsonRepresentation(BsonType.String)]
        public Guid Version { get; private set; }

        public string Name { get; private set; }

        public string Type { get; private set; }

        public IMlModelParameters Parameters { get; private set; }

        [BsonRepresentation(BsonType.String)]
        public Guid CreatedBy { get; private set; }

        public string State { get; private set; }

        public object Result { get; private set; }

        private MlModel(string name, string type, Guid createdBy, IMlModelParameters parameters)
        {
            Id = Guid.NewGuid();
            CreatedAt = DateTime.UtcNow;
            Version = Guid.NewGuid();
            Name = name;
            Type = type;
            Parameters = parameters;
            CreatedBy = createdBy;
            State = StateType.Pending.GetDescription();
            Result = null;
        }

        public static ITry<MlModel> TryCreate(string name, string modelType, Guid createdBy, IMlModelParameters modelParameters)
        {
            return Actions.TryAction<MlModel, ValidationException>(_ =>
            {
                var mlModel = new MlModel(name, modelType, createdBy, modelParameters);
                mlModel.Validate();
                
                return mlModel;
            });
        }

        public void Validate(IEntity entity)
        {
            var mlModel = (MlModel) entity;
            var validator = new MlModelValidator(mlModel.Type);
            validator.Validate(mlModel);
        }
    }

    public enum MlModelType
    {
        [FieldDescription("default")]
        Default,

        [FieldDescription("linear")]
        LinearRegression,

        [FieldDescription("elastic")]
        ElasticRegression,

        [FieldDescription("lasso")]
        LassoRegression,

        [FieldDescription("lassoLars")]
        LassoLarsRegression,

        [FieldDescription("ridge")]
        RidgeRegression,

        [FieldDescription("bayesianRidge")]
        BayesianRidgeRegression,

        [FieldDescription("Adam")]
        AdamRnn,

        [FieldDescription("Adamax")]
        AdamaxRnn,

        [FieldDescription("Nadam")]
        NadamRnn,

        [FieldDescription("Adadelta")]
        AdadeltaRnn,

        [FieldDescription("RMSprop")]
        RmsPropRnn,

        [FieldDescription("SGD")]
        SgdRnn,
        [FieldDescription("decisionTree")]
        DecisionTree,

        [FieldDescription("randomForest")]
        RandomForest
    }

    public enum OptimizerType
    {
        [FieldDescription("Adam")]
        Adam,

        [FieldDescription("Adamax")]
        Adamax,

        [FieldDescription("Nadam")]
        Nadam,

        [FieldDescription("Adadelta")]
        Adadelta,

        [FieldDescription("RMSprop")]
        RmsProp,

        [FieldDescription("SGD")]
        Sgd
    }

    public enum FeatureType
    {
        [FieldDescription("high")]
        High,

        [FieldDescription("low")]
        Low,

        [FieldDescription("open")]
        Open,

        [FieldDescription("close")]
        Close,

        [FieldDescription("volume")]
        Volume
    }

    public enum SelectionType
    {
        [FieldDescription("cyclic")]
        Cyclic,

        [FieldDescription("random")]
        Random
    }

    public enum ScalerType
    {
        [FieldDescription("StandardScaler")]
        Standard,

        [FieldDescription("MinMaxScaler")]
        MinMax,

        [FieldDescription("RobustScaler")]
        Robust,

        [FieldDescription("MaxAbsScaler")]
        MaxAbs
    }

    public enum StateType
    {
        [FieldDescription("Pending")]
        Pending,

        [FieldDescription("Created")]
        Created,

        [FieldDescription("Failed")]
        Failed
    }

    public enum SolverType
    {
        [FieldDescription("auto")]
        Auto,

        [FieldDescription("svd")]
        Svd,

        [FieldDescription("cholesky")]
        Cholesky,

        [FieldDescription("lsqr")]
        Lsqr,

        [FieldDescription("sparse_cg")]
        Sparse,

        [FieldDescription("sag")]
        Sag,

        [FieldDescription("saga")]
        Saga
    }

    public enum MetricsType
    {
        [FieldDescription("mse")]
        Mse,

        [FieldDescription("mae")]
        Mae,

        [FieldDescription("mape")]
        Mape
    }

    public enum CriterionType
    {
        [FieldDescription("mse")]
        Mse,
        [FieldDescription("mae")]
        Mae,
        [FieldDescription("friedman_mse")]
        FriedmanMse
    }

    public enum SplitterType
    {
        [FieldDescription("best")]
        Best,
        [FieldDescription("random")]
        Random
    }
}
