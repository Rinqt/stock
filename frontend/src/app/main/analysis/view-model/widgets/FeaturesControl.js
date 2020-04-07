import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  FormControl,
  Typography,
  Paper,
  Checkbox,
  FormControlLabel,
  Tooltip
} from "@material-ui/core";
import HelpIcon from "@material-ui/icons/Help";


const styles = theme => ({
  layoutRoot: {},
  fullwidth: {
    marginRight: "15px",
    width: "100%"
  }
});

export class FeaturesControl extends Component {
  render() {
    const { classes, loading, features, direction, locale } = this.props;
    const loaderRows = [];
    for (let i = 0; i < 5; i++) {
      loaderRows.push(
        <div className="flex flex-1 p-16" key={i}>
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

              <div
                className={direction ? `flex ${direction}` : "flex flex-row"}
              >
                {!loading ? (
                <>
                  <div className="flex flex-1">
                    <FormControl className={classes.fullwidth}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            disabled
                            className={
                              features.indexOf("open") !== -1
                                ? "checked-export"
                                : ""
                            }
                            checked={features.indexOf("open") !== -1}
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
                            disabled
                            className={
                              features.indexOf("close") !== -1
                                ? "checked-export"
                                : ""
                            }
                            checked={features.indexOf("close") !== -1}
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
                            disabled
                            className={
                              features.indexOf("low") !== -1
                                ? "checked-export"
                                : ""
                            }
                            checked={features.indexOf("low") !== -1}
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
                            disabled
                            className={
                              features.indexOf("high") !== -1
                                ? "checked-export"
                                : ""
                            }
                            checked={features.indexOf("high") !== -1}
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
                            disabled
                            className={
                              features.indexOf("volume") !== -1
                                ? "checked-export"
                                : ""
                            }
                            checked={features.indexOf("volume") !== -1}
                            value="volume"
                          />
                        }
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

export default withStyles(styles, { withTheme: true })(FeaturesControl);
