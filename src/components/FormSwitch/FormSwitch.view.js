import React from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';
import classnames from 'classnames';

// app
import styles from './FormSwitch.styles';
import { ErrorMessage } from 'components';

// mui
import { makeStyles, FormLabel, Switch, FormControlLabel, FormGroup } from '@material-ui/core';

FormSwitchView.propTypes = {
  control: PropTypes.object,
  register: PropTypes.func,
  watch: PropTypes.func,
  name: PropTypes.string.isRequired,
  value: PropTypes.bool,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]).isRequired,
    })
  ),
  label: PropTypes.string,
  title: PropTypes.string,
  hint: PropTypes.string,
  error: PropTypes.object,
  handleChange: PropTypes.func,
  muiComponentProps: PropTypes.object,
  muiFormGroupProps: PropTypes.object,
};

FormSwitchView.defaultProps = {
  color: 'primary',
  muiComponentProps: {},
  muiFormGroupProps: {},
  nestedClasses: {},
};

export function FormSwitchView({
  muiComponentProps,
  muiFormGroupProps,
  control,
  register,
  watch,
  options,
  name,
  color,
  value,
  label,
  title,
  hint,
  error,
  nestedClasses,
}) {
  const classes = makeStyles(styles, { name: 'FormSwitch' })({
    hasError: Boolean(error),
  });

  const hasOptions = options && options.length > 1;
  const isSingleOption = options && options.length === 1;

  return (
    <div className={classnames(classes.root, { [nestedClasses.root]: Boolean(nestedClasses.root) })}>
      {title && (
        <FormLabel component="legend" className={classes.title}>
          {title}
        </FormLabel>
      )}

      {hasOptions && control && register && watch && (
        <FormGroup {...muiFormGroupProps}>
          {options.map((option) => (
            <Controller
              control={control}
              id={name}
              name={name}
              key={`${name}_${option.value}`}
              render={({ onChange, name, value }) => (
                <FormControlLabel
                  control={
                    <Switch
                      name={name}
                      onChange={(e) => {
                        onChange(e.target.checked);
                      }}
                      label={label}
                      checked={value}
                      color={color}
                      {...muiComponentProps}
                      inputProps={{
                        ...muiComponentProps.inputProps,
                        'data-form-type': 'switch',
                      }}
                      disabled={option.disabled}
                      className={classes.checkbox}
                      inputRef={register()}
                    />
                  }
                  disabled={option.disabled}
                  label={option.label}
                />
              )}
            />
          ))}
        </FormGroup>
      )}

      {(isSingleOption || !hasOptions) &&
        (control ? (
          <Controller
            name={name}
            control={control}
            render={({ onChange, name, value }) => (
              <FormControlLabel
                control={
                  <Switch
                    {...muiComponentProps}
                    onChange={(e) => {
                      onChange(e.target.checked);
                      if (muiComponentProps && muiComponentProps.onChange) {
                        muiComponentProps.onChange(name, e.target.checked);
                      }
                    }}
                    label={label}
                    checked={value}
                    name={name}
                    inputProps={{
                      ...muiComponentProps.inputProps,
                      'data-form-type': 'switch',
                    }}
                    color={color}
                  />
                }
              />
            )}
          />
        ) : (
          <FormControlLabel
            value={value}
            {...(isSingleOption && {
              value: options[0].value,
            })}
            control={
              <Switch
                color={color}
                checked={value}
                inputProps={{
                  'data-form-type': 'switch',
                }}
              />
            }
            label={isSingleOption ? options[0].label : label}
          />
        ))}

      <ErrorMessage error={error} hint={hint} />
    </div>
  );
}
