import React from 'react';
import PropTypes from 'prop-types';

// app
import styles from './FilterChip.styles';
import * as utils from 'utils';

// mui
import { Chip, makeStyles } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';

FilterChipView.propTypes = {
  label: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  isFocused: PropTypes.bool,
  removeProps: PropTypes.shape({
    onClick: PropTypes.func,
  }),
};

export function FilterChipView({ isFocused, removeProps, label }) {
  const classes = makeStyles(styles, { name: 'FilterChip' })({ focus: isFocused, remove: utils.generic.isFunction(removeProps.onClick) });

  return (
    <Chip
      label={label}
      className={classes.chip}
      onDelete={removeProps.onClick}
      deleteIcon={removeProps.onClick ? <CancelIcon {...removeProps} /> : undefined}
    />
  );
}
