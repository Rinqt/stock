import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { FusePageSimple } from "@fuse";
import { Typography, Paper } from "@material-ui/core";
import Articles from "../shared-widgets/articles/Articles.js";
import Breadcrumbs from "../shared-widgets/breadcrumbs/Breadcrumbs.js";
import * as articlesActions from "../../api/articles.api.js";
import { checkLoggedin } from "../../api/login.api";
import { articlesLoading } from "../../store/actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import TitleLoader from "../shared-widgets/loaders/TitleLoader";
import ArticleBodyLoader from "../shared-widgets/loaders/ArticleBodyLoader";
import moment from "moment";
import classNames from "classnames";
import { getInfo, getSettings } from "../../api/user.api";
import * as Sentry from "@sentry/browser";

const styles = theme => ({
  layoutRoot: {}
});

class ArticleDetails extends Component {
  state = {
    breadcrumbs: [
      {
        title: "Dashboard",
        link: "/app/dashboard"
      },
      {
        title: "",
        link: ""
      }
    ]
  };
  componentWillMount() {
    // this will be triggred only if the user navigates to article page
    const { setArticlesLoading, checkLoggedin } = this.props;
    setArticlesLoading(true);

    // confirm if the user is logged in before entering the page
    checkLoggedin();
  }
  componentDidMount() {
    // this will be triggred only if the user navigates to article page
    const {
      getSingleArticle,
      isLoggedin,
      getUserInfo,
      getUserSettings
    } = this.props;
    const { id } = this.props.match.params;
    getSingleArticle(id);

    if (isLoggedin) {
      getUserInfo();
      getUserSettings();
    }
  }

  componentDidUpdate(prevProps) {
    // this will handle loading realred article based on the current article
    const {
      articleDetails,
      getArticles,
      getSingleArticle,
      isLoggedin,
      getUserInfo,
      getUserSettings
    } = this.props;

    if (prevProps.isLoggedin !== isLoggedin && isLoggedin) {
      getUserInfo();
      getUserSettings();
    }

    if (
      (prevProps.articleDetails === null ||
        prevProps.articleDetails.title !== articleDetails.title) &&
      articleDetails !== null
    ) {
      this.setState({
        breadcrumbs: [
          {
            title: "Dashboard",
            link: "/app/dashboard"
          },
          {
            title: articleDetails.title,
            link: ""
          }
        ]
      });
      getArticles(articleDetails.companySymbol);
    }
    // this will handle the new article details if the user clicks on the related articles widget
    const oldId = prevProps.match.params.id;
    const { id } = this.props.match.params;
    if (oldId && oldId !== id) {
      getSingleArticle(id);
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
      articleDetails,
      loadingArticles,
      singleArticleLoading,
      articles,
      locale
    } = this.props;
    return (
      <FusePageSimple
        classes={{
          root: classes.layoutRoot
        }}
        content={
          <div className="p-24 w-full">
            <div className="flex flex-col md:flex-row sm:p-8 container">
              {singleArticleLoading ? (
                <div className="animated-background text-line half-line"></div>
              ) : (
                <Breadcrumbs data={this.state.breadcrumbs}></Breadcrumbs>
              )}
            </div>
            <div className="flex flex-col md:flex-row sm:p-8 container">
              <div className="flex flex-1 flex-col min-w-0">
                <div className="widget w-full pt-16 pr-16">
                  <Paper className="p-16">
                    {singleArticleLoading ? (
                      <TitleLoader />
                    ) : (
                      <Typography variant="h5" component="h1">
                        {articleDetails.title}
                      </Typography>
                    )}
                    {singleArticleLoading ? (
                      <div>
                        <div className="flex-row">
                          <div className="animated-background meta-line"></div>
                          <div className="animated-background meta-line"></div>
                          <div className="animated-background meta-line"></div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-row article-meta">
                        <Typography component="span">
                          {moment(articleDetails.createdAt).format("ll")}
                        </Typography>
                        <Typography component="span"> | </Typography>
                        <Typography component="span">
                          {articleDetails.companySymbol}
                        </Typography>
                        <Typography component="span"> | </Typography>
                        <Typography
                          component="span"
                          className={classNames(
                            articleDetails.polarity === "Positive"
                              ? "bg-green"
                              : articleDetails.polarity === "Neutral"
                              ? "bg-orange"
                              : "bg-red",
                            "text-white font-500 px-8 py-2 rounded-4"
                          )}
                        >
                          {articleDetails.polarity}
                        </Typography>

                        <Typography
                          className="article-source"
                          component={"span"}
                        >
                          {!singleArticleLoading ? (
                            <a
                              href={articleDetails.link}
                              target="_blank"
                              className="view-original"
                              rel="noopener noreferrer"
                            >
                              {locale.source}: {articleDetails.source}
                            </a>
                          ) : (
                            ""
                          )}
                        </Typography>
                      </div>
                    )}
                    {!singleArticleLoading ? (
                      <img
                        className="single-article-image"
                        src={articleDetails.image}
                        alt={articleDetails.title}
                      />
                    ) : (
                      ""
                    )}
                    {singleArticleLoading ? (
                      <ArticleBodyLoader />
                    ) : (
                      <Typography
                        className="pt-16"
                        variant="body1"
                        component="article"
                      >
                        {articleDetails.content}
                      </Typography>
                    )}
                  </Paper>
                </div>
              </div>
              <div className="flex flex-wrap w-full md:w-400 pt-16">
                <div className="widget w-full">
                  <Articles
                    data={articles}
                    loading={loadingArticles}
                    widgetTitle={locale.relatedArticles}
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
    articleDetails: custom.articles.articleDetails,
    articles: custom.articles.list,
    loadingArticles: custom.articles.loading,
    singleArticleLoading: custom.articles.singleArticleLoading,
    breadcrumbsLocale: custom.locale.breadcrumbs,
    locale: custom.locale.articleDetails,
    isLoggedin: custom.login.isLoggedin
  };
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getArticles: articlesActions.getArticles,
      getSingleArticle: articlesActions.getSingleArticle,
      setArticlesLoading: articlesLoading,
      checkLoggedin: checkLoggedin,
      getUserInfo: getInfo,
      getUserSettings: getSettings
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles, { withTheme: true })(ArticleDetails));
