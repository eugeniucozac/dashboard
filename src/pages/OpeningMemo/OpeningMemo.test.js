import React from 'react';
import { render, mockIntersectionObserver, waitFor } from 'tests';

// app
import OpeningMemo from './OpeningMemo';

describe('PAGES › OpeningMemo', () => {
  const initialState = {
    openingMemo: { list: [], selected: { id: 111, uniqueMarketReference: 112, status: 'AWAITING APPROVAL' } },
    user: { role: 'BROKER', departmentSelected: 333 },
    placement: { selected: { id: 444 } },
    referenceData: { departments: [{ id: 333, name: 'bar' }], newRenewalBusinesses: [{ id: 1, description: 'one' }] },
  };

  beforeEach(() => {
    mockIntersectionObserver();
  });

  describe('@render', () => {
    it('renders the page title', async () => {
      // arrange
      render(<OpeningMemo />);

      // assert
      await waitFor(() => expect(document.title).toContain('openingMemo.title'));
    });

    it('renders correct icon and title', () => {
      // arrange
      const { getByText, getByTestId } = render(<OpeningMemo />, { initialState });

      // assert
      expect(getByText('openingMemo.title')).toBeInTheDocument();
      expect(getByTestId('page-header-opening-memo-title')).toBeInTheDocument();
    });

    it('hides search component for a non broker', () => {
      // arrange
      const state = { ...initialState, user: { role: 'NON_BROKER' } };
      const { queryByText } = render(<OpeningMemo />, { initialState: state, route: ['/checklist'] });

      // assert
      expect(queryByText('placement.openingMemo.search')).not.toBeInTheDocument();
    });

    it('shows search component for broker', () => {
      // arrange
      const { getByText, queryByText } = render(<OpeningMemo />, { initialState, route: ['/checklist'] });

      // assert
      expect(getByText('placement.openingMemo.search')).toBeInTheDocument();
      expect(queryByText('status.awaitingapproval')).not.toBeInTheDocument();
    });

    it('shows opening memo component for broker, in main and side panel', () => {
      // arrange
      const { getByText, queryByText } = render(<OpeningMemo />, { initialState, route: ['/checklist/1'] });

      // assert
      expect(queryByText('placement.openingMemo.search')).not.toBeInTheDocument();
      expect(getByText('status.awaitingapproval')).toBeInTheDocument();
    });
  });
});
