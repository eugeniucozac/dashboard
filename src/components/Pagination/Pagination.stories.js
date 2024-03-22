import React from 'react';

import { Pagination } from 'components';
import { withKnobs, number, select, boolean } from '@storybook/addon-knobs';
import { Box } from '@material-ui/core';

export default {
  title: 'Pagination',
  component: Pagination,
  decorators: [withKnobs],
};

export const Default = () => {
  const rowsPerPageOptions = [2, 3, 4, 5];
  return (
    <Box m={4}>
      <Pagination
        page={number('Page', 1)}
        count={number('Count', 5)}
        rowsPerPage={number('Rows Per Page', 4)}
        rowsPerPageOptions={select('Rows Per Page Options', rowsPerPageOptions)}
        centered={boolean('Centered', false)}
        onChangePage={() => alert('Changed')}
        onChangeRowsPerPage={() => alert('Rows Changed')}
      ></Pagination>
    </Box>
  );
};
