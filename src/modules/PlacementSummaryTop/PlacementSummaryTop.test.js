import React from 'react';
import { render } from 'tests';
import { PlacementSummaryTop } from './PlacementSummaryTop';
import { mockClasses } from 'setupMocks';

describe('MODULES › PlacementSummaryTop', () => {
  const defaultProps = {
    classes: mockClasses,
    placement: { selected: { id: 1 } },
  };

  describe('@render', () => {
    it('renders without crashing', () => {
      // arrange
      render(<PlacementSummaryTop {...defaultProps} />);
    });
  });
});
