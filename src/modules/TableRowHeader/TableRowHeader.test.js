import React from 'react';
import { render, screen } from 'tests';
import TableRowHeader from './TableRowHeader';

const defaultProps = {
  title: "Title",
  subtitle: "Subtitle",
  expanded: false,
};

const renderTableRowHeader = (props) => {
  return render(<TableRowHeader {...defaultProps} {...props} />);
};

describe('MODULES › TableRowHeader', () => {
  describe('@render', () => {
    it('renders without crashing', () => {
      // arrange
      renderTableRowHeader();  

      // assert
      expect(screen.getByTestId("table-row-header")).toBeInTheDocument();
    });

    it('renders props and icons', () => {
      // arrange
      const { container } = renderTableRowHeader();  

      // assert
      expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
      expect(screen.getByText(defaultProps.subtitle)).toBeInTheDocument();
      expect(container.querySelectorAll('svg')).toHaveLength(2);
    });
  });
});