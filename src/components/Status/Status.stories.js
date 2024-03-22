import React from 'react';

import { Status } from 'components';
import { text, withKnobs, select } from '@storybook/addon-knobs';
import { Box } from '@material-ui/core';

export default {
  title: 'Status',
  component: Status,
  decorators: [withKnobs],
};

export const Default = () => {
  const options = ['alert', 'success', 'error', 'new', 'info', 'light', 'unknown'];
  const defaultValue = 'alert';
  const status = select('Status', options, defaultValue);

  const optionsSize = ['xs', 'sm', 'md', 'lg', 'xl'];
  const defaultValueSize = 'xs';
  const size = select('Size', optionsSize, defaultValueSize);
  return (
    <Box>
      <Status status={status} size={size} text={text('Text', 'Status Text')}></Status>
    </Box>
  );
};
