import React from 'react';

// app
import styles from './PDFHeader.styles';
import { makeStyles } from '@material-ui/core';
import { Logo } from 'components';
import config from 'config';

const logoSize = {
  sm: 20,
  md: 30,
};

export function PDFHeaderView({ size }) {
  const classes = makeStyles(styles, { name: 'PDFHeader' })({ logoSize: logoSize[size] });

  return (
    <div className={classes.root}>
      <Logo height={logoSize[size]} />
      <img className={classes.logo} alt="" src={`${config.assets}/logo/price-forbes.png`} />
    </div>
  );
}
