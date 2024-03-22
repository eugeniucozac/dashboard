import moment from 'moment';
import isEmpty from 'lodash/isEmpty';

// app
import config from 'config';
import * as utils from 'utils';

const restrictedInputs = ['0', '0%', 'n/a', 'na', '-'];
const utilsOpeningMemo = {
  getRetainedBrokerageValue: (grossPremium, slipOrder, totalRetainedBrokerage) => {
    const total =
      Number(utils.string.stripNonNumeric(grossPremium || 0)) *
      Number(utils.string.stripNonNumeric(slipOrder || 0) / 100) *
      Number(utils.string.stripNonNumeric(totalRetainedBrokerage || 0) / 100);

    return parseInt(total * 100) / 100;
  },

  getRetainedBrokerageCurrencies: () => {
    const currentYear = utils.date.today('YYYY');
    let originalBrokerage = config.openingMemo.originalBrokerage[currentYear];

    // try to get previous year if current year is not yet available
    if (!originalBrokerage) {
      const previousYear = moment(currentYear, 'YYYY').subtract(1, 'year').format('YYYY');
      originalBrokerage = config.openingMemo.originalBrokerage[previousYear];
    }

    if (!originalBrokerage || !originalBrokerage.length) return [];

    return originalBrokerage;
  },

  getRetainedBrokerageConvertedValue: (currencyCode, total = 0) => {
    if (!currencyCode) return;
    const currencies = utilsOpeningMemo.getRetainedBrokerageCurrencies();

    const currencyObj = currencies.find((item) => item.currency === currencyCode);
    if (isEmpty(currencyObj)) return;

    return {
      value: parseInt((total / currencyObj.rate) * 100) / 100,
      rate: currencyObj.rate,
    };
  },

  isApproved: (openingMemo) => {
    if (!openingMemo || !utils.generic.isValidObject(openingMemo)) return false;

    return openingMemo.isAccountHandlerApproved && openingMemo.isAuthorisedSignatoryApproved;
  },

  displaySubRow: (value) => value.length > 0 && !restrictedInputs.includes(value.toLowerCase()),
};

export default utilsOpeningMemo;
