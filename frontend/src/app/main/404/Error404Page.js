import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";

import { Typography } from "@material-ui/core";

import { checkLoggedin } from "../../api/login.api";
import { getInfo, getSettings } from "../../api/user.api";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { FuseAnimate } from '@fuse';
import * as Sentry from '@sentry/browser';
import { Link } from 'react-router-dom';


const styles = theme => ({
  layoutRoot: {}
});

class Error404Page extends Component {

  componentDidMount() {
    const {
      isLoggedin,
      getUserInfo,
      getUserSettings
    } = this.props;
    if (isLoggedin) {
      getUserInfo();
      getUserSettings();
    }
  }
  componentWillMount() {
    const { checkLoggedin } = this.props;
    checkLoggedin();
  }

  componentDidUpdate(prevProps) {
    // here we parse the table
    const { isLoggedin, getUserInfo, getUserSettings } = this.props;
    if (prevProps.isLoggedin !== isLoggedin && isLoggedin) {
      getUserInfo();
      getUserSettings();
    }

  }

  // error log
  componentDidCatch(error, errorInfo) {
    Sentry.withScope((scope) => {
      scope.setExtras(errorInfo);
      Sentry.captureException(error);

    });
  }

  render() {
    const { locale } = this.props
    return (
      <div className="flex flex-col flex-1 items-center justify-center p-16">

        <div className="max-w-512 text-center">

          <FuseAnimate animation="transition.expandIn" delay={100}>
            <Typography variant="h1" color="inherit" className="font-medium mb-16">
              404
              </Typography>
          </FuseAnimate>

          <FuseAnimate delay={500}>
            <Typography variant="h5" color="textSecondary" className="mb-16">
              {locale.message}
            </Typography>
          </FuseAnimate>

          <Link className="font-medium" to="/apps/dashboard">{locale.goBack}</Link>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ custom }) {
  return {

    locale: custom.locale.notFound,
    isLoggedin: custom.login.isLoggedin
  };
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      checkLoggedin: checkLoggedin,
      getUserInfo: getInfo,
      getUserSettings: getSettings
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles, { withTheme: true })(Error404Page));
