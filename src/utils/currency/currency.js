import isEmpty from 'lodash/isEmpty';

const utilsCurrency = {
  cleanDollarString: (str) => {
    return str ? parseFloat(str.split('$').join('').split(',').join('').split(' ').join('').trim()) : null;
  },

  getCode: (currencies, id) => {
    if (!id || !currencies || !Array.isArray(currencies) || isEmpty(currencies)) return '';

    const currency = currencies.find((currency) => currency.id === id);

    return currency ? currency.code || '' : '';
  },

  listWithCodeAndCurrency: (currencies) => {
    return currencies?.map((currency) => ({ ...currency, name: `${currency?.id} - ${currency?.name}` })) || [];
  },
};

export default utilsCurrency;
