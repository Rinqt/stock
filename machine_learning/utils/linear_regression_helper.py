from sklearn.model_selection import train_test_split
from utils.data_util import get_stocks


def prepare_data(company_symbol, result_feature, features, forecast_out, test_size, random_state):
    """
    Method will shift data values by given 'forecast_out' amount. Basically, we will be predicting 'n' values
    in the future by shifting the values 'n' backwards. So, we will use the data that comes 'n' days ago to
    predict today and further.

    Parameter
    -------
        _dataset = Stock Dataset

    Returns
    -------
        X_train   : Set of features (For training the model)
        X_test    : Set of features (For evaluating the model)
        y_train   : Set of label (For training the model)
        y_test    : Set of label (For evaluation the model)
        x_forecast: Forecast out (It will be used to predict 'n' days ahead
    """
    dataset = get_stocks(company_symbol, features, result_feature)
    dataset['Prediction'] = dataset[result_feature].shift(-forecast_out)

    X = dataset.loc[:, features].values
    X = X[:-forecast_out]

    full_dataset = dataset.drop(columns='Prediction', axis=1)

    y = dataset.loc[:, 'Prediction'].values
    y = y[:-forecast_out]

    x_forecast = dataset.loc[:, features].values
    x_forecast = x_forecast[-forecast_out:]

    X_train, X_test, y_train, y_test = train_test_split(X,
                                                        y,
                                                        test_size=test_size,
                                                        random_state=random_state)

    return X_train, X_test, y_train, y_test, x_forecast, full_dataset


def get_model_performance(regression_model, X_test, y_test):
    """
    Method will use the passed predictor to make prediction on test data and report the accuracy metrics.

    Returns
    -------
        performance_results = A dictionary which includes performance metrics:
                variance_score
                max_error_value
                mean_abs_error_value
                mean_square_error_value
                r2_value
    """
    from sklearn.metrics import explained_variance_score, max_error, mean_absolute_error, mean_squared_error, r2_score

    # Predicting the Test set results
    y_pred = regression_model.predict(X_test)

    # Performance Metrics:
    variance_score = explained_variance_score(y_test, y_pred)
    max_error_value = max_error(y_test, y_pred)
    mean_abs_error_value = mean_absolute_error(y_test, y_pred)
    mean_square_error_value = mean_squared_error(y_test, y_pred)
    r2_value = r2_score(y_test, y_pred)

    # Metric Dictionary
    performance_results = {
        "variance_score": variance_score,
        "max_error_value": max_error_value,
        "mean_abs_error_value": mean_abs_error_value,
        "mean_square_error_value": mean_square_error_value,
        "r2_value": r2_value
    }

    return performance_results


def get_future_predictions(regression_model, x_forecast):
    """
    Method will use the passed predictor to make prediction for the future stock prices

    Parameter
    -------
        predictor = A Linear Regression Model that has been created and fit before

    Returns
    -------
        forecast_stocks = List of future stock prices
    """
    forecast_stocks = regression_model.predict(x_forecast)
    return forecast_stocks
