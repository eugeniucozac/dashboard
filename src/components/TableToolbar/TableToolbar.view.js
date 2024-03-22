import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// app
import styles from './TableToolbar.style';

// mui
import { Box, makeStyles } from '@material-ui/core';

TableToolbarView.propTypes = {
  nestedClasses: PropTypes.shape({
    root: PropTypes.string,
  }),
};

TableToolbarView.defaultProps = {
  nestedClasses: {},
};

export function TableToolbarView({ nestedClasses, children }) {
  const classes = makeStyles(styles, { name: 'TableToolbar' })();

  return (
    <Box className={classnames({ [classes.root]: true, [nestedClasses.root]: Boolean(nestedClasses.root) })} data-testid="table-toolbar">
      {children}
    </Box>
  );
}
