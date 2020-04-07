import React, { Component } from "react";
import { Typography, Paper, CircularProgress } from "@material-ui/core";
import List from "@material-ui/core/List";
import CompanyItem from "./CompanyItem.js";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import { updateSettings } from "../../../api/user.api";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

class CompaniesList extends Component {
  state = {
    filter: "",
    selectedCompanies: []
  };

  /**
   * Method used for real time search of companies in the list
   * @param $event the target field
   */
  setFilter = $event => {
    this.setState({ filter: $event.target.value });
  };

  /**
   * Method for selection of the companies in the list
   * @param symbol the symbol of th checked company
   * @param check boolean true/false
   */

  manageCompanySelect = (company, check) => {
    const { selectedCompanies } = this.state;
    this.setState({
      selectedCompanies: check
        ? [...selectedCompanies, company]
        : [...selectedCompanies.filter(el => el.symbol !== company.symbol)]
    });
  };
  /**
   * Method for preparing the list of companies that will be added or removed
   */
  manageCompanies = () => {
    const { updateUserSettings, userSettings, buttonAction } = this.props;

    let fav = userSettings.favoriteCompanies;
    if (buttonAction === "add") {
      for (
        let company = 0;
        company < this.state.selectedCompanies.length;
        company++
      ) {
        fav.push(this.state.selectedCompanies[company]);
      }
    } else if (buttonAction === "delete") {
      for (let company in this.state.selectedCompanies) {
        fav = fav.filter(
          el => el.symbol !== this.state.selectedCompanies[company].symbol
        );
      }
    }

    this.setState({
      selectedCompanies: []
    });

    updateUserSettings(fav, userSettings.language);
  };
  render() {
    const {
      companies,
      title,
      buttonColor,
      buttonText,
      userSettingsUpdate,
      search,
      emptyText
    } = this.props;

    const filteredCompanies = companies.filter(company => {
      if (this.state.filter === "") return true;
      if (
        company.name.toLowerCase().search(this.state.filter.toLowerCase()) !==
        -1
      )
        return true;
      return false;
    });

    return (
      <Paper>
        <div className="widget w-full p-16">
          <div className="flex flex-row">
            <div className="flex flex-1">
              <Typography variant="h6">{title}</Typography>
            </div>
            <div className="flex pr-16">
              <FormControl>
                <InputLabel htmlFor="component-simple">{search}</InputLabel>
                <Input
                  value={this.state.filter}
                  onChange={$event => this.setFilter($event)}
                />
              </FormControl>
            </div>
            <div className="flex">
              <div className="button-progress-wrapper">
                <Button
                  variant="contained"
                  color={buttonColor}
                  disabled={
                    !this.state.selectedCompanies.length || userSettingsUpdate
                  }
                  onClick={() => {
                    this.manageCompanies();
                  }}
                  className="button-action"
                >
                  {buttonText}
                </Button>
                {userSettingsUpdate && (
                  <CircularProgress size={24} className="button-progress" />
                )}
              </div>
            </div>
          </div>
        </div>
        <List>
          {filteredCompanies.length > 0 ? (
            filteredCompanies.map((company, index) => (
              <CompanyItem
                company={company}
                key={company.symbol}
                clickHandle={this.manageCompanySelect}
              />
            ))
          ) : (
            <div className="pr-16 pl-16">{emptyText}</div>
          )}
        </List>
      </Paper>
    );
  }
}

function mapStateToProps({ custom }) {
  return {
    userSettings: custom.user.settings,
    userSettingsUpdate: custom.user.updateLoading
  };
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      updateUserSettings: updateSettings
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(CompaniesList);
