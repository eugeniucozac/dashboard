import React from 'react';
import PropTypes from 'prop-types';

// app
import * as utils from 'utils';
import { ChartZoomLevelView } from './ChartZoomLevel.view';

ChartZoomLevel.propTypes = {
  levels: PropTypes.array.isRequired,
  onLevelChange: PropTypes.func.isRequired,
  levelOverride: PropTypes.string,
  level: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
};

export function ChartZoomLevel({ disabled, onLevelChange, levels, level, levelOverride }) {
  const zoomOptions = utils.map.getZoomOptions(levels);

  return (
    <ChartZoomLevelView
      disabled={disabled}
      zoomOptions={zoomOptions}
      onLevelChange={onLevelChange}
      levelOverride={levelOverride}
      level={level}
    />
  );
}

export default ChartZoomLevel;
