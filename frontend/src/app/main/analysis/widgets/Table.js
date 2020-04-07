import React, { Component } from "react";
import {
    withStyles,
    Icon,
    Table,
    TableHead,
    TableCell,
    TableRow,
    Typography,
    Paper,
    TableBody,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    Button
} from "@material-ui/core";
import { deleteModel } from "../../../api/models.api";
import { openDialog, closeDialog } from "../../../store/actions";
import TableRowLoader from "../../shared-widgets/loaders/TableRowLoader";
import Pagination from "../../shared-widgets/pagination/Pagination";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

const styles = theme => ({
    layoutRoot: {},
    tdItem:{
    padding: "4px 0px 4px 24px"
    }
});

class ReportsTable extends Component {
    state = {
        currentPage: 1,
        perPage: 10
    };
    /**
     * show confirmation message before deleteing the account
     */
    showDeleteModal = id => {
        const { dispatch, deleteModel, locale } = this.props;
        dispatch(
            openDialog({
                children: (
                    <React.Fragment>
                        <DialogTitle id="alert-dialog-title">
                            {locale.deleteModalTitle}
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                {locale.areYouSure}
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                onClick={() => {
                                    deleteModel(id);
                                    dispatch(closeDialog());
                                }}
                                color="secondary"
                            >
                                {locale.confirm}
                            </Button>
                            <Button
                                onClick={() => dispatch(closeDialog())}
                                color="primary"
                                autoFocus
                            >
                                {locale.cancel}
                            </Button>
                        </DialogActions>
                    </React.Fragment>
                )
            })
        );
    };

    paginate = (page = 1, perPage = 1, list = []) => {
        this.setState({
            currentPage: page,
            perPage: perPage
        });
    };

    componentDidUpdate(prevProps){
      const {userModelsFilters } = this.props;
      if(prevProps.userModelsFilters !== userModelsFilters){
        this.setState({
          currentPage: 1,
      });
      }
    }

    render() {
        const { data, userModelsFilters, locale, loading, classes } = this.props;
        const { currentPage, perPage } = this.state;
        const from = (currentPage - 1) * perPage;
        const to = currentPage * perPage;
        const loaderRows = [];
        for (let i = 0; i < 10; i++) {
            loaderRows.push(
                <TableRowLoader key={i} cellsCount={data.columns.length} />
            );
        }

        const filteredRows = data.rows.filter(row => {
            let show = true;
            row.cells.forEach(cell => {
                if (
                    (cell.id === "model" &&
                        userModelsFilters.modelType &&
                        cell.value !== userModelsFilters.modelType) ||
                    (cell.id === "date" &&
                        userModelsFilters.createdAt &&
                        cell.value !== userModelsFilters.createdAt) ||
                    (cell.id === "company" &&
                        userModelsFilters.companySymbol &&
                        cell.value !== userModelsFilters.companySymbol) ||
                    (cell.id === "status" &&
                        userModelsFilters.status &&
                        cell.value !== userModelsFilters.status)
                ) {
                    show = false;
                }
            });
            return show;
        });

        return (
            <>
                <Paper className="w-full rounded-8 shadow-none border-1">
                    <div className="table-responsive">
                        <Table className="w-full min-w-full">
                            <TableHead>
                                <TableRow>
                                    {data.columns.map(column => (
                                        <TableCell
                                            key={column.id}
                                            className="whitespace-no-wrap"
                                        >
                                            {column.title}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading
                                    ? loaderRows
                                    : filteredRows.slice(from, to).map(row => (
                                          <TableRow key={row.id}>
                                              {row.cells.map(cell => {
                                                  switch (cell.id) {
                                                      case "actions": {
                                                          return (
                                                              <TableCell
                                                                  key={cell.id}
                                                                  className={classes.tdItem}
                                                                  component="td"
                                                                  scope="row"
                                                              >
                                                                  <IconButton color="secondary">
                                                                      <Link
                                                                          to={`/app/analysis/add/${row.id}`}
                                                                      >
                                                                          <Icon>
                                                                              file_copy
                                                                          </Icon>
                                                                      </Link>
                                                                  </IconButton>
                                                                  <IconButton
                                                                      onClick={() =>
                                                                          this.showDeleteModal(
                                                                              row.id
                                                                          )
                                                                      }
                                                                  >
                                                                      <Icon className="text-red">
                                                                          delete
                                                                      </Icon>
                                                                  </IconButton>
                                                              </TableCell>
                                                          );
                                                      }
                                                      case "name": {
                                                          return (
                                                              <TableCell
                                                                  key={cell.id}
                                                                  className={classes.tdItem}
                                                                  component="td"
                                                                  scope="row"
                                                              >
                                                                  <Typography
                                                                      className={
                                                                          cell.classes
                                                                      }
                                                                  >
                                                                      <Link
                                                                          to={`/app/analysis/view/${row.id}`}
                                                                      >
                                                                          {
                                                                              cell.value
                                                                          }
                                                                      </Link>
                                                                  </Typography>
                                                              </TableCell>
                                                          );
                                                      }
                                                      default: {
                                                          return (
                                                              <TableCell
                                                                  key={cell.id}
                                                                  className={classes.tdItem}
                                                                  component="td"
                                                                  scope="row"
                                                              >
                                                                  <Typography
                                                                      className={
                                                                          cell.classes
                                                                      }
                                                                  >
                                                                      {
                                                                          cell.value
                                                                      }
                                                                  </Typography>
                                                              </TableCell>
                                                          );
                                                      }
                                                  }
                                              })}
                                          </TableRow>
                                      ))}
                            </TableBody>
                        </Table>
                        {!loading && !filteredRows.length && (
                            <div className="p-16">{locale.noData}</div>
                        )}
                    </div>
                </Paper>
                <Pagination
                    total={filteredRows.length}
                    perPage={perPage}
                    paginate={this.paginate}
                    list={[]}
                    currentPage={currentPage}
                />
            </>
        );
    }
}
function mapStateToProps({ custom }) {
    return {
        userModelsFilters: custom.models.userModelsFilters
    };
}

const mapDispatchToProps = dispatch => {
    return {
        dispatch,
        ...bindActionCreators(
            {
                deleteModel: deleteModel
            },
            dispatch
        )
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles, { withTheme: true })(ReportsTable));
