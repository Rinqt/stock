using System.Linq;
using FluentValidation;
using FuncSharp;
using Stock.Domain.Entities.MlModelParameters;
using Stock.Domain.Entities.MlModelParameters.DTrees;
using Stock.Domain.Entities.MlModelParameters.Regression;
using Stock.Domain.Entities.MlModelParameters.Rnn;
using Stock.Utilities.Extensions;

namespace Stock.Domain.Entities.Validations
{
    internal sealed class MlModelValidator : AbstractValidator<MlModel>
    {
        internal MlModelValidator(string modelType)
        {
            if (modelType.SafeNotEquals(MlModelType.Default.GetDescription()))
            {
                RuleFor(m => m.Name).NotEmpty();
                RuleFor(m => m.Parameters).NotEmpty().WithMessage("Model parameters must be defined.");
                RuleFor(m => m.Type.InEnum<MlModelType>())
                    .Must(b => b)
                    .WithMessage("Model type is not supported.");
                RuleFor(m => (BaseParameters)m.Parameters)
                    .ChildRules(bp => bp.RuleFor(p => p.CompanySymbol.InEnum<CompanySymbol>())
                        .Must(b => b)
                        .WithMessage("Company with provided company symbol does not exist.")
                    )
                    .ChildRules(bp => bp.RuleFor(p => p.ForecastOut)
                        .GreaterThanOrEqualTo(1).LessThanOrEqualTo(30)
                        .WithMessage("Forecast out value must be between 1 and 30.")
                    )
                    .ChildRules(bp => bp.RuleFor(p => p.TestSize)
                        .GreaterThanOrEqualTo(0.1).LessThanOrEqualTo(0.9)
                        .WithMessage("Test size must be between 10% and 90%.")
                    )
                    .ChildRules(bp => bp.RuleFor(p => p.Features.AllInEnum<FeatureType>())
                        .Must(b => b)
                        .WithMessage("Some of provided features are not supported.")
                    )
                    .ChildRules(bp => bp.RuleFor(p => p.FeatureToPredict.InEnum<FeatureType>())
                        .Must(b => b)
                        .WithMessage("Specified feature is not supported.")
                    );

                modelType.GetEnum<MlModelType>().Match(
                    MlModelType.LinearRegression, _ =>
                    {
                        AddDefaultRegressionValidation();
                    },
                    MlModelType.ElasticRegression, _ =>
                    {
                        AddDefaultRegressionValidation();
                        AddSharedRegressionValidation();
                        RuleFor(m => (ElasticRegressionParameters)m.Parameters)
                            .ChildRules(bp => bp.RuleFor(p => p.L1Ratio)
                                .GreaterThanOrEqualTo(0).LessThanOrEqualTo(1)
                                .WithMessage("Value of L1Ratio needs to be between 0 and 1.")
                            )
                            .ChildRules(bp => bp.RuleFor(p => p.Tol).NotEmpty())
                            .ChildRules(bp => bp.RuleFor(p => p.Selection.InEnum<SelectionType>())
                                .Must(b => b)
                                .WithMessage("Selection can be either cyclic or random.")
                            );
                    },
                    MlModelType.LassoRegression, _ =>
                    {
                        AddDefaultRegressionValidation();
                        AddSharedRegressionValidation();
                        RuleFor(m => (LassoRegressionParameters)m.Parameters)
                            .ChildRules(bp => bp.RuleFor(p => p.Tol).NotEmpty())
                            .ChildRules(bp => bp.RuleFor(p => p.Selection.InEnum<SelectionType>())
                                .Must(b => b)
                                .WithMessage("Selection can be either cyclic or random.")
                            );
                    },
                    MlModelType.LassoLarsRegression, _ =>
                    {
                        AddDefaultRegressionValidation();
                        AddSharedRegressionValidation();
                        RuleFor(m => (LassoLarsRegressionParameters)m.Parameters)
                            .ChildRules(bp => bp.RuleFor(p => p.Eps).NotEmpty());
                    },
                    MlModelType.RidgeRegression, _ =>
                    {
                        AddDefaultRegressionValidation();
                        AddSharedRegressionValidation();
                        RuleFor(m => (RidgeRegressionParameters)m.Parameters)
                            .ChildRules(bp => bp.RuleFor(p => p.Tol).NotEmpty())
                            .ChildRules(bp => bp.RuleFor(p => p.Solver.InEnum<SolverType>())
                                .Must(b => b)
                                .WithMessage("Specified solver type is not supported.")
                            );
                    },
                    MlModelType.BayesianRidgeRegression, _ =>
                    {
                        AddDefaultRegressionValidation();
                        AddSharedRegressionValidation();
                        RuleFor(m => (BayesianRidgeRegressionParameters)m.Parameters)
                            .ChildRules(bp => bp.RuleFor(p => p.Tol).NotEmpty())
                            .ChildRules(bp => bp.RuleFor(p => p.Alpha2).NotEmpty())
                            .ChildRules(bp => bp.RuleFor(p => p.Lambda1).NotEmpty())
                            .ChildRules(bp => bp.RuleFor(p => p.Lambda2).NotEmpty());
                    },
                    MlModelType.AdamRnn, _ =>
                    {
                        AddDefaultRnnValidation();
                        RuleFor(m => (AdamRnnParameters)m.Parameters)
                            .ChildRules(bp => bp.RuleFor(p => p.LearningRate).NotEmpty())
                            .ChildRules(bp => bp.RuleFor(p => p.Beta1).NotEmpty())
                            .ChildRules(bp => bp.RuleFor(p => p.Beta2).NotEmpty())
                            .ChildRules(bp => bp.RuleFor(p => p.Decay).NotEmpty())
                            .ChildRules(bp => bp.RuleFor(p => p.Epsilon).NotEmpty());
                    },
                    MlModelType.AdamaxRnn, _ =>
                    {
                        AddDefaultRnnValidation();
                        RuleFor(m => (AdamaxRnnParameters)m.Parameters)
                            .ChildRules(bp => bp.RuleFor(p => p.LearningRate).NotEmpty())
                            .ChildRules(bp => bp.RuleFor(p => p.Beta1).NotEmpty())
                            .ChildRules(bp => bp.RuleFor(p => p.Beta2).NotEmpty())
                            .ChildRules(bp => bp.RuleFor(p => p.Decay).NotEmpty())
                            .ChildRules(bp => bp.RuleFor(p => p.Epsilon).NotEmpty());
                    },
                    MlModelType.NadamRnn, _ =>
                    {
                        AddDefaultRnnValidation();
                        RuleFor(m => (NadamRnnParameters)m.Parameters)
                            .ChildRules(bp => bp.RuleFor(p => p.LearningRate).NotEmpty())
                            .ChildRules(bp => bp.RuleFor(p => p.Beta1).NotEmpty())
                            .ChildRules(bp => bp.RuleFor(p => p.Beta2).NotEmpty())
                            .ChildRules(bp => bp.RuleFor(p => p.ScheduleDecay).NotEmpty())
                            .ChildRules(bp => bp.RuleFor(p => p.Epsilon).NotEmpty());
                    },
                    MlModelType.AdadeltaRnn, _ =>
                    {
                        AddDefaultRnnValidation();
                        RuleFor(m => (AdadeltaRnnParameters)m.Parameters)
                            .ChildRules(bp => bp.RuleFor(p => p.LearningRate).NotEmpty())
                            .ChildRules(bp => bp.RuleFor(p => p.Rho).NotEmpty())
                            .ChildRules(bp => bp.RuleFor(p => p.Decay).NotEmpty())
                            .ChildRules(bp => bp.RuleFor(p => p.Epsilon).NotEmpty());
                    },
                    MlModelType.RmsPropRnn, _ =>
                    {
                        AddDefaultRnnValidation();
                        RuleFor(m => (RmsPropRnnParameters)m.Parameters)
                            .ChildRules(bp => bp.RuleFor(p => p.LearningRate).NotEmpty())
                            .ChildRules(bp => bp.RuleFor(p => p.Rho).NotEmpty())
                            .ChildRules(bp => bp.RuleFor(p => p.Decay).NotEmpty())
                            .ChildRules(bp => bp.RuleFor(p => p.Epsilon).NotEmpty());
                    },
                    MlModelType.SgdRnn, _ =>
                    {
                        AddDefaultRnnValidation();
                        RuleFor(m => (SgdRnnParameters)m.Parameters)
                            .ChildRules(bp => bp.RuleFor(p => p.LearningRate).NotEmpty())
                            .ChildRules(bp => bp.RuleFor(p => p.Momentum).NotEmpty())
                            .ChildRules(bp => bp.RuleFor(p => p.Decay).NotEmpty());
                    },
                    MlModelType.DecisionTree, _ =>
                    {
                        AddTreeValidation();
                        RuleFor(m => (DecisionTreeParameters)m.Parameters)
                            .ChildRules(bp => bp.RuleFor(p => p.RandomState).NotEmpty())
                            .ChildRules(bp => bp.RuleFor(p => p.Splitter.InEnum<SplitterType>())
                                .Must(b => b)
                                .WithMessage("Splitter type not supported.")
                            )
                            .ChildRules(bp => bp.RuleFor(p => p.Criterion.InEnum<CriterionType>())
                                .Must(b => b)
                                .WithMessage("Criterion type not supported.")
                            );
                    },
                    MlModelType.RandomForest, _ =>
                    {
                        AddTreeValidation();
                        RuleFor(m => (RandomForestParameters)m.Parameters)
                            .ChildRules(bp => bp.RuleFor(p => p.NEstimators).NotEmpty())
                            .ChildRules(bp => bp.RuleFor(p => p.Criterion.InEnumExcept(CriterionType.FriedmanMse))
                                .Must(b => b)
                                .WithMessage("Criterion type not supported.")
                            );
                    },
                    _ => throw new ValidationException("Specified model type is not supported.")
                );
            }

            void AddDefaultRegressionValidation()
            {
                RuleFor(m => (LinearRegressionParameters)m.Parameters)
                    .ChildRules(bp => bp.RuleFor(p => p.RandomState).NotEmpty());
            }

            void AddSharedRegressionValidation()
            {
                RuleFor(m => (SharedRegressionParameters)m.Parameters)
                    .ChildRules(bp => bp.RuleFor(p => p.Alpha).NotEmpty())
                    .ChildRules(bp => bp.RuleFor(p => p.MaxIteration)
                        .GreaterThanOrEqualTo(1).LessThanOrEqualTo(8129)
                        .WithMessage("Max iteration must be between 1 and 8129.")
                    );
            }

            void AddDefaultRnnValidation()
            {
                RuleFor(m => (SharedRnnParameters) m.Parameters)
                    .ChildRules(bp => bp.RuleFor(p => p.SeqLen).NotEmpty())
                    .ChildRules(bp => bp.RuleFor(p => p.Epochs).LessThanOrEqualTo(16))
                    .ChildRules(bp => bp.RuleFor(p => p.BatchSize).NotEmpty())
                    .ChildRules(bp => bp.RuleFor(p => p.NetworkUnits.Count)
                        .Equal(p => p.NetworkLayers)
                        .WithMessage("Number of network unit must correspond to the umber of network layers.")
                    )
                    .ChildRules(bp => bp.RuleFor(p => p.NetworkUnits)
                        .Must(u => u.All(i => i > 0))
                        .WithMessage("Number of neurons in each layer must be at least 1.")
                    )
                    .ChildRules(bp => bp.RuleFor(p => p.NetworkLayers)
                        .GreaterThanOrEqualTo(3)
                        .WithMessage("Number of network layer must be greater than 2.")
                    )
                    .ChildRules(bp => bp.RuleFor(p => p.DropOut).NotEmpty())
                    .ChildRules(bp => bp.RuleFor(p => p.Scaler.InEnum<ScalerType>())
                        .Must(b => b)
                        .WithMessage("Scaler type not supported.")
                    )
                    .ChildRules(bp => bp.RuleFor(p => p.Optimizer.InEnum<OptimizerType>())
                        .Must(b => b)
                        .WithMessage("Optimizer type not supported.")
                    )
                    .ChildRules(bp => bp.RuleFor(p => p.Metrics.AllInEnum<MetricsType>())
                        .Must(b => b)
                        .WithMessage("Some of provided metrics types is not supported.")
                    )
                    .ChildRules(bp => bp.RuleFor(p => p.Loss.SafeAnyEquals(p.Metrics))
                        .Must(b => b)
                        .WithMessage("Loss must be a value that corresponds to one Metrics value.")
                    );
            }

            void AddTreeValidation()
            {
                RuleFor(m => (SharedTreeParameters) m.Parameters)
                    .ChildRules(bp => bp.RuleFor(p => p.MaxDepth).NotEmpty())
                    .ChildRules(bp => bp.RuleFor(p => p.MaxLeafNodes).NotEmpty())
                    .ChildRules(bp => bp.RuleFor(p => p.MinImpurityDecrease).NotEmpty())
                    .ChildRules(bp => bp.RuleFor(p => p.MinSamplesLeaf).NotEmpty())
                    .ChildRules(bp => bp.RuleFor(p => p.MaxFeatures)
                        .LessThanOrEqualTo(p => p.Features.Count)
                        .WithMessage("Max features cannot exceed the number of features.")
                    )
                    .ChildRules(bp => bp.RuleFor(p => p.MinSamplesSplit).GreaterThanOrEqualTo(2));
            }
        }

        public new void Validate(MlModel mlModel)
        {
            this.ValidateAndThrow(mlModel);
        }
    }
}
