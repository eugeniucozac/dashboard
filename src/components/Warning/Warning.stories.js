import React from 'react';
import { Warning } from 'components';
import { withKnobs, text, select } from '@storybook/addon-knobs';
import { Flight, DirectionsBus, DriveEta, Motorcycle } from '@material-ui/icons';

export default {
  title: 'Warning',
  component: Warning,
  decorators: [withKnobs],
};

const icons = {
  airplane: Flight,
  bus: DirectionsBus,
  car: DriveEta,
  motorcycle: Motorcycle,
};

const types = ['default', 'info', 'alert', 'error', 'success'];

export const Default = () => {
  const iconName = select('Icon', Object.keys(icons), 'airplane');

  return (
    <Warning
      type={select('Type', types, 'default')}
      text={text('Text', 'Lorem ipsum sit dolor amet')}
      size={select('Size', ['Small', 'Medium', 'Large'], 'Small').toLowerCase()}
      align={select('Align', ['Left', 'Center', 'Right'], 'Center').toLowerCase()}
      icon={icons[iconName]}
    />
  );
};
