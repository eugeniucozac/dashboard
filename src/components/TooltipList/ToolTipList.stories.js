import React from 'react';
import { withKnobs, select } from '@storybook/addon-knobs';
import { TooltipList } from 'components';
import { Box } from '@material-ui/core';

export default {
  title: 'TooltipList',
  component: TooltipList,
  decorators: [withKnobs],
};

export const Default = () => {
  const items = [
    {
      amount: 2344,
      id: 1234,
      label: 'Equinox',
    },
    {
      amount: 43546545,
      id: 2345,
      label: 'Property',
    },
  ];

  const itemSelect = select('Items', items, items[0]);
  return (
    <Box m={4}>
      <TooltipList items={itemSelect}>Tool Tip Chidren</TooltipList>
    </Box>
  );
};
