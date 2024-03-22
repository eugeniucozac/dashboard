import React from 'react';
import PropTypes from 'prop-types';

// app
import { EditableTableView } from './EditableTable.view';

EditableTable.propTypes = {
  fields: PropTypes.shape({
    arrayItemDef: PropTypes.array,
    fieldData: PropTypes.array,
  }),
  tableRows: PropTypes.array,
  isTableEditable: PropTypes.bool,
  handlers: PropTypes.shape({
    handleTableTextboxChange: PropTypes.func,
    handleCheckboxClick: PropTypes.func,
    handleTableSelectChange: PropTypes.func,
    handleTableDatePickerChange: PropTypes.func,
    handleCopyTableRowData: PropTypes.func,
    handleTableUndoRowData: PropTypes.func,
  }),
};

export default function EditableTable({ fields, tableRows, isTableEditable, handlers }) {
  return <EditableTableView fields={fields} tableRows={tableRows} isTableEditable={isTableEditable} handlers={handlers} />;
}
