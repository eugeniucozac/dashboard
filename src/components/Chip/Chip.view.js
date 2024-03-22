import React from 'react';
import PropTypes from 'prop-types';

// app
import styles from './Chip.styles';

// mui
import { makeStyles, Chip as MuiChip } from '@material-ui/core';

ChipView.propTypes = {
  type: PropTypes.oneOf(['new', 'info', 'success', 'alert', 'light', 'error', 'unknown', 'pink']),
  label: PropTypes.node.isRequired,
  testid: PropTypes.string,
  nestedClasses: PropTypes.shape({
    root: PropTypes.string,
    label: PropTypes.string,
  }),
};

ChipView.defaultProps = {
  nestedClasses: {},
};

export function ChipView({ type, testid, nestedClasses, ...rest }) {
  const classes = makeStyles(styles, { name: 'Chip' })({ type, ...rest });

  return <MuiChip {...rest} classes={nestedClasses} className={classes.root} data-testid={testid} />;
}
