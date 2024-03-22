import React from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';

// app
import { Autocomplete } from 'components';

FormAutocompleteView.propTypes = {
  control: PropTypes.object,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  defaultValue: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  fieldProps: PropTypes.object.isRequired,
};

FormAutocompleteView.defaultProps = {
  value: [],
};

export function FormAutocompleteView({ control, name, value, defaultValue, fieldProps }) {
  return control ? (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      render={(renderProps) => <Autocomplete {...renderProps} {...fieldProps} />}
    />
  ) : (
    <Autocomplete {...fieldProps} value={Array.isArray(value) ? value : [value]} />
  );
}
