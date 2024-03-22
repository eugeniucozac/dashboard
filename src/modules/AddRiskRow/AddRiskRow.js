import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import compact from 'lodash/compact';

// app
import { AddRiskRowView } from './AddRiskRow.view';
import { hideModal, showModal } from 'stores';

AddRiskRow.propTypes = {
  field: PropTypes.object.isRequired,
  formProps: PropTypes.object.isRequired,
  overflow: PropTypes.bool,
  formatData: PropTypes.string,
  removeLastField: PropTypes.bool,
};

AddRiskRow.defaultProps = {
  overflow: true,
};

export default function AddRiskRow({ field, formProps, overflow, formatData, removeLastField }) {
  const dispatch = useDispatch();
  const fieldValue = formProps?.watch(field.name);

  useEffect(() => {
    fieldValue === null && formProps?.setValue(field.name, []);
  }, [field?.name, fieldValue, formProps]);

  // abort
  if (!field || !field.name || !field.arrayItemDef) return null;
  if (!formProps || !formProps.control) return null;

  const validFields = [
    'text',
    'number',
    'datepicker',
    'select',
    'autocomplete',
    'autocompletemui',
    'radio',
    'checkbox',
    'toggle',
    'hidden',
  ];

  const cols = [
    ...compact(
      field.arrayItemDef.map((def) => {
        if (!validFields.includes(def.type) || def.type === 'hidden') return null;

        return { id: def.name, label: def.label };
      })
    ),
    { id: 'delete' },
  ];

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

  return fieldValue ? (
    <AddRiskRowView
      cols={cols}
      field={field}
      validFields={validFields}
      formProps={formProps}
      overflow={overflow}
      formatData={formatData}
      removeLastField={removeLastField}
      handlers={{
        launchPasteFromExcelModal,
        closePasteFromExcelModal,
      }}
    />
  ) : null;
}
