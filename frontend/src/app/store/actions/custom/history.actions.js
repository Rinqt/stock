export const HISTORY_LOADING = "[HISTORY] LOADING";
export const HISTORY_LIST = "[HISTORY] LIST";
export const HISTORY_UPDATE = "[HISTORY] UPDATE";

export function historyLoading(loading) {
  return {
    type: HISTORY_LOADING,
    loading
  };
}

export function historyList(history) {
  return {
    type: HISTORY_LIST,
    history
  };
}
