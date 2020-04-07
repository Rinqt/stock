import * as Actions from "app/store/actions/custom";

const initialState = {
  loading: false,
  userInfo: {},
  error: ""
};

const handle = function(state = initialState, action) {
  switch (action.type) {
    case Actions.CONFIRM_LOADING: {
      return {
        ...state,
        loading: action.loading
      };
    }
    case Actions.CONFIRM_LOAD_DATA: {
      return {
        ...state,
        userInfo: { ...action.userInfo }
      };
    }

    default: {
      return state;
    }
  }
};

export default handle;
