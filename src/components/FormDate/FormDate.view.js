import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';
import classnames from 'classnames';
import omit from 'lodash/omit';

// app
import styles from './FormDate.styles';
import { FormText } from 'components';
import * as utils from 'utils';
import config from 'config';

// mui
import { makeStyles, Box } from '@material-ui/core';
import TodayIcon from '@material-ui/icons/Today';
import EventIcon from '@material-ui/icons/Event';
import { DatePicker, KeyboardDatePicker } from '@material-ui/pickers';

FormDateView.propTypes = {
  control: PropTypes.object,
  name: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['date', 'datepicker']).isRequired,
  label: PropTypes.string,
  hint: PropTypes.string,
  placeholder: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  outputFormat: PropTypes.string,
  plainText: PropTypes.bool,
  plainTextIcon: PropTypes.bool,
  muiComponentProps: PropTypes.object,
  muiPickerProps: PropTypes.object,
  handleUpdate: PropTypes.func,
  nestedClasses: PropTypes.object,
  error: PropTypes.object,
  handlers: PropTypes.shape({
    toggelDatePicker: PropTypes.func,
  }),
};

FormDateView.defaultProps = {
  placeholder: true,
  muiComponentProps: {},
  muiPickerProps: {},
  nestedClasses: {},
};

export function FormDateView({
  control,
  label,
  hint,
  error,
  icon,
  placeholder,
  outputFormat, // TODO: remove when ISO is the default
  plainText,
  plainTextIcon,
  muiComponentProps,
  muiPickerProps,
  nestedClasses,
  type,
  name,
  value = null,
  defaultValue,
  handleUpdate,
  handlers,
}) {
  const classes = makeStyles(styles, { name: 'FormDate' })();
  const [isValidDate, setIsValidDate] = useState(true);

  const helperTextProps = {
    error: Boolean(error),
    helperText: (error && error.message) || (plainText ? undefined : hint),
  };

  if (type === 'datepicker') {
    const format = muiPickerProps.format || config.ui.format.date.numeric;
    const dateValue = value ? utils.string.t('format.date', { value: { date: value, format } }) : '';
    const inputVariant = plainText ? undefined : 'outlined';
    const pickerVariant = muiPickerProps.variant || 'dialog';

    const pickerProps = {
      ...omit(muiPickerProps, ['clearable', 'showTodayButton']),
      ...(pickerVariant === 'dialog' && { clearable: muiPickerProps.clearable }),
      ...(pickerVariant === 'dialog' && { showTodayButton: muiPickerProps.showTodayButton }),
    };

    helperTextProps.error = isValidDate ? Boolean(error) : true;
    helperTextProps.helperText = isValidDate
      ? (error && error.message) || (plainText ? undefined : hint)
      : muiComponentProps?.helperText || utils.string.t('app.invalidDate');

    const calendarProps = {
      label: plainText ? undefined : label,
      emptyLabel: typeof placeholder === 'string' ? placeholder : placeholder ? utils.string.t('app.inputDate') : undefined,
      autoOk: true,
      id: name,
      inputVariant: inputVariant,
      ...muiComponentProps,
      ...pickerProps,
      ...helperTextProps,
      format: format,
      margin: muiComponentProps.margin || 'normal',
      inputProps: {
        'data-form-type': type,
      },
      InputProps: {
        'data-value': dateValue,
        classes: {
          root: classnames({
            [classes.dateInputWrapper]: plainText,
            [classes.adornedEnd]: !Boolean(plainText),
            [nestedClasses.root]: plainText && Boolean(nestedClasses.root),
            [nestedClasses.rootDatepicker]: !plainText && Boolean(nestedClasses.rootDatepicker),
          }),
          input: classnames({
            [classes.dateInput]: plainText,
            [classes.dateInputDisabled]: plainText && muiComponentProps?.disabled,
            [nestedClasses.input]: plainText && Boolean(nestedClasses.input),
            [nestedClasses.inputDatepicker]: !plainText && Boolean(nestedClasses.inputDatepicker),
          }),
        },
      },
    };

    return (
      <Controller
        control={control}
        defaultValue={defaultValue}
        render={({ onChange, name, value }) => {
          return plainText ? (
            <Box
              display="flex"
              alignItems="end"
              className={classnames({
                [nestedClasses.datepicker]: Boolean(nestedClasses.datepicker),
              })}
            >
              <DatePicker
                value={value || dateValue || null}
                onChange={(value) => {
                  let date; // TODO added on 06/03/2020: make ISO the default when all endpoints support this format
                  if (outputFormat === 'iso') {
                    date = value?.toISOString();
                  } else {
                    date = value?.format('YYYY-MM-DD');
                  }
                  if (handlers && utils.generic.isFunction(handlers.toggelDatePicker)) {
                    handlers.toggelDatePicker(name, date);
                  } // if user clears the datepicker, value will be null // in this case, we don't want to show invalid date helper text
                  if (value === null || value?.isValid()) setIsValidDate(true);
                  else setIsValidDate(false);
                  onChange(date);
                }}
                {...calendarProps}
              />
              {plainTextIcon && <TodayIcon className={classes.dateIcon} />}
            </Box>
          ) : (
            <KeyboardDatePicker
              name={name}
              value={value}
              onChange={(value) => {
                let date;
                // TODO added on 06/03/2020: make ISO the default when all endpoints support this format
                if (outputFormat === 'iso') {
                  date = value?.toISOString();
                } else {
                  date = value?.format('YYYY-MM-DD');
                }

                if (utils.generic.isFunction(handleUpdate)) {
                  handleUpdate(name, date);
                }
                if (handlers && utils.generic.isFunction(handlers.toggelDatePicker)) {
                  handlers.toggelDatePicker(name, date);
                }

                // if user clears the datepicker, value will be null
                // in this case, we don't want to show invalid date helper text
                if (value === null || value?.isValid()) setIsValidDate(true);
                else setIsValidDate(false);

                onChange(date || null);
              }}
              {...calendarProps}
              keyboardIcon={icon ? <TodayIcon /> : <EventIcon />}
            />
          );
        }}
        id={name}
        name={name}
      />
    );
  }

  return (
    <FormText
      control={control}
      type="date"
      id={name}
      name={name}
      label={label}
      hint={hint}
      error={error}
      muiComponentProps={{
        ...muiComponentProps,
        InputLabelProps: {
          shrink: true,
          classes: {
            root: classes.label,
          },
        },
      }}
    />
  );
}
