import React from 'react';
import { render } from 'tests';
import { PlacementOverview } from './PlacementOverview';
import { mockClasses } from 'setupMocks';

describe('MODULES › Placement', () => {
  const defaultProps = {
    classes: mockClasses,
    uiLoaderQueue: [],
    placementSelected: { id: 1, locations: [] },
    match: { params: { id: 1 } },
  };

  const initialState = { placement: { selected: {} } };

  describe('@render', () => {
    it('renders without crashing', () => {
      // arrange
      render(<PlacementOverview {...defaultProps} />, { initialState });
    });
  });
});
