import React, { useState } from 'react';
import { ChartZoomLevel } from 'components';
import { withKnobs, boolean } from '@storybook/addon-knobs';
import { Box } from '@material-ui/core';

export default {
  title: 'ChartZoomLevel',
  component: ChartZoomLevel,
  decorators: [withKnobs],
};

export const Default = () => {
  const defaultLevel = 'state';
  const [currentLevel, setCurrentLevel] = useState(defaultLevel);

  const setZoomLevel = (obj) => {
    console.log('[setZoomLevel]', obj);
    setCurrentLevel(obj?.levelOverride || currentLevel || defaultLevel);
  };

  return (
    <Box width="100%" position="relative" mt={-2} mr={-4}>
      <ChartZoomLevel
        levels={[
          ['<==', 1, 'country'],
          ['===', 2, 'state'],
          ['===', 3, 'county'],
          ['===', 4, 'zip'],
          ['==>', 5, 'address'],
        ]}
        onLevelChange={(levelObj) => {
          setZoomLevel(levelObj);
        }}
        level={currentLevel}
        disabled={boolean('Disabled', false)}
      />
    </Box>
  );
};
