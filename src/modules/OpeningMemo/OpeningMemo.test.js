import React from 'react';
import OpeningMemo from './OpeningMemo';
import { render, mockIntersectionObserver, fireEvent, screen } from 'tests';
import merge from 'lodash/merge';
import fetchMock from 'fetch-mock';

describe('MODULES › OpeningMemo', () => {
  beforeEach(() => {
    mockIntersectionObserver();
  });

  it('renders correct icon and title', () => {
    // arrange
    const { getByText, getByTestId } = render(<OpeningMemo />);

    // assert
    expect(getByText('openingMemo.title')).toBeInTheDocument();
    expect(getByTestId('page-header-opening-memo-icon')).toBeInTheDocument();
  });

  describe('opening memo checklist list', () => {
    const props = {
      routeWithId: false,
      route: '/checklist',
      origin: {
        path: 'department',
      },
    };

    it('renders the search field and the list,not render the action menu, OM content', () => {
      // arrange
      render(<OpeningMemo {...props} />, { route: ['/checklist'] });

      // assert
      expect(screen.getByText('placement.openingMemo.search')).toBeInTheDocument();
      expect(screen.getByText('placement.openingMemo.riskReference')).toBeInTheDocument();
      expect(screen.getByText('app.status')).toBeInTheDocument();
      expect(screen.getByText('app.download')).toBeInTheDocument();

      expect(screen.queryByTestId('opening-memo-popover-ellipsis')).not.toBeInTheDocument();
      expect(screen.queryByTestId('opening-memo-content')).not.toBeInTheDocument();
    });
  });

  describe('opening memo checklist details', () => {
    const props = {
      routeWithId: false,
      route: '/checklist',
      origin: {
        path: 'department',
      },
    };

    const initialState = {
      openingMemo: {
        selected: {
          id: 123,
          foo: 'bar',
        },
      },
      referenceData: {
        newRenewalBusinesses: [{ id: 1 }],
      },
    };

    afterEach(() => {
      fetchMock.restore();
    });

    it("doesn't render search field,the list. Renders action menu", () => {
      // arrange
      render(<OpeningMemo {...props} />, { route: ['/checklist/123'] });

      // assert
      expect(screen.queryByText('placement.openingMemo.search')).not.toBeInTheDocument();
      expect(screen.queryByText('placement.openingMemo.riskReference')).not.toBeInTheDocument();
      expect(screen.queryByText('app.status')).not.toBeInTheDocument();
      expect(screen.queryByText('app.download')).not.toBeInTheDocument();
      expect(screen.getByTestId('opening-memo-popover-ellipsis')).toBeInTheDocument();
    });

    it('renders the default actions menu options', () => {
      // arrange
      const { getByText, queryByText } = render(<OpeningMemo {...props} />, { initialState, route: ['/checklist/123'] });
      const popoverBtn = getByText('app.actions');

      // act
      fireEvent.click(popoverBtn);

      // assert
      expect(getByText('openingMemo.addEditUmr.title')).toBeInTheDocument();
      fireEvent.click(getByText('openingMemo.addEditUmr.title'));
      expect(getByText('openingMemo.downloadOpeningMemo')).toBeInTheDocument();
      expect(queryByText('openingMemo.upload.btn')).not.toBeInTheDocument();
      expect(queryByText('openingMemo.whitespace.downloadMrc')).not.toBeInTheDocument();
    });

    it('renders the actions menu for "PDF upload to XB" only for brokers', () => {
      // arrange
      render(<OpeningMemo {...props} />, {
        initialState: {
          ...initialState,
          user: {
            role: 'BROKER',
          },
        },
        route: ['/checklist/123'],
      });
      const popoverBtn = screen.getByText('app.actions');

      // act
      fireEvent.click(popoverBtn);

      // assert
      expect(screen.getByText('openingMemo.upload.btn')).toBeInTheDocument();
    });

    it('disables the "PDF upload to XB" button if OM is not approved by account handler', () => {
      // arrange
      const { getByText } = render(<OpeningMemo {...props} />, {
        initialState: merge(initialState, {
          openingMemo: {
            selected: {
              isAccountHandlerApproved: false,
              isAuthorisedSignatoryApproved: true,
            },
          },
          user: {
            role: 'BROKER',
          },
        }),
        route: ['/checklist/123'],
      });
      const popoverBtn = getByText('app.actions');

      // act
      fireEvent.click(popoverBtn);

      // assert
      // we're targeting the parentNode because the button text is wrapper in a tooltip when disabled
      expect(getByText('openingMemo.upload.btn').parentNode).toHaveClass('Mui-disabled');
    });

    it('disables the "PDF upload to XB" button if OM is not approved by account signatory', () => {
      // arrange
      const { getByText } = render(<OpeningMemo {...props} />, {
        initialState: merge(initialState, {
          openingMemo: {
            selected: {
              isAccountHandlerApproved: true,
              isAuthorisedSignatoryApproved: false,
            },
          },
          user: {
            role: 'BROKER',
          },
        }),
        route: ['/checklist/123'],
      });
      const popoverBtn = getByText('app.actions');

      // act
      fireEvent.click(popoverBtn);

      // assert
      // we're targeting the parentNode because the button text is wrapper in a tooltip when disabled
      expect(getByText('openingMemo.upload.btn').parentNode).toHaveClass('Mui-disabled');
    });

    it('disables the "PDF upload to XB" button if OM doesn\'t have XB policies', () => {
      // arrange
      fetchMock.get('glob:*/api/openingMemo/*', {
        body: {
          status: 'success',
          data: {
            id: 2,
            isAccountHandlerApproved: true,
            isAuthorisedSignatoryApproved: true,
            uniqueMarketReference: 'umr2',
          },
        },
      });
      fetchMock.get('glob:*/api/policy/xb/*', { body: { status: 'success', data: [] } });
      fetchMock.get('glob:*/api/v1/mrcContracts*', { body: { status: 'success', data: { id: 1 } } });

      const { getByText } = render(<OpeningMemo {...props} />, {
        initialState: merge(initialState, {
          openingMemo: {
            selected: {},
          },
          user: {
            role: 'BROKER',
          },
        }),
        route: ['/checklist/123'],
      });
      const popoverBtn = getByText('app.actions');

      // act
      fireEvent.click(popoverBtn);

      // assert
      // we're targeting the parentNode because the button text is wrapper in a tooltip when disabled
      expect(getByText('openingMemo.upload.btn').parentNode).toHaveClass('Mui-disabled');
    });

    it('enables the "PDF upload to XB" button if OM is approved and have XB policies', () => {
      // arrange
      fetchMock.get('glob:*/api/openingMemo/*', {
        body: {
          status: 'success',
          data: {
            id: 2,
            isAccountHandlerApproved: true,
            isAuthorisedSignatoryApproved: true,
            uniqueMarketReference: 'umr2',
          },
        },
      });
      fetchMock.get('glob:*/api/policy/xb/*', { body: { status: 'success', data: [1, 2, 3] } });
      fetchMock.get('glob:*/api/v1/mrcContracts*', { body: { status: 'success', data: { id: 1 } } });

      const { getByText } = render(<OpeningMemo {...props} />, {
        initialState: merge(initialState, {
          openingMemo: {
            selected: {},
          },
          user: {
            role: 'BROKER',
          },
        }),
        route: ['/checklist/123'],
      });
      const popoverBtn = getByText('app.actions');

      // act
      fireEvent.click(popoverBtn);

      // assert
      expect(getByText('openingMemo.upload.btn')).not.toHaveClass('Mui-disabled');
    });

    // TODO added on 25/11/2020: uncomment when this feature isn't hidden behind a dev flag
    // it('renders the actions menu option for Whitespace download if there are UMR files', () => {
    //   // arrange
    //   fetchMock.get('glob:*/api/openingMemo/*', { body: { id:123 } });
    //   fetchMock.get('glob:*/api/v1/mrcContracts?exists=true&umrId=*', { body: [1,2,3] });
    //   const { getByText } = render(<OpeningMemo {...props} />, { initialState, route: ['/checklist/123'] });
    //   const popoverBtn = getByText('app.actions');
    //
    //   // act
    //   fireEvent.click(popoverBtn);
    //
    //   // assert
    //   expect(getByText('openingMemo.whitespace.downloadMrc')).toBeInTheDocument();
    // });
  });

  describe('placement list', () => {
    const props = {
      routeWithId: true,
      route: '/placement/checklist',
      origin: {
        path: 'placement',
        id: 456,
      },
    };

    it('renders the search field,list, not render action menu, OM content', () => {
      // arrange
      render(<OpeningMemo {...props} />, { route: ['/placement/checklist/456'] });

      // assert
      expect(screen.getByText('placement.openingMemo.search')).toBeInTheDocument();
      expect(screen.getByText('placement.openingMemo.riskReference')).toBeInTheDocument();
      expect(screen.getByText('app.status')).toBeInTheDocument();
      expect(screen.getByText('app.download')).toBeInTheDocument();
      expect(screen.queryByTestId('opening-memo-popover-ellipsis')).not.toBeInTheDocument();
      expect(screen.queryByTestId('opening-memo-content')).not.toBeInTheDocument();
    });
  });
});
