import React from 'react';
import { useParams } from 'react-router';
import { render, waitFor, within } from 'tests';
import fetchMock from 'fetch-mock';
import MarketingMarkets from './MarketingMarkets';

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useParams: jest.fn(),
}));

describe('MODULES › MarketingMarkets', () => {
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
        policyMarketQuote: [
          { id: 1, code: 'Pending' },
          { id: 2, code: 'Quoted' },
          { id: 3, code: 'Declined' },
        ],
      },
    },
    department: {
      markets: {
        items: [],
      },
    },
    placement: {
      selected: {
        id: 123,
      },
      selectedMarkets: [],
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
    { id: 1, statusId: 1, market: { id: 10, edgeName: 'market10', statusId: 1, capacityTypeId: 1 }, underwriter: null },
    { id: 2, statusId: 2, market: { id: 20, edgeName: 'market20', statusId: 2, capacityTypeId: 1 }, underwriter: underwriters[1] },
    { id: 3, statusId: 3, market: { id: 30, edgeName: 'market30', statusId: 3, capacityTypeId: 2 }, underwriter: underwriters[2] },
    { id: 4, statusId: null, market: { id: 40, edgeName: 'market40', statusId: null, capacityTypeId: 2 }, underwriter: underwriters[3] },
    { id: 5, statusId: null, market: { id: 50, edgeName: 'market50', capacityTypeId: null }, underwriters: null },
  ];

  beforeEach(() => {
    useParams.mockReturnValue({ id: 1, slug: 'one' });
    fetchMock.get('glob:*/api/departmentMarket/department/*', { body: { status: 'success', data: [] } });
    fetchMock.get('glob:*/api/placementMarket/placement/*', { body: { status: 'success', data: marketsData } });
  });

  afterEach(() => {
    fetchMock.restore();
  });

  describe('@render', () => {
    it('renders nothing if not passed a placementId', () => {
      // arrange
      const { container } = render(<MarketingMarkets />, { initialState });

      // assert
      expect(container).toBeEmptyDOMElement();
    });

    it('renders the markets group by capacity types', async () => {
      // arrange
      const { getByTestId, queryByTestId } = render(<MarketingMarkets placementId={123} />, { initialState });
      await waitFor(() => expect(getByTestId('table-capacity-1-cap-1')).toBeInTheDocument());

      // assert
      expect(getByTestId('table-capacity-1-cap-1')).toBeInTheDocument();
      expect(getByTestId('table-capacity-2-cap-2')).toBeInTheDocument();
      expect(queryByTestId('table-capacity-3-cap-3')).not.toBeInTheDocument();
    });

    it('renders the table column headers', async () => {
      // arrange
      const { getByTestId } = render(<MarketingMarkets placementId={123} />, { initialState });
      await waitFor(() => expect(getByTestId('table-capacity-1-cap-1')).toBeInTheDocument());

      // assert
      expect(within(getByTestId('table-capacity-1-cap-1').querySelector('th:nth-child(1)')).getByText('cap1')).toBeInTheDocument();
      expect(
        within(getByTestId('table-capacity-1-cap-1').querySelector('th:nth-child(2)')).getByText('market.cols.status')
      ).toBeInTheDocument();
      expect(
        within(getByTestId('table-capacity-1-cap-1').querySelector('th:nth-child(3)')).getByText('market.cols.underwriterName')
      ).toBeInTheDocument();
      expect(within(getByTestId('table-capacity-2-cap-2').querySelector('th:nth-child(1)')).getByText('cap2')).toBeInTheDocument();
      expect(
        within(getByTestId('table-capacity-2-cap-2').querySelector('th:nth-child(2)')).getByText('market.cols.status')
      ).toBeInTheDocument();
      expect(
        within(getByTestId('table-capacity-2-cap-2').querySelector('th:nth-child(3)')).getByText('market.cols.underwriterName')
      ).toBeInTheDocument();
    });

    it('renders the capacity type color next to the group name', async () => {
      // arrange
      const { getByTestId } = render(<MarketingMarkets placementId={123} />, { initialState });
      await waitFor(() => expect(getByTestId('table-capacity-1-cap-1')).toBeInTheDocument());

      // assert
      expect(getByTestId('table-capacity-1-cap-1').querySelector('[data-testid="avatar"][title="cap1"]')).toBeInTheDocument();
      expect(getByTestId('table-capacity-2-cap-2').querySelector('[data-testid="avatar"][title="cap2"]')).toBeInTheDocument();
    });

    it('renders the market names', async () => {
      // arrange
      const { getByTestId } = render(<MarketingMarkets placementId={123} />, { initialState });
      await waitFor(() => expect(getByTestId('table-capacity-1-cap-1')).toBeInTheDocument());
      const table1 = getByTestId('table-capacity-1-cap-1');
      const table1row1cells = table1.querySelectorAll('tbody[data-testid="list"] > tr:nth-child(1) > td');
      const table1row2cells = table1.querySelectorAll('tbody[data-testid="list"] > tr:nth-child(2) > td');
      const table2 = getByTestId('table-capacity-2-cap-2');
      const table2row1cells = table2.querySelectorAll('tbody[data-testid="list"] > tr:nth-child(1) > td');
      const table2row2cells = table2.querySelectorAll('tbody[data-testid="list"] > tr:nth-child(2) > td');

      // assert
      expect(within(table1row1cells[0]).getByText('market10')).toBeInTheDocument();
      expect(within(table1row2cells[0]).getByText('market20')).toBeInTheDocument();
      expect(within(table2row1cells[0]).getByText('market30')).toBeInTheDocument();
      expect(within(table2row2cells[0]).getByText('market40')).toBeInTheDocument();
    });

    it('renders the market statuses for BROKERS', async () => {
      // arrange
      const { getByTestId } = render(<MarketingMarkets placementId={123} />, { initialState });
      await waitFor(() => expect(getByTestId('table-capacity-1-cap-1')).toBeInTheDocument());
      const table1 = getByTestId('table-capacity-1-cap-1');
      const table1row1cells = table1.querySelectorAll('tbody[data-testid="list"] > tr:nth-child(1) > td');
      const table1row2cells = table1.querySelectorAll('tbody[data-testid="list"] > tr:nth-child(2) > td');
      const table2 = getByTestId('table-capacity-2-cap-2');
      const table2row1cells = table2.querySelectorAll('tbody[data-testid="list"] > tr:nth-child(1) > td');
      const table2row2cells = table2.querySelectorAll('tbody[data-testid="list"] > tr:nth-child(2) > td');

      // assert
      expect(table1row1cells[0].querySelector('span[title="statusMarket.live"]')).toBeInTheDocument();
      expect(table1row2cells[0].querySelector('span[title="statusMarket.provisional"]')).toBeInTheDocument();
      expect(table2row1cells[0].querySelector('span[title="statusMarket.closed"]')).toBeInTheDocument();
      expect(table2row2cells[0].querySelector('span[title="statusMarket.live"]')).not.toBeInTheDocument();
    });

    it('renders the underwriter name', async () => {
      // arrange
      const { getByTestId } = render(<MarketingMarkets placementId={123} />, { initialState });
      await waitFor(() => expect(getByTestId('table-capacity-2-cap-2')).toBeInTheDocument());
      const table1 = getByTestId('table-capacity-1-cap-1');
      const table1row1cells = table1.querySelectorAll('tbody[data-testid="list"] > tr:nth-child(1) > td');
      const table1row2cells = table1.querySelectorAll('tbody[data-testid="list"] > tr:nth-child(2) > td');
      const table2 = getByTestId('table-capacity-2-cap-2');
      const table2row1cells = table2.querySelectorAll('tbody[data-testid="list"] > tr:nth-child(1) > td');
      const table2row2cells = table2.querySelectorAll('tbody[data-testid="list"] > tr:nth-child(2) > td');

      // assert
      expect(within(table1row1cells[2]).queryByText('John Johnson')).not.toBeInTheDocument();
      expect(within(table1row2cells[2]).getByText('Steve Stevenson')).toBeInTheDocument();
      expect(within(table2row1cells[2]).getByText('Mark')).toBeInTheDocument();
      expect(within(table2row2cells[2]).getByText('Frank Frankenson')).toBeInTheDocument();
    });

    it('renders the action menu', async () => {
      // arrange
      const { getByTestId } = render(<MarketingMarkets placementId={123} />, { initialState });
      await waitFor(() => expect(getByTestId('table-capacity-1-cap-1')).toBeInTheDocument());

      const table1 = getByTestId('table-capacity-1-cap-1');
      const table1rows = table1.querySelectorAll('tbody[data-testid="list"] > tr');
      const table2 = getByTestId('table-capacity-2-cap-2');
      const table2rows = table2.querySelectorAll('tbody[data-testid="list"] > tr');

      // assert
      expect(within(table1rows[0]).getByTestId('placement-marketing-market-popover-ellipsis')).toBeInTheDocument();
      expect(within(table1rows[1]).getByTestId('placement-marketing-market-popover-ellipsis')).toBeInTheDocument();
      expect(within(table2rows[0]).getByTestId('placement-marketing-market-popover-ellipsis')).toBeInTheDocument();
      expect(within(table2rows[1]).getByTestId('placement-marketing-market-popover-ellipsis')).toBeInTheDocument();
    });
    it('renders the marketing markets bulk view', async () => {
      // arrange
      const { getByTestId } = render(<MarketingMarkets placementId={123} />, { initialState });
      await waitFor(() => expect(getByTestId('table-capacity-1-cap-1')).toBeInTheDocument());

      // assert
      if (marketsData.length > 0) {
        expect(getByTestId('placement-marketing')).toBeInTheDocument();
      } else {
        expect(getByTestId('placement-marketing')).not.toBeInTheDocument();
      }
    });
  });
});
