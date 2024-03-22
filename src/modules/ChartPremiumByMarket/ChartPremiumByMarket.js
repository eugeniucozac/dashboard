import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import groupBy from 'lodash/groupBy';
import orderBy from 'lodash/orderBy';
import get from 'lodash/get';

// app
import { ChartPremium } from 'modules';
import * as utils from 'utils';

export class ChartPremiumByMarket extends PureComponent {
  static propTypes = {
    placements: PropTypes.array.isRequired,
    year: PropTypes.number,
  };

  getTableColumns = (currency) => [
    {
      id: 'name',
      label: utils.string.t('app.market'),
      sort: { type: 'lexical', direction: 'asc' },
    },
    {
      id: 'value',
      label: utils.string.t('chart.legend.premium', { currency }),
      sort: { type: 'numeric', direction: 'desc' },
    },
  ];

  filteredPlacements = (placements) => {
    return placements.filter((placement) => {
      const { year } = this.props;
      const placementYear = utils.placement.getYear(placement);

      // Only keep placements for defined year
      if (placementYear !== year) return false;

      // Only keep placements with premiums
      return placement.policies.reduce((acc, policy) => {
        return acc || utils.policy.hasBoundPremium(policy);
      }, false);
    });
  };

  formatData = (placements) => {
    const data = placements.reduce((list, placement) => {
      const placementId = placement.id;

      placement.policies.forEach((policy) => {
        const hasPremiums = utils.policy.hasBoundPremium(policy);
        const policyPremiumByCurrency = utils.policy.getPremiumBySettlementCurrency(policy, true, true);

        Object.keys(policyPremiumByCurrency).forEach((currency) => {
          const policySignedTotal = policy.markets.reduce((acc, market) => {
            return acc + utils.market.getLineSizeBySettlementCurrency(market, currency, true);
          }, 0);

          if (hasPremiums && utils.policy.isOriginGxb(policy)) {
            policy.markets.forEach((market) => {
              const marketId = utils.market.getId(market);
              const marketName = utils.market.getName(market);
              const marketCurrency = utils.market.getSettlementIsoCode(market);
              const marketPercentage = utils.market.getLineSizeBySettlementCurrency(market, currency, true);
              const marketPremiumAmount = policyPremiumByCurrency[currency] * (marketPercentage / policySignedTotal);
              const hasPercentage = Boolean(marketPercentage);
              const isMatchingCurrency = Boolean(marketCurrency === currency);
              const existingMarketIndex = list.findIndex((obj) => obj.id === marketId && obj.currency === currency);
              const marketAlreadyExist = existingMarketIndex >= 0;
              const insureds = utils.placement.getInsureds(placement);

              const listDatasets = marketAlreadyExist ? get(list, `[${existingMarketIndex}].datasets`) || [] : [];
              const marketPremiumPrevious = listDatasets.reduce((acc, obj) => acc + obj.value, 0);
              const marketPremiumTotal = marketPremiumPrevious + marketPremiumAmount;

              // standard list object
              // if a market with the same ID already exists, only some of these properties will be used to update the current list object
              const defaultListObj = {
                id: marketId,
                currency,
                name: marketName,
                label: utils.string.t('format.currency', { value: { number: marketPremiumTotal, currency } }),
                datasets: [
                  {
                    id: placementId,
                    value: marketPremiumAmount,
                    name: insureds,
                    object: [market],
                  },
                ],
              };

              if (hasPercentage && isMatchingCurrency) {
                // if market already exists, we need to increment the "label" and
                // add the market in the datasets/objects
                if (marketAlreadyExist) {
                  let updatedDatasets;
                  const placementCurrentIndex = list[existingMarketIndex].datasets.findIndex((obj) => obj.id === placementId);
                  const placementAlreadyExist = placementCurrentIndex >= 0;
                  const placementCurrentObj = list[existingMarketIndex].datasets[placementCurrentIndex];
                  const placementCurrentPremium = placementAlreadyExist ? placementCurrentObj.value : 0;

                  // if a placement already exists, we need to increment the "value" premium and add the market object in the "object" array
                  // if not, we simply add the dataset from defaultListObj to the datasets array
                  if (placementAlreadyExist) {
                    updatedDatasets = list[existingMarketIndex].datasets.map((set) => {
                      if (set.id === placementId) {
                        set.value = placementCurrentPremium + marketPremiumAmount;
                        set.object = [...set.object, ...defaultListObj.datasets[0].object];
                      }

                      return set;
                    });
                  } else {
                    updatedDatasets = [...list[existingMarketIndex].datasets, ...defaultListObj.datasets];
                  }

                  list[existingMarketIndex] = {
                    ...list[existingMarketIndex],
                    label: defaultListObj.label,
                    datasets: [...updatedDatasets],
                  };
                } else {
                  list = [...list, defaultListObj];
                }
              }

              return list;
            });
          }

          return list;
        });
      });

      return list;
    }, []);

    const grouped = groupBy(data, (item) => item.currency);

    return Object.keys(grouped).map((currency) => ({
      currency,
      data: grouped[currency],
      columns: this.getTableColumns(currency),
    }));
  };

  render() {
    const { placements, year } = this.props;

    // abort
    if (!placements) return null;

    const filteredPlacements = this.filteredPlacements(placements);
    const dataByCurrency = orderBy(this.formatData(filteredPlacements), 'currency');

    return <ChartPremium id="byMarket" year={year} dataByCurrency={dataByCurrency} table />;
  }
}

export default ChartPremiumByMarket;
