import React from 'react';
import PropTypes from 'prop-types';
import kebabCase from 'lodash/kebabCase';

// app
import styles from './MudmapLimit.styles';
import * as utils from 'utils';

// mui
import { makeStyles, Typography } from '@material-ui/core';

MudmapLimit.propTypes = {
  limit: PropTypes.object,
  height: PropTypes.number,
  currency: PropTypes.string,
  fullscreen: PropTypes.bool,
};

export default function MudmapLimit({ limit, height, currency, fullscreen }) {
  const offset = (limit.value / height) * 100;
  const classes = makeStyles(styles, { name: 'MudmapLimit' })({ offset, fullscreen });
  const amount = utils.string.t('format.currency', {
    value: { number: limit.value, format: { average: true, totalLength: 12, lowPrecision: false, trimMantissa: true }, currency },
  });

  return (
    <div className={classes.root} data-name={limit.name} data-testid={`limit-${kebabCase(limit.name)}-${limit.value}`}>
      {[...Array(12)].map((_, i) => {
        return (
          <Typography key={i} className={classes.label}>
            {`${limit.name} (${amount.replace(' ', '')})`}
          </Typography>
        );
      })}
    </div>
  );
}
