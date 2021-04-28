import instance from "./axios.instance";
import { getToken } from "../functions/auth";
import {
  userInfo,
  userSettings,
  userSettingsUpdate,
  showMessage,
} from "../store/actions";

/**
 * handle user request to delete account
 */
export const deleteAccount = () => {
  const accessToken = getToken("accessToken");
  const idToken = getToken("idToken");
  if (!accessToken || !idToken) {
    return;
  }

  // changed api
  return (dispatch) => {
    instance
      .delete("/users")
      .then((res) => {
        localStorage.clear();
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      })
      .catch((er) => {
        // console.log(er, "");
      });
  };
};

/**
 * load the looged in user information
 */
export const getInfo = () => {
  // const accessToken = getToken("accessToken");
  // const idToken = getToken("idToken");
  // if (!accessToken || !idToken) {
  //   return;
  // }

  // const config = {
  //   headers: {
  //
  //   },
  // };

  return (dispatch) => {
    const temp = {};
    if (localStorage.getItem("username")) {
      temp.username = localStorage.getItem("username");
    }
    dispatch(userInfo(temp));
    // dispatch(userInfo(res.data));
    //   instance
    //     .get("users/info", config)
    //     .then((res) => {
    //       //add username to user info
    //       res.data.username = localStorage.getItem("username");
    //       dispatch(userInfo(res.data));
    //     })
    //     .catch((er) => {
    //       // console.log(er, "");
    //     });
  };
};

/**
 * load logged in user settings such as prefered language and companies
 */
export const getSettings = () => {
  // userSettings(res.data)
  // const accessToken = getToken("accessToken");
  // const idToken = getToken("idToken");
  // if (!accessToken || !idToken) {
  //   return;
  // }

  // const config = {
  //   headers: {
  //
  //   },
  // };

  return (dispatch) => {
    dispatch(userSettings({}));
    // instance
    //   .get("/users/settings", config)
    //   .then((res) => {
    //     dispatch(userSettings(res.data));
    //   })
    //   .catch((er) => {
    //     // console.log(er, "");
    //   });
  };
};

/**
 *  update user setttings
 * @param fav Object of prefered companies
 * @param language String user selection of language
 */
export const updateSettings = (fav, language) => {
  const accessToken = getToken("accessToken");
  const idToken = getToken("idToken");
  if (!accessToken || !idToken) {
    return;
  }

  const params = {
    favoriteCompanies: fav,
    language: language,
  };

  return (dispatch) => {
    dispatch(userSettingsUpdate(true));
    instance
      .put("users/settings", params)
      .then((res) => {
        dispatch(userSettingsUpdate(false));
        dispatch(userSettings(res.data));
      })
      .catch((er) => {
        dispatch(userSettingsUpdate(false));

        let message =
          "We are experiencing some issues, please try again later!";
        const errors = [];
        if (er.response) {
          if (typeof er.response.data.errors === "object") {
            for (let key in er.response.data.errors) {
              errors.push(er.response.data.errors[key][0]);
            }
            message = errors.join("\n");
          } else {
            message = er.response.data.errors;
          }
        }
        dispatch(
          showMessage({
            message: message,
            autoHideDuration: 2000,
            anchorOrigin: {
              vertical: "top",
              horizontal: "right",
            },
            variant: "error",
          })
        );
      });
  };
};

/**
 * update user ifnormation
 * @param info Object of user info (first name, last name .. )
 */
export const updateInfo = (info) => {
  const accessToken = getToken("accessToken");
  const idToken = getToken("idToken");
  if (!accessToken || !idToken) {
    return;
  }
  const params = {
    ...info,
  };

  return (dispatch) => {
    dispatch(userSettingsUpdate(true));
    instance
      .put("users/info", params)
      .then((res) => {
        dispatch(
          showMessage({
            message: "Account was updated!",
            autoHideDuration: 2000,
            anchorOrigin: {
              vertical: "top",
              horizontal: "right",
            },
            variant: "success",
          })
        );
        dispatch(userInfo(res.data));
        dispatch(userSettingsUpdate(false));
      })
      .catch((er) => {
        let message =
          "We are experiencing some issues, please try again later!";
        const errors = [];
        if (er.response) {
          if (typeof er.response.data.errors === "object") {
            for (let key in er.response.data.errors) {
              errors.push(er.response.data.errors[key][0]);
            }
            message = errors.join("\n");
          } else {
            message = er.response.data.errors;
          }
        }

        dispatch(
          showMessage({
            message: message,
            autoHideDuration: 2000,
            anchorOrigin: {
              vertical: "top",
              horizontal: "right",
            },
            variant: "error",
          })
        );
      });
  };
};

/**
 * change logged in user password
 * @param previousPassword String old password
 * @param newPassword String new password
 */
export const updatePassword = (previousPassword, newPassword) => {
  const accessToken = getToken("accessToken");
  const idToken = getToken("idToken");
  if (!accessToken || !idToken) {
    return;
  }
  const params = {
    oldPassword: previousPassword,
    newPassword: newPassword,
  };

  return (dispatch) => {
    dispatch(userSettingsUpdate(true));
    instance
      .post("auth/change-password", params)
      .then((res) => {
        dispatch(
          showMessage({
            message: "Account was updated!",
            autoHideDuration: 2000,
            anchorOrigin: {
              vertical: "top",
              horizontal: "right",
            },
            variant: "success",
          })
        );
        dispatch(userInfo(res.data));
      })
      .catch((er) => {
        let message =
          "We are experiencing some issues, please try again later!";
        const errors = [];
        if (er.response) {
          if (typeof er.response.data.errors === "object") {
            for (let key in er.response.data.errors) {
              errors.push(er.response.data.errors[key][0]);
            }
            message = errors.join("\n");
          } else {
            message = er.response.data.errors;
          }
        }
        dispatch(
          showMessage({
            message: message,
            autoHideDuration: 2000,
            anchorOrigin: {
              vertical: "top",
              horizontal: "right",
            },
            variant: "error",
          })
        );
      });
  };
};
