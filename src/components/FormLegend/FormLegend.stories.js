import React from 'react';

import { FormLegend } from 'components';
import { withKnobs, text } from '@storybook/addon-knobs';
import { Box } from '@material-ui/core';

export default {
  title: 'FormLegend',
  component: FormLegend,
  decorators: [withKnobs],
};

export const Default = () => {
  return (
    <Box width={1}>
      <FormLegend text={text('Legend', 'Form Legend')} />
    </Box>
  );
};
