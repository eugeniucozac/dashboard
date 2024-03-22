import React from 'react';
import { render, fireEvent, within, screen, waitFor, waitForElementToBeRemoved } from 'tests';
import userEvent from '@testing-library/user-event';
import HeaderNav from './HeaderNav';
import fetchMock from 'fetch-mock';
import * as uiActions from 'stores/ui/ui.actions';

jest.mock('stores/ui/ui.actions', () => {
  return {
    __esModule: true,
    ...jest.requireActual('stores/ui/ui.actions'),
    collapseSidebar: jest.fn(),
    expandSidebar: jest.fn(),
    showModal: jest.fn(),
  };
});

describe('COMPONENTS › HeaderNav', () => {
  const initialState = {
    ui: {
      brand: 'priceforbes',
      loader: {
        queue: [],
      },
    },
    user: {
      role: 'BROKER',
    },
  };

  const initialStateCobroker = {
    ui: {
      brand: 'priceforbes',
      loader: {
        queue: [],
      },
    },
    user: {
      role: 'COBROKER',
    },
  };

  beforeEach(() => {
    fetchMock.get('glob:*/api/client/parent*', { body: { status: 'success', data: {} } });
    fetchMock.get('glob:*/api/search*', { body: { status: 'success', data: {} } });
    fetchMock.get('glob:*user?userId*', { body: { status: 'success', data: [] } });
  });

  afterEach(() => {
    fetchMock.restore();
  });

  describe('@render', () => {
    it('renders the nav toggle button (hamburger)', () => {
      // arrange
      const { getByTestId } = render(<HeaderNav />);

      // assert
      expect(getByTestId('hamburger-menu')).toBeInTheDocument();
    });

    it('renders the app logo', () => {
      // arrange
      const { getByTestId } = render(<HeaderNav />, { initialState });

      // assert
      expect(getByTestId('edge-logo')).toBeInTheDocument();
    });

    it('renders the user clickable menu', () => {
      // arrange
      const { getByTestId } = render(<HeaderNav />);

      // assert
      expect(getByTestId('menu-user')).toBeInTheDocument();
    });

    it('renders the user-menu when user click on it', async () => {
      // arrange
      const { getByTestId } = render(<HeaderNav />);
      // assert
      expect(getByTestId('menu-user')).toBeInTheDocument();

      // assert
      fireEvent.click(getByTestId('menu-user'));
      expect(getByTestId('menu-item-name')).toBeInTheDocument();
      expect(getByTestId('menu-item-logout')).toBeInTheDocument();
    });

    it('renders the advanced search if the query is more then 2 characters', async () => {
      // arrange
      render(<HeaderNav />, { initialState });

      const view = screen.getByTestId('search-field');
      const input = within(view).getByRole('textbox');

      // assert
      expect(screen.getByTestId('form-search')).toBeInTheDocument();
      expect(input).toBeInTheDocument();
      expect(screen.queryByTestId('advanced-search')).not.toBeInTheDocument();

      userEvent.type(input, 'qu');
      expect(input).toHaveValue('qu');
      await waitFor(() => expect(screen.getByTestId('advanced-search')).toBeInTheDocument());

      userEvent.type(input, '{backspace}{backspace}');
      expect(input).toHaveValue('');
      await waitForElementToBeRemoved(() => screen.getByTestId('advanced-search'));
      expect(screen.queryByTestId('advanced-search')).not.toBeInTheDocument();
    });

    it("doesn't render the advanced search form for COBROKERS", () => {
      // arrange
      const { queryByTestId } = render(<HeaderNav />, { initialState: initialStateCobroker });

      // assert
      expect(queryByTestId('form-search')).not.toBeInTheDocument();
    });

    it('hides advanced search if user clicks away', async () => {
      // arrange
      render(<HeaderNav />, { initialState });

      const view = screen.getByTestId('search-field');
      const input = within(view).getByRole('textbox');
      userEvent.type(input, 'query');

      await waitFor(() => expect(screen.getByTestId('advanced-search')).toBeInTheDocument());
      expect(screen.getByTestId('advanced-search')).toBeInTheDocument();
      fireEvent.click(document);
      expect(screen.queryByTestId('advanced-search')).not.toBeInTheDocument();
    });

    describe('tablet', () => {
      beforeEach(() => {
        window.resizeTo(640);
      });

      it('renders the advanced search form', () => {
        // arrange
        const { getByTestId } = render(<HeaderNav />, { initialState });

        // assert
        expect(getByTestId('form-search')).toBeInTheDocument();
      });

      it("doesn't render the advanced search form for COBROKERS", () => {
        // arrange
        const { queryByTestId } = render(<HeaderNav />, { initialState: initialStateCobroker });

        // assert
        expect(queryByTestId('form-search')).not.toBeInTheDocument();
      });

      it('renders the notifications icon on /premium-processing page', () => {
        // arrange
        const { getByTestId, queryByTestId } = render(<HeaderNav />, {
          initialState: { ...initialState, user: { userDetails: { id: 1 }, privilege: {}, routes: [] } },
          route: ['/premium-processing'],
        });

        // assert
        expect(getByTestId('desktop-notifications-btn')).toBeInTheDocument();
        expect(queryByTestId('mobile-notifications-btn')).not.toBeInTheDocument();
      });

      it("doesn't render the notifications icon on other pages", () => {
        // arrange
        const { queryByTestId } = render(<HeaderNav />, { initialState });

        // assert
        expect(queryByTestId('desktop-notifications-btn')).not.toBeInTheDocument();
        expect(queryByTestId('mobile-notifications-btn')).not.toBeInTheDocument();
      });
    });

    describe('mobile', () => {
      beforeEach(() => {
        window.resizeTo(320);
      });

      it('renders the advanced search magnifier button,on click form search is visible', async () => {
        // arrange
        render(<HeaderNav />, { initialState });
        // assert
        expect(screen.getByTestId('mobile-search-btn')).toBeInTheDocument();

        // assert
        expect(screen.getByTestId('form-search')).not.toBeVisible();
        fireEvent.click(screen.getByTestId('mobile-search-btn'));
        expect(screen.getByTestId('form-search')).toBeVisible();
      });

      it('renders the advanced search form', () => {
        // arrange
        const { getByTestId } = render(<HeaderNav />, { initialState });

        // assert
        expect(getByTestId('form-search')).toBeInTheDocument();
      });

      it("doesn't render the advanced search form for COBROKERS", () => {
        // arrange
        const { queryByTestId } = render(<HeaderNav />, { initialState: initialStateCobroker });

        // assert
        expect(queryByTestId('form-search')).not.toBeInTheDocument();
      });

      it('renders the notifications icon on /premium-processing page', () => {
        // arrange
        const { getByTestId, queryByTestId } = render(<HeaderNav />, {
          initialState: { ...initialState, user: { userDetails: { id: 1 }, privilege: {}, routes: [] } },
          route: ['/premium-processing'],
        });

        // assert
        // expect(getByTestId('mobile-notifications-btn')).toBeInTheDocument();
        expect(queryByTestId('desktop-notifications-btn')).not.toBeInTheDocument();
      });

      it("doesn't render the notifications icon on other pages", () => {
        // arrange
        const { queryByTestId } = render(<HeaderNav />, { initialState });

        // assert
        expect(queryByTestId('mobile-notifications-btn')).not.toBeInTheDocument();
        expect(queryByTestId('desktop-notifications-btn')).not.toBeInTheDocument();
      });
    });
  });

  describe('@actions', () => {
    it('toggles the expanded nav onClick', () => {
      // arrange
      const { getByTestId } = render(<HeaderNav />);
      const hamburgerButton = getByTestId('hamburger-menu');
      const spyCollapseNav = jest.spyOn(uiActions, 'collapseNav').mockReturnValue({ type: 'NAV_COLLAPSE' });
      const spyExpandNav = jest.spyOn(uiActions, 'expandNav').mockReturnValue({ type: 'NAV_EXPAND' });

      // act
      fireEvent.click(hamburgerButton);

      // assert
      expect(spyCollapseNav).toHaveBeenCalledTimes(0);
      expect(spyExpandNav).toHaveBeenCalledTimes(1);

      // act
      fireEvent.click(hamburgerButton);

      // assert
      expect(spyCollapseNav).toHaveBeenCalledTimes(1);
      expect(spyExpandNav).toHaveBeenCalledTimes(1);

      // act
      fireEvent.click(hamburgerButton);

      // assert
      expect(spyCollapseNav).toHaveBeenCalledTimes(1);
      expect(spyExpandNav).toHaveBeenCalledTimes(2);
    });
  });
});
