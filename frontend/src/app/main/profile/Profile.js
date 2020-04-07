import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { FusePageSimple } from "@fuse";
import { Typography } from "@material-ui/core";
import AccountInfo from "./widgets/AccountInfo.js";
import ContactInfo from "./widgets/ContactInfo.js";
import { getInfo, getSettings } from "../../api/user.api";
import history from "history.js";
import { checkLoggedin } from "../../api/login.api";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as Sentry from '@sentry/browser';

const styles = theme => ({
  layoutRoot: {}
});

class Profile extends Component {
  componentDidUpdate(prevProps) {
    const { isLoggedin, getUserInfo, getUserSettings } = this.props;
    // guard
    //check if the user is not logged in then redirect to the dashboard page
    if (!isLoggedin) {
      history.push("/app/dashboard");
    }

    if (prevProps.isLoggedin !== isLoggedin && isLoggedin) {
      getUserInfo();
      getUserSettings();
    }
  }
  componentWillMount() {
    const { checkLoggedin } = this.props;

    // confirm if the user is logged in before entering the page
    checkLoggedin();
  }

  // error log
  componentDidCatch(error, errorInfo) {
    Sentry.withScope((scope) => {
      scope.setExtras(errorInfo);
      Sentry.captureException(error);

    });
  }

  render() {
    const { classes, locale } = this.props;
    return (
      <FusePageSimple
        classes={{
          root: classes.layoutRoot
        }}
        content={
          <div className="p-24 w-full">
            <div className="flex flex-col md:flex-row sm:p-8 container">
              <Typography className="px-16 pb-8 text-18 font-300">
                {locale.profile}
              </Typography>
            </div>
            <div className="flex flex-col md:flex-row sm:p-8 container">
              <div className="flex flex-1 flex-row min-w-0">
                <div className="widget w-full p-16">
                  <ContactInfo locale={locale.contactInfo} />
                </div>
                <div className="widget w-full p-16">
                  <AccountInfo locale={locale.accountInfo} />
                </div>
              </div>
            </div>
          </div>
        }
      />
    );
  }
}
function mapStateToProps({ custom }) {
  return {
    isLoggedin: custom.login.isLoggedin,
    locale: custom.locale.profilePage
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
)(withStyles(styles, { withTheme: true })(Profile));
