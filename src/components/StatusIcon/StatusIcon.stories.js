import React from 'react';
import { StatusIcon } from 'components';
import { withKnobs, select } from '@storybook/addon-knobs';
import { Box } from '@material-ui/core';

export default {
  title: 'StatusIcon',
  component: StatusIcon,
  decorators: [withKnobs],
};

export const Default = () => {
  const statusList = [
    { id: 1, code: 'success', type: 'success' },
    { id: 2, code: 'alert', type: 'alert' },
    { id: 3, code: 'error', type: 'error' },
  ];

  const status = select('Type', ['success', 'alert', 'error'], 'success');
  const statusId = statusList.find((l) => l.code === status).id;

  return (
    <Box m={4}>
      <StatusIcon id={statusId} list={statusList} translationPath="status" />
    </Box>
  );
};
