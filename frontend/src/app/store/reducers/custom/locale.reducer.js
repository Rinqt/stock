import * as Actions from "app/store/actions/custom";
import locale from "../../../locale";

const initialState = {
  ...locale,
  localesCodes: ["en", "cz"]
};

const localeChange = function(state = initialState, action) {
  switch (action.type) {
    case Actions.CHANGE_LOCALE: {
      locale.setLanguage(action.lang);

      return {
        ...state,
        ...locale
      };
    }
    default: {
      return state;
    }
  }
};

export default localeChange;
