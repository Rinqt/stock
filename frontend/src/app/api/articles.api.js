import instance from "./axios.instance";
import {
  articlesLoading,
  articlesList,
  articlesSingle,
  articlesSingleLoading
} from "../store/actions";
import history from "history.js";

/**
 * get list of articles
 * @param companySymbol cpmpany symbol used as filter
 */
export const getArticles = (companySymbol, from, to) => {
  return dispatch => {
    dispatch(articlesLoading(true));
    const params = {};
    if (companySymbol) {
      params["companySymbol"] = companySymbol;
    }
    params["from"] = from;
    params["to"] = to;
    instance
      .get("articles/all", {
        params: {
          ...params
        }
      })
      .then(res => {
        // const ar = res.data.slice(0, 10);
        // localStorage.setItem("latestArticles", JSON.stringify(ar));
        dispatch(articlesList(res.data));
        dispatch(articlesLoading(false));
      })
      .catch(er => {
        dispatch(articlesLoading(false));
      });
  };
};

/**
 * get details of a single artcile
 * @param id the id of the wanted article
 */
export const getSingleArticle = id => {
  return dispatch => {
    dispatch(articlesSingleLoading(true));
    instance
      .get("articles", {
        params: {
          id
        }
      })
      .then(res => {
        dispatch(articlesSingle(res.data));
        dispatch(articlesSingleLoading(false));
      })
      .catch(er => {
        history.push("/app/error-404");
        dispatch(articlesSingle({}));
        dispatch(articlesSingleLoading(false));
      });
  };
};
