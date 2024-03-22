import React from 'react';
import PropTypes from 'prop-types';

// app
import { DynamicTableRowView } from './DynamicTableRow.view';

DynamicTableRow.propTypes = {
  row: PropTypes.object.isRequired,
  formProps: PropTypes.object.isRequired,
};

export default function DynamicTableRow({ row, formProps }) {
  return <DynamicTableRowView row={row} formProps={formProps} />;
}
