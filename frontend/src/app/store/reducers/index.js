import { combineReducers } from "redux";
import fuse from "./fuse";
import custom from "./custom";
import quickPanel from "app/fuse-layouts/shared-components/quickPanel/store/reducers";

const createReducer = asyncReducers =>
  combineReducers({
    fuse,
    custom,
    quickPanel,
    ...asyncReducers
  });

export default createReducer;
