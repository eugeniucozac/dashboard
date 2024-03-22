import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// app
import styles from './FormRequired.styles';
import * as utils from 'utils';

// mui
import { makeStyles, Typography } from '@material-ui/core';

FormRequiredView.propTypes = {
  type: PropTypes.oneOf(['default', 'dialog', 'blank']),
};

export function FormRequiredView({ type }) {
  const classes = makeStyles(styles, { name: 'FormRequired' })();

  return (
    <Typography variant="body2" align="right" className={classnames({ [classes.root]: true, [classes.dialog]: type === 'dialog' })}>
      {utils.string.t('app.requiredFields')}
    </Typography>
  );
}
