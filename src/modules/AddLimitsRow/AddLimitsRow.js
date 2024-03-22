import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import compact from 'lodash/compact';
import xorWith from 'lodash/xorWith';
import { useFieldArray, useWatch } from 'react-hook-form';

// app
import { AddLimitsRowView } from './AddLimitsRow.view';
import { hideModal, showModal } from 'stores';

AddLimitsRow.propTypes = {
  field: PropTypes.object.isRequired,
  overflow: PropTypes.bool,
  removeLastField: PropTypes.bool,
  label: PropTypes.string,
  qualifier: PropTypes.string,
  formProps: PropTypes.object.isRequired,
  limitFieldOptions: PropTypes.array,
};

AddLimitsRow.defaultProps = {
  overflow: true,
};

const validFields = ['text', 'number', 'datepicker', 'select', 'autocomplete', 'autocompletemui', 'radio', 'checkbox', 'toggle', 'hidden'];

export default function AddLimitsRow({ field, limitFieldOptions, fieldName, overflow, removeLastField, label, qualifier, formProps }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const dispatch = useDispatch();

  const fieldValues = useWatch({
    control: formProps.control,
    name: field.name,
    defaultValue: [],
  });

  const fieldValuesFieldOptions = fieldValues
    ?.filter((fieldValue) => fieldValue.fieldName === fieldName)
    ?.map((fieldValue) => fieldValue.limitFieldOptions);

  const remainingLimitFieldOptions = xorWith(limitFieldOptions, fieldValuesFieldOptions, (a, b) => {
    return a?.value === b?.value;
  }).filter((value) => value);

  const { fields, append, remove } = useFieldArray({
    control: formProps.control,
    name: field.name,
  });

  const tabFieldsCount = fields.filter((field) => field.fieldName === fieldName).length || 0;

  const cols = [
    ...compact(
      field?.arrayItemDef?.map((def) => {
        if (!validFields.includes(def.type) || def.type === 'hidden') return null;

        return { id: def.name, label: def.label };
      })
    ),
    { id: 'delete' },
  ];

  // abort
  if (!field || !field.name || !field.arrayItemDef) return null;
  if (!formProps.control) return null;

  const launchPasteFromExcelModal = (data) => {
    dispatch(
      showModal({
        component: 'PASTE_FROM_EXCEL',
        props: {
          title: 'app.pasteFromExcel',
          fullWidth: true,
          maxWidth: 'lg',
          componentProps: {
            ...data,
          },
        },
      })
    );
  };

  const closePasteFromExcelModal = () => {
    dispatch(hideModal('PASTE_FROM_EXCEL'));
  };

  const handleChangePage = (e, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
  };

  return (
    <AddLimitsRowView
      cols={cols}
      field={field}
      fields={fields}
      fieldName={fieldName}
      limitFieldOptions={remainingLimitFieldOptions || []}
      validFields={validFields}
      formProps={formProps}
      overflow={overflow}
      removeLastField={removeLastField}
      label={label}
      qualifier={qualifier}
      handlers={{
        launchPasteFromExcelModal,
        closePasteFromExcelModal,
        append,
        remove,
      }}
      pagination={{
        page,
        rowsPerPage,
        count: tabFieldsCount,
        handleChangeRowsPerPage,
        handleChangePage,
      }}
    />
  );
}
