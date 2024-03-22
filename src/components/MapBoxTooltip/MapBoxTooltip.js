import React from 'react';
import PropTypes from 'prop-types';

// app
import { MapBoxTooltipView } from './MapBoxTooltip.view';

MapBoxTooltip.propTypes = {
  title: PropTypes.string,
  list: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.element,
      title: PropTypes.string,
      content: PropTypes.node,
    })
  ),
  children: PropTypes.node,
};

export default function MapBoxTooltip({ title, list, children }) {
  return <MapBoxTooltipView title={title} list={list} children={children} />;
}
