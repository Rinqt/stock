import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Typography, Paper } from "@material-ui/core";

const styles = theme => ({
  layoutRoot: {},
  fullwidth: {
    marginRight: "15px",
    width: "100%"
  }
});

class Predictions extends Component {
  render() {
    const { result, locale, loading } = this.props;

    const loaderRows = [];
    for (let i = 0; i < 4; i++) {
      loaderRows.push(
        <div className="flex flex-1 pb-16" key={i}>
          <div className="animated-background text-line"></div>
        </div>
      );
    }
    return (
      <Paper className="p-16 w-full">
        <div className="flex flex-1 flex-col">
          <div className="flex flex-row">
            <div className="flex flex-1 pb-16">
              <Typography variant="h6">{locale.title}</Typography>
            </div>
          </div>
          {loading && loaderRows}
          {!loading && result && result["model_performance"]
            ? Object.keys(result["model_performance"]).map(key => {
                return (
                  <div className="flex flex-row pb-16" key={key}>
                    <div className="flex">
                      <Typography variant="subtitle2" className="cap">
                        {locale[key].name}
                      </Typography>
                    </div>
                    <div className="flex flex-1 ml-16">
                      <Typography variant="body2">
                        {result["model_performance"][key].toFixed(5)}
                      </Typography>
                    </div>
                  </div>
                );
              })
            : ""}
        </div>
      </Paper>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Predictions);
