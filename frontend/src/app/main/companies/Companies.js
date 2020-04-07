import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { FusePageSimple } from "@fuse";
import { Typography } from "@material-ui/core";
import CompaniesList from "./widgets/CompaniesList.js";
import history from "history.js";
import { checkLoggedin } from "../../api/login.api";
import { getInfo, getSettings } from "../../api/user.api";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as Sentry from '@sentry/browser';

const styles = theme => ({
  layoutRoot: {}
});

class Companies extends Component {
  state = {
    favoriteCompanies: [],
    companies: []
  };
  setFilter = $event => {
    this.setState({ filter: $event.target.value });
  };

  componentDidMount() {
    const {
      isLoggedin,
      userSettings,
      companies,
      getUserInfo,
      getUserSettings
    } = this.props;
    let companiesList = companies ? [...companies] : [];

    if (isLoggedin) {
      getUserInfo();
      getUserSettings();

      // Keys are in different order, check each symbol
      for (let fav = 0; fav < userSettings.favoriteCompanies.length; fav++) {
        companiesList = companiesList.filter(
          el => el.symbol !== userSettings.favoriteCompanies[fav].symbol
        );
      }

      this.setState({
        favoriteCompanies: userSettings.favoriteCompanies
          ? [...userSettings.favoriteCompanies]
          : [],
        companies: [...companiesList]
      });
    }
  }
  componentDidUpdate(prevProps) {
    const {
      isLoggedin,
      userSettings,
      companies,
      getUserInfo,
      getUserSettings
    } = this.props;
    let companiesList = companies ? [...companies] : [];
    // guard
    //check if the user is not logged in then redirect to the dashboard page
    if (!isLoggedin) {
      history.push("/app/dashboard");
    }

    if (prevProps.isLoggedin !== isLoggedin && isLoggedin) {
      getUserInfo();
      getUserSettings();
    }

    if (
      (prevProps.userSettings !== userSettings ||
        prevProps.companies !== companies) &&
      userSettings.favoriteCompanies && companies
    ) {
      // Keys are in different order, check each symbol
      for (let fav = 0; fav < userSettings.favoriteCompanies.length; fav++) {
        companiesList = companiesList.filter(
          el => el.symbol !== userSettings.favoriteCompanies[fav].symbol
        );
      }

      this.setState({
        favoriteCompanies: userSettings.favoriteCompanies,
        companies: companiesList
      });
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
                {locale.companies}
              </Typography>
            </div>
            <div className="flex flex-col md:flex-row sm:p-8 container">
              <div className="flex flex-1 flex-col min-w-0">
                <div className="widget w-full p-16">
                  <CompaniesList
                    companies={this.state.favoriteCompanies}
                    title={locale.favoriteCompanies}
                    search={locale.search}
                    buttonColor="primary"
                    buttonText={locale.deleteBtn}
                    emptyText={locale.empty}
                    buttonAction="delete"
                  />
                </div>
                <div className="widget w-full p-16">
                  <CompaniesList
                    companies={this.state.companies}
                    title={locale.addCompanies}
                    search={locale.search}
                    buttonColor="secondary"
                    buttonText={locale.addBtn}
                    emptyText={locale.empty}
                    buttonAction="add"
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
    companies: custom.companies.list,
    userSettings: custom.user.settings,
    locale: custom.locale.companiesPage
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
)(withStyles(styles, { withTheme: true })(Companies));
