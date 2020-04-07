export const LOGIN_LOADING = "[LOGIN] LOADING";
export const LOGIN_SUCCESS = "[LOGIN] SUCCESS";
export const LOGIN_ERROR = "[LOGIN] ERROR";
export const LOGIN_IS_LOGGEDIN = "[LOGIN] IS_LOGGEDIN";

export function loginLoading(loading) {
  return {
    type: LOGIN_LOADING,
    loading
  };
}

export function loginSuccess(userInfo) {
  return {
    type: LOGIN_SUCCESS,
    userInfo
  };
}

export function loginError(error) {
  return {
    type: LOGIN_ERROR,
    error
  };
}

export function loginIsLoggedin(isLoggedin) {
  return {
    type: LOGIN_IS_LOGGEDIN,
    isLoggedin
  };
}
