import React from 'react';
import PropTypes from 'prop-types';

// app
import { TimelineComponentView } from './TimelineComponent.view';

TimelineComponent.propTypes = {
  align: PropTypes.string.isRequired,
  isVirtualized: PropTypes.bool.isRequired,
  contentItems: PropTypes.array.isRequired,
};

export default function TimelineComponent({ props }) {
  return <TimelineComponentView propsTypes={props} />;
}
