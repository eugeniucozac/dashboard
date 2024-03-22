import React from 'react';
import { Approval } from 'components';
import { withKnobs, boolean, text } from '@storybook/addon-knobs';

export default {
  title: 'Approval',
  component: Approval,
  decorators: [withKnobs],
};

const users = [
  { id: 1, fullName: 'Andre Agassi' },
  { id: 2, fullName: 'Pete Sampras' },
  { id: 3, fullName: 'Alex Moreno' },
  { id: 4, fullName: 'Roger Federer' },
  { id: 5, fullName: 'Jane Doe' },
];
export const Default = () => {
  return (
    <Approval
      title={text('Title', 'Approved')}
      users={users}
      user={{
        fullName: 'Andre Agassi',
      }}
      isApproved={boolean('Approved', false)}
      approvedDate={text('Approved Date', '2021-01-14')}
      disabled={boolean('Disabled field', false)}
      disableApproval={boolean('Disabled button', false)}
    />
  );
};
