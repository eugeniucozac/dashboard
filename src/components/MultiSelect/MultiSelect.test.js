import React from 'react';

// app
import MultiSelect from './MultiSelect';
import { render } from 'tests';

describe('COMPONENTS › MultiSelect', () => {
  describe('@render', () => {
    it('renders without crashing', () => {
      render(<MultiSelect />);
    });
  });
});
