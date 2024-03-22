import React from 'react';
import { render } from 'tests';
import { Documents } from './Documents';

describe('COMPONENTS › Documents', () => {
  const defaultProps = {
    folders: [],
    documents: [],
  };

  it('renders without crashing', () => {
    render(<Documents {...defaultProps} />);
  });
});
