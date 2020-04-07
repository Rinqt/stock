export const REGISTER_LOADING = "[REGISTER] LOADING";

export function registerLoading(loading) {
  return {
    type: REGISTER_LOADING,
    loading
  };
}
