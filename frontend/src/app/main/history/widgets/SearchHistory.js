import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import { Typography, Paper } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import moment from "moment";
import { withRouter } from "react-router-dom";
import HistoryLoader from "../../shared-widgets/loaders/HistoryLoader";

const styles = theme => ({
  layoutRoot: {}
});

class SearchHistory extends Component {
  /**
   * navigate to a company details pages
   * @param symbol String of company symbol
   */
  loadCompany = symbol => {
    this.props.history.push(`/app/company/${symbol}`);
  };
  render() {
    const { data, loading, locale } = this.props;
    return (
      <Paper className="w-full">
        <div className="widget flex flex-col p-16">
          <div className="flex flex-row">
            <div className="flex flex-1">
              <Typography variant="h6">{locale.searchHistory}</Typography>
            </div>
          </div>
          <List>
            {loading ? (
              <HistoryLoader />
            ) : (
              data.map((entry, index) => (
                <ListItem
                  button
                  key={index}
                  onClick={() => this.loadCompany(entry.symbol)}
                >
                  <ListItemAvatar>
                    <Avatar>
                      <SearchIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={locale.searchedFor + entry.name}
                    secondary={moment(entry.searchedAt).format("lll")}
                  />
                </ListItem>
              ))
            )}
          </List>
        </div>
      </Paper>
    );
  }
}

export default withStyles(styles, { withTheme: true })(
  withRouter(SearchHistory)
);
