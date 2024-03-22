import React from 'react';
import '@testing-library/jest-dom/extend-expect';

// app
import FilterChips from './FilterChips';
import { render } from 'tests';

describe('COMPONENTS › FilterChips', () => {
  const defaultProps = {
    items: [],
    handleRemoveItems: jest.fn(),
  };

  describe('@render', () => {
    it('renders without crashing', () => {
      render(<FilterChips {...defaultProps} />);
    });

    it('renders items', () => {
      // arrange
      const props = {
        ...defaultProps,
        items: [
          { label: 'one', value: 1 },
          { label: 'two', value: 2 },
        ],
      };
      const { getByText, queryByText } = render(<FilterChips {...props} />);

      // assert
      expect(getByText('one')).toBeInTheDocument();
      expect(getByText('two')).toBeInTheDocument();
      expect(queryByText('app.removeAll')).not.toBeInTheDocument();
    });

    it('should not render remove all link', () => {
      // arrange
      const props = {
        ...defaultProps,
        items: [{ label: 'one', value: 1 }],
        showRemoveAll: true,
      };
      const { queryByText } = render(<FilterChips {...props}>Chip label</FilterChips>);

      // assert
      expect(queryByText('app.removeAll')).not.toBeInTheDocument();
    });

    it('should render remove all link', () => {
      // arrange
      const props = {
        ...defaultProps,
        items: [
          { label: 'one', value: 1 },
          { label: 'two', value: 2 },
        ],
        showRemoveAll: true,
      };
      const { getByText } = render(<FilterChips {...props}>Chip label</FilterChips>);

      // assert
      expect(getByText('app.removeAll')).toBeInTheDocument();
    });

    it('should render custom remove all label', () => {
      // arrange
      const props = {
        ...defaultProps,
        items: [
          { label: 'one', value: 1 },
          { label: 'two', value: 2 },
        ],
        showRemoveAll: true,
        removeAllLabel: 'custom label',
      };
      const { getByText } = render(<FilterChips {...props}>Chip label</FilterChips>);

      // assert
      expect(getByText('custom label')).toBeInTheDocument();
    });
  });
});
