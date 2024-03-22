import * as utils from 'utils';
import config from 'config';
import isNumber from 'lodash/isNumber';
import round from 'lodash/round';

export const setLefts = (layers, type = 'written') => {
  // abort
  if (!utils.generic.isValidArray(layers, true)) return [];

  const setLayers = [];

  const getRights = () => {
    return setLayers.reduce(
      (arr, sl) => {
        arr.push(sl.left + sl[type]);
        return arr;
      },
      [0]
    );
  };

  const isClear = (left, right, amount, xs) => {
    for (let i = 0; i < setLayers.length; i++) {
      let sl = setLayers[i];
      let yAxisClear = sl.amount + sl.xs <= xs || sl.xs >= amount + xs;
      let xAxisClear = sl.left + sl[type] <= left || sl.left >= right;
      if (!yAxisClear && !xAxisClear) return false;
    }
    return true;
  };

  const setLeft = (layer) => {
    const rights = getRights().sort();

    for (let i = 0; i < rights.length; i++) {
      let left = rights[i];
      if (isClear(left, left + layer[type], layer.amount, layer.xs)) {
        layer.left = round(left, 6);
        return;
      }
    }
  };

  layers
    .sort((a, b) => a.order && a.order - b.order)
    .forEach((l) => {
      setLeft(l);
      setLayers.push(l);
    });

  return setLayers;
};

export const mapById = (layers) => {
  // abort
  if (!utils.generic.isValidArray(layers, true)) return {};

  return layers.reduce((map, l) => {
    map[l.id] = l;
    return map;
  }, {});
};

export const sortByLeft = (layers, type = 'written') => {
  // abort
  if (!utils.generic.isValidArray(layers, true)) return [];

  layers.sort((a, b) => {
    return a.left + a[type] * 0.5 - (b.left + b[type] * 0.5);
  });

  for (let i = 0; i < layers.length; i++) {
    layers[i].order = i + 1;
  }
  return layers;
};

export const calcMaxAmount = (layers) => {
  // abort
  if (!utils.generic.isValidArray(layers, true)) return 0;

  const maxAmount = layers.reduce((max, layer) => {
    return layer.amount + layer.xs > max ? layer.amount + layer.xs : max;
  }, 0);

  return round(maxAmount, config.ui.format.currency.decimal);
};

export const calcMaxPercentage = (layers, type = 'written') => {
  // abort
  if (!utils.generic.isValidArray(layers, true)) return 1;

  const maxPercentage = layers.reduce((max, layer) => {
    const right = isNumber(layer.left + layer[type]) ? layer.left + layer[type] : 0;
    return right > max ? right : max;
  }, 1);

  return round(maxPercentage, config.ui.format.percent.decimal);
};

export const getXaxis = (...values) => {
  // abort
  if (!utils.generic.isValidArray(values, true)) return [];

  const valuesNumber = values.reduce((acc, value) => {
    if (isNumber(value)) acc.push(value);
    return acc;
  }, []);

  // returns set of unique values
  return [...new Set(valuesNumber)];
};

export const getYaxis = (layers) => {
  // abort
  if (!utils.generic.isValidArray(layers, true)) return [0];

  const values = layers.reduce(
    (acc, layer) => {
      if (isNumber(layer.xs)) acc.push(layer.xs);
      if (isNumber(layer.xs) && isNumber(layer.amount)) acc.push(layer.amount + layer.xs);
      return acc;
    },
    [0]
  );

  // returns set of unique values
  return [...new Set(values)].sort((a, b) => a - b);
};

export const getLimits = (limits) => {
  // abort
  if (!utils.generic.isValidArray(limits, true)) return [];

  const values = limits.reduce((acc, limit) => {
    if (isNumber(limit.value)) acc.push(limit.value);
    return acc;
  }, []);

  return [...new Set(values)].sort((a, b) => a - b);
};

export const getTranches = (layers, type = 'written') => {
  // abort
  if (!utils.generic.isValidArray(layers, true)) return [];

  const values = layers.reduce((acc, layer) => {
    if (isNumber(layer.xs)) acc.push(layer.xs);
    if (isNumber(layer.xs) && isNumber(layer.amount)) acc.push(layer.amount + layer.xs);
    return acc;
  }, []);

  // returns set of unique values
  const uniqueValuesSorted = [...new Set(values)].sort((a, b) => a - b);

  return uniqueValuesSorted.reduce((acc, cur, idx, src) => {
    if (idx >= src.length - 1) return acc;
    return [
      ...acc,
      {
        l: cur,
        u: src[idx + 1],
        percentage: percentageInTranche(layers, cur, src[idx + 1], type),
      },
    ];
  }, []);
};

export const percentageInTranche = (layers, lower, upper, type = 'written') => {
  // abort
  if (!isNumber(lower) || !isNumber(upper) || lower === upper || !utils.generic.isValidArray(layers, true)) return 0;

  const percentage = layers.reduce((sum, layer) => {
    let w = layer.xs <= lower && layer.xs + layer.amount >= upper ? layer[type] : 0;
    return sum + w;
  }, 0);

  return round(percentage, config.ui.format.percent.decimal);
};
