from sklearn.linear_model import Ridge
from regression_algorithms.regression_model import Model


class LrRidgeModel(Model):

    def create_model(self):
        self.MODEL = Ridge(alpha=self.parameters['alpha'],
                           fit_intercept=self.parameters['fitIntercept'],
                           normalize=self.parameters['normalize'],
                           max_iter=self.parameters['maxIteration'],
                           tol=self.parameters['tol'],
                           solver=self.parameters['solver'],
                           random_state=self.parameters['randomState'])

        return self.fit_evaluate()


def train_model(params):
    model = LrRidgeModel()
    model.parameters = model.set_parameters(parameter_dict=params)
    model.split_data()

    return model.create_model()
