import React from 'react';
import { render, screen, within, waitFor } from 'tests';
import QuoteBind from './QuoteBind';
import fetchMock from 'fetch-mock';

const initialState = {
  user: { role: 'BROKER' },
};

jest.mock('stores/ui/ui.actions', () => {
  return {
    __esModule: true,
    ...jest.requireActual('stores/ui/ui.actions'),
    showModal: jest.fn(),
  };
});

fetchMock.config.overwriteRoutes = true;

describe('PAGES › QuoteBind', () => {
  const response = {
    body: {
      content: [{ id: 1 }, { id: 2 }, { id: 3 }],
      pagination: { page: 1, pageSize: 5, itemsTotal: 3, pageTotal: 1, query: '' },
    },
  };

  const responseFilterByText = {
    body: {
      content: [{ id: 4 }, { id: 5 }],
      pagination: { page: 1, pageSize: 5, itemsTotal: 2, pageTotal: 1, query: 'xyz' },
    },
  };
  beforeEach(() => {
    fetchMock.restore();
    fetchMock.get('glob:*/api/v1/products', {
      body: {
        status: 'success',
        data: [{ label: 'Product Foo', value: 'FOO' }],
      },
    });
  });

  describe('@render', () => {
    beforeEach(() => {
      fetchMock.restore();
      fetchMock.get('glob:*/api/comment*', { body: {} });
      fetchMock.get('glob:*/api/v1/risks?*', { body: [] });
      fetchMock.get('glob:*/api/v1/risks/*', { body: {} });
      fetchMock.get('glob:*/api/v1/quotes*', { body: [] });
      fetchMock.get('glob:*/api/v1/facilities/countries', { body: [{ value: 'FR', label: 'France' }] });
      fetchMock.get('glob:*/api/v1/products', {
        body: {
          status: 'success',
          data: [{ label: 'Product Foo', value: 'FOO' }],
        },
      });
    });

    afterEach(() => {
      fetchMock.restore();
    });

    it('renders the page title', async () => {
      // arrange
      render(<QuoteBind />);

      // assert
      await waitFor(() => expect(document.title).toContain('products.title'));
    });

    describe('layout', () => {
      it('renders the main layout component', () => {
        // arrange
        const { getByTestId, container } = render(<QuoteBind />);

        // assert
        expect(container).toBeInTheDocument();
        expect(getByTestId('layout-main')).toBeInTheDocument();
      });

      it('renders the page title', () => {
        // arrange
        const { getByText } = render(<QuoteBind />);

        // assert
        expect(getByText('products.title')).toBeInTheDocument();
      });

      it('renders the risk search form, BDX', () => {
        // arrange
        const { getByTestId, getByText } = render(<QuoteBind />);
        // Commenting for this release
        // assert
        // expect(getByTestId('search-field')).toBeInTheDocument();
        // expect(getByText(/app.searchLabel/i)).toBeInTheDocument();
        expect(screen.getByText(/products.reports/i)).toBeInTheDocument();
        expect(screen.queryByText(/products.admin.btn/i)).not.toBeInTheDocument();
      });

      it('"Admin" button is not rendered for BROKER who is not admin', () => {
        // arrange
        render(<QuoteBind />, { initialState: { user: { role: 'BROKER', isAdmin: false } } });
        // assert
        expect(screen.queryByText(/products.admin.btn/i)).not.toBeInTheDocument();
      });

      it('"Admin" button is rendered for BROKER who is isAdmin', () => {
        // arrange
        render(<QuoteBind />, { initialState: { user: { role: 'BROKER', isAdmin: true } } });
        // assert
        expect(screen.getByText(/products.admin.btn/i)).toBeInTheDocument();
      });

      it('"Admin" button is not rendered for UNDERWRITER ', () => {
        // arrange
        render(<QuoteBind />, { initialState: { user: { role: 'UNDERWRITER', isAdmin: false } } });
        // assert
        expect(screen.queryByText(/products.admin.btn/i)).not.toBeInTheDocument();
      });
    });

    describe('risk list', () => {
      const jan_1_2010 = new Date('2010-01-01').getTime(); // 1262304000000
      const jan_10_2010 = new Date('2010-01-10').getTime(); // 1263081600000

      it('renders search results details when searching/filtering by text', () => {
        // arrange
        const { getByText } = render(<QuoteBind />, {
          initialState: {
            risk: {
              list: {
                items: [{ id: 1 }],
                query: 'foo',
                loading: false,
              },
              selected: {},
            },
          },
        });

        // assert
        expect(getByText('app.searchResult')).toBeInTheDocument();
      });

      it('renders data in corresponding table cells', async () => {
        const response = {
          body: {
            content: [
              {
                id: 1,
                type: 'NEW',
                riskStatus: 'BOUND',
                riskType: 'Aviation',
                insured: { id: 100, name: 'Insured100' },
                client: { id: 200, name: 'Client200' },
                inceptionDate: jan_1_2010,
                expiryDate: jan_10_2010,
              },
              {
                id: 2,
                type: '',
                riskStatus: 'QUOTED',
                riskType: 'Cyber',
                insured: { id: 101, name: 'Insured101' },
                client: { id: 201, name: 'Client201' },
                inceptionDate: jan_1_2010,
                expiryDate: jan_10_2010,
              },
            ],
            pagination: { page: 1, pageSize: 5, itemsTotal: 3, pageTotal: 1, query: '' },
          },
        };
        fetchMock.restore();
        fetchMock.get('glob:*/api/v1/risks*', response);
        fetchMock.get('glob:*/api/v1/products', {
          body: {
            status: 'success',
            data: [
              { value: 'Aviation', label: 'Aviation Name' },
              { value: 'Cyber', label: 'Cyber Name' },
            ],
          },
        });

        // arrange
        const { getByTestId } = render(<QuoteBind />);
        await waitFor(() => expect(getByTestId('risk-list')).toBeInTheDocument());

        // assert
        expect(within(getByTestId('risk-cell-insureds-1')).getByText('Insured100')).toBeInTheDocument();
        expect(within(getByTestId('risk-cell-renewal-1')).getByText('app.new')).toBeInTheDocument();
        expect(within(getByTestId('risk-cell-product-1')).getByText('Aviation Name')).toBeInTheDocument();
        expect(within(getByTestId('risk-cell-clients-1')).getByText('Client200')).toBeInTheDocument();
        expect(within(getByTestId('risk-cell-inceptionDate-1')).getByText('format.date(1262304000000)')).toBeInTheDocument();
        expect(within(getByTestId('risk-cell-expiryDate-1')).getByText('format.date(1263081600000)')).toBeInTheDocument();
        expect(within(getByTestId('risk-cell-status-1')).getByText('QBstatus.bound')).toBeInTheDocument();

        expect(within(getByTestId('risk-cell-insureds-2')).getByText('Insured101')).toBeInTheDocument();
        expect(within(getByTestId('risk-cell-renewal-2')).getByText('app.renewal')).toBeInTheDocument();
        expect(within(getByTestId('risk-cell-product-2')).getByText('Cyber Name')).toBeInTheDocument();
        expect(within(getByTestId('risk-cell-clients-2')).getByText('Client201')).toBeInTheDocument();
        expect(within(getByTestId('risk-cell-inceptionDate-2')).getByText('format.date(1262304000000)')).toBeInTheDocument();
        expect(within(getByTestId('risk-cell-expiryDate-2')).getByText('format.date(1263081600000)')).toBeInTheDocument();
        expect(within(getByTestId('risk-cell-status-2')).getByText('QBstatus.quoted')).toBeInTheDocument();
      });

      it('renders pagination component', () => {
        // arrange
        const { getByTestId } = render(<QuoteBind />);

        // assert
        expect(getByTestId('pagination')).toBeInTheDocument();
      });

      it('triggers a fetch on first render', async () => {
        // arrange
        fetchMock.restore();
        fetchMock.get('glob:*/api/comment*', { body: {} });
        fetchMock.get('glob:*/api/v1/risks*', response);
        fetchMock.get('glob:*/api/v1/quotes*', { body: [] });
        fetchMock.get('glob:*/api/v1/clients*', { body: { content: [], pagination: {} } });
        fetchMock.get('glob:*/api/v1/insured*', { body: { content: [], pagination: {} } });
        fetchMock.get('glob:*/api/v1/facilities/countries', { body: [{ value: 'FR', label: 'France' }] });
        fetchMock.get('glob:*/api/v1/products', {
          body: {
            status: 'success',
            data: [{ label: 'Product Foo', value: 'FOO' }],
          },
        });
        const { getByTestId } = render(<QuoteBind />);

        // assert
        await waitFor(() => expect(getByTestId('risk-list')).toBeInTheDocument());

        await waitFor(() => getByTestId('risk-row-1'));
        expect(getByTestId('risk-list').children).toHaveLength(3);
        expect(getByTestId('risk-row-1')).toBeInTheDocument();
        expect(getByTestId('risk-row-2')).toBeInTheDocument();
        expect(getByTestId('risk-row-3')).toBeInTheDocument();
      });
    });

    describe('add risk modal', () => {
      it('renders the "Add Risk" button', () => {
        // arrange
        const { getByText } = render(<QuoteBind />, { initialState });

        // assert
        expect(getByText('risks.addRisk')).toBeInTheDocument();
      });

      it('"Add Risk" button is not rendered for UNDERWRITER', () => {
        // arrange
        const { queryByText } = render(<QuoteBind />, { initialState: { user: { role: 'UNDERWRITER' } } });

        // assert
        expect(queryByText('risks.addRisk')).not.toBeInTheDocument();
      });
      // TODO fix test, select product and click
      // it('renders the "Add Risk" modal when click on button', async () => {
      //   // arrange
      //   const { getByTestId } = render(<QuoteBind />, { initialState });
      //   const spyShowModal = jest.spyOn(uiActions, 'showModal').mockReturnValue({ type: 'FOO' });

      //   // act
      //   fireEvent.click(getByTestId('risk-add-button'));

      //   // assert
      //   expect(spyShowModal).toHaveBeenCalledTimes(1);
      //   spyShowModal.mockRestore();
      // });
    });
  });
});
