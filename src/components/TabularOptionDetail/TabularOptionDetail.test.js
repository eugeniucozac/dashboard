import React from 'react';
import { render } from 'tests';
import TabularOptionDetail from './TabularOptionDetail';

describe('COMPONENTS › OptionDetail', () => {
  describe('@render', () => {
    it('renders without crashing', () => {
      // arrange
      const { container } = render(<TabularOptionDetail />);

      // assert
      expect(container).toBeInTheDocument();
    });

    it('renders label', () => {
      // arrange
      const props = {
        label: 'mock label',
      };
      const { getByText } = render(<TabularOptionDetail {...props} />);

      // assert
      expect(getByText('mock label')).toBeInTheDocument();
    });
    it('renders children', () => {
      // arrange
      const props = {
        children: <div>child node</div>,
      };
      const { getByText } = render(<TabularOptionDetail {...props} />);

      // assert
      expect(getByText('child node')).toBeInTheDocument();
    });
    it('renders tooltip icon', () => {
      // arrange
      const props = {
        detail: 'mock detail',
      };
      const { container } = render(<TabularOptionDetail {...props} />);
      const icon = container.getElementsByTagName('svg')[0];

      // assert
      expect(icon).toBeInTheDocument();
    });
  });
});
