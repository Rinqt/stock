import * as Actions from "app/store/actions/custom";

const initialState = {
  loading: true,
  list: []
};

const handle = function(state = initialState, action) {
  switch (action.type) {
    case Actions.HISTORY_LOADING: {
      return {
        ...state,
        loading: action.loading
      };
    }
    case Actions.HISTORY_LIST: {
      return {
        ...state,
        list: [...action.history]
      };
    }
    default: {
      return state;
    }
  }
};

export default handle;
