import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Button,
  TextField
} from "@material-ui/core";
import { updateModelsFilters } from "../../../store/actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import moment from "moment";
import { Select as SearchSelect } from "react-dropdown-select";

const styles = theme => ({
  layoutRoot: {},
  fullwidth: {
    marginRight: "15px",
    width: "100%"
  }
});

class Filter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      company: [],
      model: [],
      status: 0,
      date: ""
    };
  }
  componentDidMount() {
    this.clearFilters();
  }
  handleModelChange = value => {
    this.setState({ model: value });
    const { userModelsFilters, dispatch } = this.props;
    if (value.length) {
      dispatch(
        updateModelsFilters({
          ...userModelsFilters,
          modelType: value[0].type
        })
      );
    }
  };

  handleCompanyChange = value => {
    const { userModelsFilters, dispatch } = this.props;

    this.setState({ company: value });
    if (value.length) {
      dispatch(
        updateModelsFilters({
          ...userModelsFilters,
          companySymbol: value[0].symbol
        })
      );
    }
  };

  handleStatusChange = event => {
    this.setState({ status: event.target.value });
    const { userModelsFilters, dispatch } = this.props;
    dispatch(
      updateModelsFilters({
        ...userModelsFilters,
        status: event.target.value
      })
    );
  };

  handleDateChange = event => {
    this.setState({ date: event.target.value });
    const { userModelsFilters, dispatch } = this.props;
    dispatch(
      updateModelsFilters({
        ...userModelsFilters,
        createdAt: moment(event.target.value).format("ll")
      })
    );
  };
  clearFilters = () => {
    const { userModelsFilters, dispatch } = this.props;
    dispatch(
      updateModelsFilters({
        ...userModelsFilters,
        createdAt: null,
        status: null,
        companySymbol: null,
        modelType: null
      })
    );
    this.setState({
      company: [],
      model: [],
      status: 0,
      date: ""
    });
  };

  render() {
    const { classes, companies, models, locale } = this.props;

    return (
      <div className="flex flex-row align-center">
        <div className="flex flex-1">
          <FormControl className={classes.fullwidth}>
            <InputLabel className="custom-label">{locale.model}</InputLabel>
            <SearchSelect
              className="custom-select-search"
              placeholder={locale.none}
              values={this.state.model}
              onChange={this.handleModelChange}
              options={models}
              labelField="name"
              valueField="type"
              searchBy="name"
              keepSelectedInList="true"
              closeOnSelect="false"
              noDataLabel="No matches found"
            />
          </FormControl>
        </div>
        <div className="flex flex-1">
          <FormControl className={classes.fullwidth}>
            <InputLabel className="custom-label">{locale.company}</InputLabel>
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
            />
          </FormControl>
        </div>
        <div className="flex flex-1">
          <FormControl className={classes.fullwidth}>
            <TextField
              id="standard-number"
              label={locale.date}
              type="date"
              value={this.state.date}
              onChange={this.handleDateChange}
              InputLabelProps={{
                shrink: true
              }}
            />
          </FormControl>
        </div>
        <div className="flex flex-1">
          <FormControl className={classes.fullwidth}>
            <InputLabel>{locale.status}</InputLabel>
            <Select
              value={this.state.status}
              onChange={this.handleStatusChange}
            >
              <MenuItem value={0}>
                <em>{locale.none}</em>
              </MenuItem>
              <MenuItem value="Failed">{locale.failed}</MenuItem>
              <MenuItem value="Pending">{locale.pending}</MenuItem>
              <MenuItem value="Created">{locale.created}</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className="flex">
          <Button
            onClick={this.clearFilters}
            variant="contained"
            color="secondary"
          >
            {locale.clearBtn}
          </Button>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ custom }) {
  return {
    companies: custom.companies.list,
    models: custom.models.availableModels,
    userModelsFilters: custom.models.userModelsFilters
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
)(withStyles(styles, { withTheme: true })(Filter));
