import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import { withRouter } from "react-router-dom";
import { updateHistory } from "../../../api/history.api";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

const styles = theme => ({
  layoutRoot: {}
});

class CompanyItem extends Component {
  state = {
    checked: false
  };

  /**
   * Method to redirect user to single company details page
   */
  loadCompany = () => {
    const { company, updateHistory } = this.props;
    this.props.history.push(`/app/company/${company.symbol}`);
    updateHistory(company);
  };

  /**
   * Method to manage checkbox click
   */
  handleToggle = () => () => {
    const { clickHandle, company } = this.props;
    this.setState({ checked: !this.state.checked });
    clickHandle(company, !this.state.checked);
  };
  render() {
    const { company } = this.props;
    return (
      <ListItem button onClick={this.loadCompany}>
        <ListItemText primary={company.name} />
        <ListItemSecondaryAction>
          <Checkbox
            edge="end"
            onChange={this.handleToggle()}
            checked={this.state.checked}
          />
        </ListItemSecondaryAction>
      </ListItem>
    );
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      updateHistory: updateHistory
    },
    dispatch
  );

export default withStyles(styles, { withTheme: true })(
  withRouter(connect(null, mapDispatchToProps)(CompanyItem))
);
