import React, { Component } from "react";
import {
    withStyles,
    Table,
    TableHead,
    TableCell,
    TableRow,
    Typography,
    Paper,
    TableBody,
    Button,
    FormControl,
    Input,
    InputLabel
} from "@material-ui/core";
import TableRowLoader from "../../shared-widgets/loaders/TableRowLoader";
import Pagination from "../../shared-widgets/pagination/Pagination";
import _ from "@lodash";
import instance from "../../../api/axios.instance";
import moment from "moment";
import { formatNumber } from "../../../functions/format";

const styles = theme => ({
    layoutRoot: {},
    fromDate: {
        minWidth: "150px",
        marginRight: "20px;"
    },
    toDate: {
        minWidth: "150px"
    }
});

class StocksTable extends Component {
    state = {
        from: moment()
            .subtract(8, "d")
            .format("YYYY-MM-DD"),
        to: moment().format("YYYY-MM-DD"),
        loading: true,
        data: {
            columns: [
                {
                    id: "date",
                    title: "Date"
                },
                {
                    id: "open",
                    title: "Open"
                },
                {
                    id: "close",
                    title: "Close"
                },
                {
                    id: "high",
                    title: "High"
                },
                {
                    id: "low",
                    title: "Low"
                },
                {
                    id: "volume",
                    title: "Volume"
                }
            ],
            rows: []
        },
        allRows: [],
        currentPage: 1
    };

    /**
     * Filter the historical data based on the selected date
     */
    handleFilter = () => {
        const { from, to } = this.state;

        if (to < from) {
            this.parseRows([]);
            return;
        }

        this.setState({
            loading: true
        });
        instance
            .get("stocks/all", {
                params: {
                    from: from,
                    to: to,
                    companySymbol: this.props.companySymbol
                }
            })
            .then(res => {
                this.setState({
                    loading: false
                });
                this.parseRows(res.data);
            })
            .catch(er => {
                // console.log(er, "");
                this.setState({
                    loading: false
                });
                this.parseRows([]);
            });
    };
    /**
     * handle change of the date change
     */
    handleDateChange = event => {
        this.setState(
            _.set({ ...this.state }, event.target.name, event.target.value)
        );
    };

    /**
     * convert the response data object into prefered structure
     * @param data reponse Object
     */
    parseRows = data => {
        const rows = data.map(el => {
            return {
                id: el.createdAt,
                cells: [
                    {
                        id: "date",
                        value: moment(new Date(el.createdAt)).format("ll")
                    },
                    {
                        id: "open",
                        value: el.open
                    },
                    {
                        id: "close",
                        value: el.close
                    },
                    {
                        id: "high",
                        value: el.high
                    },
                    {
                        id: "low",
                        value: el.low
                    },
                    {
                        id: "volume",
                        value: el.volume
                    }
                ]
            };
        });
        this.setState({
            allRows: rows
        });
        this.paginate(1, 7, rows);
    };

    paginate = (page = 1, perPage = 1, list = []) => {
        const rows = list.slice((page - 1) * perPage, page * perPage);
        this.setState({
            data: {
                ...this.state.data,
                rows: [...rows]
            },
            currentPage: page
        });
    };

    componentDidUpdate(oldProps) {
        if (oldProps.stocksList !== this.props.stocksList) {
            this.parseRows(this.props.stocksList);
        }
        if (oldProps.loading !== this.props.loading) {
            this.setState({
                loading: this.props.loading
            });
        }
    }
    render() {
        const { classes, locale } = this.props;
        const { allRows, currentPage } = this.state;
        const loaderRows = [];
        for (let i = 0; i < 10; i++) {
            loaderRows.push(
                <TableRowLoader
                    key={i}
                    cellsCount={this.state.data.columns.length}
                />
            );
        }
        return (
            <>
                <Paper className="w-full rounded-8 shadow-none border-1">
                    <div className="relative p-24 flex flex-row items-center justify-between">
                        <div className="flex flex-col">
                            <Typography className="h3 sm:h2">
                                {locale.stockHistory}
                            </Typography>
                        </div>
                    </div>
                    <div className="flex flex-row pr-24 pl-24 pb-24">
                        <div className="flex flex-1">
                            <FormControl className={classes.fromDate}>
                                <InputLabel htmlFor="component-simple">
                                    {locale.dateFrom}
                                </InputLabel>
                                <Input
                                    type="date"
                                    name="from"
                                    value={this.state.from}
                                    onChange={event => {
                                        this.handleDateChange(event);
                                    }}
                                />
                            </FormControl>
                            <FormControl className={classes.toDate}>
                                <InputLabel htmlFor="component-simple">
                                    {locale.dateTo}
                                </InputLabel>
                                <Input
                                    type="date"
                                    name="to"
                                    value={this.state.to}
                                    onChange={event => {
                                        this.handleDateChange(event);
                                    }}
                                />
                            </FormControl>
                        </div>
                        <div className="flex  flex-1"></div>
                        <div className="flex">
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => this.handleFilter()}
                            >
                                {locale.filterBtn}
                            </Button>
                        </div>
                    </div>
                    {allRows.length ? (
                        <div className="table-responsive">
                            <Table className="w-full min-w-full">
                                <TableHead>
                                    <TableRow>
                                        {this.state.data.columns.map(column => (
                                            <TableCell
                                                key={column.id}
                                                className="whitespace-no-wrap custom-table-header"
                                            >
                                                {column.title}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.state.loading
                                        ? loaderRows
                                        : this.state.data.rows.map(
                                              (row, index) => (
                                                  <TableRow key={index}>
                                                      {row.cells.map(cell => {
                                                          switch (cell.id) {
                                                              case "date":
                                                                  return (
                                                                      <TableCell
                                                                          key={
                                                                              cell.id
                                                                          }
                                                                          component="td"
                                                                          scope="row"
                                                                          className="whitespace-no-wrap"
                                                                      >
                                                                          <Typography
                                                                              className={
                                                                                  cell.classes
                                                                              }
                                                                          >
                                                                              {moment(
                                                                                  new Date(
                                                                                      cell.value
                                                                                  )
                                                                              ).format(
                                                                                  "ll"
                                                                              )}
                                                                          </Typography>
                                                                      </TableCell>
                                                                  );
                                                              default:
                                                                  return (
                                                                      <TableCell
                                                                          key={
                                                                              cell.id
                                                                          }
                                                                          component="td"
                                                                          scope="row"
                                                                          className="whitespace-no-wrap"
                                                                      >
                                                                          <Typography
                                                                              className={
                                                                                  cell.classes
                                                                              }
                                                                          >
                                                                              {formatNumber(
                                                                                  cell.value
                                                                              )}
                                                                          </Typography>
                                                                      </TableCell>
                                                                  );
                                                          }
                                                      })}
                                                  </TableRow>
                                              )
                                          )}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className="p-16">{locale.noData}</div>
                    )}
                </Paper>
                <Pagination
                    total={allRows.length}
                    perPage={7}
                    paginate={this.paginate}
                    list={allRows}
                    currentPage={currentPage}
                />
            </>
        );
    }
}

export default withStyles(styles, { withTheme: true })(StocksTable);
