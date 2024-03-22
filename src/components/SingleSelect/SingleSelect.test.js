import React from 'react';

// app
import SingleSelect from './SingleSelect';
import { render } from 'tests';

describe('COMPONENTS › SingleSelect', () => {
  describe('@render', () => {
    it('renders without crashing', () => {
      render(<SingleSelect />);
    });
  });
});
