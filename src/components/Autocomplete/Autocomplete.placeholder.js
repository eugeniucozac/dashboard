import React from 'react';
import PropTypes from 'prop-types';

// mui
import { Typography } from '@material-ui/core';

const AutocompletePlaceholder = ({ selectProps, innerProps, children }) => {
  return (
    <Typography variant="body2" className={selectProps.classes.placeholder} noWrap {...innerProps}>
      {children}
    </Typography>
  );
};

AutocompletePlaceholder.propTypes = {
  selectProps: PropTypes.object,
  innerProps: PropTypes.object,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

export default AutocompletePlaceholder;
