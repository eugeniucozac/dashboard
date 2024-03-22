import React from 'react';

// app
import FilterChip from './FilterChip';
import { render } from 'tests';

describe('COMPONENTS › FilterChip', () => {
  const defaultProps = {
    removeProps: {
      onClick: jest.fn(),
    },
  };

  describe('@render', () => {
    it('renders without crashing', () => {
      render(<FilterChip {...defaultProps} />);
    });

    it('renders icon', () => {
      // arrange
      const { container } = render(<FilterChip {...defaultProps} />);

      // assert
      expect(container.querySelector('svg[class="MuiSvgIcon-root MuiChip-deleteIcon"]')).toBeInTheDocument();
    });

    it('renders label from children', () => {
      // arrange
      const { queryByText, getByText } = render(<FilterChip {...defaultProps}>Chip Label</FilterChip>);

      // assert
      expect(queryByText('Foo')).not.toBeInTheDocument();
      expect(queryByText('Bar')).not.toBeInTheDocument();
      expect(queryByText('Bax')).not.toBeInTheDocument();
      expect(getByText('Chip Label')).toBeInTheDocument();
    });

    it('renders label from children if data props is missing', () => {
      // arrange
      const selectProps = {
        valueLabel: 'key2',
      };
      const { queryByText, getByText } = render(
        <FilterChip {...defaultProps} selectProps={selectProps}>
          Chip Label
        </FilterChip>
      );

      // assert
      expect(queryByText('Foo')).not.toBeInTheDocument();
      expect(queryByText('Bar')).not.toBeInTheDocument();
      expect(queryByText('Bax')).not.toBeInTheDocument();
      expect(getByText('Chip Label')).toBeInTheDocument();
    });

    it('renders label from children if selectProps props is missing', () => {
      // arrange
      const data = {
        key1: 'Foo',
        key2: 'Bar',
        key3: 'Baz',
      };
      const { queryByText, getByText } = render(
        <FilterChip {...defaultProps} data={data}>
          Chip Label
        </FilterChip>
      );

      // assert
      expect(queryByText('Foo')).not.toBeInTheDocument();
      expect(queryByText('Bar')).not.toBeInTheDocument();
      expect(queryByText('Bax')).not.toBeInTheDocument();
      expect(getByText('Chip Label')).toBeInTheDocument();
    });

    it('renders label from selectProps', () => {
      // arrange
      const data = {
        key1: 'Foo',
        key2: 'Bar',
        key3: 'Baz',
      };
      const selectProps = {
        valueLabel: 'key2',
      };
      const { queryByText, getByText } = render(
        <FilterChip {...defaultProps} data={data} selectProps={selectProps}>
          Chip Label
        </FilterChip>
      );

      // assert
      expect(queryByText('Foo')).not.toBeInTheDocument();
      expect(getByText('Bar')).toBeInTheDocument();
      expect(queryByText('Bax')).not.toBeInTheDocument();
      expect(queryByText('Chip Label')).not.toBeInTheDocument();
    });
  });
});
