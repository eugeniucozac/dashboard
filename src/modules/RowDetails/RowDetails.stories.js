import React from 'react';
import { RowDetails } from 'components';
import { withKnobs } from '@storybook/addon-knobs';

export default {
  title: 'RowDetails',
  component: RowDetails,
  decorators: [withKnobs],
};

export const Default = () => {
  return <RowDetails />;
};
