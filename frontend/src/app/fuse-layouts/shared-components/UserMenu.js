import React, { Component } from "react";
import {
  Avatar,
  Button,
  Icon,
  ListItemIcon,
  ListItemText,
  Popover,
  MenuItem,
  Typography
} from "@material-ui/core";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Link } from "react-router-dom";
import { logout } from "../../api/login.api";

class UserMenu extends Component {
  state = {
    userMenu: null,
    avatar: "",
    name: ""
  };

  userMenuClick = event => {
    this.setState({ userMenu: event.currentTarget });
  };

  userMenuClose = () => {
    this.setState({ userMenu: null });
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
    const { logout, locale } = this.props;

    const { userMenu, name, avatar } = this.state;

    return (
      <React.Fragment>
        <Button className="h-64" onClick={this.userMenuClick}>
          <Avatar className="">{avatar}</Avatar>

          <div className="hidden md:flex flex-col ml-12 items-start">
            <Typography component="span" className="normal-case font-600 flex">
              {name}
            </Typography>
          </div>

          <Icon className="text-16 ml-12 hidden sm:flex" variant="action">
            keyboard_arrow_down
          </Icon>
        </Button>

        <Popover
          open={Boolean(userMenu)}
          anchorEl={userMenu}
          onClose={this.userMenuClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center"
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center"
          }}
          classes={{
            paper: "py-8"
          }}
        >
          <React.Fragment>
            <MenuItem
              component={Link}
              to="/profile"
              onClick={this.userMenuClose}
            >
              <ListItemIcon>
                <Icon>account_circle</Icon>
              </ListItemIcon>
              <ListItemText className="pl-0" primary={locale.myProfile} />
            </MenuItem>
            <MenuItem
              onClick={() => {
                logout();
                this.userMenuClose();
              }}
            >
              <ListItemIcon>
                <Icon>exit_to_app</Icon>
              </ListItemIcon>
              <ListItemText className="pl-0" primary={locale.logout} />
            </MenuItem>
          </React.Fragment>
        </Popover>
      </React.Fragment>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      logout: logout
    },
    dispatch
  );
}

function mapStateToProps({ custom }) {
  return {
    user: custom.user.info,
    locale: custom.locale.userMenu
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserMenu);
