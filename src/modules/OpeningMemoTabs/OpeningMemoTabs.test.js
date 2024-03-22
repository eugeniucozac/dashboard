import React from 'react';
import { render } from 'tests';

// app
import OpeningMemoTabs from './OpeningMemoTabs';

describe('MODULES › OpeningMemoTabs', () => {
  describe('@render', () => {
    it('renders without crashing', () => {
      // arrange
      const { container } = render(<OpeningMemoTabs />);

      // assert
      expect(container).toBeInTheDocument();
    });

    it('renders nothing if not passed tabs props', () => {
      // arrange
      const { queryByTestId } = render(<OpeningMemoTabs />);

      // assert
      expect(queryByTestId('tabs')).not.toBeInTheDocument();
    });

    it('renders tabs component', () => {
      // arrange
      const { getByTestId } = render(
        <OpeningMemoTabs
          tabs={[
            { value: 'a', label: 'A' },
            { value: 'b', label: 'B' },
            { value: 'c', label: 'C' },
          ]}
        />
      );

      // assert
      expect(getByTestId('tabs')).toBeInTheDocument();
    });
  });
});
