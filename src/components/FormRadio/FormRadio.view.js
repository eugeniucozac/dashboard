import React from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';
import classnames from 'classnames';

// app
import styles from './FormRadio.styles';
import { ErrorMessage } from 'components';
import * as utils from 'utils';

// mui
import { FormControlLabel, FormLabel, Radio, RadioGroup, makeStyles } from '@material-ui/core';

FormRadioView.propTypes = {
  control: PropTypes.object,
  name: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      label: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array, PropTypes.object, PropTypes.bool]),
    })
  ),
  title: PropTypes.string,
  hint: PropTypes.string,
  error: PropTypes.object,
  disabled: PropTypes.bool,
  color: PropTypes.oneOf(['primary', 'secondary']),
  muiComponentProps: PropTypes.object,
  muiFormGroupProps: PropTypes.object,
};

FormRadioView.defaultProps = {
  color: 'primary',
  muiComponentProps: {},
  muiFormGroupProps: {},
};

export function FormRadioView({
  control,
  name,
  options,
  title,
  hint,
  error,
  disabled,
  color,
  muiComponentProps,
  muiFormGroupProps,
  defaultValue,
}) {
  const classes = makeStyles(styles, { name: 'FormRadio' })({
    hasError: Boolean(error),
  });

  const { nestedClasses = {}, ...formGroupProps } = muiFormGroupProps;

  const RadioOptions = () => {
    return options.map((option, index) => (
      <FormControlLabel
        key={`${option.value}_${index}`}
        value={option.value}
        label={option.label}
        disabled={option.disabled}
        className={classes.radioLabel}
        control={<Radio disabled={disabled} color={color} classes={{ root: classes.radio }} {...muiComponentProps} />}
      />
    ));
  };

  return (
    <div className={classnames({ [classes.radioGroup]: true, [nestedClasses.root]: Boolean(nestedClasses.root) })}>
      {title && (
        <FormLabel component="legend" className={classes.groupTitle}>
          {title}
        </FormLabel>
      )}

      {options ? (
        control ? (
          <Controller
            render={(props) => {
              return (
                <RadioGroup
                  {...props}
                  component={RadioGroup}
                  {...formGroupProps}
                  onChange={(e) => {
                    if (utils.generic.isFunction(formGroupProps?.onChange)) {
                      formGroupProps.onChange(e.target.value);
                    }
                    return props.onChange(e.target.value);
                  }}
                >
                  <RadioOptions />
                </RadioGroup>
              );
            }}
            control={control}
            name={name}
            id={name}
            defaultValue={defaultValue}
          />
        ) : (
          <RadioGroup name={name} component={RadioGroup} {...formGroupProps}>
            <RadioOptions />
          </RadioGroup>
        )
      ) : (
        <Radio name={name} id={name} color={color} {...muiComponentProps} />
      )}
      <ErrorMessage error={error} hint={hint} />
    </div>
  );
}
