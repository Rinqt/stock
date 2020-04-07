import React, { Component } from "react";
import {
    withStyles,
    Paper,
    Button,
    Icon,
    CircularProgress
} from "@material-ui/core";
import { FusePageSimple } from "@fuse";
import { Typography } from "@material-ui/core";
import Breadcrumbs from "../../shared-widgets/breadcrumbs/Breadcrumbs.js";
import DataControl from "../view-model/widgets/DataControl";
import ModelControl from "../view-model/widgets/ModelControl.js";
import FeaturesControl from "../view-model/widgets/FeaturesControl.js";
import FeatureToPredict from "../view-model/widgets/FeatureToPredict";
import Chart from "../../shared-widgets/charts/Chart.js";
import Predictions from "../view-model/widgets/Predictions.js";
import { getInfo, getSettings } from "../../../api/user.api";
import { getModelById } from "../../../api/models.api";
import history from "history.js";
import { checkLoggedin } from "../../../api/login.api";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import moment from "moment";
import * as Sentry from "@sentry/browser";
import InputRange from "react-input-range";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const styles = theme => ({
    layoutRoot: {}
});

class CompareModels extends Component {
    state = {
        breadcrumbs: [
            {
                title: "Analysis",
                link: "/app/analysis"
            },
            {
                title: "Compare",
                link: ""
            }
        ],

        futurePredicts1: {
            labels: [],
            datasets: []
        },

        futurePredicts2: {
            labels: [],
            datasets: []
        },
        predictVsReal1: {
            labels: [],
            datasets: []
        },
        predictVsReal2: {
            labels: [],
            datasets: []
        },
        range1: 30,
        max1: 150,
        range2: 30,
        max2: 150
    };

    changeModelByIDDispaly = value => {
        const { modelByID } = this.props;

        const result = modelByID.result ? JSON.parse(modelByID.result) : {};
        let predvsrealLabels = Object.keys(result.validation_real_values);
        for (let label in predvsrealLabels) {
          predvsrealLabels[label] = moment(
            new Date(predvsrealLabels[label])
          ).format("ll");
        }
        this.setState({
            range1: value,
            predictVsReal1: {
                labels: value
                ? [...predvsrealLabels.slice(-value, predvsrealLabels.length)]
                : [],
              datasets: [
                {
                  label: "real",
                  data: value
                    ? [
                        ...Object.values(result.validation_real_values).slice(
                          -value,
                          predvsrealLabels.length
                        )
                      ]
                    : [],
                  fill: false
                },
                {
                  label: "predictions",
                  data: value
                    ? [
                        ...Object.values(result.validations_predictions).slice(
                          -value,
                          predvsrealLabels.length
                        )
                      ]
                    : [],
                  fill: false
                }
              ]
            }
        });
    };

    changeComparedModelDispaly = value => {
        const { comparedModel } = this.props;

        const result = comparedModel.result
            ? JSON.parse(comparedModel.result)
            : {};

            let predvsrealLabels = Object.keys(result.validation_real_values);
            for (let label in predvsrealLabels) {
              predvsrealLabels[label] = moment(
                new Date(predvsrealLabels[label])
              ).format("ll");
            }
        this.setState({
            range2: value,
            predictVsReal2: {
                labels: value
                ? [...predvsrealLabels.slice(-value, predvsrealLabels.length)]
                : [],
              datasets: [
                {
                  label: "real",
                  data: value
                    ? [
                        ...Object.values(result.validation_real_values).slice(
                          -value,
                          predvsrealLabels.length
                        )
                      ]
                    : [],
                  fill: false
                },
                {
                  label: "predictions",
                  data: value
                    ? [
                        ...Object.values(result.validations_predictions).slice(
                          -value,
                          predvsrealLabels.length
                        )
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
            getModelById
        } = this.props;
        const { source, target } = this.props.match.params;
        // guard
        //check if the user is not logged in then redirect to the dashboard page
        if (isLoggedin) {
            getUserInfo();
            getUserSettings();
            getModelById(source);
            getModelById(target, "compare");
        }
    }

    componentDidUpdate(prevProps) {
        // this will handle loading realred article based on the current article
        const {
            isLoggedin,
            getUserInfo,
            getUserSettings,
            getModelById,
            modelByID,
            comparedModel,
            locale
        } = this.props;
        const { source, target } = this.props.match.params;

        if (!isLoggedin) {
            history.push("/app/dashboard");
        }

        if (prevProps.isLoggedin !== isLoggedin && isLoggedin) {
            getUserInfo();
            getUserSettings();
            getModelById(source);
            getModelById(target, "compare");
        }

        // update first model
        if (
            (prevProps.modelByID === null ||
                prevProps.modelByID !== modelByID) &&
            modelByID !== null
        ) {
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
                            label: locale.futurePredictionsTitle,
                            data: [...data],
                            fill: false
                        }
                    ]
                };
                let predvsrealLabels = Object.keys(result.validation_real_values);

                for (let label in predvsrealLabels) {
                  predvsrealLabels[label] = moment(
                    new Date(predvsrealLabels[label])
                  ).format("ll");
                }
                this.setState({
                    futurePredicts1: { ...futurePredicts },
                    max1:
                    predvsrealLabels.length < 150
                            ? predvsrealLabels.length.length
                            : 150,
                    predictVsReal1: {
                        labels: predvsrealLabels.slice(
                            -this.state.range1,
                            predvsrealLabels.length
                          ),
                          datasets: [
                            {
                              label: "real",
                              data: [
                                ...Object.values(result.validation_real_values).slice(
                                  -this.state.range1,
                                  predvsrealLabels.length
                                )
                              ],
                              fill: false
                            },
                            {
                              label: "predictions",
                              data: [
                                ...Object.values(result.validations_predictions).slice(
                                  -this.state.range1,
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

        // update second model
        if (
            (prevProps.comparedModel === null ||
                prevProps.comparedModel !== comparedModel) &&
            comparedModel !== null
        ) {
            const result = comparedModel.result
                ? JSON.parse(comparedModel.result)
                : null;
            if (result) {
                const labels = [];
                const data = [];
                for (let i = 0; i < result.future_predictions.length; i++) {
                    labels.push(
                        moment(new Date(comparedModel.createdAt))
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
                            label: locale.futurePredictionsTitle,
                            data: [...data],
                            fill: false
                        }
                    ]
                };

                let predvsrealLabels = Object.keys(result.validation_real_values);

                for (let label in predvsrealLabels) {
                  predvsrealLabels[label] = moment(
                    new Date(predvsrealLabels[label])
                  ).format("ll");
                }
                this.setState({
                    futurePredicts2: { ...futurePredicts },
                    max2:
                    predvsrealLabels.length < 150
                    ? predvsrealLabels.length.length
                    : 150,
                    predictVsReal2: {
                        labels: predvsrealLabels.slice(
                            -this.state.range2,
                            predvsrealLabels.length
                          ),
                          datasets: [
                            {
                              label: "real",
                              data: [
                                ...Object.values(result.validation_real_values).slice(
                                  -this.state.range2,
                                  predvsrealLabels.length
                                )
                              ],
                              fill: false
                            },
                            {
                              label: "predictions",
                              data: [
                                ...Object.values(result.validations_predictions).slice(
                                  -this.state.range2,
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

    export = () => {
        const checkedItems = Array.from(
            document.getElementsByClassName("checked-export")
        );

        checkedItems.forEach(el => {
            el.classList.add("exporting");
        });

        this.setState({ exportLoading: true });
        const input = document.getElementById("export-pdf");
        html2canvas(input, {
            allowTaint: true,
            useCORS: true,
            imageTimeout: 0
        }).then(canvas => {
            const imgData = canvas.toDataURL("image/png", 1.0);
            const pdf = new jsPDF("p", "mm", "a4");
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight + 10);
            pdf.save("download.pdf");
            this.setState({ exportLoading: false });

            checkedItems.forEach(el => {
                el.classList.remove("exporting");
            });
        });
    };

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
        const {
            classes,
            modelByID,
            loading,
            loadingCompare,
            comparedModel,
            locale
        } = this.props;
        const resultModel = !loading ? JSON.parse(modelByID.result) : {};
        const resultCompare = !loadingCompare
            ? JSON.parse(comparedModel.result)
            : {};
        return (
            <FusePageSimple
                classes={{
                    root: classes.layoutRoot
                }}
                content={
                    <div className="p-24 w-full">
                        <div className="flex flex-col md:flex-row sm:p-8 container">
                            <Breadcrumbs
                                data={this.state.breadcrumbs}
                            ></Breadcrumbs>
                        </div>
                        <div className="flex flex-row justify-end pr-16">
                            <div className="button-progress-wrapper">
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    className={classes.button}
                                    onClick={this.export}
                                >
                                    <Icon>import_export</Icon>
                                    {locale.header.exportBtn}
                                </Button>
                                {this.state.exportLoading && (
                                    <CircularProgress
                                        size={24}
                                        className="button-progress"
                                    />
                                )}
                            </div>
                        </div>
                        <div
                            className="flex flex-col md:flex-row sm:p-8 container"
                            id="export-pdf"
                        >
                            <div className="flex flex-1 flex-col no-flex">
                                <div className="flex">
                                    {!loading && (
                                        <Typography variant="h5" component="h2">
                                            {modelByID.name}
                                        </Typography>
                                    )}
                                </div>
                                {resultModel && (
                                    <div className="flex flex-1 flex-col">
                                        <div className="flex flex-1 flex-col p-16 pl-0">
                                            <div className="flex flex-1 pb-16">
                                                <Chart
                                                    title={
                                                        locale.futurePredictionsTitle
                                                    }
                                                    data={
                                                        this.state
                                                            .futurePredicts1
                                                    }
                                                    loading={loading}
                                                    type={"error"}
                                                />
                                            </div>
                                            <div className="flex flex-1  pt-16">
                                                <Paper className="w-full p-16 flex-col">
                                                    <Typography>
                                                        {locale.sliderMessage}
                                                    </Typography>
                                                    <InputRange
                                                        maxValue={
                                                            this.state.max1
                                                        }
                                                        step={10}
                                                        minValue={0}
                                                        value={
                                                            this.state.range1
                                                        }
                                                        onChange={
                                                            this
                                                                .changeModelByIDDispaly
                                                        }
                                                    />
                                                </Paper>
                                            </div>
                                            <div className="flex flex-1">
                                                <Chart
                                                    title={
                                                        locale.predVSrealChartTitle
                                                    }
                                                    data={
                                                        this.state
                                                            .predictVsReal1
                                                    }
                                                    loading={loading}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex flex-1 pt-16 pr-16 pl-0">
                                            <Predictions
                                                result={resultModel}
                                                locale={locale.modelPerf}
                                                loading={loading}
                                            />
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
                                    direction={"flex-col"}
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
                                    direction={"flex-col"}
                                    locale={locale.featureToPredict}
                                />
                                <ModelControl
                                    type={modelByID.type}
                                    parameters={
                                        !loading ? modelByID.parameters : []
                                    }
                                    loading={loading}
                                    direction={"flex-col"}
                                    locale={locale.modelControl}
                                />
                            </div>
                            <div className="flex flex-1 flex-col no-flex">
                                <div className="flex">
                                    {!loadingCompare && (
                                        <Typography variant="h5" component="h2">
                                            {comparedModel.name}
                                        </Typography>
                                    )}
                                </div>

                                {resultCompare && (
                                    <div className="flex flex-1 flex-col">
                                        <div className="flex flex-1 flex-col p-16 pl-0">
                                            <div className="flex flex-1 pb-16">
                                                <Chart
                                                    title={
                                                        locale.futurePredictionsTitle
                                                    }
                                                    data={
                                                        this.state
                                                            .futurePredicts2
                                                    }
                                                    loading={loadingCompare}
                                                    type={"error"}
                                                />
                                            </div>
                                            <div className="flex flex-1 pt-16">
                                                <Paper className="w-full p-16 flex-col">
                                                    <Typography>
                                                        {locale.sliderMessage}
                                                    </Typography>
                                                    <InputRange
                                                        maxValue={
                                                            this.state.max2
                                                        }
                                                        step={10}
                                                        minValue={0}
                                                        value={
                                                            this.state.range2
                                                        }
                                                        onChange={
                                                            this
                                                                .changeComparedModelDispaly
                                                        }
                                                    />
                                                </Paper>
                                            </div>
                                            <div className="flex flex-1">
                                                <Chart
                                                    title={
                                                        locale.predVSrealChartTitle
                                                    }
                                                    data={
                                                        this.state
                                                            .predictVsReal2
                                                    }
                                                    loading={loadingCompare}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex flex-1 pt-16 pr-16 pl-0">
                                            <Predictions
                                                result={resultCompare}
                                                locale={locale.modelPerf}
                                                loading={loadingCompare}
                                            />
                                        </div>
                                    </div>
                                )}
                                <DataControl
                                    company={comparedModel.companySymbol}
                                    loading={loadingCompare}
                                    locale={locale.datasetControl}
                                />
                                <FeaturesControl
                                    features={
                                        !loadingCompare
                                            ? comparedModel.parameters.features
                                            : []
                                    }
                                    loading={loadingCompare}
                                    direction={"flex-col"}
                                    locale={locale.features}
                                />
                                <FeatureToPredict
                                    value={
                                        !loadingCompare
                                            ? comparedModel.parameters
                                                  .featureToPredict
                                            : null
                                    }
                                    loading={loadingCompare}
                                    direction={"flex-col"}
                                    locale={locale.featureToPredict}
                                />
                                <ModelControl
                                    type={comparedModel.type}
                                    parameters={
                                        !loadingCompare
                                            ? comparedModel.parameters
                                            : []
                                    }
                                    loading={loadingCompare}
                                    direction={"flex-col"}
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
        comparedModel: custom.models.comparedModel,
        loading: custom.models.loadingModelById,
        loadingCompare: custom.models.loadingComparedModel,
        locale: custom.locale.viewModelPage
    };
}

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            checkLoggedin: checkLoggedin,
            getUserInfo: getInfo,
            getUserSettings: getSettings,
            getModelById: getModelById
        },
        dispatch
    );

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles, { withTheme: true })(CompareModels));
