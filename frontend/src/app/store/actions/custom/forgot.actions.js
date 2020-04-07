export const FORGOT_LOADING = "[FORGOT] LOADING";

export function forgotLoading(loading) {
  return {
    type: FORGOT_LOADING,
    loading
  };
}
