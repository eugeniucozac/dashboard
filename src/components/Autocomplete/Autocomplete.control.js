import React from 'react';
import PropTypes from 'prop-types';

// mui
import { TextField } from '@material-ui/core';

const AutocompleteControl = (props) => {
  const { selectProps, menuIsOpen, innerProps, innerRef, inputComponentRef, children } = props;
  const { textFieldProps, async, inputValue, classes } = selectProps;
  const showHelperText =
    (async && !inputValue) || (!menuIsOpen && !textFieldProps.error && textFieldProps.helperText) || (!menuIsOpen && textFieldProps.error);

  return (
    <TextField
      fullWidth
      variant="outlined"
      margin="normal"
      className={classes.formControl}
      {...textFieldProps}
      InputProps={{
        inputComponent: inputComponentRef,
        inputProps: {
          className: classes.input,
          inputRef: innerRef,
          children: children,
          ...innerProps,
        },
        ...textFieldProps.InputProps,
      }}
      helperText={showHelperText ? textFieldProps.helperText : null}
    />
  );
};

AutocompleteControl.propTypes = {
  selectProps: PropTypes.object,
  innerProps: PropTypes.object,
  innerRef: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

export default AutocompleteControl;
