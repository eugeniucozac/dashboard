import React from 'react';
import PropTypes from 'prop-types';

// app
import { ChipView } from './Chip.view';

Chip.propTypes = {
  type: PropTypes.string,
  label: PropTypes.node,
  testid: PropTypes.string,
  nestedClasses: PropTypes.object,
};

export default function Chip(props) {
  return <ChipView {...props} />;
}
