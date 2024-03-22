import React from 'react';
import { render, screen, waitFor, within } from 'tests';
import ClaimRefAuditTrail from './ClaimRefAuditTrail';
import fetchMock from 'fetch-mock';

const claim = { claimId: '1004', caseIncidentID: 123456789, processID: 1234 };

const responseData = [
  {
    id: 1,
    createdDate: '2001',
    createdBy: 'Alex',
    eventName: 'event 1',
    oldValue: 1,
    newValue: 11,
  },
  {
    id: 2,
    createdDate: '2002',
    createdBy: 'Bob',
    eventName: 'event 2',
    oldValue: 2,
    newValue: 22,
  },
  {
    id: 3,
    createdDate: '2003',
    createdBy: 'Charlie',
    eventName: 'event 3',
    oldValue: 3,
    newValue: 33,
  },
];

describe('MODULES › ClaimRefAuditTrail', () => {
  describe('@render', () => {
    beforeEach(() => {
      fetchMock.post('glob:*/api/data/claims/audit/*', { body: { status: 'OK', data: { searchValue: responseData } } });
    });

    afterEach(() => {
      jest.clearAllMocks();
      fetchMock.restore();
    });

    it('renders filters toggle button', () => {
      // arrange
      render(<ClaimRefAuditTrail claim={claim} />);

      // assert
      expect(screen.queryByTestId('filters-button-toggle')).toBeInTheDocument();
    });

    it('renders table columns', () => {
      // arrange
      render(<ClaimRefAuditTrail claim={claim} />);
      const tableHead = screen.getByTestId('claim-audits-table').querySelector('thead');

      // assert
      expect(within(tableHead).getByText('claims.audits.columns.changedDateTime')).toBeInTheDocument();
      expect(within(tableHead).getByText('claims.audits.columns.event')).toBeInTheDocument();
      expect(within(tableHead).getByText('claims.audits.columns.changedBy')).toBeInTheDocument();
      expect(within(tableHead).getByText('claims.audits.columns.oldValue')).toBeInTheDocument();
      expect(within(tableHead).getByText('claims.audits.columns.newValue')).toBeInTheDocument();
    });

    it('renders table pagination', () => {
      // arrange
      render(<ClaimRefAuditTrail claim={claim} />);

      // assert
      expect(screen.getByTestId('pagination-claim-audits')).toBeInTheDocument();
    });

    it('renders table search field', () => {
      // arrange
      render(<ClaimRefAuditTrail claim={claim} />);

      // assert
      expect(screen.getByTestId('form-search')).toBeInTheDocument();
      expect(screen.getByTestId('search-button-go')).toBeInTheDocument();
    });

    it('renders table row data', async () => {
      // arrange
      render(<ClaimRefAuditTrail claim={claim} />);

      await waitFor(() => screen.getByTestId('claim-audits-table-row-1'));

      const row1 = screen.getByTestId('claim-audits-table-row-1');
      const row2 = screen.getByTestId('claim-audits-table-row-2');
      const row3 = screen.getByTestId('claim-audits-table-row-3');

      // assert
      expect(within(row1).getByText('format.date(2001)')).toBeInTheDocument();
      expect(within(row1).getByText('event 1')).toBeInTheDocument();
      expect(within(row1).getByText('Alex')).toBeInTheDocument();
      expect(within(row1).getByText('1')).toBeInTheDocument();
      expect(within(row1).getByText('11')).toBeInTheDocument();

      expect(within(row2).getByText('format.date(2002)')).toBeInTheDocument();
      expect(within(row2).getByText('event 2')).toBeInTheDocument();
      expect(within(row2).getByText('Bob')).toBeInTheDocument();
      expect(within(row2).getByText('2')).toBeInTheDocument();
      expect(within(row2).getByText('22')).toBeInTheDocument();

      expect(within(row3).getByText('format.date(2003)')).toBeInTheDocument();
      expect(within(row3).getByText('event 3')).toBeInTheDocument();
      expect(within(row3).getByText('Charlie')).toBeInTheDocument();
      expect(within(row3).getByText('3')).toBeInTheDocument();
      expect(within(row3).getByText('33')).toBeInTheDocument();
    });
  });
});
