import * as Actions from "app/store/actions/custom";

const initialState = {
  loading: true,
  list: [],
  error: "",
  articleDetails: null,
  singleArticleLoading: true
};

const handle = function(state = initialState, action) {
  switch (action.type) {
    case Actions.ARTICLES_LOADING: {
      return {
        ...state,
        loading: action.loading
      };
    }
    case Actions.ARTICLES_LIST: {
      return {
        ...state,
        list: [...action.articles]
      };
    }
    case Actions.ARTICLES_SINGLE: {
      return {
        ...state,
        articleDetails: { ...action.articleDetails }
      };
    }
    case Actions.ARTICLES_SINGLE_LOADING: {
      return {
        ...state,
        singleArticleLoading: action.loading
      };
    }

    default: {
      return state;
    }
  }
};

export default handle;
