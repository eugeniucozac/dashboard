import React from 'react';
import { render, renderWithAuth, waitFor, screen } from 'tests';
import Policy from './Policy';
import fetchMock from 'fetch-mock';
import { useParams } from 'react-router';

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useParams: jest.fn(),
}));

describe('PAGES › Policy', () => {
  describe('@render', () => {
    const initialState = {
      referenceData: {
        departments: [
          {
            id: 1,
            name: 'dept 1',
            businessTypes: [
              { id: 10, description: 'biz type 10' },
              { id: 11, description: 'biz type 11' },
            ],
          },
          {
            id: 2,
            name: 'dept 2',
            businessTypes: [
              { id: 20, description: 'biz type 20' },
              { id: 21, description: 'biz type 21' },
            ],
          },
          {
            id: 3,
            name: 'dept 3',
            businessTypes: [
              { id: 30, description: 'biz type 30' },
              { id: 31, description: 'biz type 31' },
            ],
          },
        ],
        statuses: {
          account: [],
          placement: [],
          policy: [],
          policyMarketQuote: [],
        },
      },
    };

    beforeEach(() => {
      jest.clearAllMocks();
      useParams.mockReturnValue({ id: 123 });
    });

    afterEach(() => {
      fetchMock.restore();
    });

    it('renders the page title', async () => {
      // arrange
      render(<Policy />);

      // assert
      await waitFor(() => expect(document.title).toContain('policy.title'));
      expect(screen.getByText('policy.title')).toBeInTheDocument();
      expect(screen.getByTestId('page-header-policy-icon')).toBeInTheDocument();
    });

    it('renders the content', async () => {
      // arrange
      const jan_1_2010 = new Date('2010-01-01').getTime(); // 1262304000000
      const jan_10_2010 = new Date('2010-01-10').getTime(); // 1263081600000
      const policy = {
        id: 123,
        parentPlacementId: 456,
        departmentId: 1,
        businessTypeId: 11,
        inceptionDate: jan_1_2010,
        expiryDate: jan_10_2010,
        notes: 'foo bar',
        umrId: 'umr123456789',
      };
      fetchMock.get('glob:*/api/policy/xb/*', { body: { status: 'success', data: [policy] } });
      fetchMock.get('glob:*/api/placement/*', { body: { status: 'success', data: { id: 456 } } });
      render(<Policy />, { initialState });

      // assert
      await waitFor(() => screen.getByTestId('policy-content'));

      expect(screen.getByText('policy.umr')).toBeInTheDocument();
      expect(screen.getByText('umr123456789')).toBeInTheDocument();

      expect(screen.getByText('app.inceptionDate')).toBeInTheDocument();
      expect(screen.getByText('format.date(1262304000000)')).toBeInTheDocument();

      expect(screen.getByText('app.expiryDate')).toBeInTheDocument();
      expect(screen.getByText('format.date(1263081600000)')).toBeInTheDocument();

      expect(screen.getByText('app.department')).toBeInTheDocument();
      expect(screen.getByText('dept 1')).toBeInTheDocument();

      expect(screen.getByText('app.businessType')).toBeInTheDocument();
      expect(screen.getByText('biz type 11')).toBeInTheDocument();

      expect(screen.getByText('policy.notes')).toBeInTheDocument();
      expect(screen.getByText('foo bar')).toBeInTheDocument();

      await waitFor(() => expect(screen.getByTestId('summary')).toBeInTheDocument());
    });

    it('renders the placement summary', async () => {
      // arrange
      fetchMock.get('glob:*/api/policy/xb/*', { body: { status: 'success', data: [{ id: 123, parentPlacementId: 456 }] } });
      fetchMock.get('glob:*/api/placement/*', { body: { status: 'success', data: { id: 456 } } });
      renderWithAuth(<Policy />);

      // assert
      await waitFor(() => expect(screen.getByTestId('summary')).toBeInTheDocument());
      expect(screen.getByTestId('summary')).toBeInTheDocument();
    });
  });
});
