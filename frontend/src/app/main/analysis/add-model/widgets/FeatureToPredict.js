import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  FormControl,
  Typography,
  Paper,
  FormControlLabel,
  Tooltip,
  Radio
} from "@material-ui/core";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { modelCreate } from "../../../../store/actions";
import HelpIcon from "@material-ui/icons/Help";

const styles = theme => ({
  layoutRoot: {},
  fullwidth: {
    marginRight: "15px",
    width: "100%"
  }
});

class FeatureToPredict extends Component {
  state = {
    value: "close"
  };

  handleChange = value => {
    this.setState({ ...this.state, value: value });
    const { createdModel, dispatch } = this.props;

    const parameters = { ...createdModel.parameters };
    parameters.featureToPredict = value;
    createdModel.parameters = parameters;
    dispatch(
      modelCreate({
        ...createdModel
      })
    );
  };

  componentDidUpdate(prevProps) {
    // handle if the copy
    const { value } = this.props;
    if (prevProps.value !== value && value) {
      // update local state
      this.setState({
        value: value
      });
    }
  }

  render() {
    const { classes, locale } = this.props;
    const { value } = this.state;
    return (
      <div className="flex flex-1 flex-col min-w-0">
        <div className="widget w-full pt-16 pr-16">
          <Paper className="p-16">
            <div className="flex flex-1 flex-col">
              <div className="flex flex-row">
                <div className="flex flex-1 pb-16">
                  <Typography variant="h6">
                    {locale.title}
                    <Tooltip
                      title={
                        <React.Fragment>
                          <Typography color="inherit">
                            {locale.featureToPredictTooltip}
                          </Typography>
                        </React.Fragment>
                      }
                    >
                      <HelpIcon className="help-tooltip" />
                    </Tooltip>
                  </Typography>
                </div>
              </div>

              <div className="flex flex-row">
                <div className="flex flex-1">
                  <FormControl className={classes.fullwidth}>
                    <FormControlLabel
                      control={
                        <Radio
                          checked={value === "open"}
                          onChange={() => this.handleChange("open")}
                        />
                      }
                      value="open"
                      label={locale.open}
                    />
                  </FormControl>
                </div>
                <div className="flex flex-1">
                  <FormControl className={classes.fullwidth}>
                    <FormControlLabel
                      control={
                        <Radio
                          checked={value === "close"}
                          onChange={() => this.handleChange("close")}
                        />
                      }
                      value="close"
                      label={locale.close}
                    />
                  </FormControl>
                </div>
                <div className="flex flex-1">
                  <FormControl className={classes.fullwidth}>
                    <FormControlLabel
                      control={
                        <Radio
                          checked={value === "low"}
                          onChange={() => this.handleChange("low")}
                        />
                      }
                      value="low"
                      label={locale.low}
                    />
                  </FormControl>
                </div>
                <div className="flex flex-1">
                  <FormControl className={classes.fullwidth}>
                    <FormControlLabel
                      control={
                        <Radio
                          checked={value === "high"}
                          onChange={() => this.handleChange("high")}
                        />
                      }
                      value="high"
                      label={locale.high}
                    />
                  </FormControl>
                </div>
                <div className="flex flex-1">
                  <FormControl className={classes.fullwidth}>
                    <FormControlLabel
                      control={
                        <Radio
                          checked={value === "volume"}
                          onChange={() => this.handleChange("volume")}
                        />
                      }
                      value="volume"
                      label={locale.volume}
                    />
                  </FormControl>
                </div>
              </div>
            </div>
          </Paper>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ custom }) {
  return {
    createdModel: custom.models.createdModel
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
)(withStyles(styles, { withTheme: true })(FeatureToPredict));
