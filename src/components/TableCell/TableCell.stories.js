import React from 'react';
import { withKnobs, text, boolean } from '@storybook/addon-knobs';
import { TableCell } from 'components';
import { Box } from '@material-ui/core';

export default {
  title: 'TableCell',
  component: TableCell,
  decorators: [withKnobs],
};

export const Default = () => {
  const children = (
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
  );
  return (
    <Box m={4}>
      <TableCell
        compact={boolean('Compact', false)}
        minimal={boolean('Minimal', false)}
        nowrap={boolean('Nowrap', false)}
        narrow={boolean('Narrow', false)}
        ellipsis={boolean('Ellipsis', false)}
        center={boolean('Center', false)}
        right={boolean('Right', false)}
        bold={boolean('Bold', false)}
        menu={boolean('Menu', false)}
        borderless={boolean('Borderless', false)}
        relative={boolean('Relative', false)}
        className={text('ClasssName', 'classes')}
      >
        {children}
      </TableCell>
    </Box>
  );
};
