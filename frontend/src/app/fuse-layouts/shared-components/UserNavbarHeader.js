import React, { Component } from "react";
import { AppBar, Avatar, Typography, withStyles } from "@material-ui/core";
import connect from "react-redux/es/connect/connect";
// import classNames from 'classnames';

const styles = theme => ({
  root: {
    "& .user": {
      "& .username, & .email": {
        transition: theme.transitions.create("opacity", {
          duration: theme.transitions.duration.shortest,
          easing: theme.transitions.easing.easeInOut
        })
      }
    }
  },
  avatar: {
    width: 72,
    height: 72,
    position: "absolute",
    top: 92,
    padding: 8,
    background: theme.palette.background.default,
    boxSizing: "content-box",
    left: "50%",
    transform: "translateX(-50%)",
    "& > img": {
      borderRadius: "50%"
    }
  }
});

class UserNavbarHeader extends Component {
  state = {
    userMenu: null,
    avatar: "",
    name: ""
  };
  componentDidUpdate(prevProps) {
    const { user } = this.props;
    const username = localStorage.getItem("username");

    if (prevProps.user !== user && Object.keys(user).length) {
      if (user.firstName && user.lastName) {
        this.setState({
          name: user.firstName + " " + user.lastName,
          avatar:
            user.firstName[0].toUpperCase() + user.lastName[0].toUpperCase()
        });
      } else {
        this.setState({
          name: username,
          avatar: username[0].toUpperCase()
        });
      }
    }
  }
  render() {
    const { classes, isLoggedin } = this.props;
    return (
      isLoggedin && (
        <AppBar
          position="static"
          color="primary"
          elevation={0}
          classes={{ root: classes.root }}
          className="user relative flex flex-col items-center justify-center pt-24 pb-64 mb-32 z-0"
        >
          <Typography
            className="username text-16 whitespace-no-wrap"
            color="inherit"
          >
            {this.state.name}
          </Typography>
          <Avatar className="">{this.state.avatar}</Avatar>
        </AppBar>
      )
    );
  }
}

function mapStateToProps({ custom }) {
  return {
    user: custom.user.info,
    isLoggedin: custom.login.isLoggedin
  };
}

export default withStyles(styles, { withTheme: true })(
  connect(mapStateToProps)(UserNavbarHeader)
);
