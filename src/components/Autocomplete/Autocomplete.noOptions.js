import React from 'react';
import PropTypes from 'prop-types';

// mui
import { Typography } from '@material-ui/core';

const AutocompleteNoOptions = ({ selectProps, innerProps, children }) => (
  <Typography variant="body2" color="textSecondary" className={selectProps.classes.noOptionsMessage} {...innerProps}>
    {selectProps.noOptionsFoundMessage ? selectProps.noOptionsFoundMessage : children || ''}
  </Typography>
);

AutocompleteNoOptions.propTypes = {
  selectProps: PropTypes.object,
  innerProps: PropTypes.object,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

export default AutocompleteNoOptions;
