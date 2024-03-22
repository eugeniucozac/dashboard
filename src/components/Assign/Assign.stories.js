import React from 'react';
import { Assign } from 'components';
import { withKnobs, text } from '@storybook/addon-knobs';

export default {
  title: 'Assign',
  component: Assign,
  decorators: [withKnobs],
};

export const Default = () => {
  const selectedUser = {
    userId: 1,
    userName: 'Prabhash Prabhakar',
    role: 'PP Technician',
    email: 'Lorem.Ipsum@email.com',
  };

  const users = [
    {
      userId: 1,
      userName: 'Prabhash Prabhakar',
      role: 'PP Technician',
      email: 'Lorem.Ipsum@email.com',
    },
    {
      userId: 2,
      userName: 'Quis Repellendus',
      role: 'Front End Contact',
      email: 'Quis.Repellendus@email.com',
    },
  ];

  return (
    <Assign
      label={text('Text', '')}
      placeholder={text('Placeholder', '')}
      button={text('Button', '')}
      selectedUser={selectedUser}
      users={users}
      onAssign={(value) => {
        console.log(value);
      }}
    />
  );
};
