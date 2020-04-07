import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  Button,
  Typography,
  Icon,
  CircularProgress,
  List,
  ListItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Radio,
  ListItemIcon,
  ListItemText,
  FormControl,
  InputLabel,
} from "@material-ui/core";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Select as SearchSelect } from "react-dropdown-select";

const styles = theme => ({
  layoutRoot: {},
  button: {
    marginLeft: "15px;"
  },
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: "2rem"
  },

  modalTitle: {
    marginBottom: "15px"
  },
  modalDescription: {
    marginBottom: "15px"
  },
  modalFooter: {
    textAlign: "right"
  },
  fullwidth: {
    width: "100%",
    marginRight: "15px"
  }
});

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      openCompare: false,
      exportLoading: false,
      selectedCompareModel: null,
      model: [],
      company: []
    };
  }

  handleModelChange = value => {
    this.setState({ model: value });
  };

  handleCompanyChange = value => {
    this.setState({ company: value });
  };

  handleModalOpen = () => {
    this.setState({ openCompare: true });
  };
  handleModalClose = () => {
    this.setState({ openCompare: false, selectedCompareModel: null });
  };
  handelSelectCompareModel = val => {
    this.setState({ selectedCompareModel: val });
  };
  compare = () => {
    this.props.history.push(
      `/app/analysis/compare/${this.props.match.params.id}/${this.state.selectedCompareModel}`
    );
  };

  createModel = () => {
    this.props.history.push(`/app/analysis/add`);
  };
  export = () => {
    const checkedItems = Array.from(
      document.getElementsByClassName("checked-export")
    );

    checkedItems.forEach(el => {
      el.classList.add("exporting");
    });

    this.setState({ exportLoading: true });
    const input = document.getElementById("export-pdf");
    html2canvas(input, {
      allowTaint: true,
      useCORS: true,
      imageTimeout: 0
    }).then(canvas => {
      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight + 10);
      pdf.save("download.pdf");
      this.setState({ exportLoading: false });

      checkedItems.forEach(el => {
        el.classList.remove("exporting");
      });
    });
  };

  render() {
    const {
      classes,
      name,
      state,
      userModels,
      id,
      locale,
      loading,
      companies,
      models
    } = this.props;
    const { company, model } = this.state;


    let filteredUserModels = userModels.filter(el => {
      if (
        el.id === id ||
        (company.length && el.companySymbol !== company[0].symbol) ||
        (model.length && el.type !== model[0].type) ||
        el.state !== "Created"
      ) {
        return false;
      } else {
        return true;
      }
    });

    return (
      <div className="flex flex-1 flex-col min-w-0">
        <div className="flex flex-row pt-16 pr-16">
          <div className="flex flex-1">
            {loading ? (
              <div className="animated-background text-line half-line"></div>
            ) : (
              <Typography variant="h4" component="h1">
                {name}

                <span
                  className={
                    state === "Created"
                      ? "model-status bg-green text-white text-12 p-4 rounded v-middle"
                      : state === "Pending"
                      ? "model-status bg-orange text-white text-12 p-4 rounded v-middle"
                      : "model-status bg-red text-white text-12 p-4 rounded v-middle"
                  }
                >
                  {state}
                </span>
              </Typography>
            )}
          </div>
          <div className="flex" data-html2canvas-ignore id="view-actions">
            <div className="button-progress-wrapper">
              <Button
                component={Link}
                to={`/app/analysis/add/${id}`}
                variant="outlined"
                className={classes.button}
                color="secondary"
              >
                <Icon>file_copy</Icon>
                {locale.copyBtn}
              </Button>
            </div>

            <div className="button-progress-wrapper">
              <Button
                variant="outlined"
                color="secondary"
                className={classes.button}
                onClick={this.export}
              >
                <Icon>import_export</Icon>
                {locale.exportBtn}
              </Button>
              {this.state.exportLoading && (
                <CircularProgress size={24} className="button-progress" />
              )}
            </div>
            <div className="button-progress-wrapper">
              <Button
                variant="outlined"
                onClick={this.handleModalOpen}
                className={classes.button}
                disabled={state !== "Created"}
              >
                <Icon>compare</Icon>
                {locale.compareBtn}
              </Button>
            </div>
          </div>
        </div>

        <Dialog
          open={this.state.openCompare}
          onClose={this.handleModalClose}
          fullWidth={true}
          maxWidth={"sm"}
          scroll={"paper"}
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description"
        >
          <DialogTitle id="scroll-dialog-title">
            {locale.chooseToCompare}

            <div className="flex flex-row align-center">
              <div className="flex flex-1 pt-16">
                <FormControl className={classes.fullwidth}>
                  <InputLabel className="custom-label">
                    {locale.model}
                  </InputLabel>
                  <SearchSelect
                    className="custom-select-search"
                    placeholder={locale.all}
                    values={this.state.model}
                    onChange={this.handleModelChange}
                    options={models}
                    labelField="name"
                    valueField="type"
                    searchBy="name"
                    keepSelectedInList="true"
                    closeOnSelect="false"
                    noDataLabel="No matches found"
                    clearable="true"
                  />
                </FormControl>
              </div>
              <div className="flex flex-1 pt-16">
                <FormControl className={classes.fullwidth}>
                  <InputLabel className="custom-label">
                    {locale.company}
                  </InputLabel>
                  <SearchSelect
                    className="custom-select-search"
                    placeholder={locale.all}
                    values={this.state.company}
                    onChange={this.handleCompanyChange}
                    options={companies}
                    labelField="name"
                    valueField="symbol"
                    searchBy="name"
                    keepSelectedInList="true"
                    noDataLabel="No matches found"
                    closeOnSelect="false"
                    clearable="true"
                  />
                </FormControl>
              </div>
            </div>
          </DialogTitle>
          <DialogContent>
            {userModels.length > 1 ? (
              <List className={classes.root}>
                {filteredUserModels.length ? (
                  filteredUserModels.map(el => {
                    return (
                      <ListItem
                        key={el.id}
                        role={undefined}
                        dense
                        button
                        onClick={() => {
                          this.handelSelectCompareModel(el.id);
                        }}
                      >
                        <ListItemIcon>
                          <Radio
                            checked={this.state.selectedCompareModel === el.id}
                            onChange={() => {
                              this.handelSelectCompareModel(el.id);
                            }}
                            value={el.id}
                            name="compare-model"
                            inputProps={{
                              "aria-label": "A"
                            }}
                          />
                        </ListItemIcon>
                        <ListItemText primary={el.name} />
                      </ListItem>
                    );
                  })
                ) : (
                  <Typography>{locale.noModelsCriteria}</Typography>
                )}
              </List>
            ) : (
              <Typography>{locale.noModels}</Typography>
            )}
          </DialogContent>

          {userModels.length > 1 ? (
            <DialogActions>
              <Button
                variant="contained"
                className={classes.button}
                onClick={this.handleModalClose}
              >
                {locale.closeBtn}
              </Button>
              <Button
                variant="contained"
                color="primary"
                disabled={this.state.selectedCompareModel === null}
                onClick={this.compare}
                className={classes.button}
              >
                {locale.compareBtn}
              </Button>
            </DialogActions>
          ) : (
            <DialogActions>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  this.createModel();
                }}
                className={classes.button}
              >
                {locale.createModel}
              </Button>
            </DialogActions>
          )}
        </Dialog>
      </div>
    );
  }
}

function mapStateToProps({ custom }) {
  return {
    userModels: custom.models.userModels,
    companies: custom.companies.list,
    models: custom.models.availableModels
  };
}

export default connect(mapStateToProps)(
  withStyles(styles, { withTheme: true })(withRouter(Header))
);
