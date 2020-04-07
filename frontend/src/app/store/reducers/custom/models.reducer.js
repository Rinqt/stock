import * as Actions from "app/store/actions/custom";

const commonRegParam = [
  {
    name: "alpha",
    defaultValue: 0.95,
    max: 1,
    min: 0,
    step: 0.01,
    type: "number"
  },
  {
    name: "maxIteration",
    defaultValue: 256,
    min: 1,
    max: 1024,
    step: 1,
    type: "number"
  },
  {
    name: "tol",
    defaultValue: 0.1,
    max: 1,
    step: 0.01,
    min: 0.01,
    type: "number"
  },
  {
    name: "selection",
    defaultValue: "random",
    type: "select",
    options: ["cyclic", "random"]
  },
  {
    name: "fitIntercept",
    defaultValue: false,
    type: "boolean"
  },
  {
    name: "normalize",
    defaultValue: false,
    type: "boolean"
  },

  {
    name: "preCompute",
    defaultValue: true,
    type: "boolean"
  },
  {
    name: "warmStart",
    defaultValue: true,
    type: "boolean"
  },
  {
    name: "positive",
    defaultValue: true,
    type: "boolean"
  }
];

const commonTreeParams = [
  {
    name: "criterion",
    defaultValue: "mse",
    type: "select",
    options: ["mse", "friedman_mse", "mae"]
  },

  {
    name: "splitter",
    defaultValue: "best",
    type: "select",
    options: ["best", "random"]
  },
  {
    name: "maxDepth",
    defaultValue: 2048,
    step: 1,
    min: 1,
    type: "number"
  },
  {
    name: "minSamplesSplit",
    defaultValue: 2,
    step: 1,
    min: 2,
    type: "number"
  },
  {
    name: "minSamplesLeaf",
    defaultValue: 1,
    step: 1,
    min: 1,
    type: "number"
  },
  {
    name: "maxFeatures",
    defaultValue: 4,
    step: 1,
    min: 1,
    max: 5,
    type: "number"
  },
  {
    name: "maxLeafNodes",
    defaultValue: 512,
    step: 1,
    min: 1,
    type: "number"
  },
  {
    name: "minImpurityDecrease",
    defaultValue: 0.0001,
    step: 0.1,
    min: 0,
    type: "number"
  }
];

const commonRnnParams = [
  {
    name: "epochs",
    defaultValue: 7,
    step: 1,
    min: 1,
    type: "number"
  },
  {
    name: "seqLen",
    defaultValue: 45,
    step: 1,
    min: 2,
    type: "number"
  },

  {
    name: "batchSize",
    defaultValue: 24,
    step: 1,
    min: 1,
    type: "number"
  },
  {
    name: "networkLayers",
    defaultValue: 4,
    step: 1,
    min: 3,
    type: "number"
  },
  {
    name: "networkUnits",
    defaultValue: [128, 128, 64, 64],
    type: "list"
  },

  {
    name: "metrics",
    defaultValue: ["mse", "mae", "mape"],
    type: "list"
  },

  {
    name: "dropOut",
    defaultValue: 0.3,
    step: 0.1,
    min: 0,
    max: 1,
    type: "number"
  },
  {
    name: "batchNormalization",
    defaultValue: true,
    type: "boolean"
  },
  {
    name: "loss",
    defaultValue: "mse",
    type: "select",
    options: ["mse", "mae", "mape"]
  },
  {
    name: "scaler",
    defaultValue: "StandardScaler",
    type: "select",
    options: ["StandardScaler", "MinMaxScaler", "RobustScaler", "MaxAbsScaler"]
  },
  {
    name: "learningRate",
    defaultValue: 0.001,
    step: 0.001,
    min: 0,
    max: 1,
    type: "number"
  }
];

const initialState = {
  userModels: [],
  loadingUserModels: true,

  modelByID: {},
  comparedModel: {},
  loadingModelById: true,
  loadingComparedModel: true,

  userModelsFilters: {
    modelType: null,
    companySymbol: null,
    createdAt: null,
    status: null
  },
  createdModel: {
    parameters: {
      forecastOut: 7,
      testSize: 0.33,
      randomState: 42,
      features: ["open", "high", "low", "volume"],
      featureToPredict: "close"
    }
  },
  hyperParams: {},
  availableModels: [
    //reg model
    {
      type: "linear",
      name: "Linear Regression",
      link: "https://en.wikipedia.org/wiki/Linear_regression",
      parameters: [
        ...commonRegParam.filter(
          el => ["fitIntercept", "normalize"].indexOf(el.name) !== -1
        )
      ]
    },
    {
      type: "elastic",
      name: "Elastic Regression",
      link: "https://en.wikipedia.org/wiki/Elastic_net_regularization",
      parameters: [
        ...commonRegParam,
        {
          name: "l1Ratio",
          defaultValue: 0.05,
          max: 1,
          step: 0.01,
          min: 0,
          type: "number"
        }
      ]
    },

    {
      type: "lasso",
      name: "Lasso Regression",
      link: "https://www.statisticshowto.datasciencecentral.com/lasso-regression",
      parameters: [...commonRegParam]
    },

    {
      type: "lassoLars",
      name: "Lasso Lars Regression",
      link: "https://en.wikipedia.org/wiki/Least-angle_regression",
      parameters: [
        ...commonRegParam.filter(
          el => ["tol", "selection", "warmStart"].indexOf(el.name) === -1
        ),
        {
          name: "eps",
          defaultValue: 0.01,
          max: 1,
          step: 0.01,
          min: 0,
          type: "number"
        },
        {
          name: "fitPath",
          defaultValue: true,
          type: "boolean"
        }
      ]
    },
    {
      type: "ridge",
      name: "Ridge Regression",
      link: "https://www.statisticshowto.datasciencecentral.com/ridge-regression",
      parameters: [
        ...commonRegParam.filter(
          el =>
            ["positive", "preCompute", "warmStart", "selection"].indexOf(
              el.name
            ) === -1
        ),
        {
          name: "solver",
          defaultValue: "auto",
          type: "select",
          options: [
            "auto",
            "svd",
            "cholesky",
            "lsqr",
            "sparse_cg",
            "sag",
            "saga"
          ]
        }
      ]
    },

    {
      type: "bayesianRidge",
      name: "Bayesian Ridge Regression",
      link: "https://en.wikipedia.org/wiki/Bayesian_linear_regression",
      parameters: [
        ...commonRegParam.filter(
          el =>
            ["positive", "preCompute", "warmStart", "selection"].indexOf(
              el.name
            ) === -1
        ),
        {
          name: "alpha2",
          defaultValue: 0.000001,
          max: 1,
          step: 0.000001,
          min: 0,
          type: "number"
        },
        {
          name: "lambda1",
          defaultValue: 0.000001,
          max: 1,
          step: 0.000001,
          min: 0,
          type: "number"
        },
        {
          name: "lambda2",
          defaultValue: 0.000001,
          max: 1,
          step: 0.000001,
          min: 0,
          type: "number"
        },
        {
          name: "computeScore",
          defaultValue: true,
          type: "boolean"
        }
      ]
    },
    // tree models
    {
      type: "decisionTree",
      name: "Decision Tree",
      link: "https://en.wikipedia.org/wiki/Decision_tree",
      parameters: [
        ...commonTreeParams,
        {
          name: "presort",
          defaultValue: true,
          type: "boolean"
        }
      ]
    },
    {
      type: "randomForest",
      name: "Random Forest",
      link: "https://en.wikipedia.org/wiki/Random_forest",
      parameters: [
        ...commonTreeParams,
        {
          name: "bootstrap",
          defaultValue: true,
          type: "boolean"
        },
        {
          name: "oobScore",
          defaultValue: false,
          type: "boolean"
        },
        {
          name: "nEstimators",
          defaultValue: 1024,
          step: 1,
          min: 1,
          type: "number"
        },
        {
          name: "warmStart",
          defaultValue: false,
          type: "boolean"
        }
      ]
    },
    // Rnn models

    {
      type: "Adam",
      name: "RNN with adam optimizer",
      link: "https://en.wikipedia.org/wiki/Recurrent_neural_network",
      parameters: [
        ...commonRnnParams,
        {
          name: "optimizer",
          defaultValue: "Adam",
          type: "hidden"
        },
        {
          name: "amsgrad",
          defaultValue: false,
          type: "boolean"
        },

        {
          name: "beta1",
          defaultValue: 0.9,
          step: 0.001,
          min: 0,
          max: 1,
          type: "number"
        },
        {
          name: "beta2",
          defaultValue: 0.999,
          step: 0.001,
          min: 0,
          max: 1,
          type: "number"
        },
        {
          name: "epsilon",
          defaultValue: 0.099,
          step: 0.001,
          min: 0,
          max: 1,
          type: "number"
        },
        {
          name: "decay",
          defaultValue: 0.00000001,
          step: 0.001,
          min: 0,
          max: 1,
          type: "number"
        }
      ]
    },

    {
      type: "Adamax",
      name: "RNN with admax optimizer",
      link: "https://en.wikipedia.org/wiki/Recurrent_neural_network",
      parameters: [
        ...commonRnnParams,
        {
          name: "optimizer",
          defaultValue: "Adamax",
          type: "hidden"
        },

        {
          name: "beta1",
          defaultValue: 0.9,
          step: 0.001,
          min: 0,
          max: 1,
          type: "number"
        },
        {
          name: "beta2",
          defaultValue: 0.999,
          step: 0.001,
          min: 0,
          max: 1,
          type: "number"
        },
        {
          name: "epsilon",
          defaultValue: 0.099,
          step: 0.001,
          min: 0,
          max: 1,
          type: "number"
        },
        {
          name: "decay",
          defaultValue: 0.00000001,
          step: 0.001,
          min: 0,
          max: 1,
          type: "number"
        }
      ]
    },
    {
      type: "Nadam",
      name: "RNN with nadam optimizer",
      link: "https://en.wikipedia.org/wiki/Recurrent_neural_network",
      parameters: [
        ...commonRnnParams,
        {
          name: "optimizer",
          defaultValue: "Nadam",
          type: "hidden"
        },

        {
          name: "beta1",
          defaultValue: 0.9,
          step: 0.001,
          min: 0,
          max: 1,
          type: "number"
        },
        {
          name: "beta2",
          defaultValue: 0.999,
          step: 0.001,
          min: 0,
          max: 1,
          type: "number"
        },
        {
          name: "epsilon",
          defaultValue: 0.099,
          step: 0.001,
          min: 0,
          max: 1,
          type: "number"
        },
        {
          name: "scheduleDecay",
          defaultValue: 0.002,
          step: 0.001,
          min: 0,
          max: 1,
          type: "number"
        }
      ]
    },
    {
      type: "SGD",
      name: "RNN with sgd optimizer",
      link: "https://en.wikipedia.org/wiki/Recurrent_neural_network",
      parameters: [
        ...commonRnnParams,
        {
          name: "optimizer",
          defaultValue: "SGD",
          type: "hidden"
        },

        {
          name: "decay",
          defaultValue: 0.00000001,
          step: 0.001,
          min: 0,
          max: 1,
          type: "number"
        },
        {
          name: "momentum",
          defaultValue: 0.001,
          step: 0.001,
          min: 0,
          max: 1,
          type: "number"
        },
        {
          name: "nesterov",
          defaultValue: false,
          type: "boolean"
        }
      ]
    },

    {
      type: "RMSprop",
      name: "RNN with rmsProp optimizer",
      link: "https://en.wikipedia.org/wiki/Recurrent_neural_network",
      parameters: [
        ...commonRnnParams,
        {
          name: "optimizer",
          defaultValue: "RMSprop",
          type: "hidden"
        },

        {
          name: "epsilon",
          defaultValue: 0.099,
          step: 0.001,
          min: 0,
          max: 1,
          type: "number"
        },
        {
          name: "decay",
          defaultValue: 0.00000001,
          step: 0.001,
          min: 0,
          max: 1,
          type: "number"
        },
        {
          name: "rho",
          defaultValue: 0.09,
          step: 0.001,
          min: 0,
          max: 1,
          type: "number"
        }
      ]
    },

    {
      type: "Adadelta",
      name: "RNN with adadelta optimizer",
      link: "https://en.wikipedia.org/wiki/Recurrent_neural_network",
      parameters: [
        ...commonRnnParams,
        {
          name: "optimizer",
          defaultValue: "Adadelta",
          type: "hidden"
        },

        {
          name: "epsilon",
          defaultValue: 0.099,
          step: 0.001,
          min: 0,
          max: 1,
          type: "number"
        },
        {
          name: "decay",
          defaultValue: 0.00000001,
          step: 0.001,
          min: 0,
          max: 1,
          type: "number"
        },
        {
          name: "rho",
          defaultValue: 0.001,
          step: 0.001,
          min: 0,
          max: 1,
          type: "number"
        }
      ]
    }
  ]
};

const handle = function(state = initialState, action) {
  switch (action.type) {
    case Actions.MODEL_CREATE: {
      return {
        ...state,
        createdModel: { ...action.model }
      };
    }
    case Actions.MODELS_UPDATE_FILTERS: {
      return {
        ...state,
        userModelsFilters: { ...action.filters }
      };
    }
    case Actions.MODEL_CREATE_HYPER_PARAMS: {
      return {
        ...state,
        hyperParams: { ...action.params }
      };
    }
    case Actions.MODELS_USER: {
      return {
        ...state,
        userModels: [...action.userModels]
      };
    }
    case Actions.MODEL_BY_ID: {
      return {
        ...state,
        modelByID: { ...action.modelByID }
      };
    }
    case Actions.MODEL_LOADINNG_BY_ID: {
      return {
        ...state,
        loadingModelById: action.loading
      };
    }
    case Actions.MODEL_LOADEING_COMPARE: {
      return {
        ...state,
        loadingComparedModel: action.loading
      };
    }
    case Actions.MODEL_COMPARE: {
      return {
        ...state,
        comparedModel: { ...action.model }
      };
    }
    case Actions.MODELS_USER_LOADING: {
      return {
        ...state,
        loadingUserModels: action.loading
      };
    }
    default: {
      return state;
    }
  }
};

export default handle;
