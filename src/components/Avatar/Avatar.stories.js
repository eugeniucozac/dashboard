import React from 'react';
import { Avatar } from 'components';
import { withKnobs, boolean, text, select } from '@storybook/addon-knobs';
import { Flight, DirectionsBus, DriveEta, Motorcycle } from '@material-ui/icons';

export default {
  title: 'Avatar',
  component: Avatar,
  decorators: [withKnobs],
};

const icons = {
  airplane: Flight,
  bus: DirectionsBus,
  car: DriveEta,
  motorcycle: Motorcycle,
};

const images = {
  Jim: 'https://i.pravatar.cc/150?img=6&u=a042581f4e29026704d',
  John: 'https://i.pravatar.cc/150?img=7&u=a042581f4e29026704d',
  Jess: 'https://i.pravatar.cc/150?img=25&u=a042581f4e29026704d',
  Jill: 'https://i.pravatar.cc/150?img=44&u=a042581f4e29026704d',
  Jack: 'https://i.pravatar.cc/150?img=15&u=a042581f4e29026704d',
};

const sizes = [16, 24, 32, 48, 64];

export const Text = () => {
  return (
    <Avatar
      text={text('Initials', 'AA')}
      size={select('Size', sizes, 32)}
      bg={text('bg', 'blue')}
      variant={select('Variant', ['circular', 'rounded', 'square'], 'circular')}
    />
  );
};

export const Icon = () => {
  const iconName = select('Icon', Object.keys(icons), 'airplane');

  return (
    <Avatar
      size={select('Size', sizes, 32)}
      bg={select('Colour', ['', 'White', 'LightGrey', 'HotPink', 'YellowGreen', 'LightSkyBlue'], '')}
      border={boolean('Border', true)}
      variant={select('Variant', ['circular', 'rounded', 'square'], 'circular')}
      icon={icons[iconName]}
    />
  );
};

export const Image = () => {
  const imageName = select('Image', Object.keys(images), 'Jim');

  return (
    <Avatar
      size={select('Size', sizes, 64)}
      src={images[imageName]}
      border={boolean('Border', false)}
      variant={select('Variant', ['circular', 'rounded', 'square'], 'circular')}
    />
  );
};
