import React from 'react';
import { FilterChips } from 'components';
import { withKnobs, text, boolean } from '@storybook/addon-knobs';
import { Box } from '@material-ui/core';

export default {
  title: 'FilterChips',
  component: FilterChips,
  decorators: [withKnobs],
};

export const Default = () => {
  const items = [
    { value: 'foo', label: 'Foo' },
    { value: 'bar', label: 'Bar' },
    { value: 'qwerty', label: 'Qwerty' },
    { value: 'azerty', label: 'Azerty' },
  ];

  return (
    <Box>
      <FilterChips
        items={items}
        handleRemoveItems={
          boolean('Remove enabled', false)
            ? (item) => {
                alert('Removed - check console.logs');
                console.log('[FilterChips.stories]', item);
              }
            : undefined
        }
        showRemoveAll={boolean('Remove all enabled', false)}
        removeAllLabel={text('Remove all label', 'Remove all chips...')}
      />
    </Box>
  );
};
