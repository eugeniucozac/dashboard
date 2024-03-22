import React from 'react';
import { withKnobs } from '@storybook/addon-knobs';
import { Theme } from 'components';
import { Box } from '@material-ui/core';

export default {
  title: 'Theme',
  component: Theme,
  decorators: [withKnobs],
};

export const Default = () => {
  const children = (
    <div>
      <h1>Title</h1>
      <h2>Subtitle</h2>
      <p>Lorem ipsum dolor sit amet</p>
    </div>
  );
  return (
    <Box m={4}>
      <Theme>{children}</Theme>
    </Box>
  );
};
