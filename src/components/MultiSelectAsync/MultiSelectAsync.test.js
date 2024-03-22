import React from 'react';

// app
import MultiSelect from './MultiSelectAsync';
import { render } from 'tests';

describe('COMPONENTS › MultiSelect', () => {
  describe('@render', () => {
    it('renders without crashing', () => {
      render(<MultiSelect />);
    });
  });
});
