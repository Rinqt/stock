export const ARTICLES_LOADING = "[ARTICLES] LOADING";
export const ARTICLES_LIST = "[ARTICLES] LIST";
export const ARTICLES_SINGLE = "[ARTICLES] SINGLE";
export const ARTICLES_SINGLE_LOADING = "[ARTICLES] SINGLE LOADING";

export function articlesLoading(loading) {
  return {
    type: ARTICLES_LOADING,
    loading
  };
}

export function articlesList(articles) {
  return {
    type: ARTICLES_LIST,
    articles
  };
}

export function articlesSingle(articleDetails) {
  return {
    type: ARTICLES_SINGLE,
    articleDetails
  };
}
export function articlesSingleLoading(loading) {
  return {
    type: ARTICLES_SINGLE_LOADING,
    loading
  };
}
