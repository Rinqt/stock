import React, { Component } from "react";
import { withStyles, Paper, Typography } from "@material-ui/core";
import { FusePageSimple } from "@fuse";
import Breadcrumbs from "../../shared-widgets/breadcrumbs/Breadcrumbs.js";
import DataControl from "./widgets/DataControl";
import ModelControl from "./widgets/ModelControl.js";
import FeaturesControl from "./widgets/FeaturesControl.js";
import FeatureToPredict from "./widgets/FeatureToPredict";
import Header from "./widgets/Header.js";
import Chart from "../../shared-widgets/charts/Chart.js";
import Predictions from "./widgets/Predictions.js";
import { checkLoggedin } from "../../../api/login.api";
import { getModels, getModelById } from "../../../api/models.api";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getInfo, getSettings } from "../../../api/user.api";
import { getStocksList } from "../../../api/stocks.api";
import history from "history.js";
import moment from "moment";
import * as Sentry from "@sentry/browser";
import InputRange from "react-input-range";

const styles = theme => ({
    layoutRoot: {}
});

class ViewModel extends Component {
    state = {
        breadcrumbs: [],
        futurePredicts: {
            datasets: []
        },
        predictVsReal: {
            labels: [],
            datasets: []
        },
        range: 30,
        max: 300
    };

    changeDisplay = value => {
        const { modelByID } = this.props;

        const result = modelByID.result ? JSON.parse(modelByID.result) : {};
        let predvsrealLabels = Object.keys(result.validation_real_values);
        for (let label in predvsrealLabels) {
            predvsrealLabels[label] = moment(
                new Date(predvsrealLabels[label])
            ).format("ll");
        }
        this.setState({
            range: value,
            predictVsReal: {
                labels: value
                    ? [
                          ...predvsrealLabels.slice(
                              -value,
                              predvsrealLabels.length
                          )
                      ]
                    : [],
                datasets: [
                    {
                        label: "real",
                        data: value
                            ? [
                                  ...Object.values(
                                      result.validation_real_values
                                  ).slice(-value, predvsrealLabels.length)
                              ]
                            : [],
                        fill: false
                    },
                    {
                        label: "predictions",
                        data: value
                            ? [
                                  ...Object.values(
                                      result.validations_predictions
                                  ).slice(-value, predvsrealLabels.length)
                              ]
                            : [],
                        fill: false
                    }
                ]
            }
        });
    };
    componentDidMount() {
        const {
            isLoggedin,
            getUserInfo,
            getUserSettings,
            getModels,
            getModelById
        } = this.props;
        const { id } = this.props.match.params;
        // guard
        //check if the user is not logged in then redirect to the dashboard page
        if (isLoggedin) {
            getUserInfo();
            getUserSettings();
            getModels();
            getModelById(id);
        }
    }

    componentDidUpdate(prevProps) {
        // this will handle loading realred article based on the current article
        const {
            isLoggedin,
            getUserInfo,
            getUserSettings,
            getModels,
            modelByID,
            getModelById,
            getStocksList,
            stocksList
        } = this.props;
        const { id } = this.props.match.params;

        if (!isLoggedin) {
            history.push("/app/dashboard");
        }

        if (prevProps.isLoggedin !== isLoggedin && isLoggedin) {
            getUserInfo();
            getUserSettings();
            getModels();
            getModelById(id);
        }

        if (
            (prevProps.stocksList === null ||
                prevProps.stocksList !== stocksList) &&
            stocksList !== null
        ) {
            const { futurePredicts } = this.state;
            const data = [];
            for (let i = 0; i < futurePredicts.labels.length; i++) {
                const item = stocksList.filter(el => {
                    return (
                        moment(new Date(el.createdAt)).format("ll") ===
                        futurePredicts.labels[i]
                    );
                });
                if (item.length > 0) {
                    data.push(item[0][modelByID.parameters.featureToPredict]);
                } else {
                    data.push(null);
                }
            }

            futurePredicts.datasets[1] = {
                label: "Real",
                data: [...data],
                fill: false
            };
            this.setState({
                futurePredicts: { ...futurePredicts }
            });
        }

        if (
            (prevProps.modelByID === null ||
                prevProps.modelByID !== modelByID) &&
            modelByID !== null
        ) {
            this.setState({
                breadcrumbs: [
                    {
                        title: "Analysis",
                        link: "/app/analysis"
                    },
                    {
                        title: modelByID.name,
                        link: ""
                    }
                ]
            });

            // get real data if the model was created long time ago
            if (
                moment().format("YYYY-MM-DD") >
                moment(new Date(modelByID.createdAt)).format("YYYY-MM-DD")
            ) {
                getStocksList(
                    modelByID.companySymbol,
                    moment(new Date(modelByID.createdAt)).format("YYYY-MM-DD"),
                    moment(new Date(modelByID.createdAt))
                        .add(7, "d")
                        .format("YYYY-MM-DD")
                );
            }
            const result = modelByID.result
                ? JSON.parse(modelByID.result)
                : null;
            if (result) {
                const labels = [];
                const data = [];

                for (let i = 0; i < result.future_predictions.length; i++) {
                    labels.push(
                        moment(new Date(modelByID.createdAt))
                            .add(i, "d")
                            .format("ll")
                    );

                    data.push(
                        parseFloat(result.future_predictions[i]).toFixed(2)
                    );
                }

                const futurePredicts = {
                    labels: [...labels],
                    datasets: [
                        {
                            label: "Future",
                            data: [...data],
                            fill: false
                        }
                    ]
                };

                let predvsrealLabels = Object.keys(
                    result.validation_real_values
                );

                for (let label in predvsrealLabels) {
                    predvsrealLabels[label] = moment(
                        new Date(predvsrealLabels[label])
                    ).format("ll");
                }

                this.setState({
                    futurePredicts: { ...futurePredicts },
                    max:
                        predvsrealLabels.length < 300
                            ? predvsrealLabels.length
                            : 300,
                    predictVsReal: {
                        labels: predvsrealLabels.slice(
                            -this.state.range,
                            predvsrealLabels.length
                        ),
                        datasets: [
                            {
                                label: "real",
                                data: [
                                    ...Object.values(
                                        result.validation_real_values
                                    ).slice(
                                        -this.state.range,
                                        predvsrealLabels.length
                                    )
                                ],
                                fill: false
                            },
                            {
                                label: "predictions",
                                data: [
                                    ...Object.values(
                                        result.validations_predictions
                                    ).slice(
                                        -this.state.range,
                                        predvsrealLabels.length
                                    )
                                ],
                                fill: false
                            }
                        ]
                    }
                });
            }
        }
    }

    componentWillMount() {
        const { checkLoggedin } = this.props;

        // confirm if the user is logged in before entering the page
        checkLoggedin();
    }

    // error log
    componentDidCatch(error, errorInfo) {
        Sentry.withScope(scope => {
            scope.setExtras(errorInfo);
            Sentry.captureException(error);
        });
    }

    render() {
        const { classes, modelByID, loading, locale } = this.props;
        const { id } = this.props.match.params;
        const result =
            !loading && modelByID.result ? JSON.parse(modelByID.result) : {};

        return (
            <FusePageSimple
                classes={{
                    root: classes.layoutRoot
                }}
                content={
                    <div id="export-pdf" className="p-24 w-full">
                        <div
                            className="flex flex-col md:flex-row sm:p-8 container"
                            data-html2canvas-ignore
                        >
                            {loading ? (
                                <div className="animated-background text-line half-line"></div>
                            ) : (
                                <Breadcrumbs
                                    data={this.state.breadcrumbs}
                                ></Breadcrumbs>
                            )}
                        </div>
                        <div className="flex flex-col md:flex-row sm:p-8 container">
                            <div className="flex flex-1 flex-col">
                                <Header
                                    name={modelByID.name}
                                    state={modelByID.state}
                                    loading={loading}
                                    id={id}
                                    locale={locale.header}
                                />

                                {Object.keys(result).length ? (
                                    <>
                                        <div className="flex flex-1 flex-row">
                                            <div className="flex flex-1 pr-16x pt-16">
                                                <Chart
                                                    title={
                                                        locale.futurePredictionsTitle
                                                    }
                                                    data={
                                                        this.state
                                                            .futurePredicts
                                                    }
                                                    loading={loading}
                                                    type={"error"}
                                                />
                                            </div>
                                            <div className="flex flex-1 pt-16 pl-16 pr-16 ">
                                                <Predictions
                                                    result={result}
                                                    locale={locale.modelPerf}
                                                    loading={loading}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-1 flex-col">
                                            <div className="flex flex-1 pr-16 pt-16">
                                                <Paper className="flex flex-1 p-16 flex-col">
                                                    <Typography>
                                                        {locale.sliderMessage}
                                                    </Typography>
                                                    <InputRange
                                                        maxValue={
                                                            this.state.max
                                                        }
                                                        step={10}
                                                        minValue={0}
                                                        value={this.state.range}
                                                        onChange={
                                                            this.changeDisplay
                                                        }
                                                    />
                                                </Paper>
                                            </div>
                                            <div className="flex flex-1 pr-16 pl-0">
                                                <Chart
                                                    title={
                                                        locale.predVSrealChartTitle
                                                    }
                                                    data={
                                                        this.state.predictVsReal
                                                    }
                                                    loading={loading}
                                                />
                                            </div>
                                        </div>
                                    </>
                                ) : modelByID.state === "Failed" ? (
                                    <div className="flex flex-1 flex-col">
                                        <div className="flex flex-1 pr-16 pt-16">
                                            <Paper className="flex flex-1 p-16 flex-col">
                                                <Typography>
                                                    {locale.buildFailed}
                                                </Typography>
                                            </Paper>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-1 flex-col">
                                        <div className="flex flex-1 pr-16 pt-16">
                                            <Paper className="flex flex-1 p-16 flex-col">
                                                <Typography>
                                                    {locale.noResults}
                                                </Typography>
                                            </Paper>
                                        </div>
                                    </div>
                                )}
                                <DataControl
                                    company={modelByID.companySymbol}
                                    loading={loading}
                                    locale={locale.datasetControl}
                                />
                                <FeaturesControl
                                    features={
                                        !loading
                                            ? modelByID.parameters.features
                                            : []
                                    }
                                    loading={loading}
                                    locale={locale.features}
                                />
                                <FeatureToPredict
                                    value={
                                        !loading
                                            ? modelByID.parameters
                                                  .featureToPredict
                                            : null
                                    }
                                    loading={loading}
                                    locale={locale.featureToPredict}
                                />
                                <ModelControl
                                    type={modelByID.type}
                                    parameters={
                                        !loading ? modelByID.parameters : []
                                    }
                                    loading={loading}
                                    locale={locale.modelControl}
                                />
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
        modelByID: custom.models.modelByID,
        loading: custom.models.loadingModelById,
        locale: custom.locale.viewModelPage,
        stocksList: custom.stocks.chartList
    };
}

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            checkLoggedin: checkLoggedin,
            getUserInfo: getInfo,
            getUserSettings: getSettings,
            getModelById: getModelById,
            getModels: getModels,
            getStocksList: getStocksList
        },
        dispatch
    );

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles, { withTheme: true })(ViewModel));
