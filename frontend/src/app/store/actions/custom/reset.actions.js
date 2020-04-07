export const RESET_LOADING = "[RESET] LOADING";

export function resetLoading(loading) {
  return {
    type: RESET_LOADING,
    loading
  };
}
