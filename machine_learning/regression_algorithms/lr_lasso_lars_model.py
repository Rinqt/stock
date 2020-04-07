from sklearn.linear_model import LassoLars
from regression_algorithms.regression_model import Model


class LrLassoLarsModel(Model):

    def create_model(self):
        self.MODEL = LassoLars(alpha=self.parameters['alpha'],
                               fit_intercept=self.parameters['fitIntercept'],
                               normalize=self.parameters['normalize'],
                               precompute=self.parameters['preCompute'],
                               max_iter=self.parameters['maxIteration'],
                               eps=self.parameters['eps'],
                               fit_path=self.parameters['fitPath'],
                               positive=self.parameters['positive'])

        return self.fit_evaluate()


def train_model(params):
    model = LrLassoLarsModel()
    model.parameters = model.set_parameters(parameter_dict=params)
    model.split_data()

    return model.create_model()
