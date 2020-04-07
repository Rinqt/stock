import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Typography, Paper, TextField, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, FormControl } from "@material-ui/core";
import { red } from "@material-ui/core/colors";
import { openDialog, closeDialog } from "../../../store/actions";
import { deleteAccount } from "../../../api/user.api";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Validator from "../../../ValidationService";
import { updatePassword } from "../../../api/user.api";
import _ from "@lodash";

const styles = theme => ({
  layoutRoot: {},
  formControl: {
    marginTop: "1.8rem"
  },
  danger: {}
});
const ColorButton = withStyles(theme => ({
  root: {
    color: red[700],
    marginTop: "12px;",
    "&:hover": {
      backgroundColor: red[100]
    }
  }
}))(Button);

class AccountInfo extends Component {
  state = {
    previousPassword: "",
    newPassword: "",
    newPasswordConfirm: "",
    previousPasswordError: false,
    newPasswordError: false,
    newPasswordConfirmError: false
  };

  constructor(props) {
    super(props);
    this.validator = new Validator();
  }

  /**
   * check if the entered old password is valid
   */
  validatePreviousPassword = () => {
    const { previousPassword } = this.state;

    if (this.validator.passwordValidator(previousPassword)) {
      this.setState({ previousPasswordError: false });
    } else {
      this.setState({ previousPasswordError: true });
    }
  };
  /**
   * check if the entered new password is valid
   */
  validateNewPassword = () => {
    const { newPassword } = this.state;

    if (this.validator.passwordValidator(newPassword)) {
      this.setState({ newPasswordError: false });
    } else {
      this.setState({ newPasswordError: true });
    }
  };

  /**
   * check if the entered new password confirmation is valid
   */
  validateConfirmPassword = () => {
    const { newPassword, newPasswordConfirm } = this.state;

    if (this.validator.stringMatchValidator(newPassword, newPasswordConfirm)) {
      this.setState({ newPasswordConfirmError: false });
    } else {
      this.setState({ newPasswordConfirmError: true });
    }
  };

  /**
   * check if the user can submit the form
   */
  canBeSubmitted() {
    const {
      previousPasswordError,
      newPasswordError,
      newPasswordConfirmError,
      newPassword,
      previousPassword,
      newPasswordConfirm
    } = this.state;
    return (
      !(previousPasswordError && newPasswordError && newPasswordConfirmError) &&
      newPassword.length &&
      previousPassword.length &&
      newPasswordConfirm.length
    );
  }
  handleChange = $event => {
    this.setState(
      _.set({ ...this.state }, $event.target.name, $event.target.value)
    );
  };

  /**
   * show confirmation message before deleteing the account
   */
  showDeleteModal = () => {
    const { dispatch, deleteUserAccount, modalLocale } = this.props;
    dispatch(
      openDialog({
        children: (
          <React.Fragment>
            <DialogTitle id="alert-dialog-title">
              {modalLocale.deleteModalTitle}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {modalLocale.deleteModalSure}
              </DialogContentText>
              <DialogContentText id="alert-dialog-description">
                {modalLocale.deleteModalInfo}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  deleteUserAccount();
                  dispatch(closeDialog());
                }}
                color="secondary"
              >
                {modalLocale.confirmBtn}
              </Button>
              <Button
                onClick={() => dispatch(closeDialog())}
                color="primary"
                autoFocus
              >
                {modalLocale.cancelBtn}
              </Button>
            </DialogActions>
          </React.Fragment>
        )
      })
    );
  };

  /**
   * handle the password change request
   */
  updatePassword = () => {
    const { updateUserPassword } = this.props;
    const { previousPassword, newPassword } = this.state;
    updateUserPassword(previousPassword, newPassword);
    this.setState({
      previousPassword: "",
      newPassword: "",
      newPasswordConfirm: "",
      previousPasswordError: false,
      newPasswordError: false,
      newPasswordConfirmError: false
    });
  };
  render() {
    const { classes, locale } = this.props;
    return (
      <Paper>
        <div className="widget flex flex-col w-full p-16">
          <div className="flex flex-row">
            <div className="flex flex-1">
              <Typography variant="h6">{locale.title}</Typography>
            </div>
          </div>
          <div className="flex flex-row">
            <FormControl
              className={["flex", "flex-1", classes.formControl].join(" ")}
            >
              <TextField
                type="password"
                label={locale.currentPassword}
                name="previousPassword"
                value={this.state.previousPassword}
                onChange={this.handleChange}
                onBlur={this.validatePreviousPassword}
                error={this.state.previousPasswordError}
                helperText={
                  this.state.previousPasswordError
                    ? "Password is not valid"
                    : ""
                }
              />
            </FormControl>
          </div>
          <div className="flex flex-row">
            <FormControl
              className={["flex", "flex-1", classes.formControl].join(" ")}
            >
              <TextField
                type="password"
                label={locale.newPassword}
                name="newPassword"
                value={this.state.newPassword}
                onChange={this.handleChange}
                onBlur={this.validateNewPassword}
                error={this.state.newPasswordError}
                helperText={
                  this.state.newPasswordError ? "Password is not valid" : ""
                }
              />
            </FormControl>
          </div>
          <div className="flex flex-row">
            <FormControl
              className={["flex", "flex-1", classes.formControl].join(" ")}
            >
              <TextField
                type="password"
                label={locale.confirmPassword}
                name="newPasswordConfirm"
                value={this.state.newPasswordConfirm}
                onChange={this.handleChange}
                onBlur={this.validateConfirmPassword}
                error={this.state.newPasswordConfirmError}
                helperText={
                  this.state.newPasswordConfirmError
                    ? "Password is not valid"
                    : ""
                }
              />
            </FormControl>
          </div>

          <div className="flex flex-row">
            <FormControl
              className={["flex", "flex-1", classes.formControl].join(" ")}
            >
              <Button
                variant="contained"
                color="primary"
                disabled={!this.canBeSubmitted()}
                onClick={this.updatePassword}
              >
                {locale.updatePasswordBtn}
              </Button>
            </FormControl>
          </div>
          <div className="flex flex-row">
            <FormControl
              className={["flex", "flex-1", classes.formControl].join(" ")}
            >
              <ColorButton
                className={classes.danger}
                onClick={() => this.showDeleteModal()}
              >
                {locale.deleteAccBtn}
              </ColorButton>
            </FormControl>
          </div>
        </div>
      </Paper>
    );
  }
}
function mapStateToProps({ custom }) {
  return {
    modalLocale: custom.locale.deleteModal
  };
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    ...bindActionCreators(
      {
        deleteUserAccount: deleteAccount,
        updateUserPassword: updatePassword
      },
      dispatch
    )
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles, { withTheme: true })(AccountInfo));
