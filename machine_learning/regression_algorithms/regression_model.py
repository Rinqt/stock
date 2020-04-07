class Model:

    def __init__(self):
        self.parameters = \
            {
                'companySymbol': 'orcl',

                # Prediction Parameters
                'features': ['high', 'low', 'open', 'volume'],
                'featureToPredict': 'close',
                'forecastOut': 7,
                'testSize': 0.33,
                'randomState': 42,
                'precision':    3,  # Always three

                # Common Regression Parameters
                'alpha': 0.95,
                'fitIntercept': False,
                'normalize': False,
                'maxIteration': 8000,
                'tol': 0.01,
                'preCompute': True,
                'warmStart': True,
                'positive': False,
                'selection': 'random',

                # Bayesian Ridge Regression Specific Parameters
                'alpha2': 1e-06,
                'lambda': 1e-06,
                'lambda2': 1e-06,
                'computeScore': True,

                # Elastic Regression Specific Parameters
                'l1Ratio': 10.85,

                # Lasso Lars Specific Parameters
                'eps': 0.01,
                'fitPath': True,

                # Ridge Regression Specific Parameters
                'solver': 'auto',

                # Common Tree Parameters
                'criterion': 'friedman_mse',
                'splitter': 'best',
                'maxDepth': 512,
                'maxFeatures': 4,
                'minImpurityDecrease': 0.0,
                'minSamplesLeaf': 1,
                'minSamplesSplit': 2,
                'maxLeafNodes': None,

                # Decision Tree Parameters
                'preSort': True,

                # Random Forest Parameters
                'bootstrap': True,
                'estimators': 1024,
                'oobScore': False,
            }

        # train and test sets will be defined in fit() method
        self.X_train = None
        self.X_test = None
        self.x_forecast = None
        self.y_train = None
        self.y_test = None
        self.y_pred = None
        self.dataset = None

        # Model
        self.MODEL = None

    def split_data(self):
        from utils.linear_regression_helper import prepare_data

        self.X_train, self.X_test, self.y_train, self.y_test, self.x_forecast, self.dataset = prepare_data(company_symbol=self.parameters['companySymbol'],
                                                                                                           result_feature=self.parameters['featureToPredict'],
                                                                                                           features=self.parameters['features'],
                                                                                                           forecast_out=self.parameters['forecastOut'],
                                                                                                           test_size=self.parameters['testSize'],
                                                                                                           random_state=self.parameters['randomState'])

    def set_parameters(self, parameter_dict):
        """
        Method will set the parameters based on what they chose on model creation page.
        If user didn't select a parameter, it will be set to default value.

        :param parameter_dict: Parameters that user selected on model creation page
        """
        for key, value in parameter_dict.items():
            self.parameters[key] = value

        return self.parameters

    def fit_evaluate(self):
        from utils.linear_regression_helper import get_model_performance, get_future_predictions
        import numpy as np
        np.set_printoptions(precision=self.parameters['precision'])

        self.MODEL.fit(self.X_train, self.y_train)

        # Create validation data without shuffling so user can see the latest trends on the predictions, since
        # the data is continues when it is not shuffled.
        test_size = len(self.X_test)
        real_values = self.dataset.loc[:, self.parameters['features']]
        real_values = real_values.iloc[-test_size:].values

        real_vs_prediction_df = self.dataset[self.parameters['featureToPredict']].iloc[-test_size:].to_frame()
        real_vs_prediction_df['prediction'] = np.round(self.MODEL.predict(real_values), decimals=self.parameters['precision'])
        validation_dict = real_vs_prediction_df.to_dict()

        model_performance = get_model_performance(regression_model=self.MODEL,
                                                  X_test=real_values,
                                                  y_test=real_vs_prediction_df[self.parameters['featureToPredict']])

        # Get future predictions on not shuffled data.
        future_predictions = get_future_predictions(regression_model=self.MODEL,
                                                    x_forecast=self.x_forecast)
        future_predictions = np.round(future_predictions, decimals=self.parameters['precision'])

        # Convert results to JSON object and return it to Backend
        from utils.data_util import dictionary_to_json
        return dictionary_to_json(performance_results=model_performance,
                                  validation_real_values=validation_dict[self.parameters['featureToPredict']],
                                  validation_predictions=validation_dict['prediction'],
                                  future_predictions=future_predictions)
