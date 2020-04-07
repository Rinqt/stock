import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  InputLabel,
  FormControl,
  Typography,
  Paper,
  Tooltip,
  Input
} from "@material-ui/core";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { modelCreate } from "../../../../store/actions";
import HelpIcon from "@material-ui/icons/Help";
import { Select as SearchSelect } from "react-dropdown-select";
import moment from "moment";

const styles = theme => ({
  layoutRoot: {},
  fullwidth: {
    marginRight: "15px",
    width: "100%"
  }
});

class DataControl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      company: [],
      modelName: "title"
    };
  }

  componentDidUpdate(prevProps) {
    // handle if the copy
    const { companySymbol, name, companies } = this.props;
    if (
      prevProps.companySymbol !== companySymbol &&
      prevProps.name !== name &&
      companySymbol &&
      name
    ) {
      // update local state
      this.setState({
        company: companies.filter(el=>  el.symbol === companySymbol),
        modelName: name + "-" + moment().format('YYYY.MM.DD HH:mm:ss')
      });
    }
  }

  handleModelNameChange = event => {
    this.setState({ modelName: event.target.value });
    const { createdModel, dispatch } = this.props;

    dispatch(
      modelCreate({
        ...createdModel,
        name: event.target.value
      })
    );
  };
  handleCompanyChange = value => {
    this.setState({ company: value });
    const { createdModel, dispatch } = this.props;

    const parameters = { ...createdModel.parameters };
    if (value.length) {
      parameters.companySymbol = value[0].symbol;
      createdModel.parameters = parameters;
      dispatch(
        modelCreate({
          ...createdModel
        })
      );
    }
  };
  render() {
    const { classes, companies, locale } = this.props;
    return (
      <div className="flex flex-1 flex-col min-w-0">
        <div className="widget w-full pt-16 pr-16">
          <Paper className="p-16">
            <div className="flex flex-1 flex-col">
              <div className="flex flex-col">
                <div className="flex flex-1 pb-16">
                  <Typography variant="h6">{locale.title}</Typography>
                </div>
              </div>
              <div className="flex flex-row">
                <div className="flex flex-1">
                  <FormControl required className={classes.fullwidth}>
                    <InputLabel>
                      {locale.modelTitle}
                      <Tooltip
                        title={
                          <React.Fragment>
                            <Typography color="inherit">
                              {locale.modelTitleTooltip}
                            </Typography>
                          </React.Fragment>
                        }
                      >
                        <HelpIcon className="help-tooltip" />
                      </Tooltip>
                    </InputLabel>

                    <Input
                      className="mb-16"
                      type="text"
                      name="modelName"
                      value={this.state.modelName}
                      onChange={this.handleModelNameChange}
                      fullWidth
                    />
                  </FormControl>
                </div>
                <div className="flex flex-1">
                  <FormControl required className={classes.fullwidth}>
                    <InputLabel className="custom-label">
                      {locale.company}
                      <Tooltip
                        title={
                          <React.Fragment>
                            <Typography color="inherit">
                              {locale.companyTooltip}
                            </Typography>
                          </React.Fragment>
                        }
                      >
                        <HelpIcon className="help-tooltip" />
                      </Tooltip>
                    </InputLabel>

                    <SearchSelect
                      className="custom-select-search"
                      placeholder={locale.none}
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

                <div className="flex flex-1"></div>
                <div className="flex flex-1"></div>
              </div>
            </div>
          </Paper>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ custom }) {
  return {
    companies: custom.companies.list,
    createdModel: custom.models.createdModel
  };
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    ...bindActionCreators({}, dispatch)
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles, { withTheme: true })(DataControl));
