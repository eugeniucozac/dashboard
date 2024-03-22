import { firstBy } from 'thenby';
import toNumber from 'lodash/toNumber';
import round from 'lodash/round';
import uniq from 'lodash/uniq';
import get from 'lodash/get';

// app
import * as utils from 'utils';
import config from 'config';
import { MARKETS_STATUS_ID_ORDER } from 'consts';

const valid = (markets = []) => {
  return utils.generic.isValidArray(markets, true);
};

const utilsMarkets = {
  getByStatusIds: (markets = [], statusIdsArray = []) => {
    if (!valid(markets) || !utils.generic.isValidArray(statusIdsArray, true)) return [];

    return markets.filter((market) => {
      return statusIdsArray.includes(get(market, 'statusId'));
    });
  },

  filterByLineToStand: (markets = []) => {
    if (!valid(markets)) return [];

    return markets.filter((market) => {
      return utils.market.isLineToStand(market);
    });
  },

  getCurrency: (markets) => {
    if (!valid(markets)) return;

    const currencies = markets.filter((market) => utils.market.getCurrency(market)).map((market) => utils.market.getCurrency(market));

    return uniq(currencies).length === 1 ? uniq(currencies)[0] : false;
  },

  // layer OMS
  // false/false means we want the total gross premium amount
  // it is assumed that ALL markets within a policy have the same currency
  // as per Alex, the B/E will also follow that assumption
  // this will always return an object with a single currency, eg. { "USD": 1000 }
  getPremiumByCurrency: (markets = [], currency, isSigned = false, toOrder = false) => {
    if (!valid(markets) || !currency) return {};

    return markets.reduce((acc, market) => {
      let lineSize = toOrder ? utils.market.getLineSize(market, isSigned) / 100 : 1 / markets.length;
      let premium = utils.market.getPremium(market);

      if (!acc[currency]) acc[currency] = 0;
      acc[currency] = acc[currency] + lineSize * premium;

      return acc;
    }, {});
  },

  // policy GXB
  // true/true means we want the premium value signed and ordered (based on markets %)
  getPremiumBySettlementCurrency: (markets = [], isSigned = false, toOrder = false) => {
    if (!valid(markets)) return {};
    return markets.reduce((acc, market) => {
      let lineSize = toOrder ? utils.market.getLineSize(market, isSigned) / 100 : 1 / markets.length;
      let premium = utils.market.getPremium(market);
      let currencyCode = utils.market.getSettlementIsoCode(market);

      if (!acc[currencyCode]) acc[currencyCode] = 0;
      acc[currencyCode] = acc[currencyCode] + lineSize * premium;

      return acc;
    }, {});
  },

  // TODO added on 17/11/2020: this should be removed if market(s) have support for "getLineSizeByCurrency"
  getLineSize: (markets = [], isSigned = false) => {
    if (!valid(markets)) return 0;

    return markets.reduce((acc, market) => {
      let lineSize = utils.market.getLineSize(market, isSigned);
      return acc + lineSize;
    }, 0);
  },

  // TODO added on 17/11/2020: until markets have currency code, this method is useless
  // getLineSizeByCurrency: (markets = [], currency, isSigned = false) => {
  //   if (!valid(markets) || !currency) return 0;
  //
  //   return markets.reduce((acc, market) => {
  //     let lineSize = utils.market.getLineSizeByCurrency(market, currency, isSigned);
  //     return acc + lineSize;
  //   }, 0);
  // },

  hasMultiplePremiums: (markets = []) => {
    if (!valid(markets)) return;

    const premiums = markets.map((market) => utils.market.getPremium(market));
    return uniq(premiums).length > 1;
  },

  order: (markets = [], byUnderwriterGroup) => {
    if (!valid(markets)) return [];

    if (byUnderwriterGroup) {
      return markets.sort(
        firstBy(utils.sort.array('lexical', 'underwriterGroup', 'asc', true))
          .thenBy(utils.sort.array('lexical', 'uniqueMarketReference', 'asc', true))
          .thenBy(utils.sort.array('customSort', 'statusId', '', true, MARKETS_STATUS_ID_ORDER))
          .thenBy(utils.sort.array('boolean', 'isLeader'))
          .thenBy(utils.sort.array('numeric', 'premium', 'asc', true))
          .thenBy(utils.sort.array('numeric', 'writtenLinePercentage', 'desc', true))
          .thenBy(utils.sort.array('lexical', 'section', 'ASC', true))
      );
    }

    return markets.sort(
      firstBy(utils.sort.array('lexical', 'uniqueMarketReference', 'asc', true))
        .thenBy(utils.sort.array('customSort', 'statusId', '', true, MARKETS_STATUS_ID_ORDER))
        .thenBy(utils.sort.array('boolean', 'isLeader'))
        .thenBy(utils.sort.array('numeric', 'premium', 'asc', true))
        .thenBy(utils.sort.array('numeric', 'writtenLinePercentage', 'desc', true))
        .thenBy(utils.sort.array('lexical', 'section', 'ASC', true))
    );
  },

  signDown: (markets = [], percentage) => {
    const isZero = percentage === 0 || percentage === '0';
    const isPercentage = isZero || toNumber(percentage) > 0;

    if (markets.length <= 0 || !isPercentage) return markets;

    const toStand = markets.reduce((acc, market) => {
      return acc + (utils.market.isLineToStand(market) ? utils.market.getLineSize(market) : 0);
    }, 0);

    const toSignDown = markets.reduce((acc, market) => {
      return acc + (utils.market.isLineToStand(market) ? 0 : utils.market.getLineSize(market));
    }, 0);

    const available = Math.max(0, percentage - toStand);

    return markets.map((market) => {
      const writtenLinePercentage = utils.market.getLineSize(market);

      if (utils.market.isLineToStand(market)) {
        return utils.market.setSigned(market, writtenLinePercentage);
      } else {
        const signed = round((writtenLinePercentage / toSignDown) * available, config.ui.format.percent.decimal);
        return utils.market.setSigned(market, signed);
      }
    });
  },
};

export default utilsMarkets;
