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
import { connect } from "react-redux";

const styles = theme => ({
    layoutRoot: {},
    fullwidth: {
        marginRight: "15px",
        width: "100%"
    }
});

class ModelControl extends Component {


    render() {
        const { classes, models, type, loading, parameters, direction, locale } = this.props;
        const model = models.filter(el => el.type === type);
        const hyperParameter = model.length ? model[0]['parameters'] : [];

        const loaderRows = [];
        for (let i = 0; i < 4; i++) {
            loaderRows.push(
                <div className="flex flex-1 p-16"  key={i}>
                    <div className="animated-background text-line"></div>
                </div>
            );
        }

        const paramsLoaders = [];
        for (let i = 0; i < 12; i++) {
            paramsLoaders.push(
                <Grid item sm={direction ? 12 : 3} className="pr-16 pl-16"  key={i}>
                    <div className="animated-background text-line"></div>
                </Grid>
            );
        }


        return (
            <React.Fragment>
                <div className="flex flex-1 flex-col min-w-0">
                    <div className="widget w-full pt-16 pr-16">
                        <Paper className="p-16">
                            <div className="flex flex-1 flex-col">
                                <div className="flex flex-row">
                                    <div className="flex flex-1 pb-16">
                                        <Typography variant="h6">
                                            {locale.title}
                                        </Typography>
                                    </div>
                                </div>
                                <div className={direction ? `flex ${direction}` : "flex flex-row"}>
                                    {!loading ? <>
                                        <div className="flex flex-1">
                                            <FormControl className={classes.fullwidth}>
                                                <InputLabel>{locale.model} <Tooltip data-html2canvas-ignore
                                                    title={
                                                        <React.Fragment>
                                                            <Typography color="inherit">
                                                                {locale.modelTooltip}
                                                            </Typography>
                                                        </React.Fragment>
                                                    }
                                                >
                                                    <HelpIcon className="help-tooltip" />
                                                </Tooltip></InputLabel>
                                                <Select
                                                    value={type}
                                                    disabled
                                                >
                                                    <MenuItem value={0}>
                                                        <em>{locale.none}</em>
                                                    </MenuItem>
                                                    {models.map(el =>
                                                        <MenuItem value={el.type} key={el.type}>{el.name}</MenuItem>
                                                    )}
                                                </Select>
                                            </FormControl>
                                        </div>
                                        <div className="flex flex-1">
                                            <FormControl className={classes.fullwidth}>
                                                <InputLabel>{locale.forecastOut}<Tooltip data-html2canvas-ignore
                                                    title={
                                                        <React.Fragment>
                                                            <Typography color="inherit">
                                                                {locale.forecastOutTooltip}
                                                            </Typography>
                                                        </React.Fragment>
                                                    }
                                                >
                                                    <HelpIcon className="help-tooltip" />
                                                </Tooltip></InputLabel>

                                                <Input
                                                    className="mb-16"
                                                    type="number"
                                                    name="forecastOut"
                                                    value={parameters.forecastOut}
                                                    disabled
                                                    fullWidth
                                                />
                                            </FormControl>
                                        </div>
                                        <div className="flex flex-1">

                                            <FormControl className={classes.fullwidth}>
                                                <InputLabel>{locale.testSize}<Tooltip data-html2canvas-ignore
                                                    title={
                                                        <React.Fragment>
                                                            <Typography color="inherit">
                                                                {locale.testSizeTooltip}
                                                            </Typography>
                                                        </React.Fragment>
                                                    }
                                                >
                                                    <HelpIcon className="help-tooltip" />
                                                </Tooltip></InputLabel>

                                                <Input
                                                    className="mb-16"
                                                    type="number"
                                                    disabled
                                                    name="testSize"
                                                    value={parameters.testSize}
                                                    fullWidth
                                                />
                                            </FormControl>
                                        </div>
                                        <div className="flex flex-1">
                                        {[0, 'Adam', 'Nadam', 'Adamax', 'Adadelta', 'RMSprop', 'SGD'].indexOf(type) === -1 ?
                                            <FormControl className={classes.fullwidth}>
                                                <InputLabel>{locale.randomState}<Tooltip data-html2canvas-ignore
                                                    title={
                                                        <React.Fragment>
                                                            <Typography color="inherit">
                                                                {locale.randomStateTooltip}
                                                            </Typography>
                                                        </React.Fragment>
                                                    }
                                                >
                                                    <HelpIcon className="help-tooltip" />
                                                </Tooltip></InputLabel>

                                                <Input
                                                    className="mb-16"
                                                    type="number"
                                                    disabled
                                                    name="randomState"
                                                    value={parameters.randomState}
                                                    fullWidth
                                                />
                                           </FormControl> : ''}
                                        </div>
                                    </>
                                        : loaderRows}
                                </div>
                            </div>
                        </Paper>
                    </div>
                </div >
                {loading && (
                    <div className="flex flex-1 flex-col min-w-0">
                        <div className="widget w-full pt-16 pr-16">
                            <Paper className="p-16">
                                <Grid container>{paramsLoaders}</Grid>
                            </Paper>
                        </div>
                    </div>
                )}

                {!loading && hyperParameter.length ? (<div className="flex flex-1 flex-col min-w-0">
                    <div className="widget w-full pt-16 pr-16">
                        <Paper className="p-16">
                            <Grid container>
                                {hyperParameter.map(el => {
                                    switch (el.type) {
                                        case 'list': {
                                            return (<Grid item sm={3} key={el.name}>
                                                <div className="pl-8 pr-8">
                                                    <FormControl className={classes.fullwidth}>
                                                        <InputLabel>{el.name}<Tooltip
                                                            title={
                                                                <React.Fragment>
                                                                    <Typography color="inherit">
                                                                        {locale[el.name][type]}
                                                                    </Typography>
                                                                </React.Fragment>
                                                            }
                                                        >
                                                            <HelpIcon className="help-tooltip" />
                                                        </Tooltip></InputLabel>

                                                        <Input
                                                            className="mb-16"
                                                            type="text"
                                                            name={el.name}
                                                            value={parameters[el.name].join(",")}
                                                            fullWidth
                                                        />
                                                    </FormControl>
                                                </div>
                                            </Grid>);
                                        }
                                        case 'number': {
                                            const inputProps = {};

                                            inputProps['min'] = el.min;

                                            if (el.max) {
                                                inputProps['max'] = el.max;
                                            }
                                            if (el.step) {
                                                inputProps['step'] = el.step;
                                            }
                                            return (

                                                <Grid item sm={direction ? 12 : 3} key={el.name}>
                                                    <div className="pl-8 pr-8">
                                                        <FormControl className={classes.fullwidth}>
                                                            <InputLabel>{el.name}<Tooltip data-html2canvas-ignore
                                                                title={
                                                                    <React.Fragment>
                                                                        <Typography color="inherit">
                                                                            {locale[el.name][type]}
                                                                        </Typography>
                                                                    </React.Fragment>
                                                                }
                                                            >
                                                                <HelpIcon className="help-tooltip" />
                                                            </Tooltip></InputLabel>

                                                            <Input
                                                                className="mb-16"
                                                                type="number"
                                                                name={el.name}
                                                                value={parameters[el.name]}
                                                                disabled
                                                                inputProps={inputProps}
                                                                fullWidth
                                                            />
                                                        </FormControl>
                                                    </div>
                                                </Grid>
                                            )
                                        }

                                        case 'boolean': {
                                            return (
                                                <Grid item sm={direction ? 12 : 3} key={el.name}>
                                                    <div className="pl-8 pr-8">
                                                        <FormControl className={classes.fullwidth}>

                                                            <FormControlLabel
                                                                control={
                                                                    <Checkbox
                                                                        checked={
                                                                            parameters[el.name]
                                                                        }
                                                                        className={parameters[el.name] ? "checked-export" : ""}
                                                                        disabled
                                                                        value={el.name}
                                                                    />
                                                                }
                                                                label={<React.Fragment> {el.name}
                                                                    <Tooltip data-html2canvas-ignore
                                                                        title={
                                                                            <React.Fragment>
                                                                                <Typography color="inherit">
                                                                                    {locale[el.name][type]}
                                                                                </Typography>
                                                                            </React.Fragment>
                                                                        }
                                                                    >
                                                                        <HelpIcon className="help-tooltip" />
                                                                    </Tooltip>
                                                                </React.Fragment>}
                                                            />
                                                        </FormControl>
                                                    </div>
                                                </Grid>
                                            )
                                        }


                                        case 'select': {
                                            return (
                                                <Grid item sm={direction ? 12 : 3} key={el.name}>
                                                    <div className="pl-8 pr-8">
                                                        <FormControl className={classes.fullwidth}>
                                                            <InputLabel>{el.name} <Tooltip data-html2canvas-ignore
                                                                title={
                                                                    <React.Fragment>
                                                                        <Typography color="inherit">
                                                                            {locale[el.name][type]}
                                                                        </Typography>
                                                                    </React.Fragment>
                                                                }
                                                            >
                                                                <HelpIcon className="help-tooltip" />
                                                            </Tooltip></InputLabel>
                                                            <Select
                                                                value={parameters[el.name]}
                                                                name={el.name}
                                                                disabled
                                                            >
                                                                {el.options.map(opt =>
                                                                    <MenuItem value={opt} key={opt}>{opt}</MenuItem>
                                                                )}
                                                            </Select>
                                                        </FormControl>
                                                    </div>
                                                </Grid>
                                            )
                                        }
                                        default: {
                                            return "";
                                        }

                                    }
                                })}


                            </Grid>
                        </Paper>
                    </div>
                </div>) : ''
                }
            </React.Fragment>
        );
    }
}


function mapStateToProps({ custom }) {
    return {
        models: custom.models.availableModels,
    };
}
export default connect(
    mapStateToProps)(withStyles(styles, { withTheme: true })(ModelControl));
