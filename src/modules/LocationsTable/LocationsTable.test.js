import React from 'react';
import { render, within } from 'tests';

import LocationsTable from './LocationsTable';

describe('MODULES › LocationsTable', () => {
  describe('@render', () => {
    const defaultProps = {
      rows: [],
      cols: [],
      sort: {},
      pagination: {},
      handleClickRow: () => {},
    };

    it('renders without crashing', () => {
      // arrange
      const { container } = render(<LocationsTable />);

      // assert
      expect(container).toBeInTheDocument();
    });

    it('renders no table rows if not passed rows props', () => {
      // arrange
      const { getByTestId } = render(<LocationsTable />);

      // assert
      expect(getByTestId('locations-list')).toBeEmptyDOMElement();
    });

    it('renders empty pagination if not passed rows & pagination props', () => {
      // arrange
      const { getByTestId } = render(<LocationsTable />);

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
          { id: 'street', label: 'street' },
          { id: 'city', label: 'city' },
          { id: 'state', label: 'state' },
          { id: 'tiv', label: 'tiv' },
        ],
      };

      const { container } = render(<LocationsTable {...props} />);
      const tablehead = container.querySelector('table > thead');

      // assert
      expect(tablehead).toBeInTheDocument();
      expect(tablehead.querySelector('th:nth-child(1)')).toHaveTextContent('street');
      expect(tablehead.querySelector('th:nth-child(2)')).toHaveTextContent('city');
      expect(tablehead.querySelector('th:nth-child(3)')).toHaveTextContent('state');
      expect(tablehead.querySelector('th:nth-child(4)')).toHaveTextContent('tiv');
    });

    it('renders the table rows', () => {
      // arrange
      const props = {
        ...defaultProps,
        rows: [
          {
            id: 1,
            streetAddress: '123 street',
            city: 'Miami',
            state: 'FL',
            totalInsurableValues: '1000',
          },
        ],
      };

      const { getByTestId } = render(<LocationsTable {...props} />);

      // assert
      expect(getByTestId(`overview-table-1`)).toBeInTheDocument();
      expect(getByTestId('overview-table-location-1')).toHaveTextContent('123 street');
      expect(getByTestId('overview-table-city-1')).toHaveTextContent('Miami');
      expect(getByTestId('overview-table-state-1')).toHaveTextContent('FL');
      expect(getByTestId('overview-table-tiv-1')).toHaveTextContent('1000');
    });

    it('renders multiple table rows', () => {
      // arrange
      const props = {
        ...defaultProps,
        rows: [{ id: 1 }, { id: 2 }, { id: 3 }],
      };
      const { getByTestId } = render(<LocationsTable {...props} />);

      // assert
      expect(getByTestId(`locations-list`).children).toHaveLength(3);
    });
  });
});
