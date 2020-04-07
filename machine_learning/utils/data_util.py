import json
import pandas as pd
import numpy as np
import urllib.request


def get_stocks(company_symbol, features, result_feature):
    """
    Method is responsible of connecting the backend and retrieves the stocks values.
    Workflow:
        - Connects to backend and retrieves data
        - Create a data frame with the retrieved data.

    Parameters
    ----------
    company_symbol: Stock Market Symbol of a company
    features: Features that will be used to create predictions (e.g: 'Close', 'Open')
    result_feature: Feature to be predicted

    Returns
    -------
    dataset: Stock values
    """

    cols = ['createdAt'] + features + [result_feature]

    # Remove the duplicates (if any)
    cols = set(cols)
    cols = list(cols)

    api_url = 'https://stockapi20200306052122.azurewebsites.net/api/stocks/all?companySymbol=' + company_symbol
    all_stocks = urllib.request.urlopen(api_url).read()

    dataset = pd.DataFrame(eval(all_stocks))
    dataset = dataset[cols]
    dataset.set_index('createdAt', inplace=True)

    return dataset


def dictionary_to_json(performance_results, validation_real_values, validation_predictions, future_predictions):
    """

    Parameters
    ----------
    performance_results: Metric results of the network training.
    validation_real_values: Real stock values that is divided for validation.
    validation_predictions: Predicted stock values of validation data.
    future_predictions: Predictions for future

    Returns
    -------
    results: JSON Object contains all the data
    """

    results = {'model_performance': performance_results,
               'validation_real_values': validation_real_values,
               'validations_predictions': validation_predictions,
               'future_predictions': future_predictions}

    results = json.dumps(results, cls=NumpyEncoder)
    return results


class NumpyEncoder(json.JSONEncoder):
    """
        Numpy encoder to encode JSON values correctly.
    """
    def default(self, obj):
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        return json.JSONEncoder.default(self, obj)
