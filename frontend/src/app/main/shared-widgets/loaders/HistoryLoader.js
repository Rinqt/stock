import React, { Component } from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";

class HistoryLoader extends Component {
  render() {
    const items = [];
    for (let i = 0; i < 5; i++) {
      items.push(
        <ListItem button key={i}>
          <ListItemAvatar>
            <Avatar>
              <div className="animated-background avatar"></div>
            </Avatar>
          </ListItemAvatar>

          <div className="align-start flex-col list-item-loader">
            <div className="animated-background text-line half-line"></div>
            <div className="animated-background meta-line"></div>
          </div>
        </ListItem>
      );
    }
    return <>{items}</>;
  }
}

export default HistoryLoader;
