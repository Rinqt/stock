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
import HelpIcon from "@material-ui/icons/Help";

const styles = theme => ({
  layoutRoot: {},
  fullwidth: {
    marginRight: "15px",
    width: "100%"
  }
});

export class FeatureToPredict extends Component {
  render() {
    const { classes, loading, value, direction, locale } = this.props;

    const loaderRows = [];
    for (let i = 0; i < 5; i++) {
      loaderRows.push(
        <div className="flex flex-1 p-16"  key={i}>
           <div className="animated-background text-line"></div>
        </div>
      );
    }

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
                      data-html2canvas-ignore
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

              <div
                className={direction ? `flex ${direction}` : "flex flex-row"}
              >
                {!loading ? (<>
                  <div className="flex flex-1">
                    <FormControl className={classes.fullwidth}>
                      <FormControlLabel
                        control={
                          <Radio
                            disabled
                            checked={value === "open"}
                            className={value === "open" ? "checked-export" : ""}
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
                            disabled
                            checked={value === "close"}
                            className={
                              value === "close" ? "checked-export" : ""
                            }
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
                            disabled
                            checked={value === "low"}
                            className={value === "low" ? "checked-export" : ""}
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
                            disabled
                            checked={value === "high"}
                            className={value === "high" ? "checked-export" : ""}
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
                            disabled
                            checked={value === "volume"}
                            className={
                              value === "volume" ? "checked-export" : ""
                            }
                          />
                        }
                        value="volume"
                        label={locale.volume}
                      />
                    </FormControl>
                  </div>
                </>
                ) : loaderRows}
              </div>

            </div>
          </Paper>
        </div>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(FeatureToPredict);
