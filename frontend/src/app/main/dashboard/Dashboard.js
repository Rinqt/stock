import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { FusePageSimple } from "@fuse";
import { Typography, IconButton, Tooltip } from "@material-ui/core";
import { ArrowBack, ArrowForward } from "@material-ui/icons";
import Chart from "../shared-widgets/charts/Chart.js";
import CompaniesTable from "./widgets/Table.js";
import Articles from "../shared-widgets/articles/Articles.js";
import { getArticles } from "../../api/articles.api.js";
import { checkLoggedin } from "../../api/login.api";
import { getInfo, getSettings } from "../../api/user.api";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getLatestStocksList, getStocksList } from "../../api/stocks.api";
import * as Sentry from "@sentry/browser";

import moment from "moment";

const styles = theme => ({
  layoutRoot: {}
});

class Dashboard extends Component {
  state = {
    chart: {},
    table: {
      columns: [
        {
          id: "companySymbol",
          title: "Company"
        },
        {
          id: "open",
          title: "Open"
        },
        {
          id: "close",
          title: "Close"
        },
        {
          id: "high",
          title: "High"
        },
        {
          id: "low",
          title: "Low"
        }
      ],
      rows: []
    },
    dates: {
      from: moment()
        .subtract(8, "d")
        .format("YYYY-MM-DD"),
      to: moment().add(1,"d").format("YYYY-MM-DD")
    },
    companySymbol: ""
  };

  /**
   * Get the past of the next week prices
   * @param type 0 for past | 1 for future | -1 for current week
   */
  weekNavigate = (type = -1, companySymbol = "") => {
    const { getArticles, getStocksList } = this.props;
    const { dates } = this.state;
    let from = dates.from;
    let to = dates.to;
    if (type === 0) {
      to = from;
      from = moment(new Date(from))
        .subtract(8, "d")
        .format("YYYY-MM-DD");
    } else if (type === 1) {
      if (moment().format("YYYY-MM-DD") !== to) {
        from = to;
        to = moment(new Date(from))
          .add(8, "d")
          .format("YYYY-MM-DD");
      }
    } else if (type === -1) {
      from = moment()
        .subtract(8, "d")
        .format("YYYY-MM-DD");
      to = moment().add(1,"d").format("YYYY-MM-DD");
    }

    this.setState({
      companySymbol: companySymbol,
      dates: { from, to }
    });
    getArticles(companySymbol, from, to);
    getStocksList(companySymbol, from, to);
  };

  componentDidMount() {
    const {
      getLatestStocksList,
      isLoggedin,
      getUserInfo,
      getUserSettings
    } = this.props;

    getLatestStocksList();
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
    const {
      isLoggedin,
      getUserInfo,
      getUserSettings,
      stocksList,
      getArticles,
      getStocksList
    } = this.props;
    if (prevProps.isLoggedin !== isLoggedin && isLoggedin) {
      getUserInfo();
      getUserSettings();
    }
    if (
      (!prevProps.stocksList.length && stocksList.length) ||
      stocksList !== prevProps.stocksList
    ) {
      const { dates } = this.state;
      const companySymbol = stocksList[0]["companySymbol"];
      this.setState({
        companySymbol: companySymbol
      });
      getArticles(companySymbol, dates.from, dates.to);
      getStocksList(companySymbol, dates.from, dates.to);
      const rows = stocksList.map(el => {
        return {
          id: el.companySymbol,
          cells: [
            {
              id: "companySymbol",
              value: el.companySymbol
            },
            {
              id: "open",
              value: el.content.open
            },
            {
              id: "close",
              value: el.content.close
            },
            {
              id: "high",
              value: el.content.high
            },
            {
              id: "low",
              value: el.content.low
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
    // here we parse the chart data
    if (
      (!prevProps.chartList.length && this.props.chartList.length) ||
      this.props.chartList !== prevProps.chartList
    ) {
      const labels = [
        ...this.props.chartList.map(el =>
          moment(new Date(el.createdAt)).format("ll")
        )
      ];
      const open = [...this.props.chartList.map(el => el.open)];
      const close = [...this.props.chartList.map(el => el.close)];
      this.setState({
        chart: {
          labels: [...labels],
          datasets: [
            {
              label: "Opening price",
              data: [...open],
              fill: false
            },
            {
              label: "Closing price",
              data: [...close],
              fill: false
            }
          ]
        }
      });
    }
  }

  // error log
  componentDidCatch(error, errorInfo) {
    Sentry.withScope(scope => {
      scope.setExtras(errorInfo);
      Sentry.captureException(error);
    });
  }

  render() {
    const {
      classes,
      articles,
      loadingArticles,
      stocksLoading,
      chartLoading,
      locale,
      breadcrumbsLocale
    } = this.props;

    const { companySymbol, dates } = this.state;

    return (
      <FusePageSimple
        classes={{
          root: classes.layoutRoot
        }}
        content={
          <div className="p-24 w-full">
            <div className="flex flex-col md:flex-row sm:p-8 container">
              <Typography className="px-16 pb-8 text-18 font-300">
                {breadcrumbsLocale.Dashboard}
              </Typography>
            </div>
            <div className="flex flex-col md:flex-row sm:p-8 container">
              <div className="flex flex-1 flex-col min-w-0">
                <div className="widget w-full p-16">
                  <div className="dashbard-chart">
                    <div className="navigagte-buttons">
                      <Tooltip title={locale.prevButton}>
                        <span>
                          <IconButton
                            onClick={() => {
                              this.weekNavigate(0, companySymbol);
                            }}
                          >
                            {" "}
                            <ArrowBack />
                          </IconButton>
                        </span>
                      </Tooltip>
                      <Tooltip title={locale.nextButton}>
                        <span>
                          <IconButton
                            onClick={() => {
                              this.weekNavigate(1, companySymbol);
                            }}
                            disabled={dates.to === moment().add(1,"d").format("YYYY-MM-DD")}
                          >
                            {" "}
                            <ArrowForward />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </div>
                    <Chart
                      data={this.state.chart}
                      title={locale.chartTitle + " - " + companySymbol}
                      loading={chartLoading}
                    />
                  </div>
                </div>
                <div className="widget w-full p-16 pt-0">
                  <CompaniesTable
                    data={this.state.table}
                    loading={stocksLoading}
                    navigateToWeek={this.weekNavigate}
                    latestPrices={locale.latestPrices}
                    companySymbol={companySymbol}
                  />
                </div>
              </div>
              <div className="flex flex-wrap w-full md:w-400 pt-16">
                <div className="widget w-full">
                  <Articles
                    data={articles}
                    loading={loadingArticles}
                    widgetTitle={locale.articles}
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
    success: custom.articles.success,
    articles: custom.articles.list,
    loadingArticles: custom.articles.loading,
    stocksList: custom.stocks.list,
    stocksLoading: custom.stocks.loading,
    chartLoading: custom.stocks.chartLoading,
    chartList: custom.stocks.chartList,
    locale: custom.locale.dashboard,
    breadcrumbsLocale: custom.locale.breadcrumbs,
    isLoggedin: custom.login.isLoggedin
  };
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getArticles: getArticles,
      checkLoggedin: checkLoggedin,
      getLatestStocksList: getLatestStocksList,
      getStocksList: getStocksList,
      getUserInfo: getInfo,
      getUserSettings: getSettings
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles, { withTheme: true })(Dashboard));
