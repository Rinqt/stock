import React, { Component } from "react";
import ParagraphLoader from "./ParagraphLoader";

class ArticleBodyLoader extends Component {
  render() {
    const loaders = [];
    for (let i = 0; i < 4; i++) {
      loaders.push(
        <div className="align-start flex-col paragraph-loader" key={i}>
          <ParagraphLoader />
        </div>
      );
    }
    return loaders;
  }
}

export default ArticleBodyLoader;
