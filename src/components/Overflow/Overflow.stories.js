import React from 'react';
import { withKnobs } from '@storybook/addon-knobs';
import { Overflow } from 'components';

export default {
  title: 'Overflow',
  component: Overflow,
  decorators: [withKnobs],
};

export const Default = () => {
  return (
    <Overflow>
      <>children</>
    </Overflow>
  );
};
