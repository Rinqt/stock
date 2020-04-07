import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { modelCreate } from "../../../../store/actions";
import {
  FormControl,
  Typography,
  Paper,
  Checkbox,
  FormControlLabel,
  Tooltip
} from "@material-ui/core";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import HelpIcon from "@material-ui/icons/Help";

const styles = theme => ({
  layoutRoot: {},
  fullwidth: {
    marginRight: "15px",
    width: "100%"
  }
});

class FeaturesControl extends Component {
  state = {
    open: true,
    close: false,
    low: true,
    high: true,
    volume: true
  };

  componentDidUpdate(prevProps) {
    // handle if the copy
    const { features } = this.props;
    if (prevProps.features !== features && features) {
      const localState = {
        ...this.state
      }
      for (let key in localState) {
        localState[key] = features.indexOf(key) !== -1;
      }

      this.setState({
        ...localState
      })
    }
  }

  handleChange = name => event => {
    const state = { ...this.state };
    state[name] = event.target.checked;
    this.setState({ ...state });
    const temp = [];
    for (let key in state) {
      if (state[key]) {
        temp.push(key);
      }
    }
    const { createdModel, dispatch } = this.props;

    const parameters = { ...createdModel.parameters };
    parameters.features = [...temp];
    createdModel.parameters = parameters;
    dispatch(
      modelCreate({
        ...createdModel
      })
    );
  };
  render() {
    const { classes, locale } = this.props;
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
                            {locale.featuresTooltip}
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
                        <Checkbox
                          checked={this.state.open}
                          onChange={this.handleChange("open")}
                          value="open"
                        />
                      }
                      label={locale.open}
                    />
                  </FormControl>
                </div>
                <div className="flex flex-1">
                  <FormControl className={classes.fullwidth}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={this.state.close}
                          onChange={this.handleChange("close")}
                          value="close"
                        />
                      }
                      label={locale.close}
                    />
                  </FormControl>
                </div>
                <div className="flex flex-1">
                  <FormControl className={classes.fullwidth}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={this.state.low}
                          onChange={this.handleChange("low")}
                          value="low"
                        />
                      }
                      label={locale.low}
                    />
                  </FormControl>
                </div>
                <div className="flex flex-1">
                  <FormControl className={classes.fullwidth}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={this.state.high}
                          onChange={this.handleChange("high")}
                          value="high"
                        />
                      }
                      label={locale.high}
                    />
                  </FormControl>
                </div>
                <div className="flex flex-1">
                  <FormControl className={classes.fullwidth}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={this.state.volume}
                          onChange={this.handleChange("volume")}
                          value="volume"
                        />
                      }
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
)(withStyles(styles, { withTheme: true })(FeaturesControl));
