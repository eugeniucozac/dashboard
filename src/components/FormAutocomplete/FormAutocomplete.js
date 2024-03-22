import React from 'react';
import PropTypes from 'prop-types';

// app
import { FormAutocompleteView } from './FormAutocomplete.view';

FormAutocomplete.propTypes = {
  control: PropTypes.object,
  name: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  optionKey: PropTypes.string.isRequired,
  optionLabel: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  label: PropTypes.string,
  placeholder: PropTypes.string,
  hint: PropTypes.string,
  error: PropTypes.shape({
    message: PropTypes.string,
    type: PropTypes.string,
  }),
  muiComponentProps: PropTypes.object,
  innerComponentProps: PropTypes.object,
  handleUpdate: PropTypes.func,
};

FormAutocomplete.defaultProps = {
  muiComponentProps: {},
  options: [],
  optionKey: 'value',
  optionLabel: 'label',
  value: [],
};

export default function FormAutocomplete({
  control,
  defaultValue,
  name,
  options,
  optionKey,
  optionLabel,
  value,
  label,
  placeholder,
  hint,
  error,
  muiComponentProps,
  innerComponentProps,
  handleUpdate,
}) {
  const fieldProps = {
    id: name,
    name,
    suggestions: options,
    optionKey,
    optionLabel,
    label,
    placeholder,
    error,
    helperText: hint,
    muiComponentProps,
    innerComponentProps,
    handleUpdate,
  };

  return <FormAutocompleteView control={control} name={name} value={value} defaultValue={defaultValue} fieldProps={fieldProps} />;
}
