import React from 'react';
import Trips from './Trips';
import fetchMock from 'fetch-mock';
import { render, within, fireEvent, waitFor, waitForElementToBeRemoved } from 'tests';

describe('PAGES › Trips', () => {
  const defaultTrip = {
    id: 1,
    title: 'Miami Trip',
    visits: [
      {
        id: 10,
        visitingDate: '2020-01-01',
        client: {
          id: 100,
          name: 'Epic Insurance',
        },
        users: [{ id: 1000, firstName: 'Joe', lastName: 'Smith' }],
      },
    ],
  };

  beforeEach(() => {
    fetchMock.get('glob:*/api/trip?page=1*', { body: { status: 'success', data: { content: [], pagination: { query: 'hello' } } } });
    fetchMock.get('glob:*/api/trip/*', { body: { status: 'success', data: defaultTrip } });
    fetchMock.get('glob:*/api/comment/*', { body: {} });
  });

  afterEach(() => {
    fetchMock.restore();
  });

  describe('@render', () => {
    it('renders the page title', async () => {
      // arrange
      render(<Trips />);

      // assert
      await waitFor(() => expect(document.title).toContain('trips.title'));
    });

    describe('layout', () => {
      it('renders the main and panel components', () => {
        // arrange
        const { getByTestId, container } = render(<Trips />);

        // assert
        expect(container).toBeInTheDocument();
        expect(getByTestId('layout-main')).toBeInTheDocument();
        expect(getByTestId('layout-sidebar')).toBeInTheDocument();
      });

      it('renders the page title', () => {
        // arrange
        const { getByText } = render(<Trips />);

        // assert
        expect(getByText('trips.title')).toBeInTheDocument();
      });

      it('renders the risk search form', () => {
        // arrange
        const { getByTestId } = render(<Trips />);

        // assert
        expect(getByTestId('search-field')).toBeInTheDocument();
        expect(getByTestId('search-button-go')).toBeInTheDocument();
      });
    });

    describe('trips list', () => {
      it('renders search results details when searching/filtering by text', () => {
        // arrange
        const { getByText } = render(<Trips />, {
          initialState: {
            trip: {
              list: {
                items: [],
                itemsTotal: 0,
                page: 1,
                pageSize: 10,
                pageTotal: 0,
                query: 'foo',
              },
              selected: {},
            },
          },
        });

        // assert
        expect(getByText('app.searchResult')).toBeInTheDocument();
      });

      it('renders a table row for each trip', () => {
        // arrange
        const { getByTestId, queryByTestId } = render(<Trips />, {
          initialState: {
            trip: {
              list: {
                items: [
                  { id: 1 },
                  { id: 2, title: 'Miami Trip' },
                  { id: 3, title: 'Chicago Trip', visits: [] },
                  { id: 4, title: 'Denver Trip', visits: [] },
                ],
              },
            },
          },
        });

        // assert
        expect(getByTestId('trip-row-1')).toBeInTheDocument();
        expect(getByTestId('trip-row-2')).toBeInTheDocument();
        expect(getByTestId('trip-row-3')).toBeInTheDocument();
        expect(getByTestId('trip-row-4')).toBeInTheDocument();
        expect(queryByTestId('trip-row-5')).not.toBeInTheDocument();
      });

      it('renders data in corresponding table cells', () => {
        // arrange
        const { getByText, getByTestId } = render(<Trips />, {
          initialState: {
            trip: {
              list: {
                items: [defaultTrip],
                query: 'foo',
              },
              selected: {},
            },
          },
        });

        // assert
        expect(getByTestId('trip-row-1')).toBeInTheDocument();
        expect(getByText('Miami Trip')).toBeInTheDocument();
        expect(getByText('Epic Insurance')).toBeInTheDocument();
        expect(getByText('format.date(1577836800000)')).toBeInTheDocument();
        expect(getByText('JS')).toBeInTheDocument();
        expect(getByText('Joe')).toBeInTheDocument();
      });

      it('renders the comma separated list of clients', () => {
        // arrange
        const { getByTestId } = render(<Trips />, {
          initialState: {
            trip: {
              list: {
                items: [
                  {
                    id: 1,
                    title: 'Miami Trip',
                    visits: [
                      { id: 10, client: { id: 100, name: 'Epic Insurance' } },
                      { id: 20, client: { id: 200, name: 'Lloyds' } },
                      { id: 30, client: { id: 300, name: 'Foo' } },
                    ],
                  },
                ],
              },
            },
          },
        });

        // assert
        expect(within(getByTestId('trip-cell-clients-1')).getByText('Epic Insurance')).toBeInTheDocument();
        expect(within(getByTestId('trip-cell-clients-1')).getByText('Lloyds')).toBeInTheDocument();
        expect(within(getByTestId('trip-cell-clients-1')).getByText('Foo')).toBeInTheDocument();
      });

      it('renders the list of brokers', () => {
        // arrange
        const { getByTestId } = render(<Trips />, {
          initialState: {
            trip: {
              list: {
                items: [
                  {
                    id: 1,
                    title: 'Miami Trip',
                    visits: [
                      {
                        id: 10,
                        client: { id: 100, name: 'Epic' },
                      },
                      {
                        id: 20,
                        client: { id: 200, name: 'Lloyds' },
                        users: [{ id: 1000, firstName: 'Rob', lastName: 'Robson' }],
                      },
                      {
                        id: 30,
                        client: { id: 300, name: 'Foo' },
                        users: [
                          { id: 2000, firstName: 'Joe', lastName: 'Johnson' },
                          { id: 3000, firstName: 'Tom', lastName: 'Thompson' },
                          { id: 4000, firstName: 'Dave', lastName: 'Davidson' },
                        ],
                      },
                    ],
                  },
                ],
              },
            },
          },
        });

        // assert
        expect(within(getByTestId('trip-cell-users-1')).getByText('RR')).toBeInTheDocument();
        expect(within(getByTestId('trip-cell-users-1')).getByText('JJ')).toBeInTheDocument();
        expect(within(getByTestId('trip-cell-users-1')).getByText('TT')).toBeInTheDocument();
        expect(within(getByTestId('trip-cell-users-1')).getByText('DD')).toBeInTheDocument();
      });

      it('renders pagination component', () => {
        // arrange
        const { getByTestId } = render(<Trips />);

        // assert
        expect(getByTestId('pagination')).toBeInTheDocument();
      });
    });
  });

  describe('@actions', () => {
    it('triggers a fetch on first render', async () => {
      // arrange
      const response = {
        status: 'success',
        data: {
          content: [defaultTrip],
          pagination: {},
        },
      };

      fetchMock.restore();
      fetchMock.get('glob:*/api/trip?page=1*', { body: response });
      fetchMock.get('glob:*/api/trip/*', { body: { status: 'success', data: {} } });
      fetchMock.get('glob:*/api/comment*', { body: {} });
      const { getByTestId } = render(<Trips />);

      // assert
      expect(getByTestId('trip-list')).toBeInTheDocument();
      expect(getByTestId('trip-list').children).toHaveLength(0);

      await waitFor(() => getByTestId('trip-row-1'));
      //  expect(getByTestId('trip-list').children).toHaveLength(1);
      expect(getByTestId('trip-row-1')).toBeInTheDocument();
    });

    it('triggers a new fetch when searching/filtering and clearing the search filter', async () => {
      // arrange
      const response = {
        status: 'success',
        data: {
          content: [defaultTrip],
          pagination: { page: 1, pageSize: 5, itemsTotal: 3, pageTotal: 1, query: '' },
        },
      };

      const responseFilterByText = {
        status: 'success',
        data: {
          content: [
            { id: 2, title: 'Chicago Trip', visits: [] },
            { id: 3, title: 'LA Trip', visits: [] },
          ],
          pagination: { page: 1, pageSize: 5, itemsTotal: 2, pageTotal: 1, query: 'xyz' },
        },
      };

      fetchMock.restore();
      fetchMock.get('glob:*/api/trip?page=1*query=xyz*', responseFilterByText, { name: 'tripFilterByText' });
      fetchMock.get('glob:*/api/trip?page=1*', response, { name: 'trip' });
      fetchMock.get('glob:*/api/trip/*', { body: { status: 'success', data: {} } });
      fetchMock.get('glob:*/api/comment*', { body: {} });

      const { getByText, getByPlaceholderText, getByTestId, queryByTestId } = render(<Trips />);

      // assert
      // wait for the initial fetch
      await waitFor(() => getByTestId('trip-row-1'));
      // expect(getByTestId('trip-list').children).toHaveLength(1);

      // act - simulate a search/filter by text
      fireEvent.change(getByPlaceholderText('trips.search'), { target: { value: 'xyz' } });
      fireEvent.click(getByTestId('search-button-go'));

      // assert
      await waitFor(() => getByTestId('trip-row-2'));

      expect(getByTestId('trip-list').children).toHaveLength(2);
      //expect(getByTestId('search-button-clear')).toBeInTheDocument();

      // act - simulate resetting the search query
      // fireEvent.click(getByTestId('search-button-clear'));
      // await waitForElementToBeRemoved(() => getByText('app.searchResult'));
      //  expect(queryByTestId('search-button-clear')).not.toBeInTheDocument();
      // expect(getByTestId('trip-list').children).toHaveLength(1);
    });
  });
});
