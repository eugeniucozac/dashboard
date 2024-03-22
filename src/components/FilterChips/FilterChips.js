import React from 'react';
import PropTypes from 'prop-types';

// app
import { FilterChipsView } from './FilterChips.view';

FilterChips.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      label: PropTypes.string,
    })
  ).isRequired,
  handleRemoveItems: PropTypes.func,
  showRemoveAll: PropTypes.bool,
  removeAllLabel: PropTypes.string,
};

export default function FilterChips({ items, handleRemoveItems, removeAllLabel, showRemoveAll }) {
  return (
    <FilterChipsView items={items} handleRemoveItems={handleRemoveItems} showRemoveAll={showRemoveAll} removeAllLabel={removeAllLabel} />
  );
}
