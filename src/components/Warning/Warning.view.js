import React from 'react';
import PropTypes from 'prop-types';

// app
import styles from './Warning.styles';

// mui
import { makeStyles, Typography } from '@material-ui/core';

WarningView.propTypes = {
  type: PropTypes.oneOf(['default', 'info', 'alert', 'error', 'success']).isRequired,
  text: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large']).isRequired,
  align: PropTypes.oneOf(['left', 'center', 'right']).isRequired,
  icon: PropTypes.object,
  border: PropTypes.bool,
  hasboxShadowColor: PropTypes.bool,
  backGround: PropTypes.string,
};

export function WarningView({ type, text, size, align, icon, border, backGround, hasboxShadowColor }) {
  const classes = makeStyles(styles, { name: 'Warning' })({ type, size, align, border, backGround, hasboxShadowColor });
  const IconComponent = icon;

  return (
    <Typography variant="body2" className={classes.root} data-testid={`warning-${type}`}>
      {icon && <IconComponent className={classes.icon} />}
      {text}
    </Typography>
  );
}
