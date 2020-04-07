import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Typography, Paper, TextField } from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { updateInfo } from "../../../api/user.api";
import _ from "@lodash";

const styles = theme => ({
  layoutRoot: {},
  formControl: {
    marginTop: "1.8rem"
  }
});

class ContactInfo extends Component {
  state = {
    username: "",
    firstName: "",
    lastName: ""
  };
  componentDidMount() {
    const { userInfo } = this.props;
    this.setState({
      ...userInfo
    });
  }
  componentDidUpdate(prevProps) {
    const { userInfo } = this.props;
    if (prevProps.userInfo !== userInfo) {
      this.setState({
        ...userInfo
      });
    }
  }
  handleChange = $event => {
    this.setState(
      _.set({ ...this.state }, $event.target.name, $event.target.value)
    );
  };
  /**
   * trigger user information update
   */
  update = () => {
    const { updateUserInfo } = this.props;
    updateUserInfo(this.state);
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
                label={locale.username}
                disabled={true}
                value={this.state.username || ""}
              />
            </FormControl>
          </div>
          <div className="flex flex-row">
            <FormControl
              className={["flex", "flex-1", classes.formControl].join(" ")}
            >
              <TextField
                label={locale.firstName}
                name="firstName"
                value={this.state.firstName || ""}
                onChange={this.handleChange}
              />
            </FormControl>
          </div>
          <div className="flex flex-row">
            <FormControl
              className={["flex", "flex-1", classes.formControl].join(" ")}
            >
              <TextField
                label={locale.lastName}
                name="lastName"
                value={this.state.lastName || ""}
                onChange={this.handleChange}
              />
            </FormControl>
          </div>

          <div className="flex flex-row">
            <FormControl
              className={["flex", "flex-1", classes.formControl].join(" ")}
            >
              <Button
                variant="contained"
                color="secondary"
                onClick={this.update}
              >
                {locale.updateBtn}
              </Button>
            </FormControl>
          </div>
        </div>
      </Paper>
    );
  }
}
function mapStateToProps({ custom }) {
  return {
    userInfo: custom.user.info
  };
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      updateUserInfo: updateInfo
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles, { withTheme: true })(ContactInfo));
