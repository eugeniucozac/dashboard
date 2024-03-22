import React from 'react';
import PropTypes from 'prop-types';
import compact from 'lodash/compact';
import { useFieldArray, useWatch } from 'react-hook-form';

// app
import FormDataGridView from './FormDataGrid.view';
import * as utils from 'utils';

const FormDataGrid = ({ field, formProps, overflow, showCopyIconFirst }) => {
  const { fields } = useFieldArray({
    name: field?.name,
    control: formProps?.control,
  });

  const fieldsValues = useWatch({
    control: formProps?.control,
    name: field?.name,
  });

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

  const customFields = ['stringDisplay', 'sumOfValues'];

  const cols = [
    ...compact(
      field.arrayItemDef.map((def) => {
        if (![...validFields, ...customFields].includes(def.type) || def.type === 'hidden') return null;

        return { id: def.name, label: def.label, ...(def.width && { width: `${def.width}px` }) };
      })
    ),
  ];
  const copyRow = { id: 'copy', width: 40 };

  showCopyIconFirst ? cols.unshift(copyRow) : cols.push(copyRow);

  const copyFields = field.arrayItemDef.filter((item) => !item?.excludeCopy).map((item) => item.name);

  const copyRowData = (index) => {
    const updateValues = fieldsValues[index - 1];

    if (utils.generic.isValidObject(updateValues) && utils.generic.isFunction(formProps.setValue)) {
      copyFields.forEach((name) => {
        const fieldName = `${field.name}[${index}].${name}`;
        const fieldValue = updateValues[name];

        formProps.setValue(fieldName, fieldValue);
      });
    }
  };

  return (
    <FormDataGridView
      cols={cols}
      field={field}
      validFields={validFields}
      customFields={customFields}
      formProps={formProps}
      overflow={overflow}
      fields={fields}
      showCopyIconFirst={showCopyIconFirst}
      handlers={{
        copyRowData: copyRowData,
      }}
    />
  );
};

FormDataGrid.propTypes = {
  field: PropTypes.object.isRequired,
  formProps: PropTypes.object.isRequired,
  overflow: PropTypes.bool,
  showCopyIconFirst: PropTypes.bool,
};

FormDataGrid.defaultProps = {
  overflow: true,
  showCopyIconFirst: false,
};

export default FormDataGrid;
