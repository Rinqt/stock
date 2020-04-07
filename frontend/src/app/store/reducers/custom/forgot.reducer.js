import * as Actions from "app/store/actions/custom";

const initialState = {
  loading: false
};

const handle = function(state = initialState, action) {
  switch (action.type) {
    case Actions.FORGOT_LOADING: {
      return {
        ...state,
        loading: action.loading
      };
    }
    default: {
      return state;
    }
  }
};

export default handle;
