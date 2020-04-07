import * as Actions from "app/store/actions/custom";

const initialState = {
  list: [],
  singleCompanyLoading: true,
  singleCompanyDetails: {}
};

const handle = function(state = initialState, action) {
  switch (action.type) {
    case Actions.COMPANIES_LIST: {
      return {
        ...state,
        list: action.companies
      };
    }
    case Actions.COMPANIES_SINGLE: {
      return {
        ...state,
        singleCompanyDetails: action.companyDetails
      };
    }
    case Actions.COMPANIES_SINGLE_LOADING: {
      return {
        ...state,
        singleCompanyLoading: action.loading
      };
    }
    default: {
      return state;
    }
  }
};

export default handle;
