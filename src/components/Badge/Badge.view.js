import React from 'react';
import PropTypes from 'prop-types';

// app
import styles from './Badge.styles';

// mui
import { makeStyles, Badge as MuiBadge } from '@material-ui/core';

BadgeView.propTypes = {
  type: PropTypes.oneOf(['info', 'success', 'alert', 'error', 'unknown']),
  compact: PropTypes.bool,
  standalone: PropTypes.bool,
};

BadgeView.defaultProps = {
  type: 'unknown',
};

export function BadgeView({ type, compact, standalone, children, ...rest }) {
  const classes = makeStyles(styles, { name: 'Badge' })({ type, compact, standalone });

  return (
    <MuiBadge
      {...rest}
      children={!children ? <span /> : children}
      classes={{
        badge: classes.badge,
      }}
    />
  );
}
