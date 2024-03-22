import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// mui
import { Paper } from '@material-ui/core';

const AutocompleteMenu = ({ selectProps, innerProps, children }) => {
  const { inputValue, async } = selectProps;
  const showMenu = !async || (async && inputValue);
  const classesPaper = {
    [selectProps.classes.paper]: true,
    [selectProps.classes.paperError]: selectProps.textFieldProps.error,
  };

  return showMenu ? (
    <Paper elevation={5} className={classnames(classesPaper)} {...innerProps}>
      {children}
    </Paper>
  ) : null;
};

AutocompleteMenu.propTypes = {
  selectProps: PropTypes.object,
  innerProps: PropTypes.object,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

export default AutocompleteMenu;
