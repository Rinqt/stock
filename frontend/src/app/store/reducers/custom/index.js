import { combineReducers } from "redux";
import locale from "./locale.reducer";
import login from "./login.reducer";
import register from "./register.reducer";
import confirm from "./confirm.reducer";
import forgot from "./forgot.reducer";
import reset from "./reset.reducer";
import articles from "./articles.reducer";
import stocks from "./stocks.reducer";
import companies from "./companies.reducer";
import history from "./history.reducer";
import user from "./user.reducers";
import models from "./models.reducer";

const customReducers = combineReducers({
  locale,
  login,
  register,
  confirm,
  forgot,
  reset,
  articles,
  stocks,
  companies,
  history,
  user,
  models
});

export default customReducers;
