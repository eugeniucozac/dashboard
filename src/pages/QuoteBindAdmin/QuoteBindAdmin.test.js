import React from 'react';
import { render, within, waitFor, fireEvent } from 'tests/index';
import QuoteBindAdmin from './QuoteBindAdmin';
import fetchMock from 'fetch-mock';

describe('PAGES › QuoteBindAdmin', () => {
  beforeEach(() => {
    fetchMock.get('glob:*/api/v1/facilities*', {
      body: {
        content: [
          {
            id: '1',
            name: 'Facility Name',
            carrierId: '2',
            productCode: 'FOO',
            capacity: 3242,
            liveFrom: '2020-02-13T16:30:16Z',
            liveTo: '2021-12-31T16:30:16Z',
            clientId: '1',
          },
        ],
      },
    });

    fetchMock.get('glob:*/api/v1/clients*', {
      body: {
        content: [
          { id: '1', name: 'Client Bar' },
          { id: '1', name: 'Client Foo' },
        ],
      },
    });

    fetchMock.get('glob:*/api/v1/carriers*', {
      body: [
        { id: '1', name: 'Carrier Bar' },
        { id: '2', name: 'Carrier Foo' },
      ],
    });

    fetchMock.get('glob:*/api/v1/insured*', {
      body: {
        content: [
          { id: '1', name: 'Insured Bar' },
          { id: '1', name: 'Insured Foo' },
        ],
      },
    });

    fetchMock.get('glob:*/api/v1/reinsured*', {
      body: {
        content: [
          { id: '1', name: 'ReInsured Bar' },
          { id: '2', name: 'ReInsured Foo' },
        ],
      },
    });

    fetchMock.get('glob:*/api/v1/products', {
      body: {
        status: 'success',
        data: [{ name: 'party-text', type: 'TEXT', group: 'PARTY', label: 'PARTY Text' }],
      },
    });
    fetchMock.get('glob:*/api/v1/users', {});
  });

  afterEach(() => {
    fetchMock.restore();
  });

  describe('@render', () => {
    it('renders the page title', async () => {
      // arrange
      render(<QuoteBindAdmin />);

      // assert
      await waitFor(() => expect(document.title).toContain('products.admin.title'));
    });

    it('renders correct icon and title', () => {
      // arrange
      const { getAllByText, getByTestId } = render(<QuoteBindAdmin />);

      // assert
      expect(getAllByText('products.admin.title')).toHaveLength(1);
      expect(getByTestId('page-header-products-admin-icon')).toBeInTheDocument();
    });

    it('renders breadcrumbs', () => {
      // arrange
      const { getByTestId } = render(<QuoteBindAdmin />);

      // assert
      expect(getByTestId('breadcrumb-products-admin')).toBeInTheDocument();
      expect(within(getByTestId('breadcrumb-products-admin')).getByText('products.title')).toBeInTheDocument();
      expect(within(getByTestId('breadcrumb-products-admin')).getByText('products.admin.titleShort')).toBeInTheDocument();
    });

    it('renders tabs', () => {
      // arrange
      const { getByText } = render(<QuoteBindAdmin />);

      // assert
      expect(getByText('app.facility_plural')).toBeInTheDocument();
      expect(getByText('app.client_plural')).toBeInTheDocument();
      expect(getByText('app.insured_plural')).toBeInTheDocument();
      expect(getByText('app.reInsured_plural')).toBeInTheDocument();
    });

    it('renders facility table', async () => {
      // arrange
      const { getByTestId } = render(<QuoteBindAdmin />);

      // assert
      await waitFor(() => getByTestId('products-admin-facilities'));
    });
  });

  describe('@actions', () => {
    it('renders client tab', async () => {
      // arrange
      const { getByTestId, getAllByTestId } = render(<QuoteBindAdmin />);
      const tabs = getAllByTestId('tabs-mui-item');
      await waitFor(() => getByTestId('products-admin-facilities'));

      // act
      fireEvent.click(tabs[1]);

      // assert
      await waitFor(() => getByTestId('products-admin-clients'));
    });

    it('renders carriers tab', async () => {
      // arrange
      const { getByTestId, getAllByTestId } = render(<QuoteBindAdmin />);
      const tabs = getAllByTestId('tabs-mui-item');
      await waitFor(() => getByTestId('products-admin-facilities'));

      // act
      fireEvent.click(tabs[2]);

      // assert
      await waitFor(() => getByTestId('products-admin-carriers'));
    });

    it('renders insureds tab', async () => {
      // arrange
      const { getByTestId, getAllByTestId } = render(<QuoteBindAdmin />);
      const tabs = getAllByTestId('tabs-mui-item');
      await waitFor(() => getByTestId('products-admin-facilities'));

      // act
      fireEvent.click(tabs[3]);

      // assert
      await waitFor(() => getByTestId('products-admin-insureds'));
    });

    it('renders ReInsureds tab', async () => {
      // arrange
      const { getByTestId, getAllByTestId } = render(<QuoteBindAdmin />);
      const tabs = getAllByTestId('tabs-mui-item');
      await waitFor(() => getByTestId('products-admin-facilities'));

      // act
      fireEvent.click(tabs[4]);

      // assert
      await waitFor(() => getByTestId('products-admin-reInsureds'));
    });
  });
});
