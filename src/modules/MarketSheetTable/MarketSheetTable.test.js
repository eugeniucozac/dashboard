import React from 'react';
import { render } from 'tests';
import { MarketSheetTable } from './MarketSheetTable';
import { mockClasses, mockTheme } from 'setupMocks';

describe('MODULES › MarketSheetTable', () => {
  const defaultProps = {
    classes: mockClasses,
    theme: mockTheme,
    policies: [],
    year: 2019,
    option: 'a',
  };

  describe('@render', () => {
    it('renders without crashing', () => {
      // arrange
      render(<MarketSheetTable {...defaultProps} />);
    });
  });
});
