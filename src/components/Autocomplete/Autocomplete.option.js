import React from 'react';
import PropTypes from 'prop-types';

// mui
import { MenuItem } from '@material-ui/core';

const AutocompleteOption = ({ selectProps, innerProps, innerRef, isFocused, isSelected, children }) => (
  <MenuItem
    ref={innerRef}
    selected={isFocused}
    component="div"
    className={selectProps.classes.menuItem}
    style={{
      fontWeight: isSelected ? 500 : 400,
    }}
    {...innerProps}
  >
    {children}
  </MenuItem>
);

AutocompleteOption.propTypes = {
  selectProps: PropTypes.object,
  innerProps: PropTypes.object,
  innerRef: PropTypes.func,
  isFocused: PropTypes.bool,
  isSelected: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

export default AutocompleteOption;
