import React, { Component } from "react";
import {
  withStyles,
  Button,
  Card,
  CardContent,
  TextField,
  Typography
} from "@material-ui/core";
import { darken } from "@material-ui/core/styles/colorManipulator";
import { FuseAnimate } from "@fuse";
import classNames from "classnames";
import { Link } from "react-router-dom";
import _ from "@lodash";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import resetActions from "../../../api/resetpassword.api";
import Validator from "../../../ValidationService.js";

import history from "history.js";
import { checkLoggedin } from "../../../api/login.api.js";
import * as Sentry from "@sentry/browser";

const styles = theme => ({
  root: {
    background:
      "radial-gradient(" +
      darken(theme.palette.primary.dark, 0.5) +
      " 0%, " +
      theme.palette.primary.dark +
      " 80%)",
    color: theme.palette.primary.contrastText
  }
});

class ResetPasswordPage extends Component {
  state = {
    username: "",
    password: "",
    passwordConfirm: "",
    confirmationCode: "",
    usernameError: false,
    passwordError: false,
    confirmPasswordError: false,
    confirmationCodeError: false
  };

  constructor(props) {
    super(props);
    this.validator = new Validator();
  }

  handleChange = event => {
    this.setState(
      _.set(
        { ...this.state },
        event.target.name,
        event.target.type === "checkbox"
          ? event.target.checked
          : event.target.value
      )
    );
  };

  /**
   * check if the form can be submitted
   */
  canBeSubmitted() {
    const {
      usernameError,
      passwordError,
      confirmPasswordError,
      confirmationCodeError,
      username,
      password,
      passwordConfirm
    } = this.state;

    return (
      !(
        usernameError &&
        passwordError &&
        confirmPasswordError &&
        confirmationCodeError
      ) &&
      username.length > 0 &&
      password.length > 0 &&
      passwordConfirm.length > 0
    );
  }

  /**
   * check if the user name is valid
   */
  validateUsername = () => {
    const { username } = this.state;

    if (this.validator.usernameValidator(username)) {
      this.setState({ usernameError: false });
    } else {
      this.setState({ usernameError: true });
    }
  };

  /**
   * check if the password is valid
   */
  validatePassword = () => {
    const { password } = this.state;

    if (this.validator.passwordValidator(password)) {
      this.setState({ passwordError: false });
    } else {
      this.setState({ passwordError: true });
    }
  };

  /**
   * check if the password confirmation is valid
   */
  validateConfirmPassword = () => {
    const { password, passwordConfirm } = this.state;

    if (this.validator.stringMatchValidator(password, passwordConfirm)) {
      this.setState({ confirmPasswordError: false });
    } else {
      this.setState({ confirmPasswordError: true });
    }
  };

  /**
   * check if entered code is valid
   */
  validateConfirmationCode = () => {
    const { confirmationCode } = this.state;

    if (this.validator.confirmationCodeValidator(confirmationCode)) {
      this.setState({ confirmationCodeError: false });
    } else {
      this.setState({ confirmationCodeError: true });
    }
  };

  componentDidUpdate(prevProps) {
    const { isLoggedin } = this.props;
    // guard
    //check if the user is not logged in then redirect to the dashboard page
    if (isLoggedin) {
      history.push("/app/dashboard");
    }
  }

  componentWillMount() {
    const { checkLoggedin } = this.props;

    // confirm if the user is logged in before entering the page
    checkLoggedin();
  }

  // error log
  componentDidCatch(error, errorInfo) {
    Sentry.withScope(scope => {
      scope.setExtras(errorInfo);
      Sentry.captureException(error);
    });
  }

  render() {
    const { classes, reset, locale } = this.props;
    const {
      username,
      password,
      passwordConfirm,
      confirmationCode
    } = this.state;

    return (
      <div
        className={classNames(
          classes.root,
          "flex flex-col flex-auto flex-no-shrink items-center justify-center p-32"
        )}
      >
        <div className="flex flex-col items-center justify-center w-full">
          <FuseAnimate animation="transition.expandIn">
            <Card className="w-full max-w-384">
              <CardContent className="flex flex-col items-center justify-center p-32">
                <Typography variant="h6" className="mt-16 mb-32">
                  {locale.title}
                </Typography>

                <form
                  name="resetForm"
                  noValidate
                  className="flex flex-col justify-center w-full"
                  onSubmit={event => {
                    event.preventDefault();
                    reset(
                      this.state.username,
                      this.state.password,
                      this.state.confirmationCode
                    );
                  }}
                >
                  <TextField
                    className="mb-16"
                    label={locale.username}
                    autoFocus
                    type="text"
                    name="username"
                    value={username}
                    onChange={this.handleChange}
                    onBlur={this.validateUsername}
                    error={this.state.usernameError}
                    helperText={
                      this.state.usernameError ? locale.invalidUsername : ""
                    }
                    variant="outlined"
                    required
                    fullWidth
                  />

                  <TextField
                    className="mb-16"
                    label={locale.password}
                    type="password"
                    name="password"
                    value={password}
                    onChange={this.handleChange}
                    onBlur={this.validatePassword}
                    error={this.state.passwordError}
                    helperText={
                      this.state.passwordError ? locale.invalidPassword : ""
                    }
                    variant="outlined"
                    required
                    fullWidth
                  />

                  <TextField
                    className="mb-16"
                    label={locale.confirmPassword}
                    type="password"
                    name="passwordConfirm"
                    value={passwordConfirm}
                    onChange={this.handleChange}
                    onBlur={this.validateConfirmPassword}
                    error={this.state.confirmPasswordError}
                    helperText={
                      this.state.confirmPasswordError
                        ? locale.passwordNoMatch
                        : ""
                    }
                    variant="outlined"
                    required
                    fullWidth
                  />
                  <TextField
                    className="mb-16"
                    label={locale.confirmationCode}
                    type="text"
                    name="confirmationCode"
                    value={confirmationCode}
                    onChange={this.handleChange}
                    onBlur={this.validateConfirmationCode}
                    error={this.state.confirmationCodeError}
                    helperText={
                      this.state.confirmationCodeError
                        ? locale.invalidConfirmationCode
                        : ""
                    }
                    variant="outlined"
                    required
                    fullWidth
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    className="w-224 mx-auto mt-16"
                    aria-label="Reset"
                    disabled={!this.canBeSubmitted()}
                    type="submit"
                  >
                    {locale.resetButton}
                  </Button>
                </form>

                <div className="flex flex-col items-center justify-center pt-32 pb-24">
                  <Link className="font-medium" to="/auth/login">
                    {locale.backToLogin}
                  </Link>
                </div>
              </CardContent>
            </Card>
          </FuseAnimate>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ custom }) {
  return {
    loading: custom.reset.loading,
    locale: custom.locale.resetPassword,
    isLoggedin: custom.login.isLoggedin
  };
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      reset: resetActions,
      checkLoggedin: checkLoggedin
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles, { withTheme: true })(ResetPasswordPage));
