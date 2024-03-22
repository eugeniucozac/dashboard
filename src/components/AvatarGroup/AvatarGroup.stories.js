import React from 'react';
import { AvatarGroup } from 'components';
import { withKnobs, boolean, select } from '@storybook/addon-knobs';

export default {
  title: 'AvatarGroup',
  component: AvatarGroup,
  decorators: [withKnobs],
};

const users = [
  { id: 1, firstName: 'Andre', lastName: 'Agassi' },
  { id: 2, firstName: 'Pete', lastName: 'Sampras' },
  { id: 3, firstName: 'Alex', lastName: 'Moreno' },
  { id: 4, fullName: 'Roger Federer' },
  { id: 5, firstName: 'Rafa' },
];

export const Single = () => {
  return (
    <AvatarGroup
      users={[{ id: 1, firstName: 'Thomas', lastName: 'Moore' }]}
      showFullname={boolean('Fullname', false)}
      size={select('Size', [16, 24, 32, 48, 64], 32)}
      variant={select('Variant', ['circular', 'rounded', 'square'], 'circular')}
    />
  );
};

export const Multiple = () => {
  return (
    <AvatarGroup
      users={users}
      showFullname={boolean('Show Fullname', false)}
      size={select('Size', [16, 24, 32, 48, 64], 32)}
      max={select('Max', [1, 2, 3, 4, 5, 6], 3)}
      variant={select('Variant', ['circular', 'rounded', 'square'], 'circular')}
    />
  );
};
