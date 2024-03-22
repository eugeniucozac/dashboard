import React from 'react';
import { TimelineComponent } from 'components';
import { withKnobs } from '@storybook/addon-knobs';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import { Typography } from '@material-ui/core';

// app

export default {
  title: 'Timeline Component',
  component: TimelineComponent,
  decorators: [withKnobs],
};

export const Default = () => {
  const timelineData = {
    align: 'alternate',
    isVirtualized: true,
    contentItems: Array(10000)
      .fill()
      .map((val, idx) => {
        return {
          isOppositeContent: true,
          isTimeLineDotVarient: 'outlined',
          isTimeLineConnector: true,
          isDotIcon: true,
          isElevation: 3,
          isTimeLineDotIcon: <FastfoodIcon />,
          oppositeContent: (
            <>
              <Typography variant="body2" color="textSecondary">
                {idx}
              </Typography>
            </>
          ),
          content: (
            <>
              <Typography variant="h6" component="h1">
                {(idx % 2 === 0 && 'EAT') || 'SLEEP'}
              </Typography>
              <Typography>{(idx % 2 === 0 && 'I am eating') || 'I am sleeping'}</Typography>
            </>
          ),
        };
      }),
  };
  return <TimelineComponent props={timelineData} />;
};
