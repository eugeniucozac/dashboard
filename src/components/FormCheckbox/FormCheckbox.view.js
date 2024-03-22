import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Controller } from 'react-hook-form';

// app
import styles from './FormCheckbox.styles';
import { ErrorMessage } from 'components';
import * as utils from 'utils';

// mui
import { Checkbox, FormControlLabel, makeStyles, FormLabel, FormGroup } from '@material-ui/core';

FormCheckboxView.propTypes = {
  control: PropTypes.object,
  register: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.array, PropTypes.string, PropTypes.number, PropTypes.bool]),
  name: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      name: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]).isRequired,
    })
  ),
  label: PropTypes.string,
  title: PropTypes.string,
  hint: PropTypes.string,
  error: PropTypes.object,
  disabled: PropTypes.bool,
  color: PropTypes.oneOf(['primary', 'secondary']),
  muiComponentProps: PropTypes.object,
  muiFormGroupProps: PropTypes.object,
  nestedClasses: PropTypes.shape({
    root: PropTypes.string,
    title: PropTypes.string,
  }),
};

FormCheckboxView.defaultProps = {
  color: 'primary',
  muiComponentProps: {},
  muiFormGroupProps: {},
  nestedClasses: {},
};

export function FormCheckboxView({
  control,
  register,
  value,
  defaultValue,
  name,
  options,
  label,
  title,
  hint,
  error,
  disabled,
  color,
  muiComponentProps,
  muiFormGroupProps,
  nestedClasses,
}) {
  const classes = makeStyles(styles, { name: 'FormCheckbox' })();

  const hasOptions = Boolean(options && utils.generic.isValidArray(options));
  const hasMultipleOptions = Boolean(hasOptions && options.length >= 2);
  const hasSingleOption = Boolean(hasOptions && options.length === 1);
  const hasNoOption = !hasOptions;

  const isCheckedWithoutControl = (option) => {
    return utils.generic.isValidArray(value) && value.includes(option.name);
  };

  return (
    <div className={classnames(classes.checkboxGroup, nestedClasses.root)}>
      {title && (
        <FormLabel component="legend" error={Boolean(error)} className={classnames(classes.title, nestedClasses.title)}>
          {title}
        </FormLabel>
      )}

      {hasMultipleOptions && (
        <FormGroup {...muiFormGroupProps}>
          {options.map((option) =>
            control && register ? (
              <Controller
                control={control}
                id={option.name}
                name={option.name}
                defaultValue={option.value}
                key={`${option.name}_${option.value}`}
                render={(renderProps) => (
                  <FormControlLabel
                    {...renderProps}
                    control={
                      <Checkbox
                        color={color}
                        {...muiComponentProps}
                        disabled={disabled || option.disabled}
                        className={classes.checkbox}
                        onChange={(e) => {
                          renderProps.onChange(e.target.checked);

                          if (utils.generic.isFunction(muiComponentProps?.onChange)) {
                            muiComponentProps.onChange(name, e.target.name, e.target.checked);
                          }
                        }}
                        checked={renderProps.value}
                      />
                    }
                    disabled={option.disabled}
                    label={option.label}
                  />
                )}
              />
            ) : (
              <FormControlLabel
                key={`${name}_${option.name}`}
                value={option.name}
                control={
                  <Checkbox
                    name={option.name}
                    color={color}
                    disabled={option.disabled}
                    {...muiComponentProps}
                    onChange={(e) => {
                      if (utils.generic.isFunction(muiComponentProps?.onChange)) {
                        muiComponentProps.onChange(name, e.target.name, e.target.checked);
                      }
                    }}
                    className={classes.checkbox}
                    checked={isCheckedWithoutControl(option)}
                  />
                }
                label={option.label}
              />
            )
          )}
        </FormGroup>
      )}

      {hasSingleOption &&
        (control ? (
          <Controller
            control={control}
            id={`${options[0].name}`}
            name={options[0].name}
            disabled={disabled}
            defaultValue={options[0].value}
            render={(renderProps) => (
              <FormControlLabel
                {...renderProps}
                control={
                  <Checkbox
                    color={color}
                    {...muiComponentProps}
                    onChange={(e) => {
                      renderProps.onChange(e.target.checked);

                      if (utils.generic.isFunction(muiComponentProps?.onChange)) {
                        muiComponentProps.onChange(name, e.target.name, e.target.checked);
                      }
                    }}
                    checked={renderProps.value}
                    className={classes.checkbox}
                  />
                }
                label={options[0].label}
              />
            )}
          />
        ) : (
          <FormControlLabel
            value={options[0].value}
            control={
              <Checkbox
                name={options[0].name}
                color={color}
                {...muiComponentProps}
                onChange={(e) => {
                  if (utils.generic.isFunction(muiComponentProps?.onChange)) {
                    muiComponentProps.onChange(name, e.target.name, e.target.checked);
                  }
                }}
                className={classes.checkbox}
                checked={isCheckedWithoutControl(options[0])}
              />
            }
            label={options[0].label}
          />
        ))}

      {hasNoOption &&
        (control ? (
          <Controller
            control={control}
            id={name}
            name={name}
            defaultValue={defaultValue}
            render={(renderProps) => (
              <FormControlLabel
                {...renderProps}
                disabled={disabled}
                control={
                  <Checkbox
                    name={name}
                    checked={renderProps.value || false}
                    color={color}
                    {...muiComponentProps}
                    onChange={(e) => {
                      renderProps.onChange(e.target.checked);

                      if (utils.generic.isFunction(muiComponentProps?.onChange)) {
                        muiComponentProps.onChange(e.target.name, e.target.checked);
                      }
                    }}
                    className={classes.checkbox}
                  />
                }
                label={label}
              />
            )}
          />
        ) : (
          <FormControlLabel
            control={
              <Checkbox
                name={name}
                checked={value}
                color={color}
                {...muiComponentProps}
                onChange={(e) => {
                  if (utils.generic.isFunction(muiComponentProps?.onChange)) {
                    muiComponentProps.onChange(e.target.name, e.target.checked);
                  }
                }}
                className={classes.checkbox}
              />
            }
            label={label}
          />
        ))}

      <ErrorMessage className={classes.errorMessage} error={error} hint={hint} />
    </div>
  );
}
