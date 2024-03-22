import React from 'react';
import propTypes from 'prop-types';
import { List, AutoSizer, CellMeasurer } from 'react-virtualized';

// app
import styles from './InfiniteScroll.styles';

// mui
import { makeStyles } from '@material-ui/core';

InfiniteScrollView.propTypes = {
  itemCount: propTypes.number.isRequired,
  content: propTypes.func.isRequired,
  cache: propTypes.object.isRequired,
  scrollToIndex: propTypes.number,
  containerHeight: propTypes.number.isRequired,
};

export function InfiniteScrollView({ itemCount, content, cache, scrollToIndex, containerHeight }) {
  const classes = makeStyles(styles, { name: 'InfiniteScroll' })();

  const rowRenderer = ({ key, index, parent, style }) => (
    <CellMeasurer cache={cache} columnIndex={0} key={key} parent={parent} rowIndex={index}>
      <div style={style}>{content(index)}</div>
    </CellMeasurer>
  );

  return (
    <AutoSizer disableHeight>
      {({ width }) => (
        <List
          className={classes.root}
          width={width}
          height={containerHeight}
          scrollToIndex={scrollToIndex}
          deferredMeasurementCache={cache}
          rowHeight={cache.rowHeight}
          rowCount={itemCount}
          rowRenderer={rowRenderer}
        />
      )}
    </AutoSizer>
  );
}
