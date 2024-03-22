import React from 'react';
import { withKnobs, select, text, boolean } from '@storybook/addon-knobs';
import { Summary } from 'components';
import { Box } from '@material-ui/core';

export default {
  title: 'Summary',
  component: Summary,
  decorators: [withKnobs],
};

export const Default = () => {
  const options = ['btn', 'card'];
  const defaultValue = 'card';
  const expandedToggle = select('Expand Toggle', options, defaultValue);
  return (
    <Box m={4}>
      <Summary
        status={text('Status', 'Summary Status')}
        title={text('Title', 'title')}
        subtitle={text('Subtitle', 'Sub Title')}
        description={text('Description', 'Description goes here')}
        showToggle={boolean('Show Toggle', false)}
        expanded={boolean('Expanded', false)}
        expandedToggle={expandedToggle}
        collapseActions={boolean('Collapse Actions', false)}
        collapseTitle={boolean('Collapse Title', false)}
        collapseSubtitle={boolean('Collapse Subtitle', false)}
        collapseDescription={boolean('Collapse Description', false)}
        collapseContent={boolean('Collapse Content', false)}
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </Summary>
    </Box>
  );
};
