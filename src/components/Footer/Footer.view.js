import React from 'react';
import PropTypes from 'prop-types';

// app
import styles from './Footer.styles';
import * as utils from 'utils';

// mui
import { makeStyles, Typography } from '@material-ui/core';

FooterView.propTypes = {
  build: PropTypes.string,
  brand: PropTypes.string,
  isDev: PropTypes.bool,
};

export function FooterView({ build, brand, isDev }) {
  const classes = makeStyles(styles, { name: 'Footer' })();

  return (
    <div className={classes.footer} data-testid="footer">
      <Typography variant="caption" color="textSecondary">
        <span
          dangerouslySetInnerHTML={{
            __html: `${utils.string.t('app.copyright', { appname: utils.app.getAppName(brand) })} ${new Date().getFullYear()}`,
          }}
        />
      </Typography>

      {isDev && (
        <Typography variant="caption" color="textSecondary" className={classes.version}>
          {`${utils.string.t('app.version').toLowerCase()} ${build}`}
        </Typography>
      )}
    </div>
  );
}
