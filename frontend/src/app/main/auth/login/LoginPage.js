import React, { Component } from "react";
import {
  withStyles,
  Button,
  Card,
  CardContent,
  Divider,
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
import Validator from "../../../ValidationService.js";
import history from "history.js";
import * as loginActions from "../../../api/login.api.js";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
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

class LoginPage extends Component {
  state = {
    username: "",
    password: "",
    usernameError: false,
    passwordError: false
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
   * check if entered password is valid
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
   * check if the form can be submitted
   */
  canBeSubmitted() {
    const { usernameError, passwordError, username, password } = this.state;
    return (
      !(usernameError && passwordError) &&
      username.length > 5 &&
      password.length > 7
    );
  }

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
    const { classes, login, locale } = this.props;
    const { username, password } = this.state;
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
                  name="loginForm"
                  noValidate
                  className="flex flex-col justify-center w-full"
                  onSubmit={event => {
                    event.preventDefault();
                    login(this.state.username, this.state.password);
                  }}
                >
                  <div className="helper">
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
                      variant="outlined"
                      required
                      fullWidth
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

                  <div className="flex items-center justify-between">
                    <Link className="font-medium" to="/auth/forgot-password">
                      {locale.forgotPassword}
                    </Link>
                  </div>

                  <Button
                    variant="contained"
                    color="primary"
                    className="w-224 mx-auto mt-16"
                    aria-label="LOG IN"
                    disabled={!this.canBeSubmitted()}
                    type="submit"
                  >
                    {locale.login}
                  </Button>
                </form>

                <div className="my-24 flex items-center justify-center">
                  <Divider className="w-32" />
                  <span className="mx-8 font-bold">{locale.or}</span>
                  <Divider className="w-32" />
                </div>

                <div className="flex flex-col items-center justify-center pt-32 pb-24">
                  <span className="font-medium">{locale.noAccount}</span>
                  <Link className="font-medium" to="/auth/register">
                    {locale.register}
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
    userInfo: custom.login.userInfo,
    errorMessage: custom.login.error,
    loading: custom.login.loading,
    isLoggedin: custom.login.isLoggedin,
    locale: custom.locale.loginPage
  };
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      login: loginActions.login,
      checkLoggedin: loginActions.checkLoggedin
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles, { withTheme: true })(LoginPage));
