import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';

// app
import { FormAutocompleteMuiView } from './FormAutocompleteMui.view';
import * as utils from 'utils';

FormAutocompleteMui.propTypes = {
  control: PropTypes.object,
  name: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  optionKey: PropTypes.string.isRequired,
  optionLabel: PropTypes.string.isRequired,
  optionsCreatable: PropTypes.bool,
  optionsFetch: PropTypes.object,
  value: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  defaultValue: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  label: PropTypes.string,
  placeholder: PropTypes.string,
  hint: PropTypes.string,
  error: PropTypes.shape({
    message: PropTypes.string,
    type: PropTypes.string,
  }),
  muiComponentProps: PropTypes.object,
  targetField: PropTypes.string,
  callback: PropTypes.func,
  showLoading: PropTypes.bool,
  clearOnBlur: PropTypes.bool,
  onSelect: PropTypes.func,
};

FormAutocompleteMui.defaultProps = {
  muiComponentProps: {},
  options: [],
  optionKey: 'value',
  optionLabel: 'label',
  value: null,
  defaultValue: null,
  showLoading: true,
  nestedClasses: {},
};

export default function FormAutocompleteMui({
  control,
  setValue,
  name,
  value,
  defaultValue,
  options,
  optionKey,
  optionLabel,
  optionsCreatable,
  optionsFetch,
  label,
  placeholder,
  hint,
  error,
  disabled,
  muiComponentProps,
  targetField,
  callback,
  showLoading,
  showCreate,
  nestedClasses,
  clearOnBlur,
  onSelect,
}) {
  const fieldProps = {
    optionLabel,
    label,
    showCreate,
    placeholder,
    error,
    disabled: disabled || muiComponentProps?.disabled,
    helperText: hint,
    muiComponentProps,
    targetField,
    callback,
    showLoading,
  };

  const [componentValue, setComponentValue] = useState(value || defaultValue);
  const [componentInputValue, setComponentInputValue] = useState('');
  const [componentOptions, setComponentOptions] = useState(options || []);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    setComponentOptions(options);
  }, [options]);

  const fetch = useMemo(
    () =>
      // debounce to prevent too many fetches on every keystrokes
      debounce((request, callback) => {
        // check if the component support async fetch (optionsFetch)
        if (utils.generic.isFunction(optionsFetch?.handler)) {
          setFetching(true);
          optionsFetch.handler(optionsFetch.type, request.input).then((results) => {
            // check if the component has a custom filter method
            // if yes, filter the results before returning them
            // if no, return the results to callback method
            setFetching(false);
            if (utils.generic.isFunction(optionsFetch?.filter)) {
              callback(optionsFetch.filter(results));
            } else {
              callback(results);
            }
          });
        }
      }, 250),
    [optionsFetch]
  );

  useEffect(() => {
    let active = true;

    // abort if component doesn't support async fetch for options
    if (!optionsFetch) {
      return;
    }

    if (componentInputValue === '') {
      setComponentOptions(componentValue ? [componentValue] : []);
      return;
    }

    // after selecting an option - to prevent another fetch
    if (componentInputValue === componentValue?.[optionLabel]) {
      setComponentOptions([]);
      return;
    }

    fetch({ input: componentInputValue, value: componentValue }, (results) => {
      if (active) {
        let newOptions = [];

        if (results) {
          newOptions = [...results];
        }

        setComponentOptions(newOptions);
      }
    });

    return () => {
      active = false;
    };
  }, [componentValue, componentInputValue, fetch, optionsFetch, optionLabel]);

  return (
    <FormAutocompleteMuiView
      control={control}
      clearOnBlur={clearOnBlur}
      setValue={setValue}
      name={name}
      nestedClasses={nestedClasses}
      value={componentValue}
      fieldProps={fieldProps}
      options={componentOptions}
      showSpinner={showLoading && fetching}
      filterOptions={fieldProps.filterOptions}
      onChange={(event, newValue) => {
        if (typeof onSelect === 'function') {
          onSelect(newValue);
        }
        if (typeof newValue === 'string') {
          setComponentValue({
            [optionKey]: newValue,
            [optionLabel]: newValue,
          });
        } else if (optionsCreatable && newValue && newValue.created && newValue[optionKey]) {
          // Create a new value from the user input
          setComponentValue({
            [optionKey]: newValue[optionKey],
            [optionLabel]: newValue[optionKey],
          });
        } else {
          setComponentValue(newValue);
        }

        setComponentOptions(componentOptions);
      }}
      onInputChange={(event, newInputValue) => {
        setComponentInputValue(newInputValue);
      }}
    />
  );
}
