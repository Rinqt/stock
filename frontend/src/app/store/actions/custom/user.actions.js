export const USER_INFO = "[USER] INFO";
export const USER_SETTINGS = "[USER] SETTINGS";
export const USER_SETTINGS_UPDATE = "[USER] SETTINGS UPDATE";

export function userInfo(info) {
  return {
    type: USER_INFO,
    info
  };
}

export function userSettings(settings) {
  return {
    type: USER_SETTINGS,
    settings
  };
}
export function userSettingsUpdate(loading) {
  return {
    type: USER_SETTINGS_UPDATE,
    loading
  };
}
