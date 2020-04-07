const en = {
  navigation: {
    applications: "Application",
    dashboard: "Dashboard",
    companies: "Companies",
    history: "History",
    requestCompany: "Request Company",
    analysis: "Analysis",
    login: "Login",
    register: "Register"
  },
  languages: {
    en: "English",
    cz: "Čeština",
    language: "Language"
  },
  loginPage: {
    title: "LOGIN TO YOUR ACCOUNT",
    username: "Username",
    password: "Password",
    rememberMe: "Remember me",
    forgotPassword: "Forgot password?",
    login: "Login",
    or: "OR",
    noAccount: "Don't have an account?",
    register: "Create an account",
    invalidUsername: "Invalid username",
    invalidPassword: "Invalid password",
    hints: {
      username: {
        h1: "Username is case sensitive",
        h2: "Must start with a letter small/Capital",
        h3: "It can contain numbers",
        h4: "Only [-], [_] are allowed",
        h5: "At least 5 characters and 15 at max"
      },
      password: {
        h1: "Password is case sensitive",
        h2: "Must start contain a small letter",
        h3: "Must start contain a capital letter",
        h4: "Must start contain a number",
        h5: "At least 8 characters"
      }
    }
  },
  registerPage: {
    title: "CREATE AN ACCOUNT",
    username: "Username",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm password",
    createAccount: "Create account",
    haveAccount: "Already have an account?",
    login: "Login",
    invalidUsername: "Invalid username",
    invalidEmail: "Invalid email",
    invalidPassword: "Invalid password",
    passwordNoMatch: "Passwords don't match",
    hints: {
      username: {
        h1: "Username is case sensitive",
        h2: "Must start with a letter small/Capital",
        h3: "It can contain numbers",
        h4: "Only [-], [_] are allowed",
        h5: "At least 5 characters and 15 at max"
      },
      password: {
        h1: "Password is case sensitive",
        h2: "Must start contain a small letter",
        h3: "Must start contain a capital letter",
        h4: "Must start contain a number",
        h5: "At least 8 characters"
      }
    }
  },
  confirmPage: {
    confirmAddress: "Confirm your email address!",
    confirmationSent: "A confirmation code has been sent to",
    confirmationCode: "Confirmation code",
    confirm: "Confirm",
    backToLogin: "Go back to login",
    invalidConfirmationCode: "Invalid confirmation code"
  },
  forgotPassword: {
    recovertTitle: "Recover your password",
    username: "Username",
    sendCode: "Send reset code",
    backToLogin: "Go back to login",
    invalidUsername: "Invalid username"
  },
  resetPassword: {
    title: "Reset your password",
    username: "Username",
    password: "Password",
    confirmPassword: "Confirm password",
    confirmationCode: "Confirmation code",
    resetButton: "Reset my password",
    backToLogin: "Go back to login",
    invalidUsername: "Invalid username",
    invalidPassword: "Invalid password",
    passwordNoMatch: "Passwords don't match",
    invalidConfirmationCode: "Invalid confirmation code"
  },

  companiesPage: {
    companies: "Companies",
    favoriteCompanies: "Favorite companies",
    deleteBtn: "Delete",
    addCompanies: "Add more companies",
    addBtn: "Add",
    search: "Search",
    empty: "No companies to show."
  },
  companyProfile: {
    relatedArticles: "Related Articles",
    currentWeek: "Current week's prices",
    nextWeek: "Next week's forecast",
    high: "Current week's high",
    low: "Current week's low",
    volume: "Current week's volume",
    companyDetails: {
      detailsHistory: "Details & History",
      name: "Name",
      revenue: "Revenue",
      ceo: "CEO",
      creationDate: "Creation Date",
      description: "Description",
      industries: "Industries",
      employees: "Employees",
      hq: "Headquarters",
      visit: "Visit Site"
    },
    stockHistoryTable: {
      stockHistory: "Stock Price History",
      dateFrom: "Date From",
      dateTo: "Date To",
      filterBtn: "Filter",
      noData: "There is no data that match your selected dates."
    }
  },

  userMenu: {
    myProfile: "My Profile",
    logout: "Logout"
  },

  profilePage: {
    profile: "Profile",
    contactInfo: {
      title: "Contact Info",
      username: "Username",
      firstName: "First Name",
      lastName: "Last Name",
      position: "Position",
      updateBtn: "Update"
    },
    accountInfo: {
      title: "Account Info",
      currentPassword: "Current Password",
      newPassword: "New Password",
      confirmPassword: "Confirm Password",
      updatePasswordBtn: "Update Password",
      deleteAccBtn: "Delete my account!"
    }
  },

  analysisPage: {
    filter: {
      model: "Model",
      company: "Company",
      date: "Date",
      status: "Status",
      clearBtn: "Clear Filters",
      none: "None",
      failed: "Failed",
      pending: "Pending",
      created: "Created"
    },
    table: {
      model: "Model",
      company: "Company",
      date: "Date",
      status: "Status",
      actions: "Actions",
      noData: "There are no models that match your criteria.",
      deleteModalTitle: "Delete Model!",
      areYouSure: "Are you sure you want to delete this model?",
      confirm: "Confirm",
      cancel: "Cancel"
    }
  },
  viewModelPage: {
    cancelBtn: "Cancel",
    saveBtn: "Save",
    header: {
      compareBtn: "Compare",
      exportBtn: "Export",
      createModel: "Create model",
      noModels: "There are no models to compare.",
      noModelsCriteria: "There are no models matching your criteria.",
      chooseToCompare: "Choose a model to compare",
      closeBtn: "Close",
      copyBtn: "Copy",

      model: "Model",
      company: "Company",
      all: "All"
    },
    datasetControl: {
      title: "Dataset Control",
      company: "Company",
      modelTitle: "Model Title",
      modelTitleTooltip: "A display title for easy access.",
      companyTooltip: "Company you will use to train your model",
      none: "None",
      loading: "Loading..."
    },
    features: {
      title: "Features",
      featuresTooltip: "Features you will use to train your model",
      open: "Opening Price",
      close: "Closing Price",
      low: "Min price of day",
      high: "Max price of day",
      volume: "Exchange volume",
      loading: "Loading..."
    },
    featureToPredict: {
      title: "Feature to predict",
      featureToPredictTooltip: "Which feature you want your model to predict",
      open: "Opening Price",
      close: "Closing Price",
      low: "Min price of day",
      high: "Max price of day",
      volume: "Exchange volume",
      loading: "Loading..."
    },
    modelControl: {
      title: "Model Control",
      more: "More about this machine learning model",
      model: "Model",
      modelTooltip: "Algorithm you will use to train your model",
      none: "None",
      forecastOut: "Forecast out",
      forecastOutTooltip:
        "How many days in the future we want to make prediction",
      testSize: "Test size",
      testSizeTooltip: "Size for the test dataset in percentage %.",
      randomState: "Random State",
      randomStateTooltip:
        "The seed of the pseudo random number generator that selects a random feature to update.",
      l1Ratio: {
        elastic: "Stop the algorithm if weight has converged"
      },
      eps: {
        lassoLars:
          "The machine-precision regularization in the computation of the Cholesky diagonal factors"
      },
      fitPath: {
        lassoLars: "If the full path is stored in the coef_path_ attribute"
      },
      solver: {
        ridge: "Solver to use in the computational routines"
      },
      alpha2: {
        bayesianRidge:
          "Inverse scale parameter (rate parameter) for the Gamma Distribution prior over the alpha parameter"
      },
      lambda1: {
        bayesianRidge:
          "Shape parameter for the Gamma Distribution prior over the alpha parameter"
      },
      lambda2: {
        bayesianRidge:
          "Inverse scale parameter (rate parameter) for the Gamma Distribution prior over the alpha parameter"
      },
      computeScore: {
        bayesianRidge:
          "Compute the log marginal likelihood at each iteration of the optimization"
      },
      positive: {
        elastic: "Forces the coefficients to be positive",
        lasso: "Forces the coefficients to be positive",
        lassoLars:
          "Under the positive restriction the model coefficients will not converge to the ordinary-least-squares solution for small values of alpha"
      },
      warmStart: {
        elastic:
          "Reuse the solution of the previous call to fit as initialization or just erase the previous solution",
        lasso:
          "Reuse the solution of the previous call to fit as initialization or just erase the previous solution",
        randomForest:
          "Reuse the solution of the previous call to fit as initialization or just erase the previous solution"
      },
      preCompute: {
        elastic:
          "Whether to use a pre-computed Gram matrix to speed up calculations",
        lasso:
          "Whether to use a pre-computed Gram matrix to speed up calculations",
        lassoLars:
          "Whether to use a pre-computed Gram matrix to speed up calculations"
      },
      normalize: {
        linear:
          "If False, then the regressor will be normalized before regression by subtracting the mean and dividing by the L2-norm",
        elastic:
          "If False, then the regressor will be normalized before regression by subtracting the mean and dividing by the L2-norm",
        lasso:
          "If False, then the regressor will be normalized before regression by subtracting the mean and dividing by the L2-norm",
        lassoLars:
          "If False, then the regressor will be normalized before regression by subtracting the mean and dividing by the L2-norm",
        ridge:
          "If False, then the regressor will be normalized before regression by subtracting the mean and dividing by the L2-norm",
        bayesianRidge:
          "If False, then the regressor will be normalized before regression by subtracting the mean and dividing by the L2-norm"
      },
      fitIntercept: {
        linear: "Whether to calculate the intercept for the model",
        elastic: "Whether to calculate the intercept for the model",
        lasso: "Whether to calculate the intercept for the model",
        lassoLars: "Whether to calculate the intercept for the model",
        ridge: "Whether to calculate the intercept for the model",
        bayesianRidge: "Whether to calculate the intercept for the model"
      },
      selection: {
        elastic:
          "If set to random, a random coefficient is updated every iteration rather than looping over features sequentially by default",
        lasso:
          "If set to random, a random coefficient is updated every iteration rather than looping over features sequentially by default"
      },
      tol: {
        elastic: "The tolerance for the optimization",
        lasso: "The tolerance for the optimization",
        ridge: "Precision of the solution",
        bayesianRidge: "Stop the algorithm if weight has converged"
      },
      maxIteration: {
        elastic: "The maximum number of iterations",
        lasso: "The maximum number of iterations",
        lassoLars: "The maximum number of iterations",
        ridge: "The maximum number of iterations",
        bayesianRidge: "The maximum number of iterations"
      },
      alpha: {
        elastic: "Constant that multiples the penalty terms",
        lasso: "Constant that multiples the penalty terms",
        lassoLars: "Constant that multiples the penalty terms",
        ridge: "Regularization strength; must be a positive float",
        bayesianRidge:
          "Shape parameter for the Gamma Distribution prior over the alpha parameter",
        decisionTree: "Constant that multiples the penalty terms"
      },
      presort: {
        decisionTree:
          "Whether to presort the data to speed up the finding of best splits in fitting",
        randomForest:
          "Whether to presort the data to speed up the finding of best splits in fitting"
      },
      criterion: {
        decisionTree: "The function to measure the quality of a split",
        randomForest: "The function to measure the quality of a split"
      },
      splitter: {
        decisionTree: "The strategy used to choose the split at each node",
        randomForest: "The strategy used to choose the split at each node",
        Adam: "The strategy used to choose the split at each node"
      },
      maxDepth: {
        decisionTree: "The maximum depth of the tree",
        randomForest: "The maximum depth of the tree"
      },
      minSamplesSplit: {
        decisionTree:
          "The minimum number of samples required to split an internal node",
        randomForest:
          "The minimum number of samples required to split an internal node"
      },
      minSamplesLeaf: {
        decisionTree:
          "The minimum number of samples required to be at a leaf node",
        randomForest:
          "The minimum number of samples required to be at a leaf node"
      },
      maxFeatures: {
        decisionTree:
          "The number of features to consider when looking for the best split",
        randomForest:
          "The number of features to consider when looking for the best split"
      },
      maxLeafNodes: {
        decisionTree:
          "Grow a tree with max_leaf_nodes in best-first fashion. Best nodes are defined as relative reduction in impurity",
        randomForest:
          "Grow a tree with max_leaf_nodes in best-first fashion. Best nodes are defined as relative reduction in impurity"
      },
      minImpurityDecrease: {
        decisionTree:
          "A node will be split if this split induces a decrease of the impurity greater than or equal to this value",
        randomForest:
          "A node will be split if this split induces a decrease of the impurity greater than or equal to this value"
      },
      bootstrap: {
        randomForest: "Whether bootstrap samples are used when building trees"
      },
      nEstimators: {
        randomForest: "The number of trees in the forest"
      },
      oobScore: {
        randomForest:
          "Whether to use out-of-bag samples to estimate the R2 on unseen data"
      },
      epochs: {
        Adam:
          "Number of times that network will iterate over the training data",
        Adamax:
          "Number of times that network will iterate over the training data",
        Nadam:
          "Number of times that network will iterate over the training data",
        SGD: "Number of times that network will iterate over the training data",
        RMSprop:
          "Number of times that network will iterate over the training data",
        Adadelta:
          "Number of times that network will iterate over the training data"
      },
      seqLen: {
        Adam:
          "Stock Prices must be pre-processed in a way that it represents each seqLen days of stock as one sequence",
        Adamax:
          "Stock Prices must be pre-processed in a way that it represents each seqLen days of stock as one sequence",
        Nadam:
          "Stock Prices must be pre-processed in a way that it represents each seqLen days of stock as one sequence",
        SGD:
          "Stock Prices must be pre-processed in a way that it represents each seqLen days of stock as one sequence",
        RMSprop:
          "Stock Prices must be pre-processed in a way that it represents each seqLen days of stock as one sequence",
        Adadelta:
          "Stock Prices must be pre-processed in a way that it represents each seqLen days of stock as one sequence"
      },
      batchSize: {
        Adam:
          "The batch size limits the number of samples to be shown to the network before a weight update can be performed",
        Adamax:
          "The batch size limits the number of samples to be shown to the network before a weight update can be performed",
        Nadam:
          "The batch size limits the number of samples to be shown to the network before a weight update can be performed",
        SGD:
          "The batch size limits the number of samples to be shown to the network before a weight update can be performed",
        RMSprop:
          "The batch size limits the number of samples to be shown to the network before a weight update can be performed",
        Adadelta:
          "The batch size limits the number of samples to be shown to the network before a weight update can be performed"
      },
      networkUnits: {
        Adam:
          "Number of neurons that will used for each layer of the network except the Dense Layer",
        Adamax:
          "Number of neurons that will used for each layer of the network except the Dense Layer",
        Nadam:
          "Number of neurons that will used for each layer of the network except the Dense Layer",
        SGD:
          "Number of neurons that will used for each layer of the network except the Dense Layer",
        RMSprop:
          "Number of neurons that will used for each layer of the network except the Dense Layer",
        Adadelta:
          "Number of neurons that will used for each layer of the network except the Dense Layer"
      },
      networkLayers: {
        Adam: "Number of layers that will used to build the network",
        Adamax: "Number of layers that will used to build the network",
        Nadam: "Number of layers that will used to build the network",
        SGD: "Number of layers that will used to build the network",
        RMSprop: "Number of layers that will used to build the network",
        Adadelta: "Number of layers that will used to build the network"
      },
      dropOut: {
        Adam: "Dropout is a way to prevent over-fitting",
        Adamax: "Dropout is a way to prevent over-fitting",
        Nadam: "Dropout is a way to prevent over-fitting",
        SGD: "Dropout is a way to prevent over-fitting",
        RMSprop: "Dropout is a way to prevent over-fitting",
        Adadelta: "Dropout is a way to prevent over-fitting"
      },
      batchNormalization: {
        Adam: "Normalizes the activation of the previous layer at each batch",
        Adamax: "Normalizes the activation of the previous layer at each batch",
        Nadam: "Normalizes the activation of the previous layer at each batch",
        SGD: "Normalizes the activation of the previous layer at each batch",
        RMSprop:
          "Normalizes the activation of the previous layer at each batch",
        Adadelta:
          "Normalizes the activation of the previous layer at each batch"
      },
      metrics: {
        Adam:
          "There are three different metrics that can be used for model evaluation",
        Adamax:
          "There are three different metrics that can be used for model evaluation",
        Nadam:
          "There are three different metrics that can be used for model evaluation",
        SGD:
          "There are three different metrics that can be used for model evaluation",
        RMSprop:
          "There are three different metrics that can be used for model evaluation",
        Adadelta:
          "There are three different metrics that can be used for model evaluation"
      },
      scaler: {
        Adam: "Object that scales the data",
        Adamax: "Object that scales the data",
        Nadam: "Object that scales the data",
        SGD: "Object that scales the data",
        RMSprop: "Object that scales the data",
        Adadelta: "Object that scales the data"
      },
      loss: {
        Adam:
          "Measure of mistakes made by the network in predicting the output",
        Adamax:
          "Measure of mistakes made by the network in predicting the output",
        Nadam:
          "Measure of mistakes made by the network in predicting the output",
        SGD: "Measure of mistakes made by the network in predicting the output",
        RMSprop:
          "Measure of mistakes made by the network in predicting the output",
        Adadelta:
          "Measure of mistakes made by the network in predicting the output"
      },
      learningRate: {
        Adam: "The amount the weights are updated during training",
        Adamax: "The amount the weights are updated during training",
        Nadam: "The amount the weights are updated during training",
        SGD: "The amount the weights are updated during training",
        RMSprop: "The amount the weights are updated during training",
        Adadelta: "The amount the weights are updated during training"
      },
      beta1: {
        Adam: "The exponential decay rate for the first moment estimates",
        Adamax: "The exponential decay rate for the first moment estimates",
        Nadam: "The exponential decay rate for the first moment estimates"
      },
      beta2: {
        Adam: "The exponential decay rate for the second moment estimates",
        Adamax: "The exponential decay rate for the second moment estimates",
        Nadam: "The exponential decay rate for the second moment estimates"
      },
      epsilon: {
        Adam: "A small number that prevents division by zero",
        Adamax: "A small number that prevents division by zero",
        Nadam: "A small number that prevents division by zero",
        RMSprop: "A small number that prevents division by zero",
        Adadelta: "A small number that prevents division by zero"
      },
      decay: {
        Adam:
          "After each update, the weights of the neural network are multiplied by a factor slightly less than one",
        Adamax:
          "After each update, the weights of the neural network are multiplied by a factor slightly less than one",
        SGD:
          "After each update, the weights of the neural network are multiplied by a factor slightly less than one",
        RMSprop:
          "After each update, the weights of the neural network are multiplied by a factor slightly less than one",
        Adadelta:
          "After each update, the weights of the neural network are multiplied by a factor slightly less than one"
      },
      amsgrad: {
        Adam: "Whether to apply the AMSGrad variant",
        Adamax: "Whether to apply the AMSGrad variant",
        Nadam: "Whether to apply the AMSGrad variant",
        SGD: "Whether to apply the AMSGrad variant",
        RMSprop: "Whether to apply the AMSGrad variant",
        Adadelta: "Whether to apply the AMSGrad variant"
      },
      scheduleDecay: {
        Nadam: "Drops the learning rate by a given factor in every few epochs"
      },
      momentum: {
        SGD:
          "Parameter that accelerates SGD in the relevant direction and dampens oscillations"
      },
      nesterov: {
        SGD: "Whether to apply Nesterov Momentum"
      },
      rho: {
        RMSprop:
          "The decay factor or the exponentially weighted average over the square of the gradients",
        Adadelta:
          "The decay factor or the exponentially weighted average over the square of the gradients"
      }
    },
    lossChartTitle: "Loss",
    futurePredictionsTitle: "Future Predictions",
    predVSrealChartTitle: "Prediction VS Real",
    sliderMessage: "Use the slider to manage display",
    noResults: "There are still no results yet for your model",
    buildFailed:
      "There are no prediction results because the model building failed.",
    modelPerf: {
      title: "Model Performance",
      variance_score: {
        name: "Variance Score"
      },
      max_error_value: {
        name: "Max Error Value"
      },
      mean_abs_error_value: {
        name: "Mean Abs Error Value"
      },
      mean_square_error_value: {
        name: "Mean Square Error Value"
      },
      r2_value: {
        name: "R2 Value"
      },
      mse: {
        name: "Mean Squared Error"
      },
      mae: {
        name: "Mean Absolute Error"
      },
      mape: {
        name: "Mean Absolute Percentage Error"
      }
    }
  },

  deleteModal: {
    deleteModalTitle: "Delete Account?",
    deleteModalSure: "Are you sure that you want to delete your account?",
    deleteModalInfo: "This action cannot be undone!",
    confirmBtn: "Confirm",
    cancelBtn: "Cancel"
  },

  history: {
    title: "History",
    list: {
      searchHistory: "Search History",
      searchedFor: "You searched for "
    }
  },

  breadcrumbs: {
    Dashboard: "Dashboard",
    Companies: "Companies",
    Analysis: "Analysis",
    Compare: "Compare",
    "Add new model": "Add new model"
    // add here breadcrumbs translations
  },
  articleDetails: {
    relatedArticles: "Related Articles",
    source: "Source"
  },
  dashboard: {
    chartTitle: "Weekly prices",
    articles: "Articles",
    prevButton: "Previous week",
    nextButton: "Next week",
    latestPrices: "Latest prices as of "
  },
  search: {
    title: "Search",
    noResults: "No results...",
    close: "Close"
  },
  notFound: {
    message: "Sorry but we could not find the page you are looking for",
    goBack: "Go back to dashboard"
  }
};

export default en;
