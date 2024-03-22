import React from 'react';
import PropTypes from 'prop-types';

// app
import { TableActionsView } from './TableActions.view';

TableActions.propTypes = {
  nestedClasses: PropTypes.shape({
    root: PropTypes.string,
  }),
};

TableActions.defaultProps = {
  nestedClasses: {},
};

export function TableActions({ ...props }) {
  return <TableActionsView {...props} />;
}

export default TableActions;
