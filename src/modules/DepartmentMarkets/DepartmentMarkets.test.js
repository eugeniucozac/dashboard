import React from 'react';
import { useParams } from 'react-router';
import { render, waitFor, within } from 'tests';
import fetchMock from 'fetch-mock';
import DepartmentMarkets from './DepartmentMarkets';

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useParams: jest.fn(),
}));

describe('MODULES › DepartmentMarkets', () => {
  const initialState = {
    referenceData: {
      capacityTypes: [
        { id: 1, color: '#111', name: 'cap1' },
        { id: 2, color: '#222', name: 'cap2' },
        { id: 3, color: '#333', name: 'cap3' },
      ],
      statuses: {
        account: [
          { id: 1, code: 'live' },
          { id: 2, code: 'provisional' },
          { id: 3, code: 'closed' },
        ],
      },
    },
    department: {
      markets: {
        items: [],
      },
    },
    user: {
      role: 'BROKER',
      departmentIds: [1, 2, 3],
      auth: {
        accessToken: 'abc123',
      },
    },
  };

  const underwriters = [
    { id: 1, firstName: 'John', lastName: 'Johnson', emailId: 'jj@abc.com' },
    { id: 2, firstName: 'Steve', lastName: 'Stevenson', emailId: 'ss@abc.com' },
    { id: 3, firstName: 'Mark', lastName: '', emailId: 'm@abc.com' },
    { id: 4, firstName: 'Frank', lastName: 'Frankenson', emailId: 'ff@abc.com' },
  ];

  const marketsData = [
    { id: 3, market: { id: 30, edgeName: 'market30', statusId: 3, capacityTypeId: 2 }, underwriters: [underwriters[0], underwriters[1]] },
    { id: 1, market: { id: 10, edgeName: 'market10', statusId: 1, capacityTypeId: 1 }, underwriters: [] },
    { id: 2, market: { id: 20, edgeName: 'market20', statusId: 2, capacityTypeId: 1 }, underwriters: [underwriters[0]] },
    { id: 5, market: { id: 50, edgeName: 'market50', capacityTypeId: null }, underwriters: [] },
    { id: 4, market: { id: 40, edgeName: 'market40', statusId: null, capacityTypeId: 2 }, underwriters: underwriters },
  ];

  beforeEach(() => {
    useParams.mockReturnValue({ id: 1, slug: 'one' });
    fetchMock.get('glob:*/api/departmentMarket/department/*', { body: { status: 'success', data: marketsData } });
  });

  afterEach(() => {
    fetchMock.restore();
  });

  describe('@render', () => {
    it('renders the add market button', () => {
      // arrange
      const { getByText } = render(<DepartmentMarkets />, { initialState });

      // assert
      expect(getByText('market.addMarket')).toBeInTheDocument();
    });

    it('renders the markets group by capacity types', async () => {
      // arrange
      const { getByTestId, queryByTestId } = render(<DepartmentMarkets />, { initialState });
      await waitFor(() => expect(getByTestId('table-capacity-1-cap-1')).toBeInTheDocument());

      // assert
      expect(getByTestId('table-capacity-1-cap-1')).toBeInTheDocument();
      expect(getByTestId('table-capacity-2-cap-2')).toBeInTheDocument();
      expect(queryByTestId('table-capacity-3-cap-3')).not.toBeInTheDocument();
    });

    it('renders the table column headers', async () => {
      // arrange
      const { getByTestId } = render(<DepartmentMarkets />, { initialState });
      await waitFor(() => expect(getByTestId('table-capacity-1-cap-1')).toBeInTheDocument());

      // assert
      expect(within(getByTestId('table-capacity-1-cap-1').querySelector('th:nth-child(1)')).getByText('cap1')).toBeInTheDocument();
      expect(
        within(getByTestId('table-capacity-1-cap-1').querySelector('th:nth-child(2)')).getByText('market.cols.underwriterName')
      ).toBeInTheDocument();
      expect(
        within(getByTestId('table-capacity-1-cap-1').querySelector('th:nth-child(3)')).getByText('market.cols.underwriterEmail')
      ).toBeInTheDocument();
      expect(within(getByTestId('table-capacity-2-cap-2').querySelector('th:nth-child(1)')).getByText('cap2')).toBeInTheDocument();
      expect(
        within(getByTestId('table-capacity-2-cap-2').querySelector('th:nth-child(2)')).getByText('market.cols.underwriterName')
      ).toBeInTheDocument();
      expect(
        within(getByTestId('table-capacity-2-cap-2').querySelector('th:nth-child(3)')).getByText('market.cols.underwriterEmail')
      ).toBeInTheDocument();
    });

    it('renders the capacity type color next to the group name', async () => {
      // arrange
      const { getByTestId } = render(<DepartmentMarkets />, { initialState });
      await waitFor(() => expect(getByTestId('table-capacity-1-cap-1')).toBeInTheDocument());

      // assert
      expect(getByTestId('table-capacity-1-cap-1').querySelector('[data-testid="avatar"][title="cap1"]')).toBeInTheDocument();
      expect(getByTestId('table-capacity-2-cap-2').querySelector('[data-testid="avatar"][title="cap2"]')).toBeInTheDocument();
    });

    it('renders the market names sort alphabetically', async () => {
      // arrange
      const { getByTestId } = render(<DepartmentMarkets />, { initialState });
      await waitFor(() => expect(getByTestId('table-capacity-1-cap-1')).toBeInTheDocument());
      const table1 = getByTestId('table-capacity-1-cap-1');
      const table1row1cells = table1.querySelectorAll('tbody[data-testid="department-market-list"] > tr:nth-child(1) > td');
      const table1row2cells = table1.querySelectorAll('tbody[data-testid="department-market-list"] > tr:nth-child(2) > td');
      const table2 = getByTestId('table-capacity-2-cap-2');
      const table2row1cells = table2.querySelectorAll('tbody[data-testid="department-market-list"] > tr:nth-child(1) > td');
      const table2row2cells = table2.querySelectorAll('tbody[data-testid="department-market-list"] > tr:nth-child(2) > td');

      // assert
      expect(within(table1row1cells[0]).getByText('market10')).toBeInTheDocument();
      expect(within(table1row2cells[0]).getByText('market20')).toBeInTheDocument();
      expect(within(table2row1cells[0]).getByText('market30')).toBeInTheDocument();
      expect(within(table2row2cells[0]).getByText('market40')).toBeInTheDocument();
    });

    it('renders the market statuses for BROKERS', async () => {
      // arrange
      const { getByTestId } = render(<DepartmentMarkets />, { initialState });
      await waitFor(() => expect(getByTestId('table-capacity-1-cap-1')).toBeInTheDocument());
      const table1 = getByTestId('table-capacity-1-cap-1');
      const table1row1cells = table1.querySelectorAll('tbody[data-testid="department-market-list"] > tr:nth-child(1) > td');
      const table1row2cells = table1.querySelectorAll('tbody[data-testid="department-market-list"] > tr:nth-child(2) > td');
      const table2 = getByTestId('table-capacity-2-cap-2');
      const table2row1cells = table2.querySelectorAll('tbody[data-testid="department-market-list"] > tr:nth-child(1) > td');
      const table2row2cells = table2.querySelectorAll('tbody[data-testid="department-market-list"] > tr:nth-child(2) > td');

      // assert
      expect(table1row1cells[0].querySelector('span[title="statusMarket.live"]')).toBeInTheDocument();
      expect(table1row2cells[0].querySelector('span[title="statusMarket.provisional"]')).toBeInTheDocument();
      expect(table2row1cells[0].querySelector('span[title="statusMarket.closed"]')).toBeInTheDocument();
      expect(table2row2cells[0].querySelector('span[title="statusMarket.live"]')).not.toBeInTheDocument();
    });

    it('renders the underwriter details', async () => {
      // arrange
      const { getByTestId } = render(<DepartmentMarkets />, { initialState });
      await waitFor(() => expect(getByTestId('table-capacity-2-cap-2')).toBeInTheDocument());
      const table = getByTestId('table-capacity-2-cap-2').querySelector(
        'tbody[data-testid="department-market-list"] > tr:nth-child(2) > td:nth-child(2) > table'
      );
      const rows = table.querySelectorAll('tr');

      // assert
      expect(within(rows[0]).getByText('John Johnson')).toBeInTheDocument();
      expect(within(rows[0]).getByText('jj@abc.com')).toBeInTheDocument();
      expect(within(rows[1]).getByText('Steve Stevenson')).toBeInTheDocument();
      expect(within(rows[1]).getByText('ss@abc.com')).toBeInTheDocument();
      expect(within(rows[2]).getByText('Mark')).toBeInTheDocument();
      expect(within(rows[2]).getByText('m@abc.com')).toBeInTheDocument();
      expect(within(rows[3]).getByText('Frank Frankenson')).toBeInTheDocument();
      expect(within(rows[3]).getByText('ff@abc.com')).toBeInTheDocument();
    });

    it('renders the action menu', async () => {
      // arrange
      const { getByTestId } = render(<DepartmentMarkets />, { initialState });
      await waitFor(() => expect(getByTestId('table-capacity-1-cap-1')).toBeInTheDocument());

      const table1 = getByTestId('table-capacity-1-cap-1');
      const table1rows = table1.querySelectorAll('tbody[data-testid="department-market-list"] > tr');
      const table2 = getByTestId('table-capacity-2-cap-2');
      const table2rows = table2.querySelectorAll('tbody[data-testid="department-market-list"] > tr');

      // assert
      expect(within(table1rows[0]).getByTestId('department-market-popover-ellipsis')).toBeInTheDocument();
      expect(within(table1rows[1]).getByTestId('department-market-popover-ellipsis')).toBeInTheDocument();
      expect(within(table2rows[0]).getByTestId('department-market-popover-ellipsis')).toBeInTheDocument();
      expect(within(table2rows[1]).getByTestId('department-market-popover-ellipsis')).toBeInTheDocument();
    });
  });
});
