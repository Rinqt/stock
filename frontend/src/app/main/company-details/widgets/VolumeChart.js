import React, { Component } from "react";
import { withStyles, Card, Icon, Typography } from "@material-ui/core";
import { Line } from "react-chartjs-2";
import SmallChartLoader from "../../shared-widgets/loaders/SmallChartLoader";
import { formatNumber } from "../../../functions/format";

class VolumeChart extends Component {
  state = {
    options: {
      spanGaps: false,
      legend: {
        display: false
      },
      maintainAspectRatio: false,
      elements: {
        point: {
          radius: 2,
          borderWidth: 1,
          hoverRadius: 2,
          hoverBorderWidth: 1
        },
        line: {
          tension: 0
        }
      },
      layout: {
        padding: {
          top: 24,
          left: 16,
          right: 16,
          bottom: 16
        }
      },
      scales: {
        xAxes: [
          {
            display: false
          }
        ],
        yAxes: [
          {
            display: false
          }
        ]
      }
    }
  };
  render() {
    const { data, theme, title, loading } = this.props;
    let dataWithColors = [],
      lastValue = 0,
      secondTolast = 0;
    if (!loading && data.datasets) {
      dataWithColors = data.datasets.map(obj => ({
        ...obj,
        borderColor: theme.palette.secondary.main
      }));
      lastValue = data.datasets[0]["data"][data.datasets[0]["data"].length - 1];
      secondTolast =
        data.datasets[0]["data"][data.datasets[0]["data"].length - 2];
    }

    return (
      <Card className="w-full rounded-8 shadow-none border-1">
        {loading ? (
          <SmallChartLoader />
        ) : (
          <>
            <div className="p-16 pb-0 flex flex-row items-end flex-wrap">
              <div className="pr-16">
                <Typography className="h3" color="textSecondary">
                  {title}
                </Typography>
                <Typography className="text-40 font-300 leading-none mt-8">
                  {formatNumber(lastValue)}{" "}
                  {lastValue - secondTolast > 0 ? (
                    <Icon className="text-green mr-4">trending_up</Icon>
                  ) : (
                    <Icon className="text-red mr-4">trending_down</Icon>
                  )}
                </Typography>
              </div>
            </div>

            <div className="h-96 w-100-p">
              <Line
                data={{
                  labels: data.labels,
                  datasets: dataWithColors
                }}
                options={this.state.options}
              />
            </div>
          </>
        )}
      </Card>
    );
  }
}

export default withStyles(null, { withTheme: true })(VolumeChart);
