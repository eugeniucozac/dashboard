import React from 'react';

import { SectionHeader } from 'components';
import { text, withKnobs, select } from '@storybook/addon-knobs';
import { Box, Flight, DirectionsBus, DriveEta, Motorcycle } from '@material-ui/core';

export default {
  title: 'SectionHeader',
  component: SectionHeader,
  decorators: [withKnobs],
};

const icons = {
  airplane: Flight,
  bus: DirectionsBus,
  car: DriveEta,
  motorcycle: Motorcycle,
};

export const Default = () => {
  const iconName = select('Icon', Object.keys(icons), 'airplane');
  return (
    <Box>
      <SectionHeader
        title={text('Title', 'Title')}
        subtitle={text('Sub Title', 'Sub Title')}
        content={text('Content', 'Content')}
        icon={icons[iconName]}
        testid={'test123'}
      >
        <h1>Title</h1>
        <p>Section Header Content</p>
      </SectionHeader>
    </Box>
  );
};
