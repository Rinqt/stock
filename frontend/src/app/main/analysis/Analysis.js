import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { FusePageSimple } from "@fuse";
import { Typography } from "@material-ui/core";
import Filter from "./widgets/Filter.js";
import ReportsTable from "./widgets/Table.js";
import AddIcon from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab";
import { Link } from "react-router-dom";
import history from "history.js";
import { checkLoggedin } from "../../api/login.api";
import { getInfo, getSettings } from "../../api/user.api";
import { getModels } from "../../api/models.api";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import moment from "moment";
import * as Sentry from '@sentry/browser';

const styles = theme => ({
  layoutRoot: {},
  fab: {
    position: "fixed",
    bottom: "10rem",
    right: "5rem"
  }
});

class Analysis extends Component {
  state = {
    interval: null,
    table: {
      columns: [
        {
          id: "name",
          title: "Name"
        },

        {
          id: "model",
          title: "Model"
        },
        {
          id: "company",
          title: "Company"
        },
        {
          id: "date",
          title: "Date"
        },
        {
          id: "status",
          title: "Status"
        },
        {
          id: "actions",
          title: "Actions"
        }
      ],
      rows: []
    }
  };

  componentDidUpdate(prevProps) {
    const {
      isLoggedin,
      userModels,
      getUserInfo,
      getUserSettings,
      getModels
    } = this.props;
    // guard
    //check if the user is not logged in then redirect to the dashboard page
    if (!isLoggedin) {
      history.push("/app/dashboard");
    }
    if (prevProps.isLoggedin !== isLoggedin && isLoggedin) {
      getUserInfo();
      getUserSettings();
      getModels();

     const interval =  setInterval(() => {
        getModels(false);
      }, 30000);

      this.setState({interval:interval})
    }

    if (
      (!prevProps.userModels.length && userModels.length) ||
      userModels !== prevProps.userModels
    ) {
      const rows = userModels.map(el => {
        return {
          id: el.id,
          cells: [
            {
              id: "name",
              value: el.name
            },

            {
              id: "model",
              value: el.type
            },
            {
              id: "company",
              value: el.companySymbol
            },

            {
              id: "date",
              value: moment(el.createdAt).format("ll")
            },
            {
              id: "status",
              value: el.state,
              classes:
                el.state === "Created"
                  ? "bg-green text-white text-12 p-4 rounded"
                  : el.state === "Pending"
                  ? "bg-orange text-white text-12 p-4 rounded"
                  : "bg-red text-white text-12 p-4 rounded",
              icon: ""
            },
            {
              id: "actions",
              value: ""
            }
          ]
        };
      });
      this.setState({
        table: {
          ...this.state.table,
          rows: [...rows]
        }
      });
    }
  }
  componentDidMount() {
    const { isLoggedin, getUserInfo, getUserSettings, getModels } = this.props;
    if (isLoggedin) {
      getUserInfo();
      getUserSettings();
      getModels();

      const interval = setInterval(() => {
        getModels(false);
      }, 30000);
      this.setState({interval:interval})

    }
  }
  componentWillUnmount(){
    clearInterval(this.state.interval);
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
    const { classes, locale, breadcrumbsLocale, loading } = this.props;
    return (
      <FusePageSimple
        classes={{
          root: classes.layoutRoot
        }}
        content={
          <div className="p-24 w-full">
            <div className="flex flex-col md:flex-row sm:p-8 container">
              <Typography className="px-16 pb-8 text-18 font-300">
                {breadcrumbsLocale.Analysis}
              </Typography>
            </div>
            <div className="flex flex-col md:flex-row sm:p-8 container">
              <div className="flex flex-1 flex-col min-w-0">
                <div className="widget w-full p-16">
                  <Filter locale={locale.filter} />
                </div>
                <div className="widget w-full p-16">
                  <ReportsTable locale={locale.table} data={this.state.table} loading={loading} />
                </div>
              </div>
              <div className={classes.fab}>
                <Fab
                  component={Link}
                  color="secondary"
                  to="/app/analysis/add"
                  aria-label="add"
                >
                  <AddIcon />
                </Fab>
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
    userModels: custom.models.userModels,
    loading:custom.models.loadingUserModels,
    locale: custom.locale.analysisPage,
    breadcrumbsLocale: custom.locale.breadcrumbs
  };
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      checkLoggedin: checkLoggedin,
      getModels: getModels,
      getUserInfo: getInfo,
      getUserSettings: getSettings
    },
    dispatch
  );
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles, { withTheme: true })(Analysis));
