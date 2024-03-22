import React from 'react';
import config from 'config';

// app
import { PDFHeader, Translate } from 'components';
import styles from './PDFCover.styles';
import { makeStyles } from '@material-ui/core';

export function PDFCoverView({ title, subtitle }) {
  const classes = makeStyles(styles, { name: 'PDFCover' })();

  return (
    <div className={classes.root}>
      <PDFHeader />
      <img className={classes.photo} alt="" src={`${config.assets}/images/london-skyline.jpg`} />
      {title && <Translate className={classes.title} label={title} variant="h1" />}
      {subtitle && <Translate className={classes.subtitle} label={subtitle} variant="h2" />}
    </div>
  );
}
