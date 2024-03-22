import get from 'lodash/get';
import uniq from 'lodash/uniq';
import * as utils from 'utils';
import * as constants from 'consts';

const utilsPolicy = {
  getMarkets: (policy) => {
    if (!policy || !utils.generic.isValidArray(policy.markets, true)) return [];

    return get(policy, 'markets', []);
  },

  // layer OMS
  // false/false means we want the total gross premium amount
  getPremiumByCurrency: (policy, currency, isSigned = false, toOrder = true) => {
    if (!policy || !currency) return {};

    let markets = utilsPolicy.getMarkets(policy);
    return utils.markets.getPremiumByCurrency(markets, currency, isSigned, toOrder);
  },

  // policy GXB
  // true/true means we want the premium value signed and ordered (based on markets %)
  getPremiumBySettlementCurrency: (policy, isSigned = false, toOrder = true) => {
    if (!policy) return {};

    let markets = utilsPolicy.getMarkets(policy);
    return utils.markets.getPremiumBySettlementCurrency(markets, isSigned, toOrder);
  },

  getName: (policy) => {
    if (!policy) return '';

    const amount = utils.string
      .t('format.number', { value: { number: policy.amount, format: { average: true, totalLength: 12, lowPrecision: false } } })
      .toUpperCase();

    const excess = utils.string
      .t('format.number', { value: { number: policy.excess, format: { average: true, totalLength: 12, lowPrecision: false } } })
      .toUpperCase();

    const hasAmount = Boolean(policy.amount);
    const hasExcess = Boolean(policy.excess);
    const hasBoth = hasAmount && hasExcess;
    const currency = utilsPolicy.getCurrency(policy);

    if (utilsPolicy.isPrimary(policy)) {
      return `${utils.string.t('placement.generic.primary')} ${amount}${currency ? ` ${currency}` : ''}`;
    } else if (hasBoth) {
      return `${amount} xs ${excess}${currency ? ` ${currency}` : ''}`;
    } else if (hasExcess) {
      return `xs ${excess}${currency ? ` ${currency}` : ''}`;
    } else if (policy.uniqueMarketReference) {
      return policy.uniqueMarketReference;
    } else {
      return '--';
    }
  },

  getCurrency: (policy) => {
    if (!utils.generic.isValidArray(policy?.markets, true)) return;

    const currencies = policy.markets
      .filter((market) => utils.market.getCurrency(market))
      .map((market) => utils.market.getCurrency(market));

    return uniq(currencies).length === 1 ? uniq(currencies)[0] : false;
  },

  hasBoundPremium: (policy) => {
    if (!policy || !utils.generic.isValidObject(policy) || !utilsPolicy.isOriginGxb(policy)) return false;

    const premiumsByCurrency = utils.markets.getPremiumBySettlementCurrency(utilsPolicy.getMarkets(policy), true, true);

    return Object.values(premiumsByCurrency).some((premium) => premium > 0);
  },

  isPrimary: (policy) => {
    return policy && policy.amount && !policy.excess;
  },

  isOriginEdge: (policy) => {
    return policy && policy.origin === constants.ORIGIN_EDGE;
  },

  isOriginGxb: (policy) => {
    return policy && policy.origin === constants.ORIGIN_GXB;
  },
};

export default utilsPolicy;
