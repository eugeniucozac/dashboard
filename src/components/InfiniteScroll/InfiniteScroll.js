import React, { useEffect, useState } from 'react';
import propTypes from 'prop-types';
import { CellMeasurerCache } from 'react-virtualized';

// app
import { InfiniteScrollView } from './InfiniteScroll.view';

InfiniteScroll.propTypes = {
  itemCount: propTypes.number.isRequired,
  content: propTypes.func.isRequired,
  rowHeight: propTypes.node.isRequired,
  containerHeight: propTypes.node.isRequired,
};

export default function InfiniteScroll({ itemCount, rowHeight, content, containerHeight }) {
  const cache = new CellMeasurerCache({ defaultHeight: rowHeight, fixedWidth: true });
  const [scrollToIndex, setScrollToIndex] = useState(undefined);

  useEffect(
    () => {
      if (!itemCount) return;
      setScrollToIndex(0);
      cache.clearAll();
    },
    [itemCount] // eslint-disable-line react-hooks/exhaustive-deps
  );

  return (
    <InfiniteScrollView
      itemCount={itemCount}
      content={content}
      containerHeight={containerHeight}
      cache={cache}
      scrollToIndex={scrollToIndex}
    />
  );
}
