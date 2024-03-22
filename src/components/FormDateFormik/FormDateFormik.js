import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import classnames from 'classnames';
import { Field as FormikField } from 'formik';
import { TextField } from 'formik-material-ui';
import omit from 'lodash/omit';

// app
import styles from './FormDateFormik.styles';
import * as utils from 'utils';
import config from 'config';

// mui
import { DatePicker } from '@material-ui/pickers';
import { withStyles } from '@material-ui/core';

export class FormDateFormik extends PureComponent {
  static propTypes = {
    name: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['date', 'datepicker']).isRequired,
    label: PropTypes.string,
    hint: PropTypes.string,
    placeholder: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    plainText: PropTypes.bool,
    muiComponentProps: PropTypes.object,
    muiPickerProps: PropTypes.object,
    handleUpdate: PropTypes.func,
    nestedClasses: PropTypes.object,
  };

  static defaultProps = {
    placeholder: true,
    muiComponentProps: {},
    nestedClasses: {},
  };

  DatePickerField = ({ field, form, ...other }) => {
    const { label, hint, placeholder, plainText, muiComponentProps, muiPickerProps, handleUpdate, nestedClasses, classes } = this.props;

    const value = field.value || null;
    const variant = plainText ? undefined : 'outlined';
    const currentError = form.touched[field.name] && form.errors[field.name];
    const pickerVariant = muiPickerProps.variant || 'dialog';

    const pickerProps = {
      ...omit(muiPickerProps, ['clearable', 'showTodayButton']),
      ...(pickerVariant === 'dialog' && { clearable: muiPickerProps.clearable }),
      ...(pickerVariant === 'dialog' && { showTodayButton: muiPickerProps.showTodayButton }),
    };

    return (
      <DatePicker
        id={field.name}
        name={field.name}
        value={value}
        label={label}
        helperText={currentError || hint}
        emptyLabel={typeof placeholder === 'string' ? placeholder : placeholder ? utils.string.t('app.selectDate') : undefined}
        autoOk
        inputVariant={variant}
        onChange={(value) => handleUpdate(field.name, value)}
        {...muiComponentProps}
        {...pickerProps}
        format={muiPickerProps.format || config.ui.format.date.numeric}
        error={Boolean(currentError)}
        InputProps={{
          classes: {
            root: classnames({
              [classes.placeholder]: !Boolean(field.value),
              [classes.dateInputWrapper]: plainText,
              [nestedClasses.root]: plainText && Boolean(nestedClasses.root),
            }),
            input: classnames({
              [classes.dateInput]: plainText,
              [nestedClasses.input]: plainText && Boolean(nestedClasses.input),
            }),
          },
        }}
      />
    );
  };

  render() {
    const { name, type, label, placeholder, hint, muiComponentProps, classes } = this.props;

    if (type === 'datepicker') {
      return <FormikField name={name} component={this.DatePickerField} />;
    }

    return (
      <FormikField
        type="date"
        id={name}
        name={name}
        label={label}
        placeholder={typeof placeholder === 'string' ? placeholder : undefined}
        helperText={hint}
        {...muiComponentProps}
        variant={muiComponentProps.variant || 'outlined'}
        margin={muiComponentProps.margin || 'normal'}
        fullWidth={typeof muiComponentProps.fullWidth !== 'undefined' ? muiComponentProps.fullWidth : true}
        component={TextField}
        InputLabelProps={{
          shrink: true,
          classes: {
            root: classes.label,
          },
          ...muiComponentProps.InputLabelProps,
        }}
      />
    );
  }
}

export default compose(withStyles(styles))(FormDateFormik);
