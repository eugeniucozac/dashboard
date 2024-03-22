import React from 'react';
import { render, within } from 'tests';
import ChartTable from './ChartTable';

describe('COMPONENTS › ChartTable', () => {
  const defaultProps = {
    rows: [],
    cols: [],
    sort: {},
    pagination: {},
    onClick: () => {},
  };

  const rows = [
    { id: 1, name: 'a', datasets: [{ id: 1, value: 5 }], label: '$5' },
    { id: 2, name: 'b', datasets: [{ id: 1, value: 10 }] },
    { id: 3, name: 'c', datasets: [{ id: 1, value: 0 }] },
  ];

  describe('@render', () => {
    it('renders without crashing', () => {
      // arrange
      const { container } = render(<ChartTable />);

      // assert
      expect(container).toBeInTheDocument();
    });

    it('renders no table rows if not passed rows props', () => {
      // arrange
      const { getByTestId } = render(<ChartTable />);

      // assert
      expect(getByTestId('chart-table-list')).toBeEmptyDOMElement();
    });

    it('renders empty pagination if not passed rows & pagination props', () => {
      // arrange
      const { getByTestId } = render(<ChartTable />);

      // assert
      expect(getByTestId('pagination')).toBeInTheDocument();
      expect(within(getByTestId('pagination')).getByText('10')).toBeInTheDocument();
      expect(within(getByTestId('pagination')).getByText('0-0 pagination.of 0')).toBeInTheDocument();
    });

    it('renders the table column headers', () => {
      // arrange
      const props = {
        ...defaultProps,
        cols: [
          { id: 'name', label: 'name', sort: { type: 'lexical', direction: 'asc' } },
          { id: 'value', label: 'value', sort: { type: 'numeric', direction: 'asc' } },
        ],
      };

      const { container } = render(<ChartTable {...props} />);
      const tablehead = container.querySelector('table > thead');

      // assert
      expect(tablehead).toBeInTheDocument();
      expect(tablehead.querySelector('th:nth-child(1)')).toHaveTextContent('name');
      expect(tablehead.querySelector('th:nth-child(2)')).toHaveTextContent('value');
    });

    it('renders the table rows', () => {
      // arrange
      const props = {
        ...defaultProps,
        rows,
      };

      const { getByTestId } = render(<ChartTable {...props} />);

      // assert
      expect(getByTestId(`chart-table-row-1`)).toBeInTheDocument();
      expect(getByTestId(`chart-table-row-1`)).toHaveTextContent('a');
      expect(getByTestId(`chart-table-row-1`)).toHaveTextContent('$5');

      expect(getByTestId(`chart-table-row-2`)).toBeInTheDocument();
      expect(getByTestId(`chart-table-row-2`)).toHaveTextContent('b');
      expect(getByTestId(`chart-table-row-2`)).toHaveTextContent('10');
    });

    it('orders the rows by value ASC', () => {
      // arrange
      const props = {
        ...defaultProps,
        rows,
        sort: {
          by: 'value',
          type: 'numeric',
          direction: 'asc',
        },
      };

      const { getByTestId } = render(<ChartTable {...props} />);
      const table = getByTestId(`chart-table-list`);

      // assert
      expect(table.querySelector('tr:nth-child(1)')).toHaveAttribute('data-testid', 'chart-table-row-3');
      expect(table.querySelector('tr:nth-child(2)')).toHaveAttribute('data-testid', 'chart-table-row-1');
      expect(table.querySelector('tr:nth-child(3)')).toHaveAttribute('data-testid', 'chart-table-row-2');
    });

    it('orders the rows by value DESC', () => {
      // arrange
      const props = {
        ...defaultProps,
        rows,
        sort: {
          by: 'value',
          type: 'numeric',
          direction: 'desc',
        },
      };

      const { getByTestId } = render(<ChartTable {...props} />);
      const table = getByTestId(`chart-table-list`);

      // assert
      expect(table.querySelector('tr:nth-child(1)')).toHaveAttribute('data-testid', 'chart-table-row-2');
      expect(table.querySelector('tr:nth-child(2)')).toHaveAttribute('data-testid', 'chart-table-row-1');
      expect(table.querySelector('tr:nth-child(3)')).toHaveAttribute('data-testid', 'chart-table-row-3');
    });

    it('orders the rows by name ASC', () => {
      // arrange
      const props = {
        ...defaultProps,
        rows,
        sort: {
          by: 'name',
          type: 'lexical',
          direction: 'asc',
        },
      };

      const { getByTestId } = render(<ChartTable {...props} />);
      const table = getByTestId(`chart-table-list`);

      // assert
      expect(table.querySelector('tr:nth-child(1)')).toHaveAttribute('data-testid', 'chart-table-row-1');
      expect(table.querySelector('tr:nth-child(2)')).toHaveAttribute('data-testid', 'chart-table-row-2');
      expect(table.querySelector('tr:nth-child(3)')).toHaveAttribute('data-testid', 'chart-table-row-3');
    });

    it('orders the rows by name DESC', () => {
      // arrange
      const props = {
        ...defaultProps,
        rows,
        sort: {
          by: 'name',
          type: 'lexical',
          direction: 'desc',
        },
      };

      const { getByTestId } = render(<ChartTable {...props} />);
      const table = getByTestId(`chart-table-list`);

      // assert
      expect(table.querySelector('tr:nth-child(1)')).toHaveAttribute('data-testid', 'chart-table-row-3');
      expect(table.querySelector('tr:nth-child(2)')).toHaveAttribute('data-testid', 'chart-table-row-2');
      expect(table.querySelector('tr:nth-child(3)')).toHaveAttribute('data-testid', 'chart-table-row-1');
    });
  });
});
