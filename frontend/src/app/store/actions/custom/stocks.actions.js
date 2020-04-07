export const STOCKS_LOADING = "[STOCKS] LOADING";
export const STOCKS_LIST = "[STOCKS] LIST";
export const STOCKS_CHART_LIST = "[STOCKS] CHART LIST";
export const STOCKS_CHART_LOADING = "[STOCKS] CHART LOADING";
export const STOCKS_CHART_CURRENT_COMPANY = "[STOCKS] CHART CURRENT COMPANY";
export const STOCKS_COMPANY_FUTURE = "[STOCKS] COMPANY FUTUR";
export const STOCKS_COMPANY_FUTURE_LOADING = "[STOCKS] COMPANY FUTUR LOADING";

export function stocksLoading(loading) {
  return {
    type: STOCKS_LOADING,
    loading
  };
}

export function stocksList(list) {
  return {
    type: STOCKS_LIST,
    list
  };
}

export function stocksChartList(list) {
  return {
    type: STOCKS_CHART_LIST,
    list
  };
}
export function stocksChartLoading(loading) {
  return {
    type: STOCKS_CHART_LOADING,
    loading
  };
}
export function stocksChartCurrentCompany(companySymbol) {
  return {
    type: STOCKS_CHART_CURRENT_COMPANY,
    companySymbol
  };
}

export function stocksCompanyFuture(newtWeekStocks) {
  return {
    type: STOCKS_COMPANY_FUTURE,
    newtWeekStocks
  };
}


export function stocksCompanyFutureLoading(loading) {
  return {
    type: STOCKS_COMPANY_FUTURE_LOADING,
    loading
  };
}
