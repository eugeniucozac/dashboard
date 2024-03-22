import React from 'react';
import PropTypes from 'prop-types';
import clickDrag from 'react-clickdrag';
import chroma from 'chroma-js';
import round from 'lodash/round';
import isString from 'lodash/isString';

// app
import * as utils from 'utils';

// mui
import { Typography } from '@material-ui/core';

MudmapLayer.propTypes = {
  layer: PropTypes.object,
  currency: PropTypes.string,
  color: PropTypes.string,
  maxAmount: PropTypes.number,
  maxPercentage: PropTypes.number,
  type: PropTypes.oneOf(['written', 'signed']),
  isDragging: PropTypes.bool,
  isPlaceholder: PropTypes.bool,
  zIndex: PropTypes.number,
  startDragging: PropTypes.func,
  setDragging: PropTypes.func,
  stopDragging: PropTypes.func,
  dataDrag: PropTypes.object, // from react-clickdrag
};

MudmapLayer.defaultProps = {
  color: '#e3e3e3',
  type: 'written',
};

export function MudmapLayer({
  layer,
  currency,
  color,
  maxAmount,
  maxPercentage,
  type,
  isDragging,
  isPlaceholder,
  zIndex,
  startDragging,
  setDragging,
  stopDragging,
  dataDrag,
}) {
  const isWritten = type === 'written';
  const isSigned = type === 'signed';
  const valuePercentage = isWritten ? layer.written : isSigned ? layer.signed : 0;
  const top = round(((maxAmount - (layer.amount + layer.xs)) / maxAmount) * 100, 4);
  const left = round((layer.left / maxPercentage) * 100, 4);
  const width = round((valuePercentage / maxPercentage) * 100, 4);
  const height = round((layer.amount / maxAmount) * 100, 4);

  // using inline styles as this seems to offer better performance than
  // material-UI generated styles updating hundreds of times per second while dragging
  const style = {
    root: {
      position: 'absolute',
      textAlign: 'center',
      backgroundColor: color,
      border: `4px solid ${chroma(chroma(color).darken(0.5))}`,
      overflow: 'hidden',
      cursor: 'pointer',
      width: `${width}%`,
      height: `${height}%`,
      top: `${top}%`,
      left: `calc(${left}% + ${dataDrag.isMouseDown ? dataDrag.moveDeltaX || 0 : 0}px)`,
      padding: '2px 8px',
      zIndex: dataDrag.isMouseDown ? zIndex : 1,
      transition: dataDrag.isMouseDown ? 'width 300ms ease, height 350ms ease' : 'all 350ms ease',
      opacity: isDragging ? 0.9 : isPlaceholder ? 0.25 : 1,
      filter: isPlaceholder ? 'blur(1px)' : 'none',
    },
    title: {
      fontSize: 12,
      fontSize: 'min(max(8px, 1.3vw), 13px)', // eslint-disable-line no-dupe-keys
      fontWeight: 600,
      lineHeight: 1.25,
      marginTop: 4,
      marginBottom: 4,
      userSelect: 'none',
      color: utils.color.contrast(color),
    },
    subtitle: {
      fontSize: 10,
      fontSize: 'min(max(8px, 1.1vw), 11px)', // eslint-disable-line no-dupe-keys
      fontWeight: 400,
      lineHeight: 1.1,
      marginTop: 0,
      marginBottom: 6,
      opacity: 0.8,
      userSelect: 'none',
      color: utils.color.contrast(color),
    },
    percentage: {
      fontSize: 9,
      fontSize: 'min(max(7px, 1vw), 10px)', // eslint-disable-line no-dupe-keys
      marginBottom: -1,
      opacity: 0.7,
      userSelect: 'none',
      color: utils.color.contrast(color),
    },
    premium: {
      fontSize: 8,
      fontSize: 'min(max(6px, 0.9vw), 9px)', // eslint-disable-line no-dupe-keys
      opacity: 0.7,
      userSelect: 'none',
      color: utils.color.contrast(color),
    },
  };

  if (dataDrag.isMouseDown) {
    setDragging(layer.id, dataDrag.moveDeltaX);
  }

  const percentage = utils.string.t('format.percent', { value: { number: valuePercentage * 100 } });
  const premium = isString(layer.premium)
    ? layer.premium
    : utils.string.t('format.currency', { value: { number: layer.premium, currency } });
  const amount = utils.string.t('format.currency', { value: { number: layer.amount, currency } });
  const excess = utils.string.t('format.currency', { value: { number: layer.xs, currency } });
  const leads = (layer && layer.leads) || [];

  return (
    <div
      onMouseUp={() => stopDragging()}
      onMouseDown={() => startDragging(layer.id)}
      style={style.root}
      data-testid={`layer-${layer.id}`}
      title={
        (layer.market ? `${layer.market}${utils.generic.isValidArray(layer.leads, true) ? '\n\n' : ''}` : '') +
        leads.map((lead) => ` • ${lead.name}${lead.notes ? `: ${lead.notes}` : ''}`).join('\n') +
        `\n\n${utils.string.t(`placement.generic.${type}`)}: ${percentage}` +
        `\n${utils.string.t('placement.generic.premium')}: ${premium}` +
        `\n${utils.string.t('placement.generic.amount')}: ${amount}` +
        `\n${utils.string.t('placement.generic.excess')}: ${excess}`
      }
    >
      <Typography variant="subtitle1" style={style.title}>
        {layer.market}
      </Typography>
      <Typography variant="subtitle2" style={style.subtitle}>
        {leads.map((lead) => lead.name).join(', ')}
      </Typography>
      <Typography variant="body1" style={style.percentage}>
        {percentage}
      </Typography>
      <Typography variant="body2" style={style.premium}>
        {premium}
      </Typography>
    </div>
  );
}

export default clickDrag(MudmapLayer, { touch: true });
