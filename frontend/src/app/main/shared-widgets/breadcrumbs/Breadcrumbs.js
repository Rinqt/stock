import React, { Component } from "react";
import { Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";

const styles = theme => ({
  layoutRoot: {},
  CustomBreadcrumb: {
    width: "100%"
  },
  BreadcrumbLink: {
    color: "rgba(0, 0, 0, 0.54) !important",
    display: "inline-block",
    fontWeight: 400,
    fontSize: "1.8rem"
  },
  BreadcrumbSperator: {
    display: "inline-block",
    marginLeft: "8px",
    userSelect: "none",
    marginRight: "8px",
    color: "rgba(0, 0, 0, 0.54)",
    fontWeight: 400,
    fontSize: "1.8rem"
  },
  BreadcrumbCurrent: {
    display: "inline-block",
    color: "rgba(0, 0, 0, 0.87)",
    fontWeight: 400,
    fontSize: "1.8rem"
  }
});
export class Breadcrumbs extends Component {
  render() {
    const { data, locale, classes } = this.props;
    return (
      <div id="custom-breadcrumbs" className={classes.CustomBreadcrumb}>
        {data.map((breadcrumb, index) => {
          if (breadcrumb.link !== "") {
            return (
              <React.Fragment key={index}>
                <Link className={classes.BreadcrumbLink} to={breadcrumb.link}>
                  {locale[breadcrumb.title]}
                </Link>
                <Typography
                  component="span"
                  className={classes.BreadcrumbSperator}
                >
                  /
                </Typography>
              </React.Fragment>
            );
          }
          return (
            <React.Fragment key={index}>
              <Typography
                component="span"
                className={classes.BreadcrumbCurrent}
              >
                {locale[breadcrumb.title]
                  ? locale[breadcrumb.title]
                  : breadcrumb.title}
              </Typography>
            </React.Fragment>
          );
        })}
      </div>
    );
  }
}

function mapStateToProps({ custom }) {
  return {
    locale: custom.locale.breadcrumbs
  };
}

export default connect(mapStateToProps)(
  withStyles(styles, { withTheme: true })(Breadcrumbs)
);
