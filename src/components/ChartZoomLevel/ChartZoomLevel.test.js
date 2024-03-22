import React from 'react';
import '@testing-library/jest-dom/extend-expect';

// app
import { ChartZoomLevel } from './ChartZoomLevel';
import { render } from 'tests';

describe('COMPONENTS › ChartZoomLevel', () => {
  describe('@render', () => {
    it('renders without crashing', () => {
      render(<ChartZoomLevel />);
    });
  });
});
