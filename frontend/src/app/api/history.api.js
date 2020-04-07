import instance from "./axios.instance";
import { getToken } from "../functions/auth";
import { historyLoading, historyList } from "../store/actions";
import history from "history.js";
/**
 * method to update the current users search hitory
 * @param  company Object of the searched company
 */
export const updateHistory = company => {
  const accessToken = getToken("accessToken");
  const idToken = getToken("idToken");
  if (!accessToken || !idToken) {
    return;
  }
  const params = {
    searchedCompany: {
      symbol: company.symbol,
      name: company.name
    }
  };

  const config = {
    headers: {
      Authorization: "Bearer " + idToken,
      AccessToken: accessToken
    }
  };

  return dispatch => {
    instance
      .put("users/search-history", params, config)
      .then(res => {})
      .catch(er => {});
  };
};

/**
 * load user history
 */
export const getHistory = () => {
  const accessToken = getToken("accessToken");
  const idToken = getToken("idToken");
  if (!accessToken || !idToken) {
    return;
  }
  const config = {
    headers: {
      Authorization: "Bearer " + idToken,
      AccessToken: accessToken
    }
  };
  return dispatch => {
    dispatch(historyLoading(true));
    instance
      .get("users/search-history", config)
      .then(res => {
        dispatch(historyLoading(false));
        dispatch(historyList(res.data.searchedCompanies));
      })
      .catch(er => {
        history.push("/app/error-404");
        dispatch(historyLoading(false));
      });
  };
};
