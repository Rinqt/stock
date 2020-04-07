import React, { Component } from "react";
import { Typography, Paper, Grid } from "@material-ui/core";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ArticleWidgetLoader from "../loaders/ArticleWidgetLoader";
import { Link } from "react-router-dom";
import moment from "moment";
import classNames from "classnames";

class Articles extends Component {
  render() {
    const { data, loading, widgetTitle, max } = this.props;
    return (
      <Paper className="w-full rounded-8 shadow-none border-1">
        <Grid className="flex items-center justify-between px-16 h-64 border-b-1">
          <Typography variant="h6">{widgetTitle}</Typography>
        </Grid>
        <List component="nav" style={{ maxHeight: 500, overflow: "auto" }}>
          {loading || !data ? (
            <ArticleWidgetLoader max={max} />
          ) : (
            data.map((article, index) => {
              if (max && index >= max) {
                return "";
              } else {
                return (
                  <React.Fragment key={index}>
                    <ListItem
                      button
                      component={Link}
                      to={`/article/${encodeURI(article.id)}`}
                    >
                      <Grid container>
                        <Grid item xs={12}>
                          <Typography variant="subtitle1">
                            {article.title}
                          </Typography>
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          className="flex-row article-meta text-muted"
                        >
                          <Typography color="textSecondary" component={"span"}>
                            {moment(article.createdAt).format("ll")}
                          </Typography>
                          <Typography component={"span"}> | </Typography>
                          <Typography color="textSecondary" component={"span"}>
                            {article.companySymbol}
                          </Typography>
                          <Typography component={"span"}> | </Typography>
                          <Typography
                            component={"span"}
                            className={classNames(
                              article.polarity === "Positive"
                                ? "bg-green"
                                : article.polarity === "Neutral"
                                ? "bg-orange"
                                : "bg-red",
                              "text-white font-500 px-8 py-2 rounded-4"
                            )}
                          >
                            {article.polarity}
                          </Typography>
                        </Grid>
                      </Grid>
                    </ListItem>

                    <Divider />
                  </React.Fragment>
                );
              }
            })
          )}
        </List>
      </Paper>
    );
  }
}

export default Articles;
