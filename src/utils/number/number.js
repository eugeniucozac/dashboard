import isNumber from 'lodash/isNumber';

const utilsNumber = {
  isEven: (num) => {
    if ((!num && num !== 0) || !isNumber(num)) return false;

    return num % 2 === 0;
  },

  isOdd: (num) => {
    if (!num || !isNumber(num)) return false;

    return Math.abs(num) % 2 === 1;
  },
  formatNumber: (num, locales = 'en-US') => {
    return num.toLocaleString(locales);
  },
};

export default utilsNumber;
