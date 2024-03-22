import React from 'react';

import { Panel } from 'components';
import { withKnobs, boolean } from '@storybook/addon-knobs';
import { Box } from '@material-ui/core';

export default {
  title: 'Panel',
  component: Panel,
  decorators: [withKnobs],
};

export const Default = () => {
  return (
    <Box m={4}>
      <Panel
        sidebar={boolean('Side Bar', false)}
        borderTop={boolean('Border Top', false)}
        borderRight={boolean('Border Right', false)}
        borderBottom={boolean('Border Bottom', false)}
        borderLeft={boolean('Border Left', false)}
        margin={boolean('Margin', true)}
        padding={boolean('Padding', true)}
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </Panel>
    </Box>
  );
};
