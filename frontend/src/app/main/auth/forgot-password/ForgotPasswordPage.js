import React, { Component } from "react";
import {
  withStyles,
  Button,
  Card,
  CardContent,
  TextField,
  Typography
} from "@material-ui/core";
import { FuseAnimate } from "@fuse";
import classNames from "classnames";
import { Link } from "react-router-dom";
import _ from "@lodash";
import { darken } from "@material-ui/core/styles/colorManipulator";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import forgotActions from "../../../api/forgotpassword.api";
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

class ForgotPasswordPage extends Component {
  state = {
    username: "",
    usernameError: false
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
    const { username } = this.state;
    return this.validator.usernameValidator(username) && username.length > 0;
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
    const { classes, forgot, locale } = this.props;
    const { username } = this.state;

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
                  {locale.recovertTitle}
                </Typography>

                <form
                  name="recoverForm"
                  noValidate
                  className="flex flex-col justify-center w-full"
                  onSubmit={event => {
                    event.preventDefault();
                    forgot(this.state.username);
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

                  <Button
                    variant="contained"
                    color="primary"
                    className="w-224 mx-auto mt-16"
                    aria-label="Reset"
                    disabled={!this.canBeSubmitted()}
                    type="submit"
                  >
                    {locale.sendCode}
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
    loading: custom.forgot.loading,
    locale: custom.locale.forgotPassword,
    isLoggedin: custom.login.isLoggedin
  };
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      forgot: forgotActions,
      checkLoggedin: checkLoggedin
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles, { withTheme: true })(ForgotPasswordPage));
