import React from 'react';

// app
import { FilterBarView } from './FilterBar.view';

export function FilterBar({ ...props }) {
  return <FilterBarView {...props} />;
}

export default FilterBar;
