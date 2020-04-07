import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { FusePageSimple } from "@fuse";
import { Typography } from "@material-ui/core";
import SearchHistory from "./widgets/SearchHistory.js";
import { getInfo, getSettings } from "../../api/user.api";
import history from "history.js";
import { checkLoggedin } from "../../api/login.api";
import { getHistory } from "../../api/history.api";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as Sentry from '@sentry/browser';

const styles = theme => ({
  layoutRoot: {}
});

class History extends Component {
  componentDidUpdate(prevProps) {
    const { isLoggedin, getUserInfo, getUserSettings, getHistory } = this.props;
    // guard
    //check if the user is not logged in then redirect to the dashboard page
    if (!isLoggedin) {
      history.push("/app/dashboard");
    }
    if (prevProps.isLoggedin !== isLoggedin && isLoggedin) {
      getUserInfo();
      getUserSettings();
      getHistory();
    }
  }
  componentDidMount() {
    const { isLoggedin, getUserInfo, getUserSettings, getHistory } = this.props;
    if (isLoggedin) {
      getUserInfo();
      getUserSettings();
      getHistory();
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
    const { classes, historyList, historyLoading, locale } = this.props;
    return (
      <FusePageSimple
        classes={{
          root: classes.layoutRoot
        }}
        content={
          <div className="p-24 ">
            <div className="flex flex-col md:flex-row sm:p-8 container">
              <Typography className="px-16 pb-8 text-18 font-300">
                {locale.title}
              </Typography>
            </div>
            <div className="flex flex-col md:flex-row sm:p-8 container">
              <div className="flex flex-1 flex-row justify-center">
                <div className="felx w-1/2">
                  <SearchHistory
                    data={historyList}
                    loading={historyLoading}
                    locale={locale.list}
                  />
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
    historyList: custom.history.list,
    historyLoading: custom.history.loading,
    locale: custom.locale.history
  };
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      checkLoggedin: checkLoggedin,
      getHistory: getHistory,
      getUserInfo: getInfo,
      getUserSettings: getSettings
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles, { withTheme: true })(History));
