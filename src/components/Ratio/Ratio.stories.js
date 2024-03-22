import React from 'react';

import { Ratio } from 'components';
import { withKnobs, number } from '@storybook/addon-knobs';
import { Box } from '@material-ui/core';

export default {
  title: 'Ratio',
  component: Ratio,
  decorators: [withKnobs],
};

export const Default = () => {
  return (
    <Box>
      <Ratio w={number('w', 2)} h={number('h', 1)}></Ratio>
    </Box>
  );
};
