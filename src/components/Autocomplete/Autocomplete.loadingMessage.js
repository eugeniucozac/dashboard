import React from 'react';
import PropTypes from 'prop-types';

// mui
import { Typography } from '@material-ui/core';

const AutocompleteLoadingMessage = ({ selectProps, innerProps, children }) => {
  return (
    <Typography variant="body2" color="textSecondary" className={selectProps.classes.loadingMessage} {...innerProps}>
      {children}
    </Typography>
  );
};

AutocompleteLoadingMessage.propTypes = {
  selectProps: PropTypes.object,
  innerProps: PropTypes.object,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

export default AutocompleteLoadingMessage;
