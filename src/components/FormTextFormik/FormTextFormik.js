import React from 'react';
import PropTypes from 'prop-types';
import { Field as FormikField } from 'formik';
import { TextField } from 'formik-material-ui';
import classnames from 'classnames';

// app
import styles from './FormTextFormik.styles';

// mui
import { makeStyles } from '@material-ui/core';

FormTextFormik.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['text', 'textarea', 'number']).isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  hint: PropTypes.string,
  muiComponentProps: PropTypes.object,
  classes: PropTypes.object,
  compact: PropTypes.bool,
};

FormTextFormik.defaultProps = {
  type: 'text',
  muiComponentProps: {},
  compact: false,
};

export function FormTextFormik({ name, type, label, placeholder, hint, muiComponentProps, classes, compact }) {
  const componentClasses = makeStyles(styles, { name: 'FormTextFormik' })();

  const fieldClasses = {
    ...muiComponentProps.classes,
    ...classes,
  };

  return (
    <FormikField
      type={type}
      id={name}
      name={name}
      label={label}
      placeholder={placeholder}
      helperText={hint}
      {...muiComponentProps}
      InputLabelProps={{
        shrink: true,
        ...muiComponentProps.InputLabelProps,
      }}
      variant={muiComponentProps.variant || 'outlined'}
      margin={muiComponentProps.margin || 'normal'}
      fullWidth={typeof muiComponentProps.fullWidth !== 'undefined' ? muiComponentProps.fullWidth : true}
      component={TextField}
      classes={{
        ...fieldClasses,
        root: classnames(fieldClasses.root, { [componentClasses.compact]: compact }),
      }}
    />
  );
}

export default FormTextFormik;
