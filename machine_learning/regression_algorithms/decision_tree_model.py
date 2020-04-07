from sklearn.tree import DecisionTreeRegressor
from regression_algorithms.regression_model import Model


class DecisionTreeModel(Model):

    def create_model(self):
        self.MODEL = DecisionTreeRegressor(criterion=self.parameters['criterion'],
                                           splitter=self.parameters['splitter'],
                                           max_depth=self.parameters['maxDepth'],
                                           min_samples_split=self.parameters['minSamplesSplit'],
                                           min_samples_leaf=self.parameters['minSamplesLeaf'],
                                           max_features=self.parameters['maxFeatures'],
                                           max_leaf_nodes=self.parameters['maxLeafNodes'],
                                           min_impurity_decrease=self.parameters['minImpurityDecrease'],
                                           presort=self.parameters['preSort'])

        return self.fit_evaluate()


def train_model(params):
    model = DecisionTreeModel()
    model.parameters = model.set_parameters(parameter_dict=params)
    model.split_data()

    return model.create_model()
