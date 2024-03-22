import React from 'react';
import PropTypes from 'prop-types';

// app
import { DynamicTableView } from './DynamicTable.view';

DynamicTable.propTypes = {
  rows: PropTypes.array.isRequired,
  columnHeaders: PropTypes.array.isRequired,
  formProps: PropTypes.object.isRequired,
};

DynamicTable.defaultProps = {
  columnHeaders: [],
  rows: [],
};

export default function DynamicTable({ rows, columnHeaders, formProps }) {
  return <DynamicTableView formProps={formProps} rows={rows} columnHeaders={columnHeaders} />;
}
