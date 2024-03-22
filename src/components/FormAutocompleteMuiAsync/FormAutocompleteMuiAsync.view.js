import { Controller, useFormContext } from 'react-hook-form';
import { TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import get from 'lodash/get';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';

import * as utils from 'utils';

const FormAutocompleteMuiAsyncView = ({
  name,
  value,
  defaultValue,
  componentOptions,
  optionKey,
  optionLabel,
  label,
  placeholder,
  hint,
  error,
  disabled,
  muiComponentProps,
  callback,
}) => {
  const fieldProps = {
    optionLabel,
    label,
    placeholder,
    error,
    disabled,
    helperText: hint,
    muiComponentProps,
    callback,
  };
  const { control, setValue } = useFormContext();
  const errorMsg = get(fieldProps, 'error.message', '');
  const isMultiple = get(fieldProps, 'muiComponentProps.multiple', false);

  const getValue = (value) => {
    const optionKey = fieldProps.optionKey || 'value';
    const result = componentOptions.filter((option) => option[optionKey] === value);

    return result[0] ? result[0] : null;
  };

  const getMultipleValues = (values) => {
    const optionKey = fieldProps.optionKey || 'value';
    const result = values
      ?.map((value) => componentOptions.find((option) => option[optionKey] === value))
      .filter((value) => utils.generic.isValidObject(value, optionKey));

    return result ? result : [];
  };

  return (
    <Controller
      name={name}
      control={control}
      value={value}
      render={({ onChange, ...props }) => {
        let { value } = props;

        if (typeof value === 'string') {
          const parsedValue = getValue(value);
          parsedValue && setValue(name, parsedValue);
        } else if (isMultiple && value.every((val) => typeof val === 'string')) {
          const parsedValues = getMultipleValues(value);
          utils.generic.isValidArray(parsedValues, true) && setValue(name, parsedValues);
        }

        return (
          <Autocomplete
            value={props.value}
            onChange={(e, data) => onChange(data)}
            options={componentOptions}
            getOptionLabel={(option) => (option && option[fieldProps.optionLabel] ? option[fieldProps.optionLabel] : '')}
            disableClearable
            multiple={isMultiple}
            ChipProps={{
              size: 'small',
              variant: 'outlined',
            }}
            autoComplete
            autoHighlight
            renderOption={(option, { inputValue }) => {
              const title = option[fieldProps.optionLabel];
              const matches = match(title, inputValue);
              const parts = parse(title, matches);

              return (
                <div>
                  {parts.map((part, index) => (
                    <span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }}>
                      {part.text}
                    </span>
                  ))}
                </div>
              );
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                variant="outlined"
                margin="normal"
                name={name}
                label={fieldProps.label}
                error={!!errorMsg}
                helperText={!!errorMsg ? errorMsg : fieldProps.helperText}
                placeholder={fieldProps.placeholder}
                data-form-type="autocomplete"
                inputProps={{
                  ...params.inputProps,
                }}
              />
            )}
            {...fieldProps.muiComponentProps}
            disabled={fieldProps.disabled || componentOptions?.length === 0}
          />
        );
      }}
    />
  );
};

export default FormAutocompleteMuiAsyncView;
