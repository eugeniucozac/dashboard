import React from 'react';

import { PopoverMenu } from 'components';
import { withKnobs, object, text } from '@storybook/addon-knobs';
import { Box } from '@material-ui/core';
import * as utils from 'utils';

export default {
  title: 'PopoverMenu',
  component: PopoverMenu,
  decorators: [withKnobs],
};

export const Default = () => {
  const popoverActions = [
    {
      id: 'all',
      label: utils.string.t('openingMemo.filter.all'),
      callback: () => alert('selected all'),
    },
    {
      id: 'inProgress',
      label: utils.string.t('openingMemo.filter.inProgress'),
      callback: () => alert('selected inprogress'),
    },
    {
      id: 'awaitingApproval',
      label: utils.string.t('openingMemo.filter.awaitingApproval'),
      callback: () => alert('selected awaitingApproval'),
    },
    {
      id: 'approved',
      label: utils.string.t('openingMemo.filter.approved'),
      callback: () => alert('selected approved'),
    },
  ];
  return (
    <Box m={4}>
      <Box>
        <Box style={{ background: 'grey', border: 'none', padding: '5px' }}>
          <PopoverMenu id={text('id', 'popover-menu')} data={object('data', { id: 'approved' })} items={object('items', popoverActions)} />
        </Box>
      </Box>
    </Box>
  );
};
