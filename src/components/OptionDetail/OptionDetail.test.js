import React from 'react';
import { render } from 'tests';
import OptionDetail from './OptionDetail';

describe('COMPONENTS › OptionDetail', () => {
  describe('@render', () => {
    it('renders without crashing', () => {
      // arrange
      const { container } = render(<OptionDetail />);

      // assert
      expect(container).toBeInTheDocument();
    });

    it('renders label', () => {
      // arrange
      const props = {
        label: 'mock label',
      };
      const { getByText } = render(<OptionDetail {...props} />);

      // assert
      expect(getByText('mock label')).toBeInTheDocument();
    });
    it('renders children', () => {
      // arrange
      const props = {
        children: <div>child node</div>,
      };
      const { getByText } = render(<OptionDetail {...props} />);

      // assert
      expect(getByText('child node')).toBeInTheDocument();
    });
    it('renders tooltip icon', () => {
      // arrange
      const props = {
        detail: 'mock detail',
      };
      const { container } = render(<OptionDetail {...props} />);
      const icon = container.getElementsByTagName('svg')[0];

      // assert
      expect(icon).toBeInTheDocument();
    });
  });
});
