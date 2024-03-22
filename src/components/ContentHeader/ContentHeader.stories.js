import React from 'react';

import { ContentHeader } from 'components';
import { number, text, withKnobs } from '@storybook/addon-knobs';
import { Box } from '@material-ui/core';

export default {
  title: 'ContentHeader',
  component: ContentHeader,
  decorators: [withKnobs],
};

export const Default = () => {
  return (
    <Box width={1}>
      <ContentHeader
        title={text('Title', 'Title')}
        subtitle={text('Sub Title', 'Sub Title')}
        content={text('Content', '')}
        marginTop={number('Margin Top', 1)}
        marginBottom={number('Margin Bottom', 2)}
      />
    </Box>
  );
};
