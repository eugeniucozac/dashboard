import React from 'react';

import { PDFFooter } from 'components';
import { withKnobs, number } from '@storybook/addon-knobs';
import { Box } from '@material-ui/core';

export default {
  title: 'PDFFooter',
  component: PDFFooter,
  decorators: [withKnobs],
};

export const Default = () => {
  const children = <p>Content</p>;
  return (
    <Box m={4}>
      <PDFFooter pageCount={number('pageCount', 3)} pageNo={number('pageNo', 2)} />
      <div>{children}</div>
    </Box>
  );
};
