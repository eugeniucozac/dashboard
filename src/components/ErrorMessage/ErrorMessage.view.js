import React from 'react';
import PropTypes from 'prop-types';

// app
import styles from './ErrorMessage.styles';

// mui
import { makeStyles, FormHelperText } from '@material-ui/core';

ErrorMessageView.propTypes = {
  error: PropTypes.shape({
    message: PropTypes.string,
  }),
  hint: PropTypes.string,
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  bold: PropTypes.bool,
  component: PropTypes.string,
  nestedClasses: PropTypes.object,
};

export function ErrorMessageView({ error, hint, size, bold, component, nestedClasses }) {
  const classes = makeStyles(styles, { name: 'ErrorMessage' })({ size, bold });

  return (
    <FormHelperText className={classes.root} classes={nestedClasses} component={component} error={!!error}>
      {(error && error.message) || hint}
    </FormHelperText>
  );
}
