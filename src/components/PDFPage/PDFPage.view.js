import React from 'react';

// app
import styles from './PDFPage.styles';
import { makeStyles } from '@material-ui/core';
import { PDFFooter, PDFHeader } from 'components';

export function PDFPageView({ children, pageCount, pageNo }) {
  const classes = makeStyles(styles, { name: 'PDFPage' })();

  return (
    <div className={classes.root}>
      <div className={classes.page}>
        <PDFHeader size="sm" />
        <div className={classes.content}>{children}</div>
        <PDFFooter pageCount={pageCount} pageNo={pageNo} />
      </div>
    </div>
  );
}
