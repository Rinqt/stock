import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { FusePageSimple } from "@fuse";
import Breadcrumbs from "../../shared-widgets/breadcrumbs/Breadcrumbs.js";
import DataControl from "./widgets/DataControl.js";
import ModelControl from "./widgets/ModelControl.js";
import FeaturesControl from "./widgets/FeaturesControl.js";
import FeatureToPredict from "./widgets/FeatureToPredict";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import { getInfo, getSettings } from "../../../api/user.api";
import { modelCreate, createHyperParams } from "../../../store/actions";
import { createModel, getModelById } from "../../../api/models.api";
import history from "history.js";
import { checkLoggedin } from "../../../api/login.api";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import moment from "moment";
import * as Sentry from "@sentry/browser";

const styles = theme => ({
  layoutRoot: {},
  button: {
    marginLeft: "15px;"
  }
});

class AddModel extends Component {
  state = {
    breadcrumbs: [
      {
        title: "Analysis",
        link: "/app/analysis"
      },
      {
        title: "Add new model",
        link: ""
      }
    ],
    openCloseChart: {
      labels: [],
      datasets: []
    },
    highLowChart: { labels: [], datasets: [] },
    volumeChart: { labels: [], datasets: [] },
    filledModel: null,
    disabled: false
  };

  componentWillMount() {
    const { checkLoggedin } = this.props;

    // confirm if the user is logged in before entering the page
    checkLoggedin();
  }
  componentDidMount() {
    const {
      dispatch,
      isLoggedin,
      getUserInfo,
      getUserSettings,
      getModelById
    } = this.props;
    const { id } = this.props.match.params;

    if (isLoggedin) {
      getUserInfo();
      getUserSettings();
      if (id) {
        getModelById(id);
      }
    }

    dispatch(
      modelCreate({
        parameters: {
          forecastOut: 7,
          testSize: 0.33,
          randomState: 42,
          features: ["open", "high", "low", "volume"],
          featureToPredict: "close"
        }
      })
    );
    dispatch(createHyperParams({}));
  }
  componentDidUpdate(prevProps) {
    const {
      isLoggedin,
      getUserInfo,
      getUserSettings,
      modelByID,
      getModelById,
      dispatch
    } = this.props;
    // guard
    //check if the user is not logged in then redirect to the dashboard page
    if (!isLoggedin) {
      history.push("/app/dashboard");
    }
    const { id } = this.props.match.params;
    if (prevProps.isLoggedin !== isLoggedin && isLoggedin) {
      getUserInfo();
      getUserSettings();
      if (id) {
        getModelById(id);
      }
    }

    if (id && prevProps.modelByID !== modelByID) {
      // if id is provided then it's copy not create
      // fill in the object
      this.setState({
        filledModel: { ...modelByID }
      });

      dispatch(
        modelCreate({
          name: modelByID.name + "-" + moment().format('YYYY.MM.DD HH:mm:ss'),
          type: modelByID.type,
          parameters: {
            companySymbol: modelByID.companySymbol,
            features: modelByID.parameters.features,
            featureToPredict: modelByID.parameters.featureToPredict,
            testSize: modelByID.parameters.testSize,
            forecastOut: modelByID.parameters.forecastOut,
            randomState: modelByID.parameters.randomState
          }
        })
      );
    }
  }
  /**
   * trigger api call ofr creatinng new model
   */
  saveModel = () => {
    const { disabled } = this.state;
    if (!disabled) {
      const { createdModel, createModel, hyperParams } = this.props;
      const model = { ...createdModel };
      if (!model.name) {
        const name =
          model.type +
          " - " +
          model.parameters.companySymbol +
          " - " +
          moment().format('YYYY.MM.DD HH:mm:ss');
        model.name = name;
      }
      model.parameters = { ...model.parameters, ...hyperParams };

      createModel(model);
      this.setState({ disabled: true });
    }
  };

  // error log
  componentDidCatch(error, errorInfo) {
    Sentry.withScope(scope => {
      scope.setExtras(errorInfo);
      Sentry.captureException(error);
    });
  }

  render() {
    const { classes, createdModel, locale } = this.props;
    const { filledModel, disabled } = this.state;
    return (
      <FusePageSimple
        classes={{
          root: classes.layoutRoot
        }}
        content={
          <div className="p-24 w-full">
            <div className="flex flex-col md:flex-row sm:p-8 container">
              <Breadcrumbs data={this.state.breadcrumbs}></Breadcrumbs>
            </div>
            <div className="flex flex-col md:flex-row sm:p-8 container">
              <div className="flex flex-1 flex-col">
                <DataControl
                  locale={locale.datasetControl}
                  name={filledModel ? filledModel.name : null}
                  companySymbol={filledModel ? filledModel.companySymbol : null}
                />
                <FeaturesControl
                  locale={locale.features}
                  features={
                    filledModel ? filledModel.parameters.features : null
                  }
                />
                <FeatureToPredict
                  locale={locale.featureToPredict}
                  value={
                    filledModel ? filledModel.parameters.featureToPredict : null
                  }
                />

                <ModelControl
                  locale={locale.modelControl}
                  model={filledModel ? filledModel.type : null}
                  params={filledModel ? filledModel.parameters : null}
                />

                <div className="flex flex-1 flex-col min-w-0">
                  <div className="flex flex-row pt-16 pr-16">
                    <div className="flex flex-1"></div>
                    <div className="flex">
                      <Button
                        variant="contained"
                        className={classes.button}
                        component={Link}
                        to="/app/analysis"
                      >
                        {locale.cancelBtn}
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        disabled={
                          !createdModel.type ||
                          !createdModel.parameters.companySymbol ||
                          disabled
                        }
                        onClick={this.saveModel}
                        className={classes.button}
                      >
                        {locale.saveBtn}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
      />
    );
  }
}

function mapStateToProps({ custom }) {
  return {
    isLoggedin: custom.login.isLoggedin,
    // stocksList: custom.stocks.chartList,
    // stocksLoading: custom.stocks.chartLoading,
    createdModel: custom.models.createdModel,
    hyperParams: custom.models.hyperParams,
    locale: custom.locale.viewModelPage,
    modelByID: custom.models.modelByID
  };
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    ...bindActionCreators(
      {
        checkLoggedin: checkLoggedin,
        getUserInfo: getInfo,
        getUserSettings: getSettings,
        createModel: createModel,
        getModelById: getModelById
      },
      dispatch
    )
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles, { withTheme: true })(AddModel));
