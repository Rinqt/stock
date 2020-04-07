from sklearn.ensemble import RandomForestRegressor
from regression_algorithms.regression_model import Model


class RandomForestModel(Model):

    def create_model(self):
        self.MODEL = RandomForestRegressor(bootstrap=self.parameters['bootstrap'],
                                           criterion=self.parameters['criterion'],
                                           max_depth=self.parameters['maxDepth'],
                                           max_features=self.parameters['maxFeatures'],
                                           max_leaf_nodes=self.parameters['maxLeafNodes'],
                                           min_impurity_decrease=self.parameters['minImpurityDecrease'],
                                           min_samples_leaf=self.parameters['minSamplesLeaf'],
                                           min_samples_split=self.parameters['minSamplesSplit'],
                                           n_estimators=self.parameters['estimators'],
                                           oob_score=self.parameters['oobScore'],
                                           random_state=self.parameters['randomState'],
                                           warm_start=self.parameters['warmStart'])

        return self.fit_evaluate()


def train_model(params):
    model = RandomForestModel()
    model.parameters = model.set_parameters(parameter_dict=params)
    model.split_data()

    return model.create_model()
