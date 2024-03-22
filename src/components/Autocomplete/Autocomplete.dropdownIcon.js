import React from 'react';
import { compose } from 'redux';
import classnames from 'classnames';
import PropTypes from 'prop-types';

// app
import styles from './Autocomplete.styles';

// mui
import { withStyles } from '@material-ui/core';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

const AutocompleteDropdownIcon = ({ classes, isFocused, selectProps, innerProps }) => {
  const iconClasses = {
    [selectProps.classes.dropdownIconXs]: selectProps.customStyles && selectProps.customStyles.size === 'xs',
    [selectProps.classes.dropdownIconCompact]: selectProps.customStyles && selectProps.customStyles.compact,
    [classes.iconFocused]: isFocused,
  };

  return <KeyboardArrowDownIcon {...innerProps} className={classnames(classes.dropdownIcon, iconClasses)} />;
};

AutocompleteDropdownIcon.propTypes = {
  selectProps: PropTypes.object,
  classes: PropTypes.object,
  isFocused: PropTypes.bool,
  innerProps: PropTypes.object,
};

export default compose(withStyles(styles))(AutocompleteDropdownIcon);
