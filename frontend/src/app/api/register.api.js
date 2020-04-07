import instance from "./axios.instance";
import history from "history.js";
import { registerLoading, showMessage } from "../store/actions";

/**
 *  Handle user registration
 * @param username  String user name
 * @param email String user email
 * @param password  String user password
 * @param confirmPassword String password confirmation
 */
const register = (username, email, password, confirmPassword) => {
  return dispatch => {
    dispatch(registerLoading(true));
    instance
      .post("auth/sign-up", {
        username: username.toLowerCase(),
        email,
        password,
        confirmPassword
      })
      .then(res => {
        dispatch(
          showMessage({
            message: "Registration successful",
            autoHideDuration: 2000,
            anchorOrigin: {
              vertical: "top",
              horizontal: "right"
            },
            variant: "success"
          })
        );
        dispatch(registerLoading(false));

        setTimeout(() => {
          history.push(`/auth/mail-confirm/${username}/${email}`);
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

        dispatch(registerLoading(false));
      });
  };
};

export default register;
