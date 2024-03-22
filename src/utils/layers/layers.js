import { firstBy } from 'thenby';
import toPairs from 'lodash/toPairs';
import groupBy from 'lodash/groupBy';
import get from 'lodash/get';
import orderBy from 'lodash/orderBy';

// app
import * as utils from 'utils';

const utilsLayers = {
  getByBusinessType: (layers) => {
    if (!utils.generic.isValidArray(layers, true)) return [];

    return toPairs(groupBy(layers, (layer) => layer.businessTypeId));
  },

  getById: (layers, id) => {
    if (!utils.generic.isValidArray(layers, true) || !id) return;

    return layers.find((layer) => layer.id === id);
  },

  getMarketById: (layers, marketId) => {
    if (!utils.generic.isValidArray(layers, true) || !marketId) return;

    const layer = layers.find((layer) => {
      return (
        utils.generic.isValidArray(layer.markets, true) &&
        layer.markets.some((market) => {
          return market.id === marketId;
        })
      );
    });

    const marketsArray = utils.layer.getMarkets(layer);

    return marketsArray.find((marketObj) => marketObj.id === marketId);
  },

  orderLayers: (layers) => {
    if (!utils.generic.isValidArray(layers, true)) return [];

    const primaryLayers = orderBy(
      layers.filter((layer) => utils.layer.isPrimary(layer)),
      ['amount'],
      ['desc']
    );
    const excessLayers = orderBy(
      layers.filter((layer) => !utils.layer.isPrimary(layer)),
      ['excess', 'amount'],
      ['asc', 'desc']
    );

    return [...primaryLayers, ...excessLayers];
  },
  getMudmap: (layers, config, statusMarketQuoted, type = 'written') => {
    if (!utils.generic.isValidArray(layers, true)) return [];

    const isWritten = type === 'written';
    const isSigned = type === 'signed';

    return layers
      .reduce((arr, layer) => {
        const marketsGroups = groupBy(get(layer, 'markets', []), (market) => get(market, 'market.capacityTypeId'));

        Object.entries(marketsGroups).forEach((marketGroup) => {
          const capacityTypeId = marketGroup[0];
          const markets = marketGroup[1];
          const marketsQuoted = utils.markets.getByStatusIds(markets, [statusMarketQuoted]);

          const layerId = `${layer.id}-${marketsQuoted.map((m) => m.id).join('-')}`;
          const layerCurrency = utils.layer.getCurrency(layer);
          const layerMultiplePrices = utils.markets.hasMultiplePremiums(marketsQuoted);
          const layerPremiumByCurrency = utils.markets.getPremiumByCurrency(marketsQuoted, layerCurrency, false, false);
          const layerWritten = utils.markets.getLineSize(marketsQuoted);
          const layerSigned = utils.markets.getLineSize(marketsQuoted, true);
          const layerConfig = config.find((l) => l.id === layerId) || {};

          // only keep layers with enough/valid data
          if (layer.amount && ((isWritten && layerWritten) || (isSigned && layerSigned))) {
            arr.push({
              id: layerId,
              order: layerConfig && layerConfig.order ? layerConfig.order : null,
              capacityId: parseInt(capacityTypeId),
              currency: utils.layer.getCurrency(layer),
              market: utils.layer.getName(layer),
              leads: marketsQuoted.reduce((leads, m) => {
                const id = utils.market.getId(m);
                const name = utils.market.getName(m);
                const notes = utils.market.getNotes(m);

                return name ? [...leads, { id, name, notes }] : leads;
              }, []),
              amount: layer.amount,
              xs: layer.excess || 0,
              premium: layerMultiplePrices ? utils.string.t('app.various') : layerPremiumByCurrency[layerCurrency] || 0,
              written: layerWritten ? layerWritten / 100 : 0,
              signed: layerSigned ? layerSigned / 100 : 0,
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

export default utilsLayers;
