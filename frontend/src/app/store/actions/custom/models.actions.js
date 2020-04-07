export const MODEL_CHANGE = "[MODEL] CHANGE";
export const MODEL_CREATE = "[MODEL] CREATE";
export const MODELS_USER = "[MODELS] USER";
export const MODELS_USER_LOADING = "[MODELS] USER LOADING";
export const MODEL_CREATE_HYPER_PARAMS = "[MODEL] CREATE HYPER PARAMS";
export const MODELS_UPDATE_FILTERS = "[MODELS] UPDATE FILTERS";
export const MODEL_BY_ID = "[MODEL] BY ID";
export const MODEL_LOADINNG_BY_ID = "[MODEL] LOADING BY ID";
export const MODEL_LOADEING_COMPARE = "[MODEL] LOADEING COMPARE"
export const MODEL_COMPARE = "[MODEL] COMPARE"

export function modelChange(model) {
  return {
    type: MODEL_CHANGE,
    model
  };
}

export function modelCreate(model) {
  return {
    type: MODEL_CREATE,
    model
  };
}

export function updateModelsFilters(filters) {
  return {
    type: MODELS_UPDATE_FILTERS,
    filters
  };
}

export function userModels(userModels) {
  return {
    type: MODELS_USER,
    userModels
  };
}

export function createHyperParams(params) {
  return {
    type: MODEL_CREATE_HYPER_PARAMS,
    params
  };
}

export function modelById(modelByID) {
  return {
    type: MODEL_BY_ID,
    modelByID
  };
}

export function modelLoadingById(loading) {
  return {
    type: MODEL_LOADINNG_BY_ID,
    loading
  };
}

export function modelCompare(model){
  return{
    type: MODEL_COMPARE,
    model
  }
}

export function modelLoadingCompare(loading){
  return {
    type: MODEL_LOADEING_COMPARE,
    loading
  }
}

export function loadingUserModels(loading){
  return {
    type: MODELS_USER_LOADING,
    loading
  }
}