import React, { Component } from "react";
import {
  Button,
  Icon,
  ListItemText,
  Popover,
  MenuItem,
  Typography
} from "@material-ui/core";
import { connect } from "react-redux";
import * as customActions from "../../store/actions/custom";
import { bindActionCreators } from "redux";
import { updateSettings } from "../../api/user.api";
class LocaleMenu extends Component {
  state = {
    langMenu: null
  };

  langMenuClick = event => {
    this.setState({ langMenu: event.currentTarget });
  };

  langMenuClose = () => {
    this.setState({ langMenu: null });
  };
  handleLangChange = ln => {
    const {
      updateUserSettings,
      changeLanguage,
      userSettings,
      isLoggedin
    } = this.props;
    changeLanguage(ln);
    if (isLoggedin) {
      updateUserSettings(userSettings.favoriteCompanies, ln);
    }
  };

  componentDidUpdate(prevProps) {
    const { userSettings, changeLanguage } = this.props;
    if (
      prevProps.userSettings !== userSettings &&
      Object.keys(userSettings).length
    ) {
      changeLanguage(userSettings.language);
    }
  }
  render() {
    const { langMenu } = this.state;
    const { locale, localeList } = this.props;
    return (
      <React.Fragment>
        <Button className="h-64" onClick={this.langMenuClick}>
          <Icon
            className="text-32 ml-12 hidden sm:flex"
            variant="action"
            fontSize="default"
          >
            language
          </Icon>
          <div className="hidden md:flex flex-col ml-12 items-start">
            <Typography component="span" className="normal-case font-600 flex">
              {locale.language}
            </Typography>
          </div>

          <Icon className="text-16 ml-12 hidden sm:flex" variant="action">
            keyboard_arrow_down
          </Icon>
        </Button>

        <Popover
          open={Boolean(langMenu)}
          anchorEl={langMenu}
          onClose={this.langMenuClose}
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
            {localeList.map(el => {
              return (
                <MenuItem
                  key={el}
                  onClick={() => {
                    this.handleLangChange(el);
                    this.langMenuClose();
                  }}
                >
                  <ListItemText className="pl-0" primary={locale[el]} />
                </MenuItem>
              );
            })}
          </React.Fragment>
        </Popover>
      </React.Fragment>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      changeLanguage: customActions.localeChange,
      updateUserSettings: updateSettings
    },
    dispatch
  );
}

function mapStateToProps({ custom }) {
  return {
    locale: custom.locale.languages,
    localeList: custom.locale.localesCodes,
    userSettings: custom.user.settings,
    isLoggedin: custom.login.isLoggedin
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LocaleMenu);
