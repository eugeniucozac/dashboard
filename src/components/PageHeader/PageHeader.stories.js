import React from 'react';

import { PageHeader } from 'components';
import { withKnobs, text } from '@storybook/addon-knobs';
import { Box } from '@material-ui/core';

export default {
  title: 'PageHeader',
  component: PageHeader,
  decorators: [withKnobs],
};

export const Default = () => {
  return (
    <Box>
      <PageHeader logo={text('Logo', 'foo')}></PageHeader>
    </Box>
  );
};
