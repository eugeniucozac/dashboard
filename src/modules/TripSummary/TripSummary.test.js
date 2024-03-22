import React from 'react';
import { render } from 'tests';

import TripSummary from './TripSummary';

describe('MODULES › TripSummary', () => {
  describe('@render', () => {
    it('renders without crashing', () => {
      // arrange
      render(<TripSummary />);
    });
  });
});
