import React from 'react';
import PropTypes from 'prop-types';
import { useWatch } from 'react-hook-form';
// app
import {
  FormAutocomplete,
  FormAutocompleteMui,
  FormAutocompleteMuiAsync,
  FormCheckbox,
  FormDate,
  FormHidden,
  FormRadio,
  FormSelect,
  FormText,
  FormToggle,
  FormLabel,
} from 'components';

AddRiskFormFieldView.propTypes = {
  field: PropTypes.object.isRequired,
  control: PropTypes.object.isRequired,
  checkboxProps: PropTypes.object.isRequired,
  selectProps: PropTypes.object.isRequired,
};

export function AddRiskFormFieldView({ field, control, checkboxProps, selectProps, setValue }) {
  const fieldMap = {
    text: FormText,
    number: FormText,
    datepicker: FormDate,
    select: FormSelect,
    selectAsync: FormSelect,
    autocompletemuiAsync: FormAutocompleteMuiAsync,
    autocomplete: FormAutocomplete,
    autocompletemui: FormAutocompleteMui,
    radio: FormRadio,
    checkbox: FormCheckbox,
    toggle: FormToggle,
    hidden: FormHidden,
    label: FormLabel,
  };

  const FieldComponent = fieldMap[field.type];
  const dependants = field?.dependants;
  const dependentBy = dependants?.map((value) => value.split(':')[1]);
  const dependentFieldsValues = useWatch({
    control,
    name: dependentBy,
  });

  // abort
  if (!FieldComponent) return null;

  return (
    <FieldComponent
      key={field.name}
      control={control}
      setValue={setValue}
      {...checkboxProps}
      {...selectProps}
      {...field}
      dependentFieldsValues={dependentFieldsValues}
      dependentBy={dependentBy}
    />
  );
}
