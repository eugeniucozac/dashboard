import React from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';
import get from 'lodash/get';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import classnames from 'classnames';

// app
import * as utils from 'utils';
import styles from './FormAutocompleteMui.styles';
import uniq from 'lodash/uniq';
import LabelAndCreate from './LabelAndCreate';

// mui
import { makeStyles, CircularProgress, Chip, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

FormAutocompleteMuiView.propTypes = {
  control: PropTypes.object,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  defaultValue: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  options: PropTypes.array.isRequired,
  filterOptions: PropTypes.func,
  fieldProps: PropTypes.object.isRequired,
  onChange: PropTypes.func,
  onInputChange: PropTypes.func,
  showSpinner: PropTypes.bool,
  showCreate: PropTypes.bool,
  nestedClasses: PropTypes.shape({
    root: PropTypes.string,
  }),
  clearOnBlur: PropTypes.bool,
};

export function FormAutocompleteMuiView({
  control,
  setValue,
  name,
  value,
  defaultValue,
  options,
  filterOptions,
  fieldProps,
  onChange,
  onInputChange,
  showSpinner,
  nestedClasses,
  clearOnBlur,
}) {
  const errorMsg = get(fieldProps, 'error.message', '');
  const isMultiple = get(fieldProps, 'muiComponentProps.multiple', false);
  const fixedOptions = options.filter((option) => option.fixed);

  const classes = makeStyles(styles, { name: 'FormAutocompleteMui' })({ multiple: isMultiple });
  const { inputProps, ...muiComponentProps } = fieldProps?.muiComponentProps || {};

  const renderAutocomplete = (controllerOnChange, props) => {
    const propsValue = props?.value;
    const optionKey = fieldProps.optionKey || 'value';

    const label = fieldProps?.showCreate ? (
      <LabelAndCreate label={fieldProps?.label} targetField={fieldProps?.targetField} setValue={setValue} value={propsValue} name={name} />
    ) : (
      fieldProps?.label
    );

    // when editing draft risk the defaultValues, value/id is string or array of strings
    if (typeof propsValue === 'string') {
      const parsedValue = utils.generic.getAutocompleteValue(propsValue, options, optionKey);
      parsedValue && utils.generic.isFunction(setValue) && setValue(name, parsedValue);
    } else if (isMultiple && utils.generic.isValidArray(propsValue, true) && propsValue.every((val) => typeof val === 'string')) {
      const parsedValues = utils.generic.getAutocompleteMultipleValues(propsValue, options, optionKey);
      utils.generic.isValidArray(parsedValues, true) && utils.generic.isFunction(setValue) && setValue(name, parsedValues);
    }
    return (
      <Autocomplete
        value={propsValue}
        clearOnBlur={clearOnBlur}
        onChange={(e, data) => {
          const newData = fixedOptions.length > 0 ? uniq([...fixedOptions, ...data]) : data;
          if (utils.generic.isFunction(onChange)) onChange(e, newData);
          if (utils.generic.isFunction(controllerOnChange)) controllerOnChange(newData);
          if (utils.generic.isFunction(fieldProps?.callback)) fieldProps.callback(e, newData);
        }}
        onInputChange={(e, data) => {
          if (utils.generic.isFunction(onInputChange)) onInputChange(e, data);
        }}
        options={options}
        filterOptions={filterOptions}
        getOptionLabel={(option) => (option && option[fieldProps.optionLabel] ? option[fieldProps.optionLabel] : '')}
        multiple={isMultiple}
        className={classnames(nestedClasses.root)}
        classes={{
          inputRoot: classes.inputRoot,
          input: classes.input,
        }}
        ChipProps={{
          size: 'small',
          variant: 'outlined',
        }}
        autoComplete
        autoHighlight
        renderTags={(value, getTagProps) => {
          return value.map((option, index) => (
            <Chip
              {...getTagProps({ index })}
              variant="outlined"
              size="small"
              label={option[fieldProps.optionLabel]}
              disabled={option.fixed}
            />
          ));
        }}
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
            label={label}
            error={!!errorMsg}
            helperText={!!errorMsg ? errorMsg : fieldProps.helperText}
            placeholder={fieldProps.placeholder}
            data-form-type="autocomplete"
            inputProps={{
              ...params.inputProps,
              ...inputProps,
            }}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {showSpinner && <CircularProgress color="inherit" size={20} />}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
        disabled={fieldProps.disabled}
        {...muiComponentProps}
      />
    );
  };

  return control ? (
    <Controller
      name={name}
      control={control}
      defaultValue={value}
      onChange={([, data]) => data}
      render={({ onChange, ...props }) => renderAutocomplete(onChange, props)}
    />
  ) : (
    renderAutocomplete()
  );
}
