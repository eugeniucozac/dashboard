import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Controller } from 'react-hook-form';
import NumberFormat from 'react-number-format';
// app
import * as utils from 'utils';
import styles from './FormText.styles';

// mui
import { makeStyles, TextField } from '@material-ui/core';

FormTextView.propTypes = {
  control: PropTypes.object,
  name: PropTypes.string.isRequired,
  value: PropTypes.any,
  defaultValue: PropTypes.any,
  type: PropTypes.oneOf(['text', 'textarea', 'number', 'date', 'time']).isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  hint: PropTypes.string,
  error: PropTypes.object,
  compact: PropTypes.bool,
  muiComponentProps: PropTypes.object,
  onChange: PropTypes.func,
  classes: PropTypes.object,
  variant: PropTypes.string,
  omitThousandSeparator: PropTypes.bool,
};

FormTextView.defaultProps = {
  type: 'text',
  muiComponentProps: {},
  compact: false,
  omitThousandSeparator: false,
  disabled: false,
};

export function FormTextView({
  control,
  name,
  value,
  defaultValue,
  type,
  label,
  placeholder,
  disabled,
  hint,
  error,
  compact,
  muiComponentProps,
  onChange,
  classes,
  variant,
  omitThousandSeparator,
}) {
  const componentClasses = makeStyles(styles, { name: 'FormText' })();

  const handleOnChange = onChange ? onChange : null;

  const fieldClasses = {
    ...muiComponentProps.classes,
    ...classes,
  };
  const isNumericField = type === 'number';

  const thousandSeparator = omitThousandSeparator ? false : isNumericField;

  const props = {
    type: isNumericField ? 'text' : type,
    id: name,
    name,
    label,
    placeholder,
    variant: variant || 'outlined',
    ...muiComponentProps,
    InputLabelProps: {
      shrink: true,
      ...muiComponentProps.InputLabelProps,
    },
    margin: 'normal',
    fullWidth: typeof muiComponentProps.fullWidth !== 'undefined' ? muiComponentProps.fullWidth : true,
    classes: {
      ...fieldClasses,
      root: classnames(fieldClasses.root, componentClasses.root, { [componentClasses.compact]: compact }),
    },
    InputProps: {
      ...muiComponentProps?.InputProps,
      classes: {
        ...muiComponentProps?.InputProps?.classes,
        root: classnames({
          [muiComponentProps?.InputProps?.classes?.root]: Boolean(muiComponentProps?.InputProps?.classes?.root),
          [componentClasses.readonly]: Boolean(muiComponentProps?.InputProps?.readOnly),
        }),
      },
    },
  };

  const helperTextProps = {
    error: Boolean(error),
    helperText: (error && error.message) || hint,
  };

  return (
    <>
      {control ? (
        isNumericField ? (
          <Controller
            render={({ onChange, value }) => {
              return (
                <NumberFormat
                  value={value}
                  customInput={TextField}
                  isNumericString
                  {...props}
                  {...helperTextProps}
                  thousandSeparator={thousandSeparator}
                  onValueChange={(v) => {
                    onChange(v.value);
                  }}
                />
              );
            }}
            onChange={([data]) => {
              return data.value;
            }}
            control={control}
            name={name}
            value={value}
            defaultValue={defaultValue}
          />
        ) : (
          <Controller
            render={(renderProps) => (
              <TextField
                onChange={(e) => {
                  if (utils.generic.isFunction(handleOnChange)) e.target.value = handleOnChange(e.target.value, control);
                  renderProps.onChange(e);
                }}
                name={renderProps.name}
                value={renderProps.value}
                {...props}
                {...helperTextProps}
              />
            )}
            control={control}
            name={name}
            defaultValue={defaultValue}
            {...props}
          />
        )
      ) : (
        <TextField {...props} value={value} {...helperTextProps} />
      )}
    </>
  );
}
