import instance from "./axios.instance";
import { getToken } from "../functions/auth";
import {
  showMessage,
  userModels,
  modelById,
  modelLoadingById,
  modelCompare,
  modelLoadingCompare,
  loadingUserModels,
} from "../store/actions";
import store from "../store";
import history from "history.js";

/**
 * method to create and train new model
 * @param  modelSettings Object of model parameter
 */
export const createModel = (modelSettings) => {
  const accessToken = getToken("accessToken");
  const idToken = getToken("idToken");
  if (!accessToken || !idToken) {
    return;
  }

  return (dispatch) => {
    instance
      .post("ml", { ...modelSettings })
      .then((res) => {
        dispatch(
          showMessage({
            message: res.data.message,
            autoHideDuration: 2000,
            anchorOrigin: {
              vertical: "top",
              horizontal: "right",
            },
            variant: "success",
          })
        );
        history.push("/app/analysis");
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
 * get all models the user created
 */
export const getModels = (showloading = true) => {
  return (dispatch) => {
    if (showloading) {
      dispatch(loadingUserModels(true));
    }
    instance
      .get("ml/all")
      .then((res) => {
        dispatch(loadingUserModels(false));
        dispatch(userModels(res.data));
      })
      .catch((er) => {
        dispatch(loadingUserModels(false));
        dispatch(userModels([]));
        // console.log(er, "");
      });
  };
};

/**
 * get a model by its id
 * @param  id String model id
 * @param type String which state to update
 */
export const getModelById = (id, type = null) => {
  const accessToken = getToken("accessToken");
  const idToken = getToken("idToken");
  if (!accessToken || !idToken) {
    return;
  }

  return (dispatch) => {
    if (type === "compare") {
      dispatch(modelLoadingCompare(true));
    } else {
      dispatch(modelLoadingById(true));
    }

    instance
      .get("ml?id=" + id)
      .then((res) => {
        if (type === "compare") {
          dispatch(modelCompare({ ...res.data }));
          dispatch(modelLoadingCompare(false));
        } else {
          dispatch(modelById({ ...res.data }));
          dispatch(modelLoadingById(false));
        }
      })
      .catch((er) => {
        history.push("/app/error-404");
        if (type === "compare") {
          dispatch(modelLoadingCompare(false));
          dispatch(modelCompare({}));
        } else {
          dispatch(modelLoadingById(false));
          dispatch(modelById({}));
        }

        // console.log(er, "");
      });
  };
};

/**
 * Performs an action to delete a model
 * @param  id String model id
 */
export const deleteModel = (id) => {
  const accessToken = getToken("accessToken");
  const idToken = getToken("idToken");
  if (!accessToken || !idToken) {
    return;
  }

  return (dispatch) => {
    instance
      .delete("ml?id=" + id)
      .then((res) => {
        const state = store.getState();
        dispatch(
          userModels(
            state.custom.models.userModels.filter((el) => id !== el.id)
          )
        );

        dispatch(
          showMessage({
            message: "Model was Deleted",
            autoHideDuration: 2000,
            anchorOrigin: {
              vertical: "top",
              horizontal: "right",
            },
            variant: "success",
          })
        );
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
