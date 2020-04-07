import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { FusePageSimple } from "@fuse";
import Breadcrumbs from "../shared-widgets/breadcrumbs/Breadcrumbs.js";
import Chart from "../shared-widgets/charts/Chart";
import BarChart from "./widgets/BarChart.js";
import VolumeChart from "./widgets/VolumeChart.js";
import Details from "./widgets/Details.js";
import StocksTable from "./widgets/Table.js";
import { checkLoggedin } from "../../api/login.api";
import { getCompanyDetails } from "../../api/companies.api";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getStocksList, getCompanyFutureStocks } from "../../api/stocks.api";
import Articles from "../shared-widgets/articles/Articles.js";
import { getArticles } from "../../api/articles.api.js";
import { getInfo, getSettings } from "../../api/user.api";
import moment from "moment";
import * as Sentry from "@sentry/browser";
const styles = theme => ({
  layoutRoot: {}
});

class CompanyDetails extends Component {
  state = {
    breadcrumbs: [],
    currentWeekOpenClose: {},
    nextWeekOpenClose: {},
    currentWeekHigh: {},
    currentWeekLow: {},
    currentWeekVolume: {},
    nextWeekStocks: {}
  };
  componentWillMount() {
    const { checkLoggedin } = this.props;

    // confirm if the user is logged in before entering the page
    checkLoggedin();
  }
  componentDidMount() {
    const {
      getCompanyDetails,
      getStocksList,
      isLoggedin,
      getUserInfo,
      getUserSettings,
      getArticles,
      getCompanyFutureStocks
    } = this.props;
    const { companySymbol } = this.props.match.params;
    getCompanyDetails(companySymbol);
    getCompanyFutureStocks(companySymbol);
    getArticles(companySymbol);
    getStocksList(
      companySymbol,
      moment()
        .subtract(8, "d")
        .format("YYYY-MM-DD"),
      moment().format("YYYY-MM-DD")
    );

    if (isLoggedin) {
      getUserInfo();
      getUserSettings();
    }
  }
  componentDidUpdate(oldProps) {
    // trigger this if user navigates to the company details from within the page it self
    const {
      isLoggedin,
      getUserInfo,
      getUserSettings,
      getCompanyFutureStocks,
      getArticles
    } = this.props;
    if (oldProps.isLoggedin !== isLoggedin && isLoggedin) {
      getUserInfo();
      getUserSettings();
    }

    const { companySymbol } = this.props.match.params;
    if (companySymbol !== oldProps.match.params.companySymbol) {
      const { getCompanyDetails, getStocksList } = this.props;
      getCompanyDetails(companySymbol);
      getCompanyFutureStocks(companySymbol);
      getArticles(companySymbol);
      getStocksList(
        companySymbol,
        moment()
          .subtract(8, "d")
          .format("YYYY-MM-DD"),
        moment().format("YYYY-MM-DD")
      );
    }
    const { stocksList, companyDetails, companyFutureStocks } = this.props;
    if (stocksList !== oldProps.stocksList) {
      const labels = [
        ...stocksList.map(el => moment(new Date(el.createdAt)).format("ll"))
      ];
      const open = [...stocksList.map(el => el.open)];
      const close = [...stocksList.map(el => el.close)];
      const high = [...stocksList.map(el => el.high)];
      const low = [...stocksList.map(el => el.low)];
      const volume = [...stocksList.map(el => el.volume)];
      this.setState({
        currentWeekOpenClose: {
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
        },
        currentWeekHigh: {
          chartType: "bar",
          datasets: [
            {
              label: "High",
              data: [...high]
            }
          ],
          labels: [...labels]
        },
        currentWeekLow: {
          chartType: "bar",
          datasets: [
            {
              label: "Low",
              data: [...low]
            }
          ],
          labels: [...labels]
        },
        currentWeekVolume: {
          chartType: "line",
          datasets: [
            {
              label: "Volume",
              data: [...volume],
              fill: false
            }
          ],
          labels: [...labels]
        }
      });
    }
    // update future data
    if (companyFutureStocks !== oldProps.companyFutureStocks) {
      this.setState({
        nextWeekStocks: {
          labels: [
            ...companyFutureStocks.map((_, index) => {
              return moment()
                .add(index, "d")
                .format("ll");
            })
          ],
          datasets: [
            {
              label: "Closing price",
              data: [
                ...companyFutureStocks.map(val => {
                  return parseFloat(val).toFixed(2);
                })
              ],
              fill: false
            }
          ]
        }
      });
    }
    // update the breadcrumbs
    if (companyDetails !== oldProps.companyDetails) {
      this.setState({
        breadcrumbs: [
          {
            title: "Companies",
            link: "/app/companies"
          },
          {
            title: companyDetails.name,
            link: ""
          }
        ]
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
      stocksLoading,
      stocksList,
      companyDetails,
      companyDetailsLoading,
      futureLoading,
      locale,
      articles,
      loadingArticles
    } = this.props;
    const { companySymbol } = this.props.match.params;
    return (
      <FusePageSimple
        classes={{
          root: classes.layoutRoot
        }}
        content={
          <div className="p-24 w-full">
            <div className="flex flex-col md:flex-row sm:p-8 container">
              {companyDetailsLoading ? (
                <div className="animated-background text-line half-line"></div>
              ) : (
                <Breadcrumbs data={this.state.breadcrumbs}></Breadcrumbs>
              )}
            </div>
            <div className="flex flex-row md:flex-row sm:p-8 container">
              <div className="flex flex-1 flex-row min-w-0">
                <div className="widget w-full p-16">
                  <Details
                    data={companyDetails}
                    loading={companyDetailsLoading}
                    locale={locale.companyDetails}
                  />
                </div>
              </div>
              <div className="flex flex-1 flex-row min-w-0">
                <div className="widget w-full p-16">
                  <Articles
                    data={articles}
                    loading={loadingArticles}
                    widgetTitle={locale.relatedArticles}
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row sm:p-8 container">
              <div className="flex flex-1 flex-row min-w-0">
                <div className="widget w-full p-16">
                  <Chart
                    data={this.state.currentWeekOpenClose}
                    title={locale.currentWeek}
                    loading={stocksLoading}
                  />
                </div>
                <div className="widget w-full p-16">
                  <Chart
                    data={this.state.nextWeekStocks}
                    title={locale.nextWeek}
                    loading={futureLoading}
                    type={"error"}
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row sm:p-8 container">
              <div className="flex flex-1 flex-row min-w-0">
                <div className="widget w-1/4 p-16">
                  <BarChart
                    data={this.state.currentWeekHigh}
                    title={locale.high}
                    isLow={false}
                    loading={stocksLoading}
                  />
                </div>
                <div className="widget w-1/4 p-16">
                  <BarChart
                    data={this.state.currentWeekLow}
                    title={locale.low}
                    isLow={true}
                    loading={stocksLoading}
                  />
                </div>
                <div className="widget w-1/2 p-16">
                  <VolumeChart
                    data={this.state.currentWeekVolume}
                    title={locale.volume}
                    loading={stocksLoading}
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row sm:p-8 container">
              <div className="flex flex-1 flex-row min-w-0">
                <div className="widget w-full p-16">
                  <StocksTable
                    loading={stocksLoading}
                    stocksList={stocksList}
                    companySymbol={companySymbol}
                    locale={locale.stockHistoryTable}
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
    stocksLoading: custom.stocks.chartLoading,
    stocksList: custom.stocks.chartList,
    articles: custom.articles.list,
    loadingArticles: custom.articles.loading,
    companyFutureStocks: custom.stocks.companyFuture,
    futureLoading: custom.stocks.companyFutureLoading,
    companyDetails: custom.companies.singleCompanyDetails,
    companyDetailsLoading: custom.companies.singleCompanyLoading,
    isLoggedin: custom.login.isLoggedin,
    locale: custom.locale.companyProfile
  };
}
const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      checkLoggedin: checkLoggedin,
      getCompanyDetails: getCompanyDetails,
      getStocksList: getStocksList,
      getUserInfo: getInfo,
      getUserSettings: getSettings,
      getCompanyFutureStocks: getCompanyFutureStocks,
      getArticles: getArticles
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles, { withTheme: true })(CompanyDetails));
