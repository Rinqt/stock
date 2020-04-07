from sklearn.linear_model import LinearRegression
from regression_algorithms.regression_model import Model


class LrDefaultModel(Model):

    def create_model(self):
        self.MODEL = LinearRegression(fit_intercept=self.parameters['fitIntercept'],
                                      normalize=self.parameters['normalize'])

        return self.fit_evaluate()


def train_model(params):
    model = LrDefaultModel()
    model.parameters = model.set_parameters(parameter_dict=params)
    model.split_data()

    return model.create_model()
