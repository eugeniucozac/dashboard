import React from 'react';

import { SaveBar } from 'components';
import { withKnobs, boolean } from '@storybook/addon-knobs';
import { Box } from '@material-ui/core';

export default {
  title: 'SaveBar',
  component: SaveBar,
  decorators: [withKnobs],
};
const children = <p>Children</p>;
export const Default = () => {
  return (
    <Box>
      <SaveBar show={boolean('Show', false)}>{children}</SaveBar>
    </Box>
  );
};
