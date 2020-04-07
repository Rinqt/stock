import * as Actions from "app/store/actions/custom";

const initialState = {
  loading: true,
  list: [],
  chartLoading: true,
  chartList: [],
  chartCurrentCompany: "",
  companyFuture: [],
  companyFutureLoading: true
};

const handle = function (state = initialState, action) {
  switch (action.type) {
    case Actions.STOCKS_LOADING: {
      return {
        ...state,
        loading: action.loading
      };
    }
    case Actions.STOCKS_LIST: {
      return {
        ...state,
        list: [...action.list]
      };
    }
    case Actions.STOCKS_CHART_LIST: {
      return {
        ...state,
        chartList: [...action.list]
      };
    }
    case Actions.STOCKS_CHART_LOADING: {
      return {
        ...state,
        chartLoading: action.loading
      };
    }
    case Actions.STOCKS_CHART_CURRENT_COMPANY: {
      return {
        ...state,
        chartCurrentCompany: action.companySymbol
      };
    }
    case Actions.STOCKS_COMPANY_FUTURE: {
      return {
        ...state,
        companyFuture: [...action.newtWeekStocks]
      }
    }
    case Actions.STOCKS_COMPANY_FUTURE_LOADING: {
      return {
        ...state,
        companyFutureLoading: action.loading
      }
    }
    default: {
      return state;
    }
  }
};

export default handle;
