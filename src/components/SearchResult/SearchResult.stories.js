import React from 'react';

import { SearchResult } from 'components';
import { text, withKnobs, number } from '@storybook/addon-knobs';
import { Box } from '@material-ui/core';

export default {
  title: 'SearchResult',
  component: SearchResult,
  decorators: [withKnobs],
};

export const Default = () => {
  return (
    <Box>
      <SearchResult
        count={number('Result Count', 0)}
        query={text('Query', 'foo')}
        category={text('Category', 'barfoofiz')}
        handleSearchReset={() => alert('Reset')}
      ></SearchResult>
    </Box>
  );
};
