export const COMPANIES_LIST = "[COMPANIES] LIST";
export const COMPANIES_SINGLE = "[COMPANIES] SINGLE";
export const COMPANIES_SINGLE_LOADING = "[COMPANIES] SINGLE LOADING";

export function companiesList(companies) {
  return {
    type: COMPANIES_LIST,
    companies
  };
}

export function companiesSingle(companyDetails) {
  return {
    type: COMPANIES_SINGLE,
    companyDetails
  };
}
export function companiesSingleLoading(loading) {
  return {
    type: COMPANIES_SINGLE_LOADING,
    loading
  };
}
