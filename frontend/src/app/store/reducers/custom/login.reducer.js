import * as Actions from "app/store/actions/custom";

const initialState = {
  loading: false,
  userInfo: {},
  error: "",
  isLoggedin: null
};

const handle = function(state = initialState, action) {
  switch (action.type) {
    case Actions.LOGIN_LOADING: {
      return {
        ...state,
        loading: action.loading
      };
    }
    case Actions.LOGIN_SUCCESS: {
      return {
        ...state,
        userInfo: { ...action.userInfo }
      };
    }
    case Actions.LOGIN_ERROR: {
      return {
        ...state,
        error: action.error
      };
    }
    case Actions.LOGIN_IS_LOGGEDIN: {
      return {
        ...state,
        isLoggedin: action.isLoggedin
      };
    }
    default: {
      return state;
    }
  }
};

export default handle;
