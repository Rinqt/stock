from sklearn.linear_model import ElasticNet
from regression_algorithms.regression_model import Model


class LrElasticModel(Model):

    def create_model(self):
        self.MODEL = ElasticNet(alpha=self.parameters['alpha'],
                                l1_ratio=self.parameters['l1Ratio'],
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
    model = LrElasticModel()
    model.parameters = model.set_parameters(parameter_dict=params)
    model.split_data()

    return model.create_model()
