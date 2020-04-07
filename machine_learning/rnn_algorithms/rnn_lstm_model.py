import numpy as np

from keras.models import Sequential
from keras.layers import Dense, LSTM, Dropout, BatchNormalization
from keras.optimizers import Adam, Adadelta, Adamax, Nadam, RMSprop, SGD
from sklearn.preprocessing import MinMaxScaler, StandardScaler, MaxAbsScaler, RobustScaler

from utils.neural_network_helper import prepare_data


class RnnModel:

    def __init__(self):
        self.parameters = \
            {
                'companySymbol': 'amzn',

                # Prediction Parameters
                'seqLen': 45,
                'forecastOut': 7,
                'features': ['close', 'open', 'high'],
                'featureToPredict': 'close',
                'testSize': 0.10,
                'scaler': 'StandardScaler',
                'precision': 2,  # Always two

                # Rnn Parameters
                'epochs': 5,
                'batchSize': 24,
                'networkUnits': [128, 128, 64, 64],
                'networkLayers': 4,
                'dropOut': 0.3,
                'batchNormalization': True,
                'metrics': ['mse', 'mae', 'mape'],
                'loss': 'mse',
                'optimizer': 'Adam',

                # Optimizer Parameters
                'learningRate': 0.001,
                'beta': 0.9,
                'beta2': 0.999,
                'epsilon': 0.099,
                'decay': 10E-8,
                'amsgrad': False,
                'scheduleDecay': 0.002,
                'momentum': 0.,
                'nesterov': False,
                'rho': 0.9
            }

        # Dataset Parameters
        self.train_x = None
        self.train_y = None
        self.validation_x = None
        self.validation_y = None
        self.main_dataset = None

        # Scaler
        self.y_scaler = None

        # Model
        self.RNN_MODEL = None

    """ 
        Optimizer Parameter Definitions:
            LEARNING_RATE   : float 
                                >= 0. Learning rate.
            BETA_1          : float
                                0 < beta < 1. Generally close to 1.
            BETA_2          : float
                                0 < beta < 1. Generally close to 1.
            EPSILON         : float 
                                >= 0. Fuzz factor. If `None`, defaults to `K.epsilon()`.
            DECAY           : float
                                >= 0. Learning rate decay over each update.
            AMSGRAD         : boolean
                                Whether to apply the AMSGrad variant of this algorithm from the paper "On the Convergence of Adam and Beyond".
            SCHEDULE_DECAY  : float
                                0 < schedule_decay < 1.
            MOMENTUM        : float 
                                >= 0. Parameter that accelerates SGD in the relevant direction and dampens oscillations.
            NESTEROV        : boolean.
                                Whether to apply Nesterov momentum.
            RHO             : float 
                                >= 0
    """

    def create_network(self):
        """
        Create a Recurrent Neural Network Model to be trained.
            Method will:
                -> create train_x, train_y to use for training.
                -> create validation_x, validation_y to use for the testing.

                Important part here is, since we have a sequential data, we need to create sequences based on user
                interval. (Look prepare_data() for more detail)

                RNN model will be Sequential. Then we will add hidden layers which they must return sequences so the next
                hidden layer can process that.

                We will have one more layer which will not return sequences and then we will add a Dense layer for the output.

        Returns
        -------
            Calls self.train_network() method which will return 3 JSON Documents:
                1. Performance Metrics
                2. Validation Data Predictions
                3. Future Stock Predictions
        """

        # Split the dataset
        self.train_x, self.train_y, self.validation_x, self.validation_y, self.y_scaler, self.main_dataset = prepare_data(company_symbol=self.parameters['companySymbol'],
                                                                                                                          features=self.parameters['features'],
                                                                                                                          feature_to_predict=self.parameters['featureToPredict'],
                                                                                                                          forecast_out=self.parameters['forecastOut'],
                                                                                                                          seq_len=self.parameters['seqLen'],
                                                                                                                          test_size=self.parameters['testSize'],
                                                                                                                          scaler=self.y_scaler)

        # Initialize RNN Model
        self.RNN_MODEL = Sequential()
        number_of_layers = 0

        # Add Input Layer of the RNN
        self.RNN_MODEL.add(LSTM(units=self.parameters['networkUnits'][0],
                                input_shape=self.train_x.shape[1:],
                                return_sequences=True, activation='linear'))
        number_of_layers += 1
        # Adding hidden layers
        while number_of_layers < self.parameters['networkLayers'] - 2:
            number_of_layers += 1
            self.RNN_MODEL.add(
                LSTM(units=self.parameters['networkUnits'][number_of_layers], return_sequences=True, activation='relu'))

            if self.parameters['dropOut'] is not None:
                self.RNN_MODEL.add(Dropout(self.parameters['dropOut']))

            if self.parameters['batchNormalization']:
                self.RNN_MODEL.add(BatchNormalization())

        # Adding the last layer before the output. It will not have return_sequences parameter
        self.RNN_MODEL.add(LSTM(units=self.parameters['networkUnits'][-1]))

        if self.parameters['dropOut'] is not None:
            self.RNN_MODEL.add(Dropout(self.parameters['dropOut']))

        self.RNN_MODEL.add(Dense(units=1, activation='linear'))

        return self.train_network()

    def train_network(self):
        """
        Train the RNN that was created by using create_network() method.

            Method will:
                -> Decide which defined optimizer user select, and set the optimizer. ( Check configure_optimizer() Method)
                -> Model will be compiled by using given loss function, optimizer and metrics.
                -> Model will be fit by using train_x and train_y, given batch size and epochs. Then performance
                   will be validated by using the validation_x and validation_y.

        Returns
        -------
            Returns performance results, validation_predictions and future_prices as separate JSON Documents
        """

        # Initialize and configure RNN Optimizer
        opt = self.configure_optimizer(self.parameters['optimizer'])

        # Compiling the RNN
        self.RNN_MODEL.compile(loss=self.parameters['loss'],
                               optimizer=opt,
                               metrics=self.parameters['metrics'])

        # Train model
        self.RNN_MODEL.fit(self.train_x, self.train_y,
                           batch_size=self.parameters['batchSize'],
                           epochs=self.parameters['epochs'],
                           validation_data=(self.validation_x, self.validation_y), shuffle=True)

        # Get Model Performance
        performance_results = self.get_model_performance()

        # Get validation data predictions
        validation_predictions = self.get_validation_predictions()

        # Get future predictions
        future_predictions = self.get_future_predictions()

        test_size = len(self.validation_x)
        real_vs_prediction_df = self.main_dataset[self.parameters['featureToPredict']].iloc[-test_size:].to_frame()
        real_vs_prediction_df['prediction'] = validation_predictions
        validation_dict = real_vs_prediction_df.to_dict()

        # Convert results to JSON object and return it to Backend
        from utils.data_util import dictionary_to_json

        return dictionary_to_json(performance_results=performance_results,
                                  validation_real_values=validation_dict[self.parameters['featureToPredict']],
                                  validation_predictions=validation_dict['prediction'],
                                  future_predictions=future_predictions)

    def configure_optimizer(self, optimizer_name):
        """
        Find user selected optimizer and set it up.

            Method will:
                -> Find the optimizer which user selected and configure its parameters by given parameters.
                   (If there is no parameter given, default values will be used)

        Returns
        -------
            optimizer that will be used on RNN
        """
        switcher = {
            'Adam': Adam(lr=self.parameters['learningRate'], beta_1=self.parameters['beta'],
                         beta_2=self.parameters['beta2'], epsilon=self.parameters['epsilon'],
                         decay=self.parameters['decay'], amsgrad=self.parameters['amsgrad']),

            'Adamax': Adamax(lr=self.parameters['learningRate'], beta_1=self.parameters['beta'],
                             beta_2=self.parameters['beta2'], epsilon=self.parameters['epsilon'],
                             decay=self.parameters['decay']),

            'Nadam': Nadam(lr=self.parameters['learningRate'], beta_1=self.parameters['beta'],
                           beta_2=self.parameters['beta2'], epsilon=self.parameters['epsilon'],
                           schedule_decay=self.parameters['scheduleDecay']),

            'SGD': SGD(lr=self.parameters['learningRate'], momentum=self.parameters['momentum'],
                       decay=self.parameters['decay'], nesterov=self.parameters['nesterov']),

            'RMSprop': RMSprop(lr=self.parameters['learningRate'], rho=self.parameters['rho'],
                               epsilon=self.parameters['epsilon'], decay=self.parameters['decay']),

            'Adadelta': Adadelta(lr=self.parameters['learningRate'], rho=self.parameters['rho'],
                                 epsilon=self.parameters['epsilon'], decay=self.parameters['decay']),

        }
        return switcher.get(optimizer_name)

    def get_model_performance(self):
        """
        Evaluate RNN

            Method will:
                -> Evaluate RNN by using validation data.

        Returns
        -------
            performance_scores = A dictionary that holds performance metrics (name, value)
        """
        score = self.RNN_MODEL.evaluate(self.validation_x, self.validation_y)
        score.pop(0)

        performance_scores = {}

        for metric, sco in zip(self.parameters['metrics'], score):
            performance_scores[metric] = sco

        return performance_scores

    def get_validation_predictions(self):
        """
        Make a prediction on validation data.

            Method will:
                -> Create predictions by using validation data.
                -> Those validations must be inverse_transform since they were scaled between 0 to 1. Thus, scaler
                   object will be used to scale the values back.
        Returns
        -------
            predicted_values = Values that RNN predicted
        """
        y_pred = self.RNN_MODEL.predict(self.validation_x)

        validation_predictions = self.y_scaler.inverse_transform(y_pred)
        validation_predictions = np.round(validation_predictions, decimals=self.parameters['precision'])

        return validation_predictions

    def get_future_predictions(self):
        """
        Make a prediction to find future stock prices.

            Method will:
                -> Take a sequence of data.
                -> Create the first prediction which is one day in the future.
                -> Remove the oldest stock price from the sequence and append the new prediction to the end.
                -> Continue until FORECAST_OUT limit is reached.

        Returns
        -------
            predicted_values = Forecasted values that RNN predicted
        """
        from numpy import newaxis

        curr_window_frame = self.validation_x[0]
        predicted = []

        for i in range(self.parameters['forecastOut']):
            next_prediction = self.RNN_MODEL.predict(curr_window_frame[newaxis, :, :])[0, 0]
            predicted.append(next_prediction)

            temp = np.zeros((1, curr_window_frame[0].size))
            temp[0][0] = predicted[i]
            temp[0][1:] = curr_window_frame[0][1:]

            curr_window_frame = curr_window_frame[1:]

            curr_window_frame = np.insert(curr_window_frame, [self.parameters['seqLen'] - 1], temp, axis=0)

        predicted_values = self.y_scaler.inverse_transform(np.array(predicted).reshape((len(predicted)), 1))
        predicted_values = np.round(predicted_values, decimals=self.parameters['precision'])

        return predicted_values

    def set_parameters(self, parameter_dict):
        """
        Method will set the parameters based on what they chose on model creation page.
        If user didn't select a parameter, it will be set to default value.

        :param parameter_dict: Parameters that user selected on model creation page
        """
        for key, value in parameter_dict.items():
            self.parameters[key] = value

        # Create the scaler object and assign it to the model object.
        switcher = {
            'StandardScaler': StandardScaler(),
            'MinMaxScaler': MinMaxScaler(),
            'RobustScaler': RobustScaler(),
            'MaxAbsScaler': MaxAbsScaler()
        }

        self.y_scaler = switcher.get(self.parameters['scaler'])


def train_model(params):
    model = RnnModel()
    model.set_parameters(parameter_dict=params)

    return model.create_network()
