import config from 'config';
import moment from 'moment';
import numbro from 'numbro';
import i18n from 'i18next';
import { reactI18nextModule } from 'react-i18next';
import isNumber from 'lodash/isNumber';
import * as utils from 'utils';

// Load internal app translations
import translationEN from './translations/en.json';
// import translationFR from './translations/fr.json';

// Load moment locale translations ("en" is loaded by default)
// import 'moment/locale/fr';

export const format = (value, type, lng) => {
  // lowercase
  if (type === 'lowercase') {
    const count = value.count !== undefined ? parseInt(value.count) : 1;
    return i18n.t(value.label, { count: count }).toLowerCase();
  }

  // uppercase
  if (type === 'uppercase') {
    const count = value.count !== undefined ? parseInt(value.count) : 1;
    return i18n.t(value.label, { count: count }).toUpperCase();
  }

  // date
  if (type === 'date') {
    const format = value.format || config.ui.format.date.text;
    return value.date ? moment(value.date).format(format) : value.default || '';
  }

  // date from now
  if (type === 'dateFromNow') {
    return utils.date.fromNow(value.date, {
      yesterday: i18n.t('time.yesterday'),
      tomorrow: i18n.t('time.tomorrow'),
    });
  }

  // escape number formatting if value is not a number
  if (type === 'number' || type === 'percent' || type === 'currency' || type === 'currencySymbol') {
    if (!isNumber(value.number) && !isNumber(numbro.unformat(value.number))) {
      return value.default || '';
    }
  }

  // number
  if (type === 'number') {
    return numbro(value.number).format({
      thousandSeparated: true,
      mantissa: config.ui.format.number.decimal,
      trimMantissa: true,
      ...value.format,
    });
  }

  // percent
  if (type === 'percent') {
    return numbro(value.number / 100).format({
      output: 'percent',
      mantissa: config.ui.format.percent.decimal,
      trimMantissa: true,
      ...value.format,
    });
  }

  // currency
  if (type === 'currency') {
    let translation;

    if (type === 'currency') translation = value.currency;
    // commenting out in case symbol formatting is needed in near future
    // if (type === 'currencyName') translation = i18n.t(`currency.${value.currency}.name`);
    // if (type === 'currencySymbol') translation = i18n.t(`currency.${value.currency}.symbol`);

    return i18n.t('currency.format', {
      number: numbro(value.number).format({
        thousandSeparated: true,
        mantissa: config.ui.format.currency.decimal,
        optionalMantissa: true,
        ...value.format,
      }),
      currency: value.currency ? translation : '',
    });
  }

  // fallback
  return value;
};

export const initialiseI18n = () => {
  // reset moment to "en" by default after loading other locales
  moment.locale(config.locale);
  numbro.setLanguage(config.localeCountry);

  i18n.use(reactI18nextModule).init(
    {
      resources: {
        en: {
          translation: translationEN,
        },
        // fr: {
        //   translation: translationFR
        // }
      },
      lng: 'en',
      fallbackLng: 'en',
      debug: false,
      interpolation: {
        escapeValue: false,
        format: format,
      },
      react: {
        wait: false,
      },
    },
    (err) => {
      if (err) {
        return console.error('i18n: Something went wrong loading', err);
      }
    }
  );
};

export default i18n;
