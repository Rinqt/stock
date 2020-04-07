import numpy as np
import random

from collections import deque


def create_sequences(dataset, SEQ_LEN, feature_to_predict, scaler):
    """
    Method is responsible of creating sequences for the stock values so it can be used for network training.

    Workflow:
        - Scale the dataset columns.
            (Keep the scaler object for the feature_to_predict so it can be used for unscaling)

        - Create sequences:
            Create a list to keep list of sequences. Keep appending the stock values to the sequence list
            until it reaches the SEQ_LEN. When it reaches the SEQ_LEN, append it to the main list.

        - Iterate over the sequential data and create X and y lists:
            -> X is the Sequences (features)
            -> y is the label

    Parameters
    ----------
    dataset: Stock prices
    SEQ_LEN: Number to identify the length of a sequence that will be used for model training.
    feature_to_predict: One value regarding what user would like to make prediction on. Due to regression,
                        user can only predict one value per model.
    scaler: Scaler object to scale feature_to_predict values. This scaler then will be used for unscaling the results.
            This scaler can be used for each column in the dataset. However, after scaling every column, scaling
            properties will be updating based on the scaled column. It would be nicer to keep unique scaler for
            feature_to_predict values since we will be needing to unscale them later.

    Returns
    -------
    train_x, train_y: Train datasets to be used in RNN
    validation_x, validation_y: Validation datasets to be used in RNN
    scaler_validation_data: Scaler object that is used to scale feature_to_predict values.
    """

    feature_to_predict_scaler = scaler

    # We need to iterate over the values, store all the features, NOT THE LABEL, then append it to list when we
    # reach the SEQ_LEN
    for col_name in dataset.columns:
        dataset.dropna(inplace=True)
        if col_name == feature_to_predict:
            dataset[col_name] = feature_to_predict_scaler.fit_transform(np.array(dataset[col_name]).reshape((len(dataset[col_name]), 1)))
        else:
            dataset[col_name] = scaler.fit_transform(np.array(dataset[col_name]).reshape((len(dataset[col_name]), 1)))

    dataset.dropna(inplace=True)

    sequential_data = []
    prev_days = deque(maxlen=SEQ_LEN)

    for val in dataset.values:
        prev_days.append([n for n in val[:-1]])
        if len(prev_days) == SEQ_LEN:
            sequential_data.append([np.array(prev_days), val[-1]])

    # If user picks a test size which we cannot create a sequence for, we will append whatever days we have,
    # then we will find the mean of the each feature column and label column we have then fill the rest of the
    # columns with the mean.
    if len(sequential_data) < 1:
        missing_days = SEQ_LEN - len(prev_days)
        mean_values = dataset.mean(axis=0)

        features_mean_value = mean_values[:-1]
        target_mean_value = mean_values[-1]

        for i in range(missing_days):
            # Fill the rest with mean value
            temp = []
            for mean in features_mean_value:
                temp.append(mean)
            prev_days.append(temp)

        sequential_data.append([np.array(prev_days), target_mean_value])

    random.shuffle(sequential_data)

    X = []
    y = []

    for seq, target in sequential_data:  # going over our new sequential data
        X.append(seq)  # X is the features
        y.append(target)  # y is the label

    return np.array(X), y, feature_to_predict_scaler


def prepare_data(company_symbol, features, feature_to_predict, forecast_out, seq_len, test_size, scaler):
    """
    Method is responsible for preparing the stock price data. Workflow:
        - It receives the stock prices from backend by using the get_stocks method.
        - Sort the dataset columns in a way that feature_to_predict will be the first column
        - There must be new column created in the stock price dataset. As the convention, 'Future ' + feature_to_predict
          naming is used. This column will be having the stock price value of the feature_to_predict shifted upwards.
            As an example, if forecast_out value is 2 and feature_to_predict is 'Close' stock values.
            The first row of the 'Future ...' column will have the value of two days later and so on:
                    Close | Future Close
                      12        22
                      18        15
                      22        33
                      15        ..
                      33        ..

        - Divide the dataset by using given test size.
        - Drop None values if any.
        - Create sequences for training and the validation dataset.

    Parameters
    ----------
    company_symbol: Stock market symbol for company (e.g: tsla for Tesla)
    features: List of features that user wants to use during the prediction. It can be one feature or all the features in the dataset
    feature_to_predict: One value regarding what user would like to make prediction on. Due to regression,
                        user can only predict one value per model.
    forecast_out: Indicates how many days in the future user wants to make prediction.
    seq_len: Number to identify the length of a sequence that will be used for model training.
    test_size: Size of the test dataset
    scaler: scaler object

    Returns
    -------
    train_x, train_y: Train datasets to be used in RNN
    validation_x, validation_y: Validation datasets to be used in RNN
    scaler_validation_data: Scaler object that is used to scale feature_to_predict values.
    """

    from utils.data_util import get_stocks
    import pandas as pd

    dataset = get_stocks(company_symbol, features, feature_to_predict)

    dataset = order_columns(dataset=dataset,
                            col_names=dataset.columns.tolist(),
                            feature_to_predict=feature_to_predict)

    full_dataset = dataset.copy()

    dataset['Future ' + feature_to_predict] = dataset[feature_to_predict].shift(-forecast_out)

    dataset.dropna(inplace=True)

    dataset.index = pd.to_datetime(dataset.index)  # convert the index to a datetime object

    times = dataset.index.values
    last_validation_percent = dataset.index.values[-int(test_size * len(times))]

    validation_data = dataset[(dataset.index >= last_validation_percent)]
    train_data      = dataset[(dataset.index < last_validation_percent)]

    validation_data.dropna(inplace=True)
    train_data.dropna(inplace=True)

    train_x, train_y, scaler_train_data = create_sequences(train_data, seq_len, feature_to_predict, scaler)
    validation_x, validation_y, scaler_validation_data = create_sequences(validation_data, seq_len, feature_to_predict, scaler)

    return train_x, train_y, validation_x, validation_y, scaler_validation_data, full_dataset


def order_columns(dataset, col_names, feature_to_predict):
    """
    Method is responsible of putting the 'feature_to_predict' name as the first column of the dataset
    and sorts the other columns names.
    Parameters
    ----------
    dataset
    col_names = column names to be sorted
    feature_to_predict = feature to be predicted

    Returns
    -------
    Dataset which has 'feature_to_predict' as the first row of the dataset.
    """
    col_names.remove(feature_to_predict)
    col_names.sort()

    sorted_column_list = [feature_to_predict]
    for col_name in col_names:
        if col_name != feature_to_predict:
            sorted_column_list.append(col_name)

    dataset = dataset.reindex(sorted_column_list, axis=1)
    return dataset
