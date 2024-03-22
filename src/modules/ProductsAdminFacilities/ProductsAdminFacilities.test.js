import React from 'react';
import { render, waitFor, fireEvent } from 'tests';
import ProductsAdminFacilities from './ProductsAdminFacilities';
import * as uiActions from 'stores/ui/ui.actions';
import fetchMock from 'fetch-mock';

jest.mock('stores/ui/ui.actions', () => {
  return {
    __esModule: true,
    ...jest.requireActual('stores/ui/ui.actions'),
    showModal: jest.fn(),
  };
});

describe('MODULES › ProductsAdminFacilities', () => {
  beforeEach(() => {
    fetchMock.get('glob:*/api/v1/facilities*', {
      body: {
        content: [
          {
            id: '1',
            name: 'Facility Name',
            brokerCode: 'B0507',
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
          { id: '2', name: 'Insured Foo' },
        ],
      },
    });

    fetchMock.get('glob:*/api/v1/products', {
      body: {
        status: 'success',
        data: [{ name: 'party-text', type: 'TEXT', group: 'PARTY', label: 'Product Foo', value: 'FOO' }],
      },
    });
    fetchMock.get('glob:*/api/v1/users', {});
  });

  afterEach(() => {
    fetchMock.restore();
  });

  describe('@render', () => {
    it('renders without crashing', () => {
      // arrange
      render(<ProductsAdminFacilities />);
    });

    it('renders facilities table', async () => {
      // arrange
      const { getByText, getAllByText } = render(<ProductsAdminFacilities />);

      // assert
      await waitFor(() => getAllByText('products.admin.facilities.tableCols.name')[0]);
      expect(getAllByText('products.admin.facilities.tableCols.name')[0]).toBeInTheDocument();
      expect(getAllByText('products.admin.facilities.tableCols.brokerCode')[0]).toBeInTheDocument();
      expect(getAllByText('products.admin.facilities.tableCols.carrierId')[0]).toBeInTheDocument();
      expect(getAllByText('products.admin.facilities.tableCols.productCode')[0]).toBeInTheDocument();
      expect(getAllByText('products.admin.facilities.tableCols.capacity')[0]).toBeInTheDocument();
      expect(getAllByText('products.admin.facilities.tableCols.liveFrom')[0]).toBeInTheDocument();
      expect(getAllByText('products.admin.facilities.tableCols.liveTo')[0]).toBeInTheDocument();

      expect(getByText('Facility Name')).toBeInTheDocument();
      expect(getByText('B0507')).toBeInTheDocument();
      expect(getByText('Carrier Foo')).toBeInTheDocument();
      expect(getByText('Product Foo')).toBeInTheDocument();
      expect(getByText('format.currency(3242)')).toBeInTheDocument();
      expect(getByText('format.date(2020-02-13T16:30:16Z)')).toBeInTheDocument();
      expect(getByText('format.date(2021-12-31T16:30:16Z)')).toBeInTheDocument();
      expect(getAllByText('products.admin.facilities.add')[0]).toBeInTheDocument();
    });

    it('renders add facility button', async () => {
      // arrange
      const { getByTestId } = render(<ProductsAdminFacilities />);

      // assert
      expect(getByTestId('facilities-create-button')).toBeInTheDocument();
    });

    it('renders pagination component', () => {
      // arrange
      const { getByTestId } = render(<ProductsAdminFacilities />);

      // assert
      expect(getByTestId('pagination')).toBeInTheDocument();
    });
  });

  describe('@actions', () => {
    it('renders the "Add Facility" modal when click on button', async () => {
      // arrange
      const { getByTestId } = render(<ProductsAdminFacilities />);
      const spyShowModal = jest.spyOn(uiActions, 'showModal').mockReturnValue({ type: 'FOO' });

      // act
      fireEvent.click(getByTestId('facilities-create-button'));

      // assert
      expect(spyShowModal).toHaveBeenCalledTimes(1);
      spyShowModal.mockRestore();
    });
  });
});
