import React, { Component } from "react";
import {
  withStyles,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Tooltip
} from "@material-ui/core";
import { darken } from "@material-ui/core/styles/colorManipulator";
import HelpIcon from "@material-ui/icons/Help";
import { FuseAnimate } from "@fuse";
import classNames from "classnames";
import { Link } from "react-router-dom";
import _ from "@lodash";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import registerActions from "../../../api/register.api.js";
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
    color: theme.palette.primary.dark
  }
});

class RegisterPage extends Component {
  state = {
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
    openSnack: false,
    usernameError: false,
    emailError: false,
    passwordError: false,
    confirmPasswordError: false
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
      emailError,
      confirmPasswordError,
      username,
      password,
      email,
      passwordConfirm
    } = this.state;
    return (
      !(usernameError && passwordError && emailError && confirmPasswordError) &&
      username.length > 5 &&
      password.length > 7 &&
      email.length > 0 &&
      passwordConfirm.length > 7
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
   * check if the user email is valid
   */
  validateEmail = () => {
    const { email } = this.state;

    if (this.validator.emailValidator(email)) {
      this.setState({ emailError: false });
    } else {
      this.setState({ emailError: true });
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

  handleClose = () => {
    this.setState({ openSnack: false });
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
    const { classes, locale, register } = this.props;
    const { username, email, password, passwordConfirm } = this.state;

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
                  name="registerForm"
                  noValidate
                  className="flex flex-col justify-center w-full"
                  onSubmit={event => {
                    event.preventDefault();
                    register(
                      this.state.username,
                      this.state.email,
                      this.state.password,
                      this.state.passwordConfirm
                    );
                  }}
                >
                  <div className="helper">
                    <TextField
                      className="mb-16"
                      label={locale.username}
                      autoFocus
                      type="username"
                      name="username"
                      value={username}
                      onChange={this.handleChange}
                      onBlur={this.validateUsername}
                      error={this.state.usernameError}
                      helperText={
                        this.state.usernameError ? locale.invalidUsername : ""
                      }
                      fullWidth
                      variant="outlined"
                      required
                    />
                    <div className="helper-icon">
                      <Tooltip
                        title={
                          <React.Fragment>
                            <Typography color="inherit">
                              {locale.hints.username.h1}
                            </Typography>
                            <ul className="helper-text">
                              <li>{locale.hints.username.h2}</li>
                              <li>{locale.hints.username.h3}</li>
                              <li>{locale.hints.username.h4}</li>
                              <li>{locale.hints.username.h5}</li>
                            </ul>
                          </React.Fragment>
                        }
                      >
                        <HelpIcon />
                      </Tooltip>
                    </div>
                  </div>
                  <TextField
                    className="mb-16"
                    label={locale.email}
                    type="email"
                    name="email"
                    value={email}
                    onChange={this.handleChange}
                    onBlur={this.validateEmail}
                    error={this.state.emailError}
                    helperText={
                      this.state.emailError ? locale.invalidEmail : ""
                    }
                    fullWidth
                    variant="outlined"
                    required
                  />
                  <div className="helper">
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
                      fullWidth
                      variant="outlined"
                      required
                    />
                    <div className="helper-icon">
                      <Tooltip
                        title={
                          <React.Fragment>
                            <Typography color="inherit">
                              {locale.hints.password.h1}
                            </Typography>
                            <ul className="helper-text">
                              <li>{locale.hints.password.h2}</li>
                              <li>{locale.hints.password.h3}</li>
                              <li>{locale.hints.password.h4}</li>
                              <li>{locale.hints.password.h5}</li>
                            </ul>
                          </React.Fragment>
                        }
                      >
                        <HelpIcon />
                      </Tooltip>
                    </div>
                  </div>
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

                  <Button
                    variant="contained"
                    color="primary"
                    className="w-224 mx-auto mt-16"
                    aria-label="Register"
                    disabled={!this.canBeSubmitted()}
                    type="submit"
                  >
                    {locale.createAccount}
                  </Button>
                </form>

                <div className="flex flex-col items-center justify-center pt-32 pb-24">
                  <span className="font-medium"> {locale.haveAccount}</span>
                  <Link className="font-medium" to="/auth/login">
                    {locale.login}
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
    loading: custom.register.loading,
    locale: custom.locale.registerPage,
    isLoggedin: custom.login.isLoggedin
  };
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      register: registerActions,
      checkLoggedin: checkLoggedin
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles, { withTheme: true })(RegisterPage));
