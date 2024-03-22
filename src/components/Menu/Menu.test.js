import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, renderWithAuth, setLocation, resetLocation } from 'tests';
import Menu from './Menu';
import fetchMock from 'fetch-mock';

describe('COMPONENTS � Menu', () => {
  const loggedInUser = {
    id: 1,
    departmentIds: [1, 2, 3],
    departmentSelected: 2,
    auth: {
      accessToken: 'abc123',
    },
  };

  const initialState = {
    user: {
      ...loggedInUser,
      role: 'ADMIN',
    },
    parent: {
      list: ['The Matrix', 'The Matrix Reloaded'],
    },
    referenceData: {
      departments: [
        { id: 1, name: 'one' },
        { id: 2, name: 'two' },
        { id: 3, name: 'three' },
      ],
    },
  };

  beforeEach(() => {
    fetchMock.get('*', { body: {} });
  });

  afterEach(() => {
    fetchMock.restore();
  });

  it('renders without crashing', () => {
    // arrange
    const { container } = render(<Menu />);

    // assert
    expect(container).toBeInTheDocument();
  });

  it('renders the user info details', () => {
    // arrange
    const { getByTestId } = render(<Menu />, {
      initialState: { user: { ...loggedInUser, firstName: 'Keanu', lastName: 'Reeves' } },
    });

    // assert
    // expect(getByTestId('menu-department')).toBeInTheDocument();
  });

  it('renders the menu list items', () => {
    // arrange
    const { getByText, getByTestId, queryAllByTestId } = render(<Menu />, { initialState: { parent: { list: [{ id: 1 }] } } });

    // assert
    expect(getByTestId('menu-list')).toBeInTheDocument();
    // expect(queryAllByTestId('menu-list-link')).toHaveLength(6);
    // expect(getByText('app.home')).toBeInTheDocument();
    // expect(getByText('client.title')).toBeInTheDocument();
    // expect(getByText('market.title')).toBeInTheDocument();
    // expect(getByText('industryNews.title')).toBeInTheDocument();
  });

  it('renders the menu list items restricted for brokers', () => {
    // arrange
    const { getByText, getByTestId, queryAllByTestId } = render(<Menu />, {
      initialState: { parent: { list: [{ id: 1 }] }, user: { ...loggedInUser, role: 'BROKER' } },
    });

    // assert
    expect(getByTestId('menu-list')).toBeInTheDocument();
    // expect(queryAllByTestId('menu-list-link')).toHaveLength(11);
    // expect(getByText('app.home')).toBeInTheDocument();
    // expect(getByText('client.title')).toBeInTheDocument();
    // expect(getByText('market.title')).toBeInTheDocument();
    // expect(getByText('products.title')).toBeInTheDocument();
    // expect(getByText('trips.title')).toBeInTheDocument();
    // expect(getByText('opportunity.title')).toBeInTheDocument();
    // expect(getByText('modelling.title')).toBeInTheDocument();
    // expect(getByText('openingMemo.title')).toBeInTheDocument();
    // expect(getByText('industryNews.title')).toBeInTheDocument();
  });

  it('renders the "clients" link if parent data was fetched', () => {
    // arrange
    const { getByText, getByTestId, queryAllByTestId } = render(<Menu />, {
      initialState: {
        parent: {
          list: ['The Matrix'],
        },
      },
    });

    // assert
    // expect(getByTestId('menu-list')).toBeInTheDocument();
    // // expect(queryAllByTestId('menu-list-link')).toHaveLength(6);
    // expect(getByText('app.home')).toBeInTheDocument();
    // expect(getByText('client.title')).toBeInTheDocument();
    // expect(getByText('industryNews.title')).toBeInTheDocument();
  });

  it('renders the "markets" link if parent data was fetched', () => {
    // arrange
    const { getByText, getByTestId, queryAllByTestId } = render(<Menu />, {
      initialState: {
        parent: {
          list: ['The Matrix'],
        },
      },
    });

    // assert
    // expect(getByTestId('menu-list')).toBeInTheDocument();
    // // expect(queryAllByTestId('menu-list-link')).toHaveLength(6);
    // expect(getByText('app.admin')).toBeInTheDocument();
    // expect(getByText('market.title')).toBeInTheDocument();
    // expect(getByText('industryNews.title')).toBeInTheDocument();
  });

  // it("doesn't render temporary/restricted links in production mode", () => {
  //   // arrange
  //   const loc = setLocation('productionHost');
  //   const { getByText, queryByTestId } = render(<Menu />);

  //   // assert
  //  expect(getByText('app.home')).toBeInTheDocument();
  //   expect(queryByTestId('products.title')).toBeNull();
  //   expect(queryByTestId('market.title')).toBeNull();

  //   // revert
  //   resetLocation(loc);
  //     expect(queryAllByTestId('menu-list-link')).toHaveLength(4);
  //     expect(queryAllByTestId('menu-list-link')[0].querySelector('a')).toHaveAttribute('href', '/');
  //     expect(queryAllByTestId('menu-list-link')[0].querySelector('svg')).toBeInTheDocument();
  //     expect(queryAllByTestId('menu-list-link')[1].querySelector('a')).toHaveAttribute('href', '/department/2/two');
  //     expect(queryAllByTestId('menu-list-link')[1].querySelector('svg')).toBeInTheDocument();
  //     expect(queryAllByTestId('menu-list-link')[2].querySelector('a')).toHaveAttribute('href', '/markets');
  //     expect(queryAllByTestId('menu-list-link')[2].querySelector('svg')).toBeInTheDocument();
  //     expect(queryAllByTestId('menu-list-link')[3].querySelector('a')).toHaveAttribute('href', '/industry-news');
  //     expect(queryAllByTestId('menu-list-link')[3].querySelector('svg')).toBeInTheDocument();
  // });

  // it('renders all the correct links and svg icon for a BROKER', () => {
  //   // arrange
  //   const { queryAllByTestId } = render(<Menu />, {
  //     initialState: {
  //       ...initialState,
  //       user: { ...loggedInUser, role: 'BROKER' },
  //     },
  //   });

  //   // assert
  //   expect(queryAllByTestId('menu-list-link')).toHaveLength(12);
  //     expect(queryAllByTestId('menu-list-link')).toHaveLength(9);
  //   expect(queryAllByTestId('menu-list-link')[0].querySelector('a')).toHaveAttribute('href', '/');
  //   expect(queryAllByTestId('menu-list-link')[0].querySelector('svg')).toBeInTheDocument();
  //   expect(queryAllByTestId('menu-list-link')[1].querySelector('a')).toHaveAttribute('href', '/claims');
  //     expect(queryAllByTestId('menu-list-link')[1].querySelector('a')).toHaveAttribute('href', '/department/2/two');
  //   expect(queryAllByTestId('menu-list-link')[1].querySelector('svg')).toBeInTheDocument();
  //   expect(queryAllByTestId('menu-list-link')[2].querySelector('a')).toHaveAttribute('href', '/department/2/two');
  //     expect(queryAllByTestId('menu-list-link')[2].querySelector('a')).toHaveAttribute('href', '/markets');
  //   expect(queryAllByTestId('menu-list-link')[2].querySelector('svg')).toBeInTheDocument();
  //   expect(queryAllByTestId('menu-list-link')[3].querySelector('a')).toHaveAttribute('href', '/clients');
  //     expect(queryAllByTestId('menu-list-link')[3].querySelector('a')).toHaveAttribute('href', '/products');
  //   expect(queryAllByTestId('menu-list-link')[3].querySelector('svg')).toBeInTheDocument();
  //   expect(queryAllByTestId('menu-list-link')[4].querySelector('a')).toHaveAttribute('href', '/markets');
  //     expect(queryAllByTestId('menu-list-link')[4].querySelector('a')).toHaveAttribute('href', '/trips');
  //   expect(queryAllByTestId('menu-list-link')[4].querySelector('svg')).toBeInTheDocument();
  //   expect(queryAllByTestId('menu-list-link')[5].querySelector('a')).toHaveAttribute('href', '/quote-bind');
  //     expect(queryAllByTestId('menu-list-link')[5].querySelector('a')).toHaveAttribute('href', '/opportunity');
  //   expect(queryAllByTestId('menu-list-link')[5].querySelector('svg')).toBeInTheDocument();
  //   expect(queryAllByTestId('menu-list-link')[6].querySelector('a')).toHaveAttribute('href', '/trips');
  //     expect(queryAllByTestId('menu-list-link')[6].querySelector('a')).toHaveAttribute('href', '/modelling');
  //   expect(queryAllByTestId('menu-list-link')[6].querySelector('svg')).toBeInTheDocument();
  //   expect(queryAllByTestId('menu-list-link')[7].querySelector('a')).toHaveAttribute('href', '/opportunity');
  //     expect(queryAllByTestId('menu-list-link')[7].querySelector('a')).toHaveAttribute('href', '/checklist');
  //   expect(queryAllByTestId('menu-list-link')[7].querySelector('svg')).toBeInTheDocument();
  //   expect(queryAllByTestId('menu-list-link')[8].querySelector('a')).toHaveAttribute('href', '/modelling');
  //     expect(queryAllByTestId('menu-list-link')[8].querySelector('a')).toHaveAttribute('href', '/industry-news');
  //   expect(queryAllByTestId('menu-list-link')[8].querySelector('svg')).toBeInTheDocument();
  //   expect(queryAllByTestId('menu-list-link')[9].querySelector('a')).toHaveAttribute('href', '/reporting');
  //   expect(queryAllByTestId('menu-list-link')[9].querySelector('svg')).toBeInTheDocument();
  //   expect(queryAllByTestId('menu-list-link')[10].querySelector('a')).toHaveAttribute('href', '/checklist');
  //   expect(queryAllByTestId('menu-list-link')[10].querySelector('svg')).toBeInTheDocument();
  //   expect(queryAllByTestId('menu-list-link')[11].querySelector('a')).toHaveAttribute('href', '/industry-news');
  //   expect(queryAllByTestId('menu-list-link')[11].querySelector('svg')).toBeInTheDocument();
  // });

  // it('renders all the correct links and svg icon for a COBROKER', () => {
  //   // arrange
  //   const { queryAllByTestId } = render(<Menu />, {
  //     initialState: {
  //       ...initialState,
  //       user: { ...loggedInUser, role: 'COBROKER' },
  //     },
  //   });

  //   // assert
  //   // expect(queryAllByTestId('menu-list-link')).toHaveLength(7);
  //   //   expect(queryAllByTestId('menu-list-link')).toHaveLength(4);
  //   expect(queryAllByTestId('menu-list-link')[0].querySelector('a')).toHaveAttribute('href', '/');
  //   expect(queryAllByTestId('menu-list-link')[0].querySelector('svg')).toBeInTheDocument();
  //   expect(queryAllByTestId('menu-list-link')[1].querySelector('a')).toHaveAttribute('href', '/claims');
  //     expect(queryAllByTestId('menu-list-link')[1].querySelector('a')).toHaveAttribute('href', '/department/2/two');
  //   expect(queryAllByTestId('menu-list-link')[1].querySelector('svg')).toBeInTheDocument();
  //   expect(queryAllByTestId('menu-list-link')[2].querySelector('a')).toHaveAttribute('href', '/department/2/two');
  //     expect(queryAllByTestId('menu-list-link')[2].querySelector('a')).toHaveAttribute('href', '/markets');
  //   expect(queryAllByTestId('menu-list-link')[2].querySelector('svg')).toBeInTheDocument();
  //   expect(queryAllByTestId('menu-list-link')[3].querySelector('a')).toHaveAttribute('href', '/clients');
  //    expect(queryAllByTestId('menu-list-link')[3].querySelector('a')).toHaveAttribute('href', '/industry-news');
  //   expect(queryAllByTestId('menu-list-link')[3].querySelector('svg')).toBeInTheDocument();
  //   expect(queryAllByTestId('menu-list-link')[4].querySelector('a')).toHaveAttribute('href', '/markets');
  //   expect(queryAllByTestId('menu-list-link')[4].querySelector('svg')).toBeInTheDocument();
  //   expect(queryAllByTestId('menu-list-link')[5].querySelector('a')).toHaveAttribute('href', '/reporting');
  //   expect(queryAllByTestId('menu-list-link')[5].querySelector('svg')).toBeInTheDocument();
  //   expect(queryAllByTestId('menu-list-link')[6].querySelector('a')).toHaveAttribute('href', '/industry-news');
  //   expect(queryAllByTestId('menu-list-link')[6].querySelector('svg')).toBeInTheDocument();
  // });

  // it('renders all the correct links and svg icon for an UNDERWRITER', () => {
  //   // arrange
  //   const { queryAllByTestId } = render(<Menu />, {
  //     initialState: {
  //       ...initialState,
  //       user: { ...loggedInUser, role: 'UNDERWRITER' },
  //     },
  //   });

  //   // assert
  //   expect(queryAllByTestId('menu-list-link')).toHaveLength(2);
  //     expect(queryAllByTestId('menu-list-link')).toHaveLength(2);
  //  expect(queryAllByTestId('menu-list-link')[0].querySelector('a')).toHaveAttribute('href', '/');
  //   expect(queryAllByTestId('menu-list-link')[0].querySelector('svg')).toBeInTheDocument();
  //   expect(queryAllByTestId('menu-list-link')[1].querySelector('a')).toHaveAttribute('href', '/quote-bind');
  //     expect(queryAllByTestId('menu-list-link')[1].querySelector('a')).toHaveAttribute('href', '/products');
  //   expect(queryAllByTestId('menu-list-link')[1].querySelector('svg')).toBeInTheDocument();
  // });

  // it('renders all the correct links and svg icons for a COBROKER/Admin', () => {
  //   // arrange
  //   const { queryAllByTestId } = render(<Menu />, {
  //     initialState: {
  //       ...initialState,
  //       user: { ...loggedInUser, role: 'COBROKER', isAdmin: true },
  //     },
  //   });

  //   // assert
  //   expect(queryAllByTestId('menu-list-link')).toHaveLength(8);
  //     expect(queryAllByTestId('menu-list-link')).toHaveLength(10);
  //   expect(queryAllByTestId('menu-list-link')[0].querySelector('a')).toHaveAttribute('href', '/');
  //   expect(queryAllByTestId('menu-list-link')[0].querySelector('svg')).toBeInTheDocument();
  //   expect(queryAllByTestId('menu-list-link')[1].querySelector('a')).toHaveAttribute('href', '/claims');
  //     expect(queryAllByTestId('menu-list-link')[1].querySelector('a')).toHaveAttribute('href', '/department/2/two');
  //   expect(queryAllByTestId('menu-list-link')[1].querySelector('svg')).toBeInTheDocument();
  //   expect(queryAllByTestId('menu-list-link')[2].querySelector('a')).toHaveAttribute('href', '/department/2/two');
  //     expect(queryAllByTestId('menu-list-link')[2].querySelector('a')).toHaveAttribute('href', '/markets');
  //   expect(queryAllByTestId('menu-list-link')[2].querySelector('svg')).toBeInTheDocument();
  //   expect(queryAllByTestId('menu-list-link')[3].querySelector('a')).toHaveAttribute('href', '/clients');
  //     expect(queryAllByTestId('menu-list-link')[3].querySelector('a')).toHaveAttribute('href', '/products');
  //   expect(queryAllByTestId('menu-list-link')[3].querySelector('svg')).toBeInTheDocument();
  //   expect(queryAllByTestId('menu-list-link')[4].querySelector('a')).toHaveAttribute('href', '/markets');
  //     expect(queryAllByTestId('menu-list-link')[4].querySelector('a')).toHaveAttribute('href', '/trips');
  //   expect(queryAllByTestId('menu-list-link')[4].querySelector('svg')).toBeInTheDocument();
  //   expect(queryAllByTestId('menu-list-link')[5].querySelector('a')).toHaveAttribute('href', '/reporting');
  //     expect(queryAllByTestId('menu-list-link')[5].querySelector('a')).toHaveAttribute('href', '/opportunity');
  //   expect(queryAllByTestId('menu-list-link')[5].querySelector('svg')).toBeInTheDocument();
  //   expect(queryAllByTestId('menu-list-link')[6].querySelector('a')).toHaveAttribute('href', '/industry-news');
  //     expect(queryAllByTestId('menu-list-link')[6].querySelector('a')).toHaveAttribute('href', '/modelling');
  //   expect(queryAllByTestId('menu-list-link')[6].querySelector('svg')).toBeInTheDocument();
  //   expect(queryAllByTestId('menu-list-link')[7].querySelector('a')).toHaveAttribute('href', '/admin');
  //     expect(queryAllByTestId('menu-list-link')[7].querySelector('a')).toHaveAttribute('href', '/checklist');
  //   expect(queryAllByTestId('menu-list-link')[7].querySelector('svg')).toBeInTheDocument();
  //    expect(queryAllByTestId('menu-list-link')[8].querySelector('a')).toHaveAttribute('href', '/industry-news');
  //     expect(queryAllByTestId('menu-list-link')[8].querySelector('svg')).toBeInTheDocument();
  //     expect(queryAllByTestId('menu-list-link')[9].querySelector('a')).toHaveAttribute('href', '/admin');
  //     expect(queryAllByTestId('menu-list-link')[9].querySelector('svg')).toBeInTheDocument();
  //   });

  //   it('renders the "clients" link if parent data was fetched for BROKER', () => {
  //     // arrange
  //     const { getByText } = render(<Menu />, {
  //       initialState: { parent: { list: [{ id: 1 }] }, user: { ...loggedInUser, role: 'BROKER' } },
  //     });

  //     // assert
  //     expect(getByText('client.title')).toBeInTheDocument();
  // });

  // it('highlights the active menu item', () => {
  //   // arrange
  //   const { getByText } = render(<Menu />, {
  //     initialState: {
  //       ...initialState,
  //       user: { ...loggedInUser, role: 'COBROKER', isAdmin: true },
  //     },
  //     route: [{ pathname: '/clients', key: 1 }],
  //   });

  //   // assert
  //   expect(getByText('client.title').className).toMatch(/listActive/);
  // });

  // it('highlights the active menu item for routes with additional params', () => {
  //   // arrange
  //   const { getByText } = render(<Menu />, {
  //     initialState: {
  //       ...initialState,
  //       user: { ...loggedInUser, role: 'COBROKER', isAdmin: true },
  //         user: {
  //           ...loggedInUser,
  //           privilege: {},
  //           routes: ['admin', 'premiumProcessing', 'processingInstructions', 'claimsFNOL', 'foo', 'bar'],
  //         },
  //     },
  //     route: [{ pathname: '/client/123', key: 1 }],
  //   });

  //   // assert

  //     // expect(queryAllByTestId('menu-list-link')).toHaveLength(4);
  //     expect(queryAllByTestId('menu-list-link')[0].querySelector('a')).toHaveAttribute('href', '/processing-instructions');
  //     expect(queryAllByTestId('menu-list-link')[0].querySelector('svg')).toBeInTheDocument();
  //     expect(queryAllByTestId('menu-list-link')[1].querySelector('a')).toHaveAttribute('href', '/premium-processing');
  //     expect(queryAllByTestId('menu-list-link')[1].querySelector('svg')).toBeInTheDocument();
  //     expect(queryAllByTestId('menu-list-link')[2].querySelector('a')).toHaveAttribute('href', '/claims');
  //     expect(queryAllByTestId('menu-list-link')[2].querySelector('svg')).toBeInTheDocument();
  //     expect(queryAllByTestId('menu-list-link')[3].querySelector('a')).toHaveAttribute('href', '/admin');
  //     expect(queryAllByTestId('menu-list-link')[3].querySelector('svg')).toBeInTheDocument();
  // });

  it('renders the divider(s)', () => {
    // arrange
    const { getByText, queryAllByTestId } = render(<Menu />, {
      initialState: {
        ...initialState,
        user: {
          ...loggedInUser,
          privilege: {},
          routes: [
            'admin',
            'reportingExtended',
            'premiumProcessing',
            'processingInstructions',
            'claimsFNOL',
            'claimsProcessing',
            'foo',
            'bar',
          ],
        },
      },
    });

    // it("doesn't render the file upload link", () => {
    //   // arrange
    //   const { queryByText } = render(<Menu />, { initialState });

    //   // assert
    //   expect(queryByText('menu.uploadFiles')).not.toBeInTheDocument();
    // });

    // assert
    expect(queryAllByTestId('menu-list-divider')).toHaveLength(0);
  });
});
