import instance from "./axios.instance";
import history from "history.js";
import { getToken } from "../functions/auth";
import {
  loginLoading,
  loginSuccess,
  showMessage,
  loginIsLoggedin,
} from "../store/actions";

/**
 * handle user login
 * @param username String user name
 * @param password String password
 */
export const login = (username, password) => {
  return (dispatch) => {
    // dispatch(loginLoading(true));

    localStorage.setItem("loginTimeStamp", Date.now());
    localStorage.setItem("username", "Kaan");
    dispatch(loginIsLoggedin(true));
    history.push("/app/dashboard");
    //   instance
    //     .post("auth/sign-in", {
    //       username: username.toLowerCase(),
    //       password
    //     })
    //     .then(res => {
    //       // localStorage.setItem("userInfo", JSON.stringify(res.data));
    //       // localStorage.setItem("loginTimeStamp", Date.now());
    //       // localStorage.setItem("username", username);
    //       // dispatch(loginSuccess(res.data));
    //       // dispatch(loginLoading(false));
    //       // dispatch(loginIsLoggedin(true));
    //       history.push("/app/dashboard");
    //     })
    //     .catch(er => {
    //       let message =
    //         "We are experiencing some issues, please try again later!";
    //       const errors = [];
    //       if (er.response) {
    //         if (typeof er.response.data.errors === "object") {
    //           for (let key in er.response.data.errors) {
    //             errors.push(er.response.data.errors[key][0]);
    //           }
    //           message = errors.join("\n");
    //         } else {
    //           message = er.response.data.errors;
    //         }
    //       }
    //       dispatch(
    //         showMessage({
    //           message: message,
    //           autoHideDuration: 2000,
    //           anchorOrigin: {
    //             vertical: "top",
    //             horizontal: "right"
    //           },
    //           variant: "error"
    //         })
    //       );
    //       dispatch(loginLoading(false));
    //     });
  };
};

/**
 * check the user is still logged in, and update the token if it's about to expire
 */
export const checkLoggedin = () => {
  return (dispatch) => {
    dispatch(loginIsLoggedin(!!localStorage.getItem("username")));

    // if (userInfoString === null) {
    //   dispatch(loginIsLoggedin(false));
    // } else {
    //   const userInfo = JSON.parse(userInfoString);
    //   const loginTime = Number(localStorage.getItem("loginTimeStamp"));
    //   const timeSinceLastValidation = (Date.now() - loginTime) / 1000;
    //   if (timeSinceLastValidation < userInfo.expiresIn) {
    //     dispatch(loginIsLoggedin(true));
    //     // check if time since last login is less than 10 mins then try to refresh the current tokens
    //     if (userInfo.expiresIn - timeSinceLastValidation < 600) {
    //       const refreshToken = getToken("refreshToken");
    //       const accessToken = getToken("accessToken");
    //       const idToken = getToken("idToken");
    //       if (!refreshToken || !idToken || !accessToken) {
    //         localStorage.clear();
    //         return;
    //       }
    //       const params = {
    //         refreshToken,
    //       };

    //       const config = {
    //         headers: {
    //
    //          ,
    //         },
    //       };

    //       instance
    //         .post("auth/update-token", params, config)
    //         .then((res) => {
    //           const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    //           userInfo.accessToken = res.data.accessToken;
    //           userInfo.idToken = res.data.idToken;
    //           localStorage.setItem("userInfo", JSON.stringify(userInfo));
    //           localStorage.setItem("loginTimeStamp", Date.now());
    //           dispatch(loginSuccess(userInfo));
    //         })
    //         .catch((er) => {
    //           // let message = "You have been logged out!";
    //           // if (er.response) {
    //           //   if (er.response.data.errors) {
    //           //     message = er.response.data.errors;
    //           //   }
    //           // }
    //           // dispatch(
    //           //   showMessage({
    //           //     message: message,
    //           //     autoHideDuration: 2000,
    //           //     anchorOrigin: {
    //           //       vertical: "top",
    //           //       horizontal: "right"
    //           //     },
    //           //     variant: "error"
    //           //   })
    //           // );
    //           localStorage.clear();
    //           setTimeout(() => {
    //             window.location.reload();
    //           }, 500);
    //           dispatch(loginIsLoggedin(false));
    //           history.push("/app/dashboard");
    //         });
    //     }
    //   } else {
    //     localStorage.clear();
    //     setTimeout(() => {
    //       window.location.reload();
    //     }, 500);
    //     dispatch(loginIsLoggedin(false));
    //     history.push("/app/dashboard");
    //   }
    // }
  };
};

/**
 * handle user logout and clear local storage
 */
export const logout = () => {
  // const accessToken = getToken("accessToken");
  // const idToken = getToken("idToken");

  // // clear storage and redirect to dashboard
  // if (!accessToken || !idToken) {
  //   localStorage.clear();
  //   history.push("/app/dashboard");
  //   return;
  // }

  return (dispatch) => {
    setTimeout(() => {
      localStorage.clear();
      window.location.reload();
    }, 100);

    // instance
    //   .post("auth/sign-out", {}, config)
    //   .then((res) => {
    //     localStorage.clear();
    //     setTimeout(() => {
    //       window.location.reload();
    //     }, 500);
    //   })
    //   .catch((er) => {
    //     // console.log(er);
    //   });
  };
};
