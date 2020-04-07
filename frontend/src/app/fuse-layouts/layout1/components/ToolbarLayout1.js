import React from "react";
import {
  AppBar,
  Hidden,
  MuiThemeProvider,
  Toolbar,
  withStyles
} from "@material-ui/core";
import FuseCustomSearch from "../../shared-components/FuseCustomSearch";
import connect from "react-redux/es/connect/connect";
import { withRouter } from "react-router-dom";
import NavbarMobileToggleButton from "app/fuse-layouts/shared-components/NavbarMobileToggleButton";
import UserMenu from "app/fuse-layouts/shared-components/UserMenu";
import LocaleMenu from "app/fuse-layouts/shared-components/LocaleMenu";
const styles = theme => ({
  separator: {
    width: 1,
    height: 64,
    backgroundColor: theme.palette.divider
  }
});

const ToolbarLayout1 = ({ classes, settings, toolbarTheme, isLoggedin }) => {
  return (
    <MuiThemeProvider theme={toolbarTheme}>
      <AppBar id="fuse-toolbar" className="flex relative z-10" color="default">
        <Toolbar className="p-0">
          <Hidden lgUp>
            <NavbarMobileToggleButton className="w-64 h-64 p-0" />
            <div className={classes.separator} />
          </Hidden>
          <div className="flex flex-1"></div>
          <div className="flex">
            <FuseCustomSearch />
            <div className={classes.separator} />
            {isLoggedin ? <UserMenu /> : ""}

            <div className={classes.separator} />
            <LocaleMenu />
          </div>
        </Toolbar>
      </AppBar>
    </MuiThemeProvider>
  );
};

function mapStateToProps({ fuse, custom }) {
  return {
    settings: fuse.settings.current,
    toolbarTheme: fuse.settings.toolbarTheme,
    isLoggedin: custom.login.isLoggedin
  };
}

export default withStyles(styles, { withTheme: true })(
  withRouter(connect(mapStateToProps)(ToolbarLayout1))
);
