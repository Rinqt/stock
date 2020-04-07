from sklearn.linear_model import BayesianRidge
from regression_algorithms.regression_model import Model


class LrBayesianRidgeModel(Model):

    def create_model(self):
        self.MODEL = BayesianRidge(n_iter=self.parameters['maxIteration'],
                                   tol=self.parameters['tol'],
                                   alpha_1=self.parameters['alpha'],
                                   alpha_2=self.parameters['alpha2'],
                                   lambda_1=self.parameters['lambda'],
                                   lambda_2=self.parameters['lambda2'],
                                   compute_score=self.parameters['computeScore'],
                                   fit_intercept=self.parameters['fitIntercept'],
                                   normalize=self.parameters['normalize'])

        return self.fit_evaluate()


def train_model(params):
    model = LrBayesianRidgeModel()
    model.parameters = model.set_parameters(parameter_dict=params)
    model.split_data()

    return model.create_model()
