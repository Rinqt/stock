import React, { Component } from "react";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import TitleLoader from "./TitleLoader";
class ArticleWidgetLoader extends Component {
  render() {
    const {max} =this.props;
    const top = max ? max : 10;
    const loaders = [];
    for (let i = 0; i < top; i++) {
      loaders.push(
        <React.Fragment key={i}>
          <ListItem className="align-start flex-col">
            <TitleLoader />
            <div className="flex-row">
              <div className="animated-background meta-line"></div>
              <div className="animated-background meta-line"></div>
            </div>
          </ListItem>
          <Divider />
        </React.Fragment>
      );
    }
    return loaders;
  }
}

export default ArticleWidgetLoader;
