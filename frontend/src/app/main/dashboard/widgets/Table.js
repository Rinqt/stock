import React, { Component } from "react";
import {
  Table,
  TableHead,
  TableCell,
  TableRow,
  Typography,
  Paper,
  TableBody,
  Grid,
  Icon
} from "@material-ui/core";
import TableRowLoader from "../../shared-widgets/loaders/TableRowLoader";
import { getStocksList } from "../../../api/stocks.api";
import { getArticles } from "../../../api/articles.api.js";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import moment from "moment";
import { Link } from "react-router-dom";

class CompaniesTable extends Component {
  render() {
    const {
      data,
      loading,
      navigateToWeek,
      latestPrices,
      companySymbol
    } = this.props;

    const loaderRows = [];
    for (let i = 0; i < 10; i++) {
      loaderRows.push(
        <TableRowLoader key={i} cellsCount={data.columns.length} />
      );
    }

    return (
      <Paper className="w-full rounded-8 shadow-none border-1">
        <Grid className="flex items-center justify-between px-16 h-64">
          <Typography variant="h6">
            {latestPrices} {moment().format("ll")}
          </Typography>
        </Grid>
        <div className="table-responsive">
          <Table className="w-full min-w-full">
            <TableHead>
              <TableRow>
                {data.columns.map(column => (
                  <TableCell className="custom-table-header" key={column.id}>
                    {column.title}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading
                ? loaderRows
                : data.rows.map(row => (
                    <TableRow
                      key={row.id}
                      className={
                        companySymbol === row.id
                          ? "current-company hover-table"
                          : "hover-table"
                      }
                      onClick={() => {
                        navigateToWeek(-1, row.id);
                      }}
                    >
                      {row.cells.map(cell => {
                        switch (cell.id) {
                          case "date":
                            return (
                              <TableCell
                                key={cell.id}
                                component="td"
                                scope="row"
                                className="whitespace-no-wrap"
                              >
                                <Typography className={cell.classes}>
                                  {moment(cell.value).format("ll")}
                                </Typography>
                              </TableCell>
                            );
                          case "companySymbol":
                            return (
                              <TableCell
                                key={cell.id}
                                component="td"
                                scope="row"
                                className="whitespace-no-wrap company-name-link"
                              >
                                <Typography
                                  component="span"
                                  className={cell.classes}
                                >
                                  {cell.value}
                                </Typography>
                                <Link to={`/app/company/${cell.value}`}>
                                  <Icon>link</Icon>
                                </Link>
                              </TableCell>
                            );

                          default:
                            return (
                              <TableCell
                                key={cell.id}
                                component="td"
                                scope="row"
                                className="whitespace-no-wrap"
                              >
                                <Typography className={cell.classes}>
                                  {cell.value}
                                </Typography>
                              </TableCell>
                            );
                        }
                      })}
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </div>
      </Paper>
    );
  }
}
const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getStocksList: getStocksList,
      getArticles: getArticles
    },
    dispatch
  );

export default connect(null, mapDispatchToProps)(CompaniesTable);
