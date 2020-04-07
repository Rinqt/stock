import React, { Component } from "react";
import {
  withStyles,
  Card,
  CardContent,
  Icon,
  TextField,
  Typography,
  Button,
  CircularProgress
} from "@material-ui/core";
import { darken } from "@material-ui/core/styles/colorManipulator";
import { FuseAnimate } from "@fuse";
import classNames from "classnames";
import { Link } from "react-router-dom";
import _ from "@lodash";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import confirmActions from "../../../api/emailconfirm.api.js";
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

class MailConfirmPage extends Component {
  state = {
    confirmationCode: "",
    confirmationCodeError: false
  };

  constructor(props) {
    super(props);
    this.validator = new Validator();
  }

  /**
   * check if the form can be submitted
   */
  canBeSubmitted() {
    const { confirmationCode } = this.state;
    return this.validator.confirmationCodeValidator(confirmationCode);
  }

  handleChange = event => {
    this.setState(
      _.set({ ...this.state }, event.target.name, event.target.value)
    );
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
    const { classes, locale, confirm, loading } = this.props;
    const { confirmationCode } = this.state;
    const { username, email } = this.props.match.params;

    return (
      <div
        className={classNames(
          classes.root,
          "flex flex-col flex-auto flex-no-shrink items-center justify-center p-32"
        )}
      >
        <div className="flex flex-col items-center justify-center w-full">
          <form
            onSubmit={event => {
              event.preventDefault();
              confirm(username, this.state.confirmationCode);
            }}
          >
            <FuseAnimate animation="transition.expandIn">
              <Card className="w-full max-w-384">
                <CardContent className="flex flex-col items-center justify-center p-32">
                  <div className="m-32">
                    <Icon className="text-96" color="action">
                      email
                    </Icon>
                  </div>

                  <Typography variant="h5" className="text-center mb-16">
                    {locale.confirmAddress}
                  </Typography>

                  <Typography
                    className="text-center mb-16 w-full"
                    color="textSecondary"
                  >
                    {locale.confirmationSent} <b>{email}</b>.
                  </Typography>

                  <TextField
                    className="mb-16"
                    label={locale.confirmationCode}
                    autoFocus
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
                    aria-label="Confirm"
                    type="submit"
                    disabled={!this.canBeSubmitted()}
                  >
                    {locale.confirm} {loading && <CircularProgress size={20} />}
                  </Button>

                  <div className="flex flex-col items-center justify-center pt-32 pb-24">
                    <Link className="font-medium" to="/auth/login">
                      {locale.backToLogin}
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </FuseAnimate>
          </form>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ custom }) {
  return {
    loading: custom.confirm.loading,
    locale: custom.locale.confirmPage,
    isLoggedin: custom.login.isLoggedin
  };
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      confirm: confirmActions,
      checkLoggedin: checkLoggedin
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles, { withTheme: true })(MailConfirmPage));
