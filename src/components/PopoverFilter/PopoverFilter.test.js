import React from 'react';

// app
import PopoverFilter from './PopoverFilter';
import { render } from 'tests';

describe('COMPONENTS › PopoverFilter', () => {
  describe('@render', () => {
    it('renders without crashing', () => {
      render(<PopoverFilter />);
    });
  });
});
