import React from 'react';
import PropTypes from 'prop-types';

// app
import styles from './MudmapTranche.styles';
import * as utils from 'utils';

// mui
import { makeStyles, Typography } from '@material-ui/core';

MudmapTranche.propTypes = {
  tranche: PropTypes.object,
  margin: PropTypes.object,
  height: PropTypes.number,
  fullscreen: PropTypes.bool,
};

export default function MudmapTranche({ tranche, margin, height, fullscreen }) {
  let avg = (tranche.u + tranche.l) * 0.5;
  let offset = ((height - avg) / height) * 100;
  const classes = makeStyles(styles, { name: 'MudmapTranche' })({ offset, margin, fullscreen });

  return (
    <Typography className={classes.root} data-testid={`tranche-${tranche.l}-${tranche.u}`}>
      {utils.string.t('format.percent', { value: { number: tranche.percentage * 100 } })}
    </Typography>
  );
}
