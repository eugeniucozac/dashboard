import React from 'react';

import { SeparatedList } from 'components';
import { text, withKnobs, select, boolean } from '@storybook/addon-knobs';
import { Box, Flight, DirectionsBus, DriveEta, Motorcycle } from '@material-ui/core';

export default {
  title: 'SeparatedList',
  component: SeparatedList,
  decorators: [withKnobs],
};
const list = [
  { id: 1, name: 'Andre' },
  { id: 2, name: 'Pete' },
  { id: 3, name: 'Alex' },
  { id: 4, name: 'Roger Federer' },
  { id: 5, name: 'Rafa' },
];

const flagIcons = {
  airplane: Flight,
  bus: DirectionsBus,
  car: DriveEta,
  motorcycle: Motorcycle,
};

export const Default = () => {
  const options = ['regular', 'medium'];
  const defaultValue = 'medium';
  const hoverWeight = select('Status', options, defaultValue);

  const optionsSize = ['xs', 'sm', 'md', 'lg', 'xl'];
  const defaultValueSize = 'xs';
  const flagSize = select('Flag Size', optionsSize, defaultValueSize);

  const iconName = select('Flag Icon', Object.keys(flagIcons), 'airplane');
  return (
    <Box>
      <SeparatedList
        list={list}
        flag={text('Flag', 'flag')}
        flagSize={flagSize}
        flagType={text('Flag Type', 'alert')}
        flagIcon={flagIcons[iconName]}
        hover={boolean('Hover', false)}
        hoverWeight={hoverWeight}
        separator={text('Separator', ', ')}
      ></SeparatedList>
    </Box>
  );
};
