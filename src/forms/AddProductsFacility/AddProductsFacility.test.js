import React from 'react';
import AddProductsFacility from './AddProductsFacility';
import { render, openMuiSelect, waitFor, within, getFormText, getFormSelect, fireEvent, waitForElement } from 'tests';
import fetchMock from 'fetch-mock';

describe('FORMS › AddProductsFacility', () => {
  beforeEach(() => {
    fetchMock.get('glob:*/api/v1/carriers*', {
      body: [
        { id: '1', name: 'Carrier Bar' },
        { id: '2', name: 'Carrier Foo' },
      ],
    });

    fetchMock.get('glob:*/api/v1/products', {
      body: {
        status: 'success',
        data: [
          { label: 'Product A', value: 'ProductA' },
          { label: 'Product B', value: 'ProductB' },
          { label: 'Product C', value: 'ProductC' },
        ],
      },
    });

    fetchMock.get('glob:*/api/v1/facilities/modules?productCode=ProductA', {
      body: [
        {
          label: 'Epic - Terror Property v1',
          value: 'EPIC_TERROR_PROP',
        },
      ],
    });
    fetchMock.get('glob:*/api/v1/users', {});
  });

  afterEach(() => {
    fetchMock.restore();
  });

  const fields = [
    {
      id: 'name',
      name: 'name',
      type: 'text',
      defaultValue: '',
      label: 'products.admin.facilities.tableCols.name',
    },
    {
      id: 'brokerCode',
      name: 'brokerCode',
      type: 'text',
      defaultValue: '',
      label: 'products.admin.facilities.tableCols.brokerCode',
    },
    {
      id: 'carrierId',
      name: 'carrierId',
      type: 'select',
      defaultValue: '',
      options: [],
      optionsDynamicKey: 'carriers',
      label: 'products.admin.facilities.tableCols.carrierId',
    },
    {
      id: 'productCode',
      name: 'productCode',
      type: 'select',
      defaultValue: '',
      options: [],
      optionKey: 'value',
      optionLabel: 'label',
      optionsDynamicKey: 'products',
      label: 'products.admin.facilities.tableCols.productCode',
    },
    {
      id: 'pricerCode',
      name: 'pricerCode',
      type: 'select',
      defaultValue: '',
      options: [],
      optionsDynamicKey: 'pricerModule',
      label: 'products.admin.facilities.tableCols.pricerModule',
    },
  ];

  describe('@render', () => {
    it('renders without crashing', () => {
      // arrange
      const { container } = render(<AddProductsFacility />);

      // assert
      expect(container).toBeInTheDocument();
    });

    it("renders nothing if there's no fields", () => {
      // arrange
      const { container } = render(<AddProductsFacility />);

      // assert
      expect(container).toBeEmptyDOMElement();
    });

    it('renders the form', () => {
      // arrange
      const { getByTestId } = render(<AddProductsFacility fields={fields} />);

      // assert
      expect(getByTestId('form-add-products-facility')).toBeInTheDocument();
    });

    it('renders the form buttons', () => {
      // arrange
      const { queryByText } = render(<AddProductsFacility fields={fields} />);

      // assert
      expect(queryByText('app.cancel')).toBeInTheDocument();
      expect(queryByText('products.admin.facilities.create')).toBeInTheDocument();
    });

    it('renders the form inputs', () => {
      // arrange
      const { container, getByText, getByLabelText } = render(<AddProductsFacility fields={fields} />);

      // assert
      expect(getByLabelText('products.admin.facilities.tableCols.name')).toBeInTheDocument();
      expect(container.querySelector(getFormText('name'))).toBeInTheDocument();

      expect(getByLabelText('products.admin.facilities.tableCols.brokerCode')).toBeInTheDocument();
      expect(container.querySelector(getFormText('brokerCode'))).toBeInTheDocument();

      expect(getByText('products.admin.facilities.tableCols.carrierId')).toBeInTheDocument();
      expect(container.querySelector(getFormSelect('carrierId'))).toBeInTheDocument();

      expect(getByText('products.admin.facilities.tableCols.productCode')).toBeInTheDocument();
      expect(container.querySelector(getFormSelect('productCode'))).toBeInTheDocument();

      expect(getByText('products.admin.facilities.tableCols.pricerModule')).toBeInTheDocument();
      expect(container.querySelector(getFormSelect('pricerCode'))).toBeInTheDocument();
    });

    it('renders carrier options', async () => {
      // arrange
      const { container, queryAllByRole, getByRole, getByTestId } = render(<AddProductsFacility fields={fields} />);
      const input = container.querySelector('input[name="carrierId"]');

      await waitFor(() => {
        expect(getByTestId('form-add-products-facility')).toBeVisible();
      });

      // act
      await openMuiSelect(input);

      // assert
      expect(document.body.querySelector('#menu-carrierId')).toBeInTheDocument();
      expect(getByRole('listbox')).toBeInTheDocument();
      expect(queryAllByRole('option')).toHaveLength(2);
      expect(within(getByRole('listbox')).getByText('Carrier Foo')).toBeInTheDocument();
      expect(within(getByRole('listbox')).getByText('Carrier Bar')).toBeInTheDocument();
    });

    it('renders product options', async () => {
      // arrange
      const { container, queryAllByRole, getByRole, getByTestId } = render(<AddProductsFacility fields={fields} />);
      const input = container.querySelector('input[name="productCode"]');

      await waitFor(() => {
        expect(getByTestId('form-add-products-facility')).toBeVisible();
      });

      // act
      await openMuiSelect(input);

      // assert
      expect(document.body.querySelector('#menu-productCode')).toBeInTheDocument();
      expect(getByRole('listbox')).toBeInTheDocument();
      expect(queryAllByRole('option')).toHaveLength(3);
      expect(within(getByRole('listbox')).getByText('Product A')).toBeInTheDocument();
      expect(within(getByRole('listbox')).getByText('Product B')).toBeInTheDocument();
      expect(within(getByRole('listbox')).getByText('Product C')).toBeInTheDocument();
    });

    it('renders Pricer Module options', async () => {
      // arrange
      const { container, queryAllByRole, getByRole, getByTestId } = render(<AddProductsFacility fields={fields} />);

      const input = container.querySelector('input[name="productCode"]');
      const pricerModuler = container.querySelector('input[name="pricerCode"]');

      await waitFor(() => {
        expect(getByTestId('form-add-products-facility')).toBeVisible();
      });

      // act
      await openMuiSelect(input);
      fireEvent.change(input, { target: { value: 'ProductA' } });

      // assert
      await waitFor(() => {
        expect(getByRole('listbox')).not.toHaveAttribute('disabled');
      });
      await openMuiSelect(pricerModuler);
      expect(document.body.querySelector('#menu-pricerCode')).toBeInTheDocument();
      expect(getByRole('listbox')).toBeInTheDocument();
      expect(queryAllByRole('option')).toHaveLength(1);
      expect(within(getByRole('listbox')).getByText('Epic - Terror Property v1')).toBeInTheDocument();
    });
  });
});
