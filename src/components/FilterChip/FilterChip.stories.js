import React from 'react';
import { FilterChip } from 'components';
import { text, boolean, object, withKnobs } from '@storybook/addon-knobs';
import { Box } from '@material-ui/core';

export default {
  title: 'FilterChip',
  component: FilterChip,
  decorators: [withKnobs],
};

export const Default = () => {
  const removeProps = {
    onClick: () => {
      alert('Clicked');
    },
  };

  const data = object('Data', { prop1: 'foo', prop2: 'bar', prop3: 'qwerty' });
  const dataProp = text('Data Prop', 'prop1');

  return (
    <Box>
      <FilterChip
        data={data}
        selectProps={{
          valueLabel: dataProp,
        }}
        isFocused={boolean('Focused', false)}
        removeProps={boolean('Remove', false) ? removeProps : undefined}
      >
        {text('Children', 'Lorem ipsum...')}
      </FilterChip>
    </Box>
  );
};
