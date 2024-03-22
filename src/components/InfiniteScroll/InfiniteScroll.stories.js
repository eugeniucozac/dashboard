import React from 'react';
import { InfiniteScroll } from 'components';
import { Grid } from '@material-ui/core';

export default {
  title: 'InfiniteScroll',
  component: InfiniteScroll,
};

const arr = [...Array(100)];
const renderContent = (index) => <div style={{ padding: 10, borderBottom: '1px solid #ccc' }}>Infinite Scroll - {index}</div>;

export const Default = () => {
  return (
    <Grid container spacing={2} direction="column">
      <Grid item>
        <InfiniteScroll itemCount={arr.length} content={(index) => renderContent(index)} containerHeight={300} rowHeight={25} />
      </Grid>
    </Grid>
  );
};
