import React from 'react';
import PropTypes from 'prop-types';

// app
import { TooltipListView } from './TooltipList.view';
import * as utils from 'utils';

TooltipListView.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number.isRequired, PropTypes.string.isRequired]),
      label: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export function TooltipList({ items }) {
  if (!utils.generic.isValidArray(items, true)) return null;
  return <TooltipListView items={items} />;
}

export default TooltipList;
