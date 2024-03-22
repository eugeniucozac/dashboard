import React from 'react';
import { render, waitFor, within } from 'tests';
import Department from './Department';

describe('PAGES › Department', () => {
  describe('@render', () => {
    const initialState = {
      placement: {
        list: {
          items: [{ id: 1 }, { id: 2 }],
        },
        sort: {},
      },
      referenceData: {
        departments: [
          { id: 1, name: 'Dept 1' },
          { id: 2, name: 'Dept 2' },
          { id: 3, name: 'Dept 3' },
        ],
        statuses: {},
      },
      user: {
        role: 'BROKER',
      },
    };

    const props = {
      match: {
        params: {
          id: '2',
          slug: 'two',
        },
      },
    };

    it('renders the page title and the correct department name', async () => {
      // arrange
      const { getByText, queryByText } = render(<Department match={{ params: { id: 2, slug: 'two' } }} />, { initialState });

      // assert
      await waitFor(() => expect(document.title).toContain('department.titlePlacements'));
      expect(queryByText('Dept 1')).not.toBeInTheDocument();
      expect(queryByText('Dept 3')).not.toBeInTheDocument();
    });

    it('renders the tabs', async () => {
      // arrange
      const { getByTestId } = render(<Department match={{ params: { id: 2, slug: 'two' } }} />, { initialState });

      // assert
      await waitFor(() => expect(document.title).toContain('department.title'));
      expect(within(getByTestId('tabs')).getByText('department.titlePlacements')).toBeInTheDocument();
      expect(within(getByTestId('tabs')).getByText('app.market_plural')).toBeInTheDocument();
    });

    it('hides the Markets tab for COBROKERS', async () => {
      // arrange
      const { getByTestId } = render(<Department match={{ params: { id: 2, slug: 'two' } }} />, {
        initialState: {
          ...initialState,
          user: {
            role: 'COBROKER',
          },
        },
      });

      // assert
      await waitFor(() => expect(document.title).toContain('department.title'));
      expect(within(getByTestId('tabs')).getByText('department.titleAccounts')).toBeInTheDocument();
      expect(within(getByTestId('tabs')).queryByText('app.market_plural')).not.toBeInTheDocument();
    });

    it('hides the Markets tab for UNDERWRITER', async () => {
      // arrange
      const { getByTestId } = render(<Department match={{ params: { id: 2, slug: 'two' } }} />, {
        initialState: {
          ...initialState,
          user: {
            role: 'UNDERWRITER',
          },
        },
      });

      // assert
      await waitFor(() => expect(document.title).toContain('department.title'));
      expect(within(getByTestId('tabs')).queryByText('app.market_plural')).not.toBeInTheDocument();
    });

    it('renders nothing without a department ID in the URL', () => {
      // arrange
      const { queryByTestId } = render(<Department match={{ params: { id: null, slug: 'two' } }} />, { initialState });

      // assert
      expect(queryByTestId('department-accounts-mobile-calendar')).not.toBeInTheDocument();
      expect(queryByTestId('department-accounts-calendar')).not.toBeInTheDocument();
    });

    it('renders conditional components for mobile and desktop', async () => {
      // arrange
      const { getByTestId, queryByTestId } = render(<Department {...props} />, { initialState });

      // assert
      expect(queryByTestId('department-accounts-mobile-calendar')).not.toBeInTheDocument();
      expect(getByTestId('department-accounts-calendar')).toBeInTheDocument();
    });

    it('renders Layout component for mobile', () => {
      // arrange
      window.resizeTo(320);
      const { getByTestId, queryByTestId } = render(<Department {...props} />, { initialState });

      // assert
      expect(getByTestId('department-accounts-mobile-calendar')).toBeInTheDocument();
      expect(queryByTestId('department-accounts-calendar')).not.toBeInTheDocument();
    });

    it('renders Layout component for tablet/desktop', () => {
      // arrange
      window.resizeTo(640);
      const { getByTestId, queryByTestId } = render(<Department {...props} />, { initialState });

      // assert
      expect(queryByTestId('department-accounts-mobile-calendar')).not.toBeInTheDocument();
      expect(getByTestId('department-accounts-calendar')).toBeInTheDocument();
    });

    it('renders Layout sidebar component for tablet/desktop', () => {
      // arrange
      window.resizeTo(640);
      const { getByTestId } = render(<Department {...props} />, { initialState });

      // assert
      expect(getByTestId('layout-sidebar')).toBeInTheDocument();
    });
  });
});
