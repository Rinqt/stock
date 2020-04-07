import * as Actions from "app/store/actions/custom";

const initialState = {
  info: {},
  settings: {},
  updateLoading: false
};

const handle = function(state = initialState, action) {
  switch (action.type) {
    case Actions.USER_INFO: {
      return {
        ...state,
        info: { ...action.info }
      };
    }
    case Actions.USER_SETTINGS: {
      return {
        ...state,
        settings: { ...action.settings }
      };
    }
    case Actions.USER_SETTINGS_UPDATE: {
      return {
        ...state,
        updateLoading: action.loading
      };
    }
    default: {
      return state;
    }
  }
};

export default handle;
