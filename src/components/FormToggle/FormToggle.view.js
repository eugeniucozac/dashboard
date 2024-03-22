import React from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';
import isString from 'lodash/isString';

// app
import styles from './FormToggle.styles';
import { ErrorMessage } from 'components';
import * as utils from 'utils';

// mui
import { ToggleButtonGroup, ToggleButton } from '@material-ui/lab';
import { makeStyles, FormLabel } from '@material-ui/core';

FormToggleView.propTypes = {
  control: PropTypes.object,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]).isRequired,
    })
  ).isRequired,
  label: PropTypes.string,
  hint: PropTypes.string,
  error: PropTypes.object,
  valueIfUnchecked: PropTypes.any,
  buttonGroupProps: PropTypes.shape({
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    exclusive: PropTypes.bool,
  }),
  enforceValueSet: PropTypes.bool,
};

FormToggleView.defaultProps = {
  buttonGroupProps: {},
  enforceValueSet: false,
};

export function FormToggleView({ control, name, type, options, label, hint, error, buttonGroupProps, enforceValueSet, valueIfUnchecked }) {
  const classes = makeStyles(styles, { name: 'FormToggle' })({
    hasError: Boolean(error),
    type,
  });

  if (control) {
    return (
      <div className={classes.root}>
        {label && (
          <FormLabel component="legend" className={classes.title}>
            {label}
          </FormLabel>
        )}
        <Controller
          control={control}
          id={name}
          name={name}
          render={({ onChange, name, value }) => {
            return (
              <ToggleButtonGroup
                id={name}
                name={name}
                value={isString(value) || utils.generic.isBoolean(value) ? value?.toString() : value}
                onChange={(e, value) => {
                  // if the user has un-selected an option, by default the value will be null
                  // but it's possible that the original default value was an empty string ''
                  // this could leave the form in a "dirty" state
                  // this newValue allows to reset the value to whatever original default value we want
                  const newValue = valueIfUnchecked !== undefined && value === null ? valueIfUnchecked : value;

                  if (enforceValueSet) {
                    if (newValue !== null) {
                      onChange(newValue);
                    }
                  } else {
                    onChange(newValue);
                  }
                }}
                {...buttonGroupProps}
                aria-label={name}
                data-testid="toggle-button-group"
              >
                {options.map((option, index) => (
                  <ToggleButton key={index} value={option.value} className={classes.toggleButton} disabled={buttonGroupProps.disabled}>
                    {option.label}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            );
          }}
        />
        <ErrorMessage error={error} hint={hint} />
      </div>
    );
  }

  return (
    <div className={classes.root}>
      {label && (
        <FormLabel component="legend" className={classes.title}>
          {label}
        </FormLabel>
      )}
      <ToggleButtonGroup {...buttonGroupProps} aria-label={name} data-testid="toggle-button-group">
        {options.map((option, index) => (
          <ToggleButton key={index} value={option.value} className={classes.toggleButton}>
            {option.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      <ErrorMessage error={error} hint={hint} />
    </div>
  );
}
