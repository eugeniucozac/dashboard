import React from 'react';

// app
import SaveBar from './SaveBar';
import { render } from 'tests';

describe('COMPONENTS › SaveBar', () => {
  const MockComponent = () => <div>mock component</div>;

  const defaultProps = {
    show: false,
  };

  describe('@render', () => {
    it('renders without crashing', () => {
      // arrange
      render(<SaveBar {...defaultProps} />);
    });

    it('should not display the child component if show set to false', () => {
      // arrange
      const { queryByText } = render(
        <SaveBar {...defaultProps}>
          <MockComponent />
        </SaveBar>
      );

      // assert
      expect(queryByText('mock component')).not.toBeInTheDocument();
    });

    it('displays the child component if show set to true', () => {
      // arrange
      const { getByText } = render(
        <SaveBar {...defaultProps} show={true}>
          <MockComponent />
        </SaveBar>
      );

      // assert
      expect(getByText('mock component')).toBeInTheDocument();
    });
  });
});
