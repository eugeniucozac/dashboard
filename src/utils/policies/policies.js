import { firstBy } from 'thenby';
import toPairs from 'lodash/toPairs';
import groupBy from 'lodash/groupBy';
import get from 'lodash/get';
import orderBy from 'lodash/orderBy';

// app
import * as utils from 'utils';

const utilsPolicies = {
  getByBusinessType: (policies) => {
    if (!utils.generic.isValidArray(policies, true)) return [];

    return toPairs(groupBy(policies, (policy) => policy.businessTypeId));
  },

  getById: (policies, id) => {
    if (!utils.generic.isValidArray(policies, true) || !id) return;

    return policies.find((policy) => policy.id === id);
  },

  getMarketById: (policies, marketId) => {
    if (!utils.generic.isValidArray(policies, true) || !marketId) return;

    const policy = policies.find((policy) => {
      return (
        utils.generic.isValidArray(policy.markets, true) &&
        policy.markets.some((market) => {
          return market.id === marketId;
        })
      );
    });

    const marketsArray = utils.policy.getMarkets(policy);

    return marketsArray.find((marketObj) => marketObj.id === marketId);
  },

  orderPolicies: (policies) => {
    if (!utils.generic.isValidArray(policies, true)) return [];

    const primaryPolicies = orderBy(
      policies.filter((policy) => utils.policy.isPrimary(policy)),
      ['amount'],
      ['desc']
    );
    const excessPolicies = orderBy(
      policies.filter((policy) => !utils.policy.isPrimary(policy)),
      ['excess', 'amount'],
      ['asc', 'desc']
    );

    return [...primaryPolicies, ...excessPolicies];
  },

  getMudmap: (policies, config, statusMarketQuoted, type = 'written') => {
    if (!utils.generic.isValidArray(policies, true)) return [];

    const isWritten = type === 'written';
    const isSigned = type === 'signed';

    return policies
      .reduce((arr, policy) => {
        const marketsGroups = groupBy(get(policy, 'markets', []), (market) => get(market, 'market.capacityTypeId'));

        Object.entries(marketsGroups).forEach((marketGroup) => {
          const capacityTypeId = marketGroup[0];
          const markets = marketGroup[1];
          const marketsQuoted = utils.markets.getByStatusIds(markets, [statusMarketQuoted]);

          const policyId = `${policy.id}-${marketsQuoted.map((m) => m.id).join('-')}`;
          const policyCurrency = utils.policy.getCurrency(policy);
          const policyMultiplePrices = utils.markets.hasMultiplePremiums(marketsQuoted);

          const isBound = utils.policy.isOriginGxb(policy);
          const policyPremiumByCurrency = isBound
            ? utils.markets.getPremiumBySettlementCurrency(marketsQuoted, false, false)
            : utils.markets.getPremiumByCurrency(marketsQuoted, policyCurrency, false, false);

          const policyWritten = utils.markets.getLineSize(marketsQuoted);
          const policySigned = utils.markets.getLineSize(marketsQuoted, true);
          const policyConfig = config.find((p) => p.id === policyId) || {};

          // only keep policies with enough/valid data
          if (policy.amount && ((isWritten && policyWritten) || (isSigned && policySigned))) {
            arr.push({
              id: policyId,
              order: policyConfig && policyConfig.order ? policyConfig.order : null,
              capacityId: parseInt(capacityTypeId),
              currency: utils.policy.getCurrency(policy),
              market: utils.policy.getName(policy),
              leads: marketsQuoted.reduce((leads, m) => {
                const id = utils.market.getId(m);
                const name = utils.market.getName(m);
                const notes = utils.market.getNotes(m);

                return name ? [...leads, { id, name, notes }] : leads;
              }, []),
              amount: policy.amount,
              xs: policy.excess || 0,
              premium: policyMultiplePrices ? utils.string.t('app.various') : policyPremiumByCurrency[policyCurrency] || 0,
              written: policyWritten ? policyWritten / 100 : 0,
              signed: policySigned ? policySigned / 100 : 0,
            });
          }
        });

        return arr;
      }, [])
      .sort(
        firstBy(utils.sort.array('numeric', 'order'))
          .thenBy(utils.sort.array('numeric', 'amount', 'desc'))
          .thenBy(utils.sort.array('numeric', 'excess', 'desc'))
      );
  },
};

export default utilsPolicies;
