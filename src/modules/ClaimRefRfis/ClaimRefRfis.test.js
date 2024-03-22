import React from 'react';
import { render, screen, waitFor, within } from 'tests';
import ClaimRefRfis from './ClaimRefRfis';
import fetchMock from 'fetch-mock';

const claim = { claimID: '1004', processID: 123456789 };

const responseDataRfis = [
  {
    queryId: '1',
    queryCodeDescription: 'Loss Details Enclosures',
    queryCode: 'QC100',
    queryCreatedOn: '2021-01-01T01:00:00',
    status: 'Completed',
    description: 'TEST TEST',
  },
  {
    queryId: '2',
    queryCodeDescription: 'Loss Details Enclosures',
    queryCode: 'QC100',
    queryCreatedOn: '2021-01-01T01:00:00',
    status: 'Completed',
    description: 'TEST TEST',
  },
  {
    queryId: '3',
    queryCodeDescription: 'Loss Details Enclosures',
    queryCode: 'QC100',
    queryCreatedOn: '2021-01-01T01:00:00',
    status: 'Completed',
    description: 'TEST TEST',
  },
];

const responseDataFilters = {
  queryCode: [
    {
      id: 16245,
      name: 'Loss Details Enclosures',
      value: 'QC100',
    },
  ],
  status: [
    {
      id: 16246,
      name: 'Completed',
      value: 'Completed',
    },
  ],
};

const prioritiesList = [
  {
    id: '1',
    name: null,
    description: 'High',
  },
  {
    id: '2',
    name: null,
    description: 'Medium',
  },
  {
    id: '3',
    name: null,
    description: 'Low',
  },
];

describe('MODULES › ClaimRefNotes', () => {
  describe('@render', () => {
    beforeEach(() => {
      fetchMock.post(`glob:*/bpmservice/rfi/${claim.claimID}/search*`, {
        body: { status: 'OK', data: { searchValue: responseDataRfis, filterValue: responseDataFilters } },
      });
      fetchMock.get(`glob:*/claims-service/api/data/gui/claims/priorities*`, {
        body: { status: 'OK', data: prioritiesList },
      });
    });

    afterEach(() => {
      jest.clearAllMocks();
      fetchMock.restore();
    });

    it('renders table columns', () => {
      // arrange
      render(<ClaimRefRfis claim={claim} />);
      const tableHead = screen.getByTestId('claim-rfis-table').querySelector('thead');

      // assert
      expect(within(tableHead).getByText('claims.rfis.columns.queryID')).toBeInTheDocument();
      expect(within(tableHead).getByText('claims.rfis.columns.to')).toBeInTheDocument();
      expect(within(tableHead).getByText('claims.rfis.columns.queryCode')).toBeInTheDocument();
      expect(within(tableHead).getByText('claims.rfis.columns.dateOfQuery')).toBeInTheDocument();
      expect(within(tableHead).getByText('claims.rfis.columns.status')).toBeInTheDocument();
    });

    it('renders table pagination', () => {
      // arrange
      render(<ClaimRefRfis claim={claim} />);

      // assert
      expect(screen.getByTestId('pagination-claim-rfis')).toBeInTheDocument();
    });

    it('renders table search field', () => {
      // arrange
      render(<ClaimRefRfis claim={claim} />);

      // assert
      expect(screen.getByTestId('form-search')).toBeInTheDocument();
      expect(screen.getByTestId('search-button-go')).toBeInTheDocument();
    });

    it('renders table row data', async () => {
      // arrange
      render(<ClaimRefRfis claim={claim} />);

      await waitFor(() => screen.getByTestId('claim-rfis-table-row-1'));

      const row1 = screen.getByTestId('claim-rfis-table-row-1');
      const row2 = screen.getByTestId('claim-rfis-table-row-2');
      const row3 = screen.getByTestId('claim-rfis-table-row-3');

      // assert
      expect(within(row1).getByText('1')).toBeInTheDocument();
      expect(within(row1).getByText('Loss Details Enclosures')).toBeInTheDocument();
      expect(within(row1).getByText('format.date(2021-01-01T01:00:00)')).toBeInTheDocument();
      expect(within(row1).getByText('TEST TEST')).toBeInTheDocument();

      expect(within(row2).getByText('2')).toBeInTheDocument();
      expect(within(row2).getByText('Loss Details Enclosures')).toBeInTheDocument();
      expect(within(row2).getByText('format.date(2021-01-01T01:00:00)')).toBeInTheDocument();
      expect(within(row2).getByText('TEST TEST')).toBeInTheDocument();

      expect(within(row3).getByText('3')).toBeInTheDocument();
      expect(within(row3).getByText('Loss Details Enclosures')).toBeInTheDocument();
      expect(within(row3).getByText('format.date(2021-01-01T01:00:00)')).toBeInTheDocument();
      expect(within(row3).getByText('TEST TEST')).toBeInTheDocument();

      // arrange
      jest.clearAllMocks();
      fetchMock.restore();
    });
  });
});
