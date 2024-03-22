import React from 'react';
import { withKnobs, boolean, text, number } from '@storybook/addon-knobs';

import TrafficLights from './TrafficLights';
import { Box } from '@material-ui/core';

export default {
  title: 'TrafficLights',
  component: TrafficLights,
  decorators: [withKnobs],
};

export const Default = () => {
  return (
    <Box m={4}>
      <TrafficLights green={number('Green', 4)} yellow={number('Yellow', 1)} red={number('Red', 2)} />
    </Box>
  );
};
export const DefaultTooltip = () => {
  return (
    <Box m={4}>
      <TrafficLights green={number('Green', 4)} yellow={number('Yellow', 1)} red={number('Red', 2)} tooltip={boolean('Tooltip', true)} />
    </Box>
  );
};
export const CustomTooltip = () => {
  const tooltipContent = text(
    'Tooltip Content',
    'Thomas A. Anderson is a man living two lives. By day he is an average computer programmer and by night a hacker known as Neo. Neo has always questioned his reality, but the truth is far beyond his imagination...'
  );
  return (
    <Box m={4}>
      <TrafficLights
        green={number('Green', 4)}
        yellow={number('Yellow', 1)}
        red={number('Red', 2)}
        tooltip={boolean('Tooltip', true)}
        tooltipContent={tooltipContent}
      />
    </Box>
  );
};
