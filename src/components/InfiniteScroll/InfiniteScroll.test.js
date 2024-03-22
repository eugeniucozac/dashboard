import React from 'react';
import { render } from 'tests';
import InfiniteScroll from './InfiniteScroll';

describe('COMPONENTS › InfiniteScroll', () => {
  const defaultProps = {
    containerHeight: 300,
    rowHeight: 20,
    itemCount: 50,
    content: (index) => <div>{index}</div>,
  };

  it('renders without crashing', () => {
    render(<InfiniteScroll {...defaultProps} />);
  });
});
