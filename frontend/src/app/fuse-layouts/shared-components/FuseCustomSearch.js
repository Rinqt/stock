import React, { Component } from "react";
import {
  withStyles,
  Popper,
  ClickAwayListener,
  MenuItem,
  Icon,
  IconButton,
  ListItemIcon,
  ListItemText,
  Paper,
  TextField,
  Tooltip,
  Typography
} from "@material-ui/core";
import { connect } from "react-redux";
import classNames from "classnames";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import { withRouter } from "react-router-dom";
import deburr from "lodash/deburr";
import Autosuggest from "react-autosuggest";
import { bindActionCreators } from "redux";
import { getCompanies } from "../../api/companies.api";
import { updateHistory } from "../../api/history.api";

const propTypes = {};

const defaultProps = {
  trigger: (
    <IconButton className="w-64 h-64">
      <Icon>search</Icon>
    </IconButton>
  ),
  variant: "full" // basic, full
};

function renderInputComponent(inputProps) {
  const { variant, classes, inputRef = () => {}, ref, ...other } = inputProps;
  return (
    <div className="w-full relative">
      {variant === "basic" ? (
        // Outlined
        <React.Fragment>
          <TextField
            fullWidth
            InputProps={{
              inputRef: node => {
                ref(node);
                inputRef(node);
              },
              classes: {
                input: classNames(classes.input, "py-0 px-16 h-48 pr-48"),
                notchedOutline: "rounded-8"
              }
            }}
            variant="outlined"
            {...other}
          />
          <Icon
            className="absolute pin-t pin-r h-48 w-48 p-12 pointer-events-none"
            color="action"
          >
            search
          </Icon>
        </React.Fragment>
      ) : (
        // Standard
        <TextField
          fullWidth
          InputProps={{
            disableUnderline: true,
            inputRef: node => {
              ref(node);
              inputRef(node);
            },
            classes: {
              input: classNames(classes.input, "py-0 px-16 h-64")
            }
          }}
          variant="standard"
          {...other}
        />
      )}
    </div>
  );
}

function renderSuggestion(suggestion, { query, isHighlighted }) {
  const matches = match(suggestion.name, query);
  const parts = parse(suggestion.name, matches);

  return (
    <MenuItem selected={isHighlighted} component="div">
      <ListItemIcon>
        {suggestion.icon ? (
          <Icon>{suggestion.icon}</Icon>
        ) : (
          <span className="text-20 w-24 font-bold uppercase text-center">
            {suggestion.name[0]}
          </span>
        )}
      </ListItemIcon>
      <ListItemText
        className="pl-0"
        primary={parts.map((part, index) => {
          return part.highlight ? (
            <span key={String(index)} style={{ fontWeight: 600 }}>
              {part.text}
            </span>
          ) : (
            <strong key={String(index)} style={{ fontWeight: 300 }}>
              {part.text}
            </strong>
          );
        })}
      />
    </MenuItem>
  );
}

function getSuggestions(value, data) {
  const inputValue = deburr(value.trim()).toLowerCase();
  const inputLength = inputValue.length;
  let count = 0;
  return inputLength === 0
    ? []
    : data.filter(suggestion => {
        const keep =
          count < 10 &&
          (match(suggestion.name, inputValue).length > 0 ||
            match(suggestion.symbol, inputValue).length > 0);

        if (keep) {
          count += 1;
        }

        return keep;
      });
}

function getSuggestionValue(suggestion) {
  return suggestion.symbol;
}

const styles = theme => ({
  root: {},
  container: {
    position: "relative"
  },
  suggestionsContainerOpen: {
    position: "absolute",
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0
  },
  suggestion: {
    display: "block"
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: "none"
  },
  input: {
    transition: theme.transitions.create(["background-color"], {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.short
    }),
    "&:focus": {
      backgroundColor: theme.palette.background.paper
    }
  }
});

class FuseCustomSearch extends Component {
  state = {
    search: false,
    popper: "",
    companiesList: [],
    suggestions: [],
    noSuggestions: false
  };

  componentDidUpdate(prevProps, prevState) {
    const { companies } = this.props;
    if (prevState.companiesList.length === 0 && companies.length > 0) {
      this.setState({
        companiesList: [...companies]
      });
    }
  }

  componentDidMount() {
    const { getCompanies } = this.props;
    getCompanies();
  }

  showSearch = () => {
    this.setState({ search: true });
    document.addEventListener("keydown", this.escFunction, false);
  };

  hideSearch = () => {
    this.setState({
      search: false,
      popper: ""
    });
    document.removeEventListener("keydown", this.escFunction, false);
  };

  escFunction = event => {
    if (event.keyCode === 27) {
      this.hideSearch();
    }
  };

  handleSuggestionsFetchRequested = ({ value }) => {
    const suggestions = getSuggestions(value, this.state.companiesList);
    const isInputBlank = value.trim() === "";
    const noSuggestions = !isInputBlank && suggestions.length === 0;

    this.setState({
      suggestions,
      noSuggestions
    });
  };

  handleSuggestionSelected = (event, { suggestion }) => {
    event.preventDefault();
    event.stopPropagation();
    const { updateHistory, isLoggedin } = this.props;
    if (isLoggedin) {
      updateHistory(suggestion);
    }
    this.props.history.push("/app/company/" + suggestion.symbol);
    this.hideSearch();
  };

  handleSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
      noSuggestions: false
    });
  };

  handleChange = name => (event, { newValue }) => {
    this.setState({
      [name]: newValue
    });
  };

  handleClickAway = event => {
    return (
      (!this.suggestionsNode || !this.suggestionsNode.contains(event.target)) &&
      this.hideSearch()
    );
  };

  handleRef = domNode => {
    this.popperNode = domNode;
  };

  handleSuggestionsRef = domNode => {
    this.suggestionsNode = domNode;
  };

  render() {
    const { classes, className, locale } = this.props;
    const autosuggestProps = {
      renderInputComponent,
      highlightFirstSuggestion: true,
      suggestions: this.state.suggestions,
      onSuggestionsFetchRequested: this.handleSuggestionsFetchRequested,
      onSuggestionsClearRequested: this.handleSuggestionsClearRequested,
      onSuggestionSelected: this.handleSuggestionSelected,
      getSuggestionValue,
      renderSuggestion
    };

    return (
      <div className={classNames(classes.root, "flex", className)}>
        <Tooltip title={locale.title} placement="bottom">
          <div onClick={this.showSearch}>{this.props.trigger}</div>
        </Tooltip>

        {this.state.search && (
          <ClickAwayListener onClickAway={this.handleClickAway}>
            <Paper
              ref={node => (this.paper = node)}
              className="absolute pin-l pin-r h-full z-9999"
              square={true}
            >
              <div className="flex items-center w-full" ref={this.handleRef}>
                <Autosuggest
                  {...autosuggestProps}
                  inputProps={{
                    classes,
                    placeholder: locale.title,
                    value: this.state.popper,
                    onChange: this.handleChange("popper"),
                    InputLabelProps: {
                      shrink: true
                    },
                    autoFocus: true
                  }}
                  theme={{
                    container: "flex flex-1 w-full",
                    suggestionsList: classes.suggestionsList,
                    suggestion: classes.suggestion
                  }}
                  renderSuggestionsContainer={options => (
                    <Popper
                      anchorEl={this.popperNode}
                      open={
                        Boolean(options.children) || this.state.noSuggestions
                      }
                      popperOptions={{ positionFixed: true }}
                      className="z-9999"
                    >
                      <div ref={this.handleSuggestionsRef}>
                        <Paper
                          elevation={1}
                          square
                          {...options.containerProps}
                          style={{
                            width: this.popperNode
                              ? this.popperNode.clientWidth
                              : null
                          }}
                        >
                          {options.children}
                          {this.state.noSuggestions && (
                            <Typography className="px-16 py-12">
                              {locale.noResults}
                            </Typography>
                          )}
                        </Paper>
                      </div>
                    </Popper>
                  )}
                />
                <IconButton onClick={this.hideSearch} className="mx-8">
                  <Icon>close</Icon>
                </IconButton>
              </div>
            </Paper>
          </ClickAwayListener>
        )}
      </div>
    );
  }
}

function mapStateToProps({ custom }) {
  return {
    companies: custom.companies.list,
    isLoggedin: custom.login.isLoggedin,
    locale: custom.locale.search
  };
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getCompanies: getCompanies,
      updateHistory: updateHistory
    },
    dispatch
  );

FuseCustomSearch.propTypes = propTypes;
FuseCustomSearch.defaultProps = defaultProps;

export default withStyles(styles)(
  withRouter(connect(mapStateToProps, mapDispatchToProps)(FuseCustomSearch))
);
