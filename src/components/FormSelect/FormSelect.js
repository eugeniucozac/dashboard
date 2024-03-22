import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Controller } from 'react-hook-form';
import { merge } from 'lodash';

// app
import styles from './FormSelect.styles';
import { ErrorMessage } from 'components';
import * as utils from 'utils';

// mui
import { makeStyles, Box, FormControl, MenuItem, OutlinedInput, Select, InputLabel } from '@material-ui/core';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import AddIcon from '@material-ui/icons/Add';

FormSelect.propTypes = {
  name: PropTypes.string.isRequired,
  margin: PropTypes.oneOf(['normal', 'none', 'dense']),
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  optionKey: PropTypes.string.isRequired,
  optionLabel: PropTypes.string.isRequired,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  hint: PropTypes.string,
  error: PropTypes.object,
  size: PropTypes.oneOf(['xs', 'sm', 'md']),
  muiComponentProps: PropTypes.object,
  handleUpdate: PropTypes.func,
  nestedClasses: PropTypes.shape({
    root: PropTypes.string,
    icon: PropTypes.string,
  }),
  testid: PropTypes.string,
};

FormSelect.defaultProps = {
  optionKey: 'value',
  optionLabel: 'label',
  margin: 'normal',
  muiComponentProps: {},
  nestedClasses: {},
  testid: 'form-select',
};

export function FormSelect({
  disabled,
  name,
  margin,
  value,
  options = [],
  optionKey,
  optionLabel,
  label,
  hint,
  error,
  size,
  nestedClasses,
  muiComponentProps,
  testid,
  control,
  defaultValue,
  handleUpdate,
}) {
  const classes = makeStyles(styles, { name: 'FormSelect' })();

  const allValues = (control && control.getValues()) || {};
  const fieldValue = allValues[name] || '';
  const isMulti = muiComponentProps.multiple;
  const isPlaceholder = control
    ? isMulti
      ? fieldValue.includes('__placeholder__')
      : fieldValue === '__placeholder__'
    : isMulti
    ? value.includes('__placeholder__')
    : value === '__placeholder__';

  const [placeholder, setPlaceholder] = useState(isPlaceholder);

  useEffect(() => {
    setPlaceholder(isPlaceholder);
  }, [isPlaceholder]); // eslint-disable-line react-hooks/exhaustive-deps

  const selectClasses = {
    [classes.placeholder]: Boolean(placeholder),
  };

  const selectSizeClasses = {
    [classes.selectMd]: size === 'md',
    [classes.selectSm]: size === 'sm',
    [classes.selectXs]: size === 'xs',
  };

  const iconSizeClasses = {
    [classes.iconXs]: size === 'xs',
  };

  const renderMenuItem = (option, key, label) => {
    if (!option || !key || !label) return;

    const isCreate = ({ value }) => value === '__create__';
    const menuClasses = {
      [classes.placeholder]: option.placeholder || option.blank,
      [classes.createLabel]: isCreate(option),
      [classes.disabled]: option.disabled,
    };

    // TODO added on 31/07/2020: in multi mode, menuItem breaks if anything other than text is rendered (Box, div...)
    return (
      <MenuItem key={`${option[key]}-${option[label]}`} value={option[key]} disabled={option.disabled} className={classnames(menuClasses)}>
        {isMulti ? (
          option[label]
        ) : (
          <Box display="flex" alignItems="center">
            {isCreate(option) && <AddIcon className={classes.createIcon} />}
            <Box className={classes.selectedLabel}>{option[label]}</Box>
          </Box>
        )}
      </MenuItem>
    );
  };

  const parseChangeValues = (event) => {
    const { name, value } = (event && event.target) || {};
    let valueIsPlaceholder;
    let valueIncludesPlaceholder;
    let returnedValue = value;

    if (isMulti) {
      valueIsPlaceholder = utils.generic.isValidArray(value) && value.length === 1 && value.includes('__placeholder__');
      valueIncludesPlaceholder = utils.generic.isValidArray(value) && value.length >= 2 && value.includes('__placeholder__');

      // we're stripping away the __placeholder__ value if there is multiple values selected
      // if ONLY __placeholder__ is selected, we leave it untouched so that it shows as the placeholder
      // if we only have valid values, we leave them untouched as well, ex:
      //                               [] --> []
      //              ['__placeholder__'] --> ['__placeholder__']
      // ['__placeholder__', 'yes', 'no'] --> ['yes', 'no']
      //                    ['yes', 'no'] --> ['yes', 'no']
      returnedValue = valueIncludesPlaceholder ? value.filter((v) => v !== '__placeholder__') : value;
    } else {
      valueIsPlaceholder = value === '__placeholder__';
    }

    setPlaceholder(valueIsPlaceholder);

    if (utils.generic.isFunction(handleUpdate)) {
      handleUpdate(name, returnedValue);
    }

    return returnedValue;
  };

  const handleChangeRHF = (event) => {
    return parseChangeValues(event);
  };

  const handleChangeMUI = (event) => {
    return parseChangeValues(event);
  };

  const fullwidth = typeof muiComponentProps.fullWidth !== 'undefined' ? muiComponentProps.fullWidth : true;

  const props = {
    displayEmpty: true,
    disabled,
    id: name,
    name,
    input: <OutlinedInput labelWidth={0} name={name} />,
    variant: 'outlined',
    error: Boolean(error),
    IconComponent: KeyboardArrowDownIcon,
    fullWidth: fullwidth,
    ...muiComponentProps,
    className: classnames(classes.select, selectClasses, nestedClasses.root),
    classes: {
      icon: classnames(iconSizeClasses),
      select: classnames(selectSizeClasses),
    },
    'data-testid': testid,
  };

  return (
    <FormControl margin={margin} fullWidth={fullwidth} className={classes.root}>
      {label && (
        <InputLabel disabled={!!muiComponentProps.disabled} error={Boolean(error)} shrink variant="outlined" htmlFor={name}>
          {label}
        </InputLabel>
      )}
      {control ? (
        <Controller
          name={name}
          control={control}
          defaultValue={defaultValue}
          value={value}
          render={({ onChange, value }) => {
            return (
              <Select
                {...props}
                onChange={(e) => {
                  handleChangeRHF(e);
                  onChange(e);
                }}
                value={value}
                inputProps={{
                  ...muiComponentProps.inputProps,
                  'data-form-type': 'select',
                }}
              >
                {options.map((option) => renderMenuItem(option, optionKey, optionLabel))}
              </Select>
            );
          }}
        />
      ) : (
        <Select
          value={value || ''}
          {...props}
          onChange={handleChangeMUI}
          inputProps={{ ...merge({}, muiComponentProps?.inputProps, { 'data-form-type': 'select' }) }}
        >
          {options.map((option) => renderMenuItem(option, optionKey, optionLabel))}
        </Select>
      )}
      <ErrorMessage error={error} hint={hint} />
    </FormControl>
  );
}

export default FormSelect;
