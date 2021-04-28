import instance from "./axios.instance";
import { getToken } from "../functions/auth";

import {
  stocksLoading,
  stocksList,
  stocksChartList,
  stocksChartLoading,
  stocksChartCurrentCompany,
  stocksCompanyFuture,
  stocksCompanyFutureLoading,
  articlesLoading,
} from "../store/actions";

/**
 * get list of the latest stockes
 */
export const getLatestStocksList = () => {
  const accessToken = getToken("accessToken");
  const idToken = getToken("idToken");

  return (dispatch) => {
    dispatch(stocksLoading(true));
    dispatch(stocksChartLoading(true));
    dispatch(articlesLoading(true));
    instance
      .get("stocks/latest")
      .then((res) => {
        dispatch(stocksList(res.data));
        dispatch(stocksLoading(false));
      })
      .catch((er) => {
        dispatch(stocksLoading(false));
      });
  };
};

/**
 * get stockes data for a company
 * @param companySymbol String company id symbol
 * @param from String filter date from
 * @param to String filter date to
 */
export const getStocksList = (companySymbol, from, to) => {
  return (dispatch) => {
    dispatch(stocksChartLoading(true));
    dispatch(stocksChartCurrentCompany(companySymbol));
    instance
      .get("stocks/all", {
        params: {
          from,
          to,
          companySymbol,
        },
      })
      .then((res) => {
        dispatch(stocksChartList(res.data));
        dispatch(stocksChartLoading(false));
      })
      .catch((er) => {
        // console.log(er, "");
        dispatch(stocksChartLoading(false));
      });
  };
};

/**
 * get future stockes perdictions for a copmany
 * @param companySymbol String company id symbol
 */
export const getCompanyFutureStocks = (companySymbol) => {
  return (dispatch) => {
    dispatch(stocksCompanyFutureLoading(true));
    instance
      .get("ml/default", {
        params: {
          companySymbol,
        },
      })
      .then((res) => {
        dispatch(
          stocksCompanyFuture(
            res.data.future_predictions ? res.data.future_predictions : []
          )
        );
        dispatch(stocksCompanyFutureLoading(false));
      })
      .catch((er) => {
        // console.log(er, "");
        dispatch(stocksCompanyFutureLoading(false));
      });
  };
};
