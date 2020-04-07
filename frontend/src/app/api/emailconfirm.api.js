import instance from "./axios.instance";
import history from "history.js";
import { confirmLoading, showMessage } from "../store/actions";

/**
 * handle email confirmation after user registation
 * @param  username String user name
 * @param  confirmationCode String code recived by the user
 */

const confirm = (username, confirmationCode) => {
  return dispatch => {
    dispatch(confirmLoading(true));
    instance
      .post("auth/confirm-sign-up", {
        username,
        confirmationCode
      })
      .then(res => {
        dispatch(confirmLoading(false));
        dispatch(
          showMessage({
            message: "Confirmation successful",
            autoHideDuration: 2000,
            anchorOrigin: {
              vertical: "top",
              horizontal: "right"
            },
            variant: "success"
          })
        );
        setTimeout(() => {
          history.push("/auth/login");
        }, 2000);
      })
      .catch(er => {
        dispatch(confirmLoading(false));

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
      });
  };
};

export default confirm;
