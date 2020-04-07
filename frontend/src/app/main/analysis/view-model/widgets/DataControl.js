import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Typography,
  Paper,
  Tooltip
} from "@material-ui/core";
import { connect } from "react-redux";
import HelpIcon from "@material-ui/icons/Help";

const styles = theme => ({
  layoutRoot: {},
  fullwidth: {
    marginRight: "15px",
    width: "100%"
  }
});

export class DataControl extends Component {
  render() {
    const { classes, companies, company, loading, locale } = this.props;
    return (
      <div className="flex flex-1 flex-col min-w-0">
        <div className="widget w-full pt-16 pr-16">
          <Paper className="p-16">
            <div className="flex flex-1 flex-col">
              <div className="flex flex-col">
                <div className="flex flex-1 pb-16">
                  <Typography variant="h6">{locale.title}</Typography>
                </div>
              </div>
              <div className="flex flex-row">
                {!loading ? (
                  <div className="flex flex-1">
                    <FormControl className={classes.fullwidth}>
                      <InputLabel>
                        {locale.company}
                        <Tooltip
                          data-html2canvas-ignore
                          title={
                            <React.Fragment>
                              <Typography color="inherit">
                                {locale.companyTooltip}
                              </Typography>
                            </React.Fragment>
                          }
                        >
                          <HelpIcon className="help-tooltip" />
                        </Tooltip>
                      </InputLabel>
                      <Select value={company} disabled>
                        <MenuItem value={0}>
                          <em>{locale.none}</em>
                        </MenuItem>
                        {companies.map(el => (
                          <MenuItem value={el.symbol} key={el.symbol}>
                            {el.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                ) : (
                  <div className="animated-background text-line half-line"></div>
                )}

                <div className="flex flex-1"></div>
                <div className="flex flex-1"></div>
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
    companies: custom.companies.list
  };
}

export default connect(mapStateToProps)(
  withStyles(styles, { withTheme: true })(DataControl)
);
