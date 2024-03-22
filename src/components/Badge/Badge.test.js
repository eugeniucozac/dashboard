import React from 'react';
import { render } from 'tests';
import Badge from './Badge';

describe('COMPONENTS › Badge', () => {
  describe('@render', () => {
    it('renders without crashing', () => {
      // arrange
      const { container } = render(<Badge />);

      // assert
      expect(container).toBeInTheDocument();
    });

    it('renders the badge content', () => {
      // arrange
      const { getByText } = render(<Badge badgeContent="foo" />);

      // assert
      expect(getByText('foo')).toBeInTheDocument();
    });
  });
});
