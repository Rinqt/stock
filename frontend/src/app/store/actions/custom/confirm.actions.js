export const CONFIRM_LOADING = "[CONFIRM] LOADING";
export const CONFIRM_LOAD_DATA = "[CONFIRM] LOAD_DATA";

export function confirmLoading(loading) {
  return {
    type: CONFIRM_LOADING,
    loading
  };
}
