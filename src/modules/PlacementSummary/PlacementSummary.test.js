import React from 'react';
import { render } from 'tests';
import { PlacementSummary } from './PlacementSummary';
import { mockClasses } from 'setupMocks';

describe('MODULES › PlacementSummary', () => {
  const defaultProps = {
    classes: mockClasses,
    placement: { selected: { id: 1 } },
  };

  describe('@render', () => {
    it('renders without crashing', () => {
      // arrange
      render(<PlacementSummary {...defaultProps} />);
    });
  });
});
