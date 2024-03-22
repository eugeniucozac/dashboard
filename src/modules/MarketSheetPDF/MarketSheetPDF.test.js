import React from 'react';
import { render } from 'tests';
import MarketSheetPDF from './MarketSheetPDF';

describe('MODULES › MarketSheetPDF', () => {
  const props = {
    mudmapConfig: {},
    layers: {},
    mudmaps: {},
    options: [],
    year: {},
    policiesFiltered: [],
    placement: {},
    formValues: {},
  };

  describe('@render', () => {
    it('renders without crashing', () => {
      // arrange
      const { container } = render(<MarketSheetPDF {...props} />);

      // assert
      expect(container).toBeInTheDocument();
    });
  });
});
