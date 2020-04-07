import instance from "./axios.instance";
import history from "history.js";
import { resetLoading, showMessage } from "../store/actions";

/**
 * Handle user reset password request
 * @param username String user name
 * @param newPassword  String new password
 * @param confirmationCode String confirmation code sent to user by email
 */
const reset = (username, newPassword, confirmationCode) => {
  return dispatch => {
    dispatch(resetLoading(true));
    instance
      .post("auth/reset-password", {
        username,
        newPassword,
        confirmationCode
      })
      .then(res => {
        dispatch(
          showMessage({
            message: "Password successfully changed. Please log in again.",
            autoHideDuration: 2000,
            anchorOrigin: {
              vertical: "top",
              horizontal: "right"
            },
            variant: "success"
          })
        );
        dispatch(resetLoading(false));

        setTimeout(() => {
          history.push("/auth/login");
        }, 2000);
      })
      .catch(er => {
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
              horizontal: "right"
            },
            variant: "error"
          })
        );

        dispatch(resetLoading(false));
      });
  };
};

export default reset;
