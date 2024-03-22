import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import ResizeObserver from 'resize-observer-polyfill';
import merge from 'lodash/merge';
import debounce from 'lodash/debounce';
import get from 'lodash/get';

// app
import styles from './Mudmap.styles';
import { MudmapAxis, MudmapLayer, MudmapLimit, MudmapTranche } from 'components';
import {
  sortByLeft,
  setLefts,
  mapById,
  calcMaxAmount,
  calcMaxPercentage,
  getLimits,
  getTranches,
  getXaxis,
  getYaxis,
} from './Mudmap.utils';
import * as utils from 'utils';

// mui
import { makeStyles } from '@material-ui/core';

Mudmap.propTypes = {
  items: PropTypes.array,
  capacities: PropTypes.array,
  limits: PropTypes.array,
  currency: PropTypes.string,
  ratio: PropTypes.number,
  fullscreen: PropTypes.bool,
  type: PropTypes.oneOf(['written', 'signed']),
  handlers: PropTypes.object,
};

Mudmap.defaultProps = {
  currency: '',
  capacities: [],
  ratio: 9 / 16, // 16:9 ratio
  type: 'written',
  handlers: {},
};

export default function Mudmap({ items, capacities, limits, currency, ratio, fullscreen, type, handlers }) {
  const margin = {
    top: 24,
    right: fullscreen ? 60 : 48,
    bottom: fullscreen ? 32 : 24,
    left: fullscreen ? 60 : 48,
  };

  const classes = makeStyles(styles, { name: 'Mudmap' })({ margin });
  const mudMapRef = useRef(null);

  const layerById = mapById(setLefts(items, type));

  const [quotes, setQuotes] = useState(items);
  const [dimensions, setDimensions] = useState({});
  const [draggingId, setDraggingId] = useState(null);
  const [zIndex, setZIndex] = useState(2);
  const [layerMap, setLayerMap] = useState(layerById);
  const [layerDraggingMap, setLayerDraggingMap] = useState(layerById);

  const layers = setLefts(quotes, type);
  const layersDragging = Object.values(layerDraggingMap);
  const maxAmount = calcMaxAmount(layers);
  const maxPercentage = calcMaxPercentage(layers, type);
  const isLoaded = maxAmount > 0;

  const xAxis = isLoaded ? getXaxis(0, 1, maxPercentage) : [0, 1];
  const yAxis = isLoaded ? getYaxis(layers) : [];
  const yAxisLimits = isLoaded ? getLimits(limits) : [];
  const tranches = isLoaded ? getTranches(layers, type) : [];

  const handleResize = () => {
    setDimensions({
      width: get(mudMapRef, 'current.clientWidth', 0),
      height: get(mudMapRef, 'current.clientHeight', 0),
    });
  };

  // first render
  useEffect(() => {
    const debouncedObserver = debounce((entries, observer) => {
      if (entries && entries[0]) handleResize();
    }, 250);

    const mudmapElem = mudMapRef.current;
    if (!mudmapElem) return;

    const ro = new ResizeObserver(debouncedObserver);

    handleResize();
    window.addEventListener('resize', handleResize);

    // check if the mudmap is resized and update width/height accordingly
    ro.observe(mudmapElem);

    // cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      ro.unobserve(mudmapElem);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // every render
  useEffect(
    () => {
      setQuotes(items);
      setLayerMap(layerById);
      setLayerDraggingMap(layerById);
    },
    [items] // eslint-disable-line react-hooks/exhaustive-deps
  );

  // abort
  if (!utils.generic.isValidArray(quotes, true)) return null;

  const stopDragging = () => {
    setTimeout(() => {
      setDraggingId(null);
      setLayerMap(layerDraggingMap);
      setQuotes(Object.values(layerDraggingMap));
      handlers.reorderMudmap(layerDraggingMap);
    }, 20);
  };

  const startDragging = (layerId) => {
    setZIndex(zIndex + 1);
    setDraggingId(layerId);
  };

  const setDragging = (layerMap) =>
    debounce((layerId, moveDeltaX) => {
      const copyLayerMap = merge({}, layerMap);

      copyLayerMap[layerId].left += (moveDeltaX / dimensions.width) * maxPercentage;
      setLefts(sortByLeft(Object.values(copyLayerMap), type), type);

      if (layerDraggingMap[layerId].order !== copyLayerMap[layerId].order) {
        setLayerDraggingMap(copyLayerMap);
      }
    }, 20);

  const getCapacityColor = (capacityId) => {
    const capacity = capacities.find((c) => c.id === capacityId) || {};

    return capacity.color;
  };

  return (
    <div className={classes.root} data-testid="mudmap" style={{ paddingTop: `${ratio * 100}%` }}>
      <div className={classes.container}>
        <div ref={mudMapRef} className={classes.mudmap}>
          {yAxis.map((value, idx) => {
            return (
              <MudmapAxis key={idx} axis="y" value={value} height={maxAmount} margin={margin} fullscreen={fullscreen} currency={currency} />
            );
          })}

          {xAxis.map((value, idx) => {
            return <MudmapAxis key={idx} axis="x" value={value} width={maxPercentage} margin={margin} fullscreen={fullscreen} />;
          })}

          {yAxisLimits.map((a) => {
            return (
              <MudmapLimit
                key={a}
                limit={limits.find((l) => l.value === a)}
                height={maxAmount}
                fullscreen={fullscreen}
                currency={currency}
              />
            );
          })}

          {tranches.map((t) => {
            return <MudmapTranche key={`${t.u}-${t.l}`} tranche={t} height={maxAmount} margin={margin} fullscreen={fullscreen} />;
          })}

          {layers.map((l) => {
            if (!draggingId || draggingId === l.id) {
              return (
                <MudmapLayer
                  key={l.id}
                  layer={l}
                  maxAmount={maxAmount}
                  maxPercentage={maxPercentage}
                  type={type}
                  isDragging={draggingId && draggingId === l.id}
                  zIndex={zIndex}
                  currency={l.currency}
                  color={getCapacityColor(l.capacityId)}
                  startDragging={startDragging}
                  setDragging={setDragging(layerMap)}
                  stopDragging={stopDragging}
                />
              );
            }
            return null;
          })}

          {layersDragging.map((l) => {
            if (draggingId) {
              return (
                <MudmapLayer
                  key={l.id}
                  layer={l}
                  maxAmount={maxAmount}
                  maxPercentage={maxPercentage}
                  type={type}
                  isPlaceholder={draggingId && draggingId === l.id}
                  currency={l.currency}
                  color={getCapacityColor(l.capacityId)}
                  startDragging={startDragging}
                  setDragging={setDragging(layerMap)}
                  stopDragging={stopDragging}
                />
              );
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
}
