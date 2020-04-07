export const CHANGE_LOCALE = "[LOCALE] CHANGE";

export function localeChange(lang) {
  return {
    type: CHANGE_LOCALE,
    lang
  };
}
