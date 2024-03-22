import get from 'lodash/get';
import * as utils from 'utils';

const utilsLayer = {
  getMarkets: (layer) => {
    if (!layer || !utils.generic.isValidArray(layer.markets, true)) return [];

    return get(layer, 'markets', []);
  },

  getMarketById: (layer, id) => {
    if (!id || !layer) return;

    const markets = utilsLayer.getMarkets(layer);

    return markets.find((m) => {
      return m.market?.id === id;
    });
  },

  getName: (layer) => {
    if (!layer) return '';

    const amount = utils.string
      .t('format.number', { value: { number: layer.amount, format: { average: true, totalLength: 12, lowPrecision: false } } })
      .toUpperCase();

    const excess = utils.string
      .t('format.number', { value: { number: layer.excess, format: { average: true, totalLength: 12, lowPrecision: false } } })
      .toUpperCase();

    const hasAmount = Boolean(layer.amount);
    const hasExcess = Boolean(layer.excess);
    const hasBoth = hasAmount && hasExcess;
    const currency = utilsLayer.getCurrency(layer, '');

    if (utilsLayer.isPrimary(layer)) {
      return `${utils.string.t('placement.generic.primary')} ${amount}${currency ? ` ${currency}` : ''}`;
    } else if (hasBoth) {
      return `${amount} xs ${excess}${currency ? ` ${currency}` : ''}`;
    } else if (hasExcess) {
      return `xs ${excess}${currency ? ` ${currency}` : ''}`;
    } else {
      return '--';
    }
  },

  getCurrency: (layer, defaultValue = '---') => {
    if (!layer) return defaultValue;

    return layer.isoCurrencyCode || defaultValue;
  },

  isPrimary: (layer) => {
    return layer && layer.amount && !layer.excess;
  },
};

export default utilsLayer;
