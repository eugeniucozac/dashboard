import React from 'react';

// app
import styles from './PDFFooter.styles';
import { makeStyles } from '@material-ui/core';
import * as utils from 'utils';

export function PDFFooterView({ pageNo, pageCount }) {
  const classes = makeStyles(styles, { name: 'PDFFooter' })();

  return (
    <div className={classes.root}>
      <span>{utils.date.today('MMMM Do YYYY')}</span>
      <span className={classes.confidential}>{utils.string.t('app.confidential')}</span>
      <span>
        {utils.string.t('app.page')} {pageNo}/{pageCount}
      </span>
    </div>
  );
}
