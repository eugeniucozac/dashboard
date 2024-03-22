import React from 'react';
import PropTypes from 'prop-types';

// mui
import { Typography } from '@material-ui/core';

const AutocompleteSingleValue = ({ selectProps, innerProps, children, ...props }) => {
  const { data } = props;
  const label = selectProps && selectProps.valueLabel ? data[selectProps.valueLabel] : children;
  return (
    <Typography variant="body2" noWrap className={selectProps.classes.singleValue} {...innerProps}>
      {label}
    </Typography>
  );
};

AutocompleteSingleValue.propTypes = {
  selectProps: PropTypes.object,
  innerProps: PropTypes.object,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

export default AutocompleteSingleValue;
