import moment from 'moment';
import { i18n } from 'utils';

export const setConfigVars = (vars) => {
  return {
    type: 'CONFIG_VARS_SET',
    payload: vars,
  };
};

export const setConfigLocale = (locale) => {
  // first, update moment locale
  // then update i18next (which will use the updated moment.locale()
  moment.locale(locale);
  i18n.changeLanguage(locale);

  return {
    type: 'CONFIG_LOCALE_SET',
    payload: locale,
  };
};
