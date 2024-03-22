import React from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';

// app
import { ErrorMessage } from 'components';

FormHiddenView.propTypes = {
  control: PropTypes.object,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  error: PropTypes.object,
  errorProps: PropTypes.object,
};

export function FormHiddenView({ control, name, error, errorProps, type, defaultValue, value }) {
  const props = {
    type,
    id: name,
    name,
  };

  return (
    <>
      {control ? (
        <>
          <Controller
            control={control}
            name={name}
            defaultValue={defaultValue}
            render={(renderProps) => <input {...renderProps} {...props} data-form-type="hidden" />}
          />
          <ErrorMessage error={error} {...errorProps} />
        </>
      ) : (
        <input {...props} value={value} data-form-type="hidden" />
      )}
    </>
  );
}
