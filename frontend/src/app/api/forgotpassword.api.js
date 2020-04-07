import instance from "./axios.instance";
import history from "history.js";
import { forgotLoading, showMessage } from "../store/actions";

/**
 * Trigger user passowrd forget
 * @param username String user name
 */

const forgot = username => {
  return dispatch => {
    dispatch(forgotLoading(true));
    instance
      .post("auth/forgot-password", {
        username
      })
      .then(res => {
        dispatch(
          showMessage({
            message: "A reset code was sent to your email address.",
            autoHideDuration: 2000,
            anchorOrigin: {
              vertical: "top",
              horizontal: "right"
            },
            variant: "success"
          })
        );
        dispatch(forgotLoading(false));

        setTimeout(() => {
          history.push("/auth/reset-password");
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
        dispatch(forgotLoading(false));
      });
  };
};

export default forgot;
