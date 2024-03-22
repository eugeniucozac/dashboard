import React from 'react';
import PropTypes from 'prop-types';

// app
import { TableToolbarView } from './TableToolbar.view';

TableToolbar.propTypes = {
  nestedClasses: PropTypes.shape({
    root: PropTypes.string,
  }),
};

TableToolbar.defaultProps = {
  nestedClasses: {},
};

export function TableToolbar({ ...props }) {
  return <TableToolbarView {...props} />;
}

export default TableToolbar;
