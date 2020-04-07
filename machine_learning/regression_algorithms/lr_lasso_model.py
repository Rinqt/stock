from sklearn.linear_model import Lasso
from regression_algorithms.regression_model import Model


class LrLassoModel(Model):

    def create_model(self):
        self.MODEL = Lasso(alpha=self.parameters['alpha'],
                           fit_intercept=self.parameters['fitIntercept'],
                           normalize=self.parameters['normalize'],
                           precompute=self.parameters['preCompute'],
                           max_iter=self.parameters['maxIteration'],
                           tol=self.parameters['tol'],
                           warm_start=self.parameters['warmStart'],
                           positive=self.parameters['positive'],
                           random_state=self.parameters['randomState'],
                           selection=self.parameters['selection'])

        return self.fit_evaluate()


def train_model(params):
    model = LrLassoModel()
    model.parameters = model.set_parameters(parameter_dict=params)
    model.split_data()

    return model.create_model()
