import isEmpty from 'lodash/isEmpty';
import isNumber from 'lodash/isNumber';
import pick from 'lodash/pick';
import trim from 'lodash/trim';

// app
import * as utils from 'utils';

const utilsMarket = {
  getId: (market) => {
    if (!market || !market.market) return '';
    return market.market.id || utilsMarket.getName(market);
  },

  getName: (market) => {
    if (!market || !market.market) return '';
    return market.market.edgeName || market.market.name || '';
  },

  getNotes: (market) => {
    if (!market || !market.subjectivities) return '';
    return market.subjectivities || '';
  },

  getUnderwriterGroup: (market) => {
    if (!market || !market.underwriterGroup) return '';
    return trim(market.underwriterGroup);
  },

  getAddress: (address) => {
    if (!utils.generic.isValidObject(address) || isEmpty(address)) return;
    const props = pick(address, ['addressLine1', 'addressLine2', 'addressLine3', 'addressLine4', 'postCode', 'country']);
    return Object.values(props)
      .map((prop) => trim(prop, ','))
      .filter((prop) => !!prop)
      .join(', ');
  },

  getCurrency: (market) => {
    if (!market || !market.isoCode) return false;
    return trim(market.isoCode);
  },

  // TODO added on 17/11/2020: remove this when B/E have removed settlementIsoCode
  // TODO added on 17/11/2020: replace with getCurrency
  getSettlementIsoCode: (market) => {
    if (!market || !market.settlementIsoCode) return '---';
    return trim(market.settlementIsoCode);
  },

  getPremium: (market, falsyReturnsZero = true) => {
    if (!market) return falsyReturnsZero ? 0 : null;
    return isNumber(market.premium) ? market.premium : falsyReturnsZero ? 0 : null;
  },

  // TODO added on 17/11/2020: this should be removed if market(s) have support for "getLineSizeByCurrency"
  getLineSize: (market, isSigned = false) => {
    if (!market) return 0;

    const value = isSigned ? market.orderPercentage : market.writtenLinePercentage;
    return isNumber(value) ? value : 0;
  },

  // TODO added on 17/11/2020: until markets have currency code, this method is useless
  // getLineSizeByCurrency: (market, currency, isSigned = false) => {
  //   if (!market || !currency || currency !== utilsMarket.getCurrency(market)) return 0;
  //
  //   return utilsMarket.getLineSize(market, isSigned);
  // },

  getLineSizeBySettlementCurrency: (market, currency, isSigned = false) => {
    if (!market || currency !== utilsMarket.getSettlementIsoCode(market)) return 0;

    return utilsMarket.getLineSize(market, isSigned);
  },

  setSigned: (market, signed) => {
    if (!market || !utils.generic.isValidObject(market) || signed === undefined) return market;

    market.orderPercentage = signed;
    return market;
  },

  isLineToStand: (market) => {
    return !!(market && market.lineToStand === true);
  },

  isLeader: (market) => {
    return !!(market && market.isLeader === true);
  },
};

export default utilsMarket;
