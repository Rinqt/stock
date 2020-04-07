import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import {
    InputLabel,
    MenuItem,
    FormControl,
    Select,
    Typography,
    Paper,
    Tooltip,
    Input,
    Grid,
    Checkbox,
    FormControlLabel
} from "@material-ui/core";
import HelpIcon from "@material-ui/icons/Help";
import { modelCreate, createHyperParams } from "../../../../store/actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Select as SearchSelect } from "react-dropdown-select";


const styles = theme => ({
    layoutRoot: {},
    fullwidth: {
        marginRight: "15px",
        width: "100%"
    }
});

class ModelControl extends Component {
    state = {
        model: [],
        forecastOut: 7,
        testSize: 0.33,
        randomState: 42,
        hyperParameter: {},
        filledParams: {},
        link: ""
    };
    handleModelChange = value => {
        const { models, createdModel, dispatch } = this.props;
        this.setState({ model: value });
        if(value.length) {
            dispatch(
                modelCreate({
                    ...createdModel,
                    type: value[0].type
                })
            );

        
            if (value[0].type === 0) {
                this.setState({
                    hyperParameter: {}
                });
            } else {
                const selectedModel = models.filter(
                    el => el.type === value[0].type
                )[0];
                const hyperParameter = [...selectedModel["parameters"]];
                const link = selectedModel.link;
                const filledHyperParam = {};
                const filledParams = {};
                hyperParameter.forEach(el => {
                    filledParams[el.name] = el.defaultValue;
                    filledHyperParam[el.name] = el.defaultValue;
                });

                dispatch(createHyperParams({ ...filledHyperParam }));

                this.setState({
                    hyperParameter: hyperParameter,
                    filledParams: filledParams,
                    link:link
                });
            }
        }
    };

    handleForecastOutChange = event => {
        this.setState({ forecastOut: event.target.value });
        const { createdModel, dispatch } = this.props;
        const parameters = { ...createdModel.parameters };
        parameters.forecastOut = event.target.value;
        createdModel.parameters = parameters;
        dispatch(
            modelCreate({
                ...createdModel
            })
        );
    };

    handleTestSizeChange = event => {
        this.setState({ testSize: event.target.value });
        const { createdModel, dispatch } = this.props;

        const parameters = { ...createdModel.parameters };
        parameters.testSize = event.target.value;
        createdModel.parameters = parameters;
        dispatch(
            modelCreate({
                ...createdModel
            })
        );
    };
    handleRandomStateChange = event => {
        this.setState({ randomState: event.target.value });
        const { createdModel, dispatch } = this.props;

        const parameters = { ...createdModel.parameters };
        parameters.randomState = event.target.value;
        createdModel.parameters = parameters;
        dispatch(
            modelCreate({
                ...createdModel
            })
        );
    };

    // general handelers for dynamic params
    handleInputFieldChange = event => {
        const { filledParams } = this.state;
        filledParams[event.target.name] = event.target.value;
        this.setState({ filledParams: { ...filledParams } });

        const { hyperParams, dispatch } = this.props;
        const filledHyperParam = { ...hyperParams };
        filledHyperParam[event.target.name] = event.target.value;
        dispatch(createHyperParams({ ...filledHyperParam }));
    };

    handleCheckBoxChange = name => event => {
        const { filledParams } = this.state;
        filledParams[name] = event.target.checked;
        this.setState({ filledParams: { ...filledParams } });

        const { hyperParams, dispatch } = this.props;
        const filledHyperParam = { ...hyperParams };
        filledHyperParam[name] = event.target.checked;
        dispatch(createHyperParams({ ...filledHyperParam }));
    };
    handleInputFieldListChange = event => {
        const { filledParams } = this.state;
        filledParams[event.target.name] = event.target.value.split(",");
        this.setState({ filledParams: { ...filledParams } });

        const { hyperParams, dispatch } = this.props;
        const filledHyperParam = { ...hyperParams };
        filledHyperParam[event.target.name] = event.target.value.split(",");
        dispatch(createHyperParams({ ...filledHyperParam }));
    };

    componentDidUpdate(prevProps) {
        // handle if the copy
        const { model, params, dispatch, models } = this.props;
        if (
            prevProps.model !== model &&
            prevProps.params !== params &&
            model &&
            params
        ) {
            // update local state
            this.setState({
                model: models.filter(el => el.type === model),
                forecastOut: params.forecastOut,
                testSize: params.testSize,
                randomState: params.randomState
            });

            const hyperParameter = [
                ...models.filter(el => el.type === model)[0]["parameters"]
            ];
            const filledHyperParam = {};
            const filledParams = {};
            hyperParameter.forEach(el => {
                filledParams[el.name] = params[el.name];
                filledHyperParam[el.name] = params[el.name];
            });

            dispatch(createHyperParams({ ...filledHyperParam }));

            this.setState({
                hyperParameter: hyperParameter,
                filledParams: filledParams
            });
        }
    }

    render() {
        const { classes, models, locale } = this.props;
        const { hyperParameter, filledParams, model, link } = this.state;
        const type = model.length ? model[0]['type'] : '';
        return (
            <React.Fragment>
                <div className="flex flex-1 flex-col min-w-0">
                    <div className="widget w-full pt-16 pr-16">
                        <Paper className="p-16">
                            <div className="flex flex-1 flex-col">
                                <div className="flex flex-col">
                                    <div className="flex flex-1 pb-16">
                                        <Typography variant="h6">
                                            {locale.title}
                                        </Typography>
                                        </div>
                                        <div className="flex pb-8">
                                        {link !== "" ? (
                                                // eslint-disable-next-line react/jsx-no-target-blank
                                                <a href={link} target="_blank">
                                                    <small>{locale.more}</small>
                                                </a>
                                            ) : ("")}
                                    </div>
                                </div>
                                <div className="flex flex-row">
                                    <div className="flex flex-1">
                                        <FormControl
                                            className={classes.fullwidth}
                                            required
                                        >
                                            <InputLabel className="custom-label">
                                                {locale.model}{" "}
                                                <Tooltip
                                                    title={
                                                        <React.Fragment>
                                                            <Typography color="inherit">
                                                                {
                                                                    locale.modelTooltip
                                                                }
                                                            </Typography>
                                                        </React.Fragment>
                                                    }
                                                >
                                                    <HelpIcon className="help-tooltip" />
                                                </Tooltip>
                                            </InputLabel>
                                            <SearchSelect
                                                className="custom-select-search"
                                                placeholder={locale.none}
                                                values={this.state.model}
                                                onChange={this.handleModelChange}
                                                options={models}
                                                labelField="name"
                                                valueField="type"
                                                searchBy="name"
                                                keepSelectedInList="true"
                                                closeOnSelect="false"
                                                noDataLabel="No matches found"
                                                />
                                        </FormControl>
                                    </div>
                                    <div className="flex flex-1">
                                        {model !== 0 ? (
                                            <FormControl
                                                className={classes.fullwidth}
                                            >
                                                <InputLabel>
                                                    {locale.forecastOut}
                                                    <Tooltip
                                                        title={
                                                            <React.Fragment>
                                                                <Typography color="inherit">
                                                                    {
                                                                        locale.forecastOutTooltip
                                                                    }
                                                                </Typography>
                                                            </React.Fragment>
                                                        }
                                                    >
                                                        <HelpIcon className="help-tooltip" />
                                                    </Tooltip>
                                                </InputLabel>

                                                <Input
                                                    className="mb-16"
                                                    type="number"
                                                    name="forecastOut"
                                                    value={
                                                        this.state.forecastOut
                                                    }
                                                    onChange={
                                                        this.handleForecastOutChange
                                                    }
                                                    inputProps={{
                                                        min: 1,
                                                        max: 30,
                                                        step: 1
                                                    }}
                                                    fullWidth
                                                />
                                            </FormControl>
                                        ) : (
                                            ""
                                        )}
                                    </div>
                                    <div className="flex flex-1">
                                        {model !== 0 ? (
                                            <FormControl
                                                className={classes.fullwidth}
                                            >
                                                <InputLabel>
                                                    {locale.testSize}
                                                    <Tooltip
                                                        title={
                                                            <React.Fragment>
                                                                <Typography color="inherit">
                                                                    {
                                                                        locale.testSizeTooltip
                                                                    }
                                                                </Typography>
                                                            </React.Fragment>
                                                        }
                                                    >
                                                        <HelpIcon className="help-tooltip" />
                                                    </Tooltip>
                                                </InputLabel>

                                                <Input
                                                    className="mb-16"
                                                    type="number"
                                                    name="testSize"
                                                    value={this.state.testSize}
                                                    onChange={
                                                        this
                                                            .handleTestSizeChange
                                                    }
                                                    inputProps={{
                                                        min: 0.1,
                                                        max: 0.9,
                                                        step: 0.01
                                                    }}
                                                    fullWidth
                                                />
                                            </FormControl>
                                        ) : (
                                            ""
                                        )}
                                    </div>
                                    <div className="flex flex-1">
                                        {[
                                            0,
                                            "Adam",
                                            "Nadam",
                                            "Adamax",
                                            "Adadelta",
                                            "RMSprop",
                                            "SGD"
                                        ].indexOf(model) === -1 ? (
                                            <FormControl
                                                className={classes.fullwidth}
                                            >
                                                <InputLabel>
                                                    {locale.randomState}
                                                    <Tooltip
                                                        title={
                                                            <React.Fragment>
                                                                <Typography color="inherit">
                                                                    {
                                                                        locale.randomStateTooltip
                                                                    }
                                                                </Typography>
                                                            </React.Fragment>
                                                        }
                                                    >
                                                        <HelpIcon className="help-tooltip" />
                                                    </Tooltip>
                                                </InputLabel>

                                                <Input
                                                    className="mb-16"
                                                    type="number"
                                                    name="randomState"
                                                    value={
                                                        this.state.randomState
                                                    }
                                                    onChange={
                                                        this
                                                            .handleRandomStateChange
                                                    }
                                                    inputProps={{
                                                        min: 1,
                                                        step: 1
                                                    }}
                                                    fullWidth
                                                />
                                            </FormControl>
                                        ) : (
                                            ""
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Paper>
                    </div>
                </div>

                {hyperParameter.length ? (
                    <div className="flex flex-1 flex-col min-w-0">
                        <div className="widget w-full pt-16 pr-16">
                            <Paper className="p-16">
                                <Grid container>
                                    {hyperParameter.map(el => {
                                        switch (el.type) {
                                            case "list": {
                                                return (
                                                    <Grid
                                                        item
                                                        sm={3}
                                                        key={el.name}
                                                    >
                                                        <div className="pl-8 pr-8">
                                                            <FormControl
                                                                className={
                                                                    classes.fullwidth
                                                                }
                                                            >
                                                                <InputLabel>
                                                                    {el.name}
                                                                    <Tooltip
                                                                        title={
                                                                            <React.Fragment>
                                                                                <Typography color="inherit">
                                                                                    {
                                                                                        locale[
                                                                                            el
                                                                                                .name
                                                                                        ][
                                                                                            type
                                                                                        ]
                                                                                    }
                                                                                </Typography>
                                                                            </React.Fragment>
                                                                        }
                                                                    >
                                                                        <HelpIcon className="help-tooltip" />
                                                                    </Tooltip>
                                                                </InputLabel>

                                                                <Input
                                                                    className="mb-16"
                                                                    type="text"
                                                                    name={
                                                                        el.name
                                                                    }
                                                                    value={filledParams[
                                                                        el.name
                                                                    ].join(",")}
                                                                    onChange={
                                                                        this
                                                                            .handleInputFieldListChange
                                                                    }
                                                                    fullWidth
                                                                />
                                                            </FormControl>
                                                        </div>
                                                    </Grid>
                                                );
                                            }
                                            case "number": {
                                                const inputProps = {};

                                                inputProps["min"] = el.min;

                                                if (el.max) {
                                                    inputProps["max"] = el.max;
                                                }
                                                if (el.step) {
                                                    inputProps["step"] =
                                                        el.step;
                                                }
                                                return (
                                                    <Grid
                                                        item
                                                        sm={3}
                                                        key={el.name}
                                                    >
                                                        <div className="pl-8 pr-8">
                                                            <FormControl
                                                                className={
                                                                    classes.fullwidth
                                                                }
                                                            >
                                                                <InputLabel>
                                                                    {el.name}
                                                                    <Tooltip
                                                                        title={
                                                                            <React.Fragment>
                                                                                <Typography color="inherit">
                                                                                    {
                                                                                        locale[
                                                                                            el
                                                                                                .name
                                                                                        ][
                                                                                            type
                                                                                        ]
                                                                                    }
                                                                                </Typography>
                                                                            </React.Fragment>
                                                                        }
                                                                    >
                                                                        <HelpIcon className="help-tooltip" />
                                                                    </Tooltip>
                                                                </InputLabel>

                                                                <Input
                                                                    className="mb-16"
                                                                    type="number"
                                                                    name={
                                                                        el.name
                                                                    }
                                                                    value={
                                                                        filledParams[
                                                                            el
                                                                                .name
                                                                        ]
                                                                    }
                                                                    onChange={
                                                                        this
                                                                            .handleInputFieldChange
                                                                    }
                                                                    inputProps={
                                                                        inputProps
                                                                    }
                                                                    fullWidth
                                                                />
                                                            </FormControl>
                                                        </div>
                                                    </Grid>
                                                );
                                            }

                                            case "boolean": {
                                                return (
                                                    <Grid
                                                        item
                                                        sm={3}
                                                        key={el.name}
                                                    >
                                                        <div className="pl-8 pr-8">
                                                            <FormControl
                                                                className={
                                                                    classes.fullwidth
                                                                }
                                                            >
                                                                <FormControlLabel
                                                                    control={
                                                                        <Checkbox
                                                                            checked={
                                                                                filledParams[
                                                                                    el
                                                                                        .name
                                                                                ]
                                                                            }
                                                                            onChange={this.handleCheckBoxChange(
                                                                                el.name
                                                                            )}
                                                                            value={
                                                                                el.name
                                                                            }
                                                                        />
                                                                    }
                                                                    label={
                                                                        <React.Fragment>
                                                                            {" "}
                                                                            {
                                                                                el.name
                                                                            }
                                                                            <Tooltip
                                                                                title={
                                                                                    <React.Fragment>
                                                                                        <Typography color="inherit">
                                                                                            {
                                                                                                locale[
                                                                                                    el
                                                                                                        .name
                                                                                                ][
                                                                                                    type
                                                                                                ]
                                                                                            }
                                                                                        </Typography>
                                                                                    </React.Fragment>
                                                                                }
                                                                            >
                                                                                <HelpIcon className="help-tooltip" />
                                                                            </Tooltip>
                                                                        </React.Fragment>
                                                                    }
                                                                />
                                                            </FormControl>
                                                        </div>
                                                    </Grid>
                                                );
                                            }

                                            case "select": {
                                                return (
                                                    <Grid
                                                        item
                                                        sm={3}
                                                        key={el.name}
                                                    >
                                                        <div className="pl-8 pr-8">
                                                            <FormControl
                                                                className={
                                                                    classes.fullwidth
                                                                }
                                                            >
                                                                <InputLabel>
                                                                    {el.name}{" "}
                                                                    <Tooltip
                                                                        title={
                                                                            <React.Fragment>
                                                                                <Typography color="inherit">
                                                                                    {
                                                                                        locale[
                                                                                            el
                                                                                                .name
                                                                                        ][
                                                                                            type
                                                                                        ]
                                                                                    }
                                                                                </Typography>
                                                                            </React.Fragment>
                                                                        }
                                                                    >
                                                                        <HelpIcon className="help-tooltip" />
                                                                    </Tooltip>
                                                                </InputLabel>
                                                                <Select
                                                                    value={
                                                                        filledParams[
                                                                            el
                                                                                .name
                                                                        ]
                                                                    }
                                                                    name={
                                                                        el.name
                                                                    }
                                                                    onChange={
                                                                        this
                                                                            .handleInputFieldChange
                                                                    }
                                                                >
                                                                    {el.options.map(
                                                                        opt => (
                                                                            <MenuItem
                                                                                value={
                                                                                    opt
                                                                                }
                                                                                key={
                                                                                    opt
                                                                                }
                                                                            >
                                                                                {
                                                                                    opt
                                                                                }
                                                                            </MenuItem>
                                                                        )
                                                                    )}
                                                                </Select>
                                                            </FormControl>
                                                        </div>
                                                    </Grid>
                                                );
                                            }
                                            default: {
                                                return "";
                                            }
                                        }
                                    })}
                                </Grid>
                            </Paper>
                        </div>
                    </div>
                ) : (
                    ""
                )}
            </React.Fragment>
        );
    }
}

function mapStateToProps({ custom }) {
    return {
        models: custom.models.availableModels,
        createdModel: custom.models.createdModel,
        hyperParams: custom.models.hyperParams
    };
}

const mapDispatchToProps = dispatch => {
    return {
        dispatch,
        ...bindActionCreators({}, dispatch)
    };
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles, { withTheme: true })(ModelControl));
