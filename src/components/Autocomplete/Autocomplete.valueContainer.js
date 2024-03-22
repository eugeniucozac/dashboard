import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const AutocompleteValueContainer = ({ selectProps, children, hasValue, isMulti }) => {
  // custom check to grey out text
  // only applies on focus, for single dropdown with previous value and nothing typed in yet
  const greyedOutText = !isMulti && hasValue && selectProps.menuIsOpen && selectProps.inputValue === '';

  const classes = {
    [selectProps.classes.valueContainer]: true,
    [selectProps.classes.valueContainerXs]: selectProps.customStyles && selectProps.customStyles.size === 'xs',
    [selectProps.classes.valueContainerCompact]: selectProps.customStyles && selectProps.customStyles.compact,
    [selectProps.classes.valueContainerMulti]: selectProps.isMulti,
    [selectProps.classes.valueContainerGreyed]: greyedOutText,
  };

  return <div className={classnames(classes)}>{children}</div>;
};

AutocompleteValueContainer.propTypes = {
  selectProps: PropTypes.object,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  isMulti: PropTypes.bool,
  hasValue: PropTypes.bool,
};

export default AutocompleteValueContainer;
