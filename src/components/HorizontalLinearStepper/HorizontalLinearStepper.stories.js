import React from 'react';
import { HorizontalLinearStepper } from 'components';
import { withKnobs } from '@storybook/addon-knobs';

export default {
  title: 'HorizontalLinearStepper',
  component: HorizontalLinearStepper,
  decorators: [withKnobs],
};

export const Default = () => {
  const steps = ['Step 1', 'Step 2', 'Step 3'];
  return <HorizontalLinearStepper stepContent={() => {}} steps={steps} activeStep={1} />;
};
