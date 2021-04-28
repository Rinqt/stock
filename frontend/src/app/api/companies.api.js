import instance from "./axios.instance";
import {
  companiesList,
  companiesSingle,
  companiesSingleLoading,
} from "../store/actions";
import { getToken } from "../functions/auth";
import history from "history.js";

export const getCompanies = () => {
  const accessToken = getToken("accessToken");
  const idToken = getToken("idToken");

  /**
   * get companies list in the system
   */

  return (dispatch) => {
    instance
      .get("companies/all")
      .then((res) => {
        localStorage.setItem("companiesList", JSON.stringify(res.data));
        dispatch(companiesList(res.data));
      })
      .catch((er) => {
        // console.log(er);
      });
  };
};

/**
 * Load details about a company
 * @param companySymbol id of the company
 */
export const getCompanyDetails = (companySymbol) => {
  return (dispatch) => {
    dispatch(companiesSingleLoading(true));
    instance
      .get("companies", {
        params: {
          companySymbol,
        },
      })
      .then((res) => {
        dispatch(companiesSingleLoading(false));
        dispatch(companiesSingle(res.data));
      })
      .catch((er) => {
        history.push("/app/error-404");
        dispatch(companiesSingle({}));
        dispatch(companiesSingleLoading(false));
        // console.log(er);
      });
  };
};
