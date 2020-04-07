import React, { Component } from "react";

class ChartLoader extends Component {
  render() {
    return (
      <div className="flex-col">
        <div className="half-line animated-background text-line chart-title"></div>
        <div className="animated-background chart-box"></div>
      </div>
    );
  }
}

export default ChartLoader;
