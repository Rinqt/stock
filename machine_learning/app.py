import sentry_sdk

from flask import Flask, request
from regression_algorithms import lr_bayesian_ridge_model, lr_default_model, lr_elastic_model, lr_lasso_lars_model, lr_lasso_model, lr_ridge_model
from regression_algorithms import decision_tree_model, random_forest_model
from rnn_algorithms import rnn_lstm_model
from sentry_sdk import init, capture_message


ml = Flask(__name__)
init(<sentry_connection_string>)

algorithms = \
    {
        'lr_default_model'    : lr_default_model,
        'lr_lasso_lars_model'    : lr_lasso_lars_model,
        'lr_ridge_model'         : lr_ridge_model,
        'lr_elastic_model'       : lr_elastic_model,
        'lr_lasso_model'         : lr_lasso_model,
        'lr_bayesian_ridge_model': lr_bayesian_ridge_model,

        'decision_tree_model'    : decision_tree_model,
        'random_forest_model'    : random_forest_model,

        'rnn_lstm_model'         : rnn_lstm_model,
    }


@ml.route('/<string:modelName>', methods=['GET'])
def train_prediction_model(modelName):
    content = request.get_json()

    try:
        model_performance = algorithms[modelName].train_model(params=content['params'])
        return model_performance
    except Exception as err:
        params = ' >> ' + str(content['params'])
        msg = 'Exception: ' + str(err)
        capture_message(msg + params)


@ml.route('/default_predictor', methods=['GET'])
def train_default_model():
    content = request.get_json()
    company_name = {"companySymbol": content['params']['companySymbol']}

    try:
        model_performance = algorithms['rnn_lstm_model'].train_model(params=company_name)
        return model_performance
    except Exception as err:
        params = ' >> ' + str({"companySymbol": content['params']['companySymbol']})
        msg = 'Exception: ' + str(err)
        capture_message(msg + params)


if __name__ == '__main__':
    ml.run(debug=True, host='0.0.0.0')
