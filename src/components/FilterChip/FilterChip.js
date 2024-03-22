import React from 'react';
import PropTypes from 'prop-types';

// app
import { FilterChipView } from './FilterChip.view';

FilterChip.propTypes = {
  isFocused: PropTypes.bool,
  data: PropTypes.object,
  selectProps: PropTypes.shape({
    valueLabel: PropTypes.string,
  }),
  removeProps: PropTypes.shape({
    onClick: PropTypes.func,
  }),
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

FilterChipView.defaultProps = {
  removeProps: {},
};

export default function FilterChip({ isFocused, removeProps, data, selectProps, children }) {
  const label = data && selectProps && selectProps.valueLabel ? data[selectProps.valueLabel] : children;
  return <FilterChipView isFocused={isFocused} removeProps={removeProps} label={label} />;
}
