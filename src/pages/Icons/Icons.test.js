import React from 'react';

// app
import { render } from 'tests';
import Icons from './Icons';

describe('PAGES › Icons', () => {
  describe('@render', () => {
    it('renders without crashing', () => {
      // arrange
      const { container } = render(<Icons />);

      // assert
      expect(container).toBeInTheDocument();
    });
  });
});
