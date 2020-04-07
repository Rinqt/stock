import React, { Component } from "react";

class SmallChartLoader extends Component {
  render() {
    return (
      <div className="flex-col">
        <div className="half-line animated-background text-line chart-title"></div>
        <div className="animated-background text-line chart-value"></div>
        <div className="animated-background small-chart-box"></div>
      </div>
    );
  }
}

export default SmallChartLoader;
