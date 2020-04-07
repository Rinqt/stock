import React, { Component } from "react";
import { withStyles, Card, Typography } from "@material-ui/core";
import { Line } from "react-chartjs-2";
import red from "@material-ui/core/colors/red";
import ChartLoader from "../loaders/ChartLoader";

export class Chart extends Component {
  state = {
    chartType: "line",

    options: {
      spanGaps: false,
      legend: {
        display: false
      },
      maintainAspectRatio: false,
      tooltips: {
        position: "nearest",
        mode: "index",
        intersect: false
      },
      layout: {
        padding: {
          left: 24,
          right: 32
        }
      },
      elements: {
        point: {
          radius: 4,
          borderWidth: 2,
          hoverRadius: 4,
          hoverBorderWidth: 2
        }
      },
      scales: {
        xAxes: [
          {
            gridLines: {
              display: false
            },
            ticks: {
              fontColor: "rgba(0,0,0,0.54)"
            }
          }
        ],
        yAxes: [
          {
            gridLines: {
              tickMarkLength: 16
            },
            ticks: {
              beginAtZero: false,
            }
          }
        ]
      },
      plugins: {
        filler: {
          propagate: false
        }
      }
    }
  };

  componentDidUpdate(oldProps) {
    // calc the step size for chart
    const { data } = this.props;
    if (oldProps.data !== data) {
      let min0 = 0,
        max0 = 0,
        min1 = 0,
        max1 = 0,
        min = 0,
        max = 0,
        step = 1;
      const { options } = this.state;
      min0 = Math.min(...data.datasets[0]["data"]);
      max0 = Math.max(...data.datasets[0]["data"]);
      min1 =
        data.datasets.length > 1 ? Math.min(...data.datasets[1]["data"]) : 1;
      max1 =
        data.datasets.length > 1 ? Math.max(...data.datasets[1]["data"]) : 1;
      min = Math.min(min0, min1);
      max = Math.max(max0, max1);
      step = Math.round((max - min) / 7);
      options.scales.yAxes[0] = {
        stepSize: step
      };
      this.setState({ options: { ...options } });
    }
  }

  render() {
    const { data, theme, title, loading, type } = this.props;

    let dataWithColors = [];
    if (!loading && data && data.datasets) {
      dataWithColors = data.datasets.map((obj, index) => {
        let palette = theme.palette[index === 0 ? "primary" : "secondary"];
        if (type) {
          palette = theme.palette[index === 0 ? type : "secondary"];
        }
        if (!palette) {
          palette = red;
        }
        return {
          ...obj,
          borderColor: palette.main,
          backgroundColor: palette.main,
          pointBackgroundColor: palette.dark,
          pointHoverBackgroundColor: palette.main,
          pointBorderColor: palette.contrastText,
          pointHoverBorderColor: palette.contrastText
        };
      });
    }
    return (
      <Card className="w-full rounded-8 shadow-none border-1">
        {loading && !dataWithColors.length ? (
          <ChartLoader />
        ) : (
          <>
            <div className="relative p-24 flex flex-row items-center justify-between">
              <div className="flex flex-col">
                <Typography  variant="h6"> {title} </Typography>
              </div>
            </div>

            <Typography className="relative h-200 sm:h-320 sm:pb-16">
              <Line
                data={{
                  labels: data.labels,
                  datasets: dataWithColors
                }}
                options={this.state.options}
              />
            </Typography>
          </>
        )}
      </Card>
    );
  }
}

export default withStyles(null, { withTheme: true })(Chart);
