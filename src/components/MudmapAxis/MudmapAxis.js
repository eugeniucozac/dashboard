import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// app
import styles from './MudmapAxis.styles';
import * as utils from 'utils';

// mui
import { makeStyles, Typography } from '@material-ui/core';

MudmapAxis.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  axis: PropTypes.oneOf(['x', 'y']),
  margin: PropTypes.object,
  width: PropTypes.number,
  height: PropTypes.number,
  currency: PropTypes.string,
  fullscreen: PropTypes.bool,
};

export default function MudmapAxis({ value, axis, margin, width, height, currency, fullscreen }) {
  const xAxis = axis === 'x';
  const yAxis = axis === 'y';
  const offset = (value / (xAxis ? width : height)) * 100;
  const isAxisX100 = xAxis && value === 1;
  const classes = makeStyles(styles, { name: 'MudmapAxis' })({ offset, margin, bold: isAxisX100, fullscreen });
  const testid = `axis-${axis}-${axis === 'x' ? Math.round(value * 10000) / 100 : value}`;

  return (
    <Typography className={classnames([classes.root, xAxis ? classes.xAxis : classes.yAxis])} data-testid={testid}>
      <span>
        {xAxis && utils.string.t('format.percent', { value: { number: value * 100 } })}
        {yAxis &&
          utils.string
            .t('format.currency', {
              value: { number: value, format: { average: true, totalLength: 12, lowPrecision: false, trimMantissa: true }, currency },
            })
            .replace(' ', '')}
      </span>
    </Typography>
  );
}
