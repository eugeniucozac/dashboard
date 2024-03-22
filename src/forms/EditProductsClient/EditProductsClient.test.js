import React from 'react';
import EditProductsClient from './EditProductsClient';
import { render, getFormText, getFormAutocompleteMui, waitFor } from 'tests';
import fetchMock from 'fetch-mock';

describe('FORMS › EditProductsClient', () => {
  const fields = [
    {
      id: 'name',
      name: 'name',
      type: 'text',
      defaultValue: '',
      label: 'products.admin.insureds.tableCols.name',
    },
    {
      id: 'street',
      name: 'street',
      type: 'text',
      value: '',
      label: 'products.admin.insureds.tableCols.street',
    },
    {
      id: 'city',
      name: 'city',
      type: 'text',
      value: '',
      label: 'products.admin.insureds.tableCols.city',
    },
    {
      id: 'zipCode',
      name: 'zipCode',
      type: 'text',
      value: '',
      label: 'products.admin.insureds.tableCols.zipCode',
    },
    {
      id: 'county',
      name: 'county',
      type: 'text',
      value: '',
      label: 'products.admin.insureds.tableCols.county',
    },
    {
      id: 'state',
      name: 'state',
      type: 'text',
      value: '',
      label: 'products.admin.insureds.tableCols.state',
    },
    {
      id: 'country',
      name: 'country',
      type: 'autocompletemui',
      value: [],
      options: [],
      optionsDynamicKey: 'countries',
      label: 'products.admin.insureds.tableCols.country',
    },
    {
      id: 'distanceToCoast',
      name: 'distanceToCoast',
      type: 'hidden',
      value: '',
    },
  ];

  const item = {
    id: '6065ca9ba0442f3e4a42e83f',
    name: 'Client Name',
    address: {
      street: 'testt',
      city: 'South test',
      zipCode: 'SE1 test',
      county: 'testt',
      state: 'Test testt',
      distanceToCoast: '',
      country: 'US',
    },
  };

  const initialState = {
    countries: {
      items: [{ value: 'US', label: 'United States' }],
      loading: false,
    },
  };

  const countries = [{ value: 'US', label: 'United States' }];

  describe('@render', () => {
    it("renders nothing if there's no fields", () => {
      // arrange
      const { getByTestId } = render(<EditProductsClient />);

      // assert
      expect(getByTestId('empty-placeholder')).toBeInTheDocument();
    });

    it('renders the form, buttons, inputs and input values', async () => {
      fetchMock.get('glob:*/api/v1/clients/6065ca9ba0442f3e4a42e83f', { body: item });
      fetchMock.get('glob:*/api/v1/facilities/countries', { body: countries });

      // arrange
      const { container, queryByText, queryByTestId, getByLabelText } = render(<EditProductsClient id={item.id} fields={fields} />, {
        initialState: { ...initialState },
      });

      // assert
      // form
      await waitFor(() => {
        expect(queryByTestId('form-edit-products-client')).toBeInTheDocument();
      });

      // buttons
      expect(queryByText('app.cancel')).toBeInTheDocument();
      expect(queryByText('products.admin.clients.update')).toBeInTheDocument();

      // inputs
      expect(getByLabelText('products.admin.clients.tableCols.name')).toBeInTheDocument();
      expect(container.querySelector(getFormText('name'))).toBeInTheDocument();
      expect(container.querySelector(getFormText('name'))).toHaveValue(item.name);

      expect(getByLabelText('products.admin.insureds.tableCols.street')).toBeInTheDocument();
      expect(container.querySelector(getFormText('street'))).toBeInTheDocument();
      expect(container.querySelector(getFormText('street'))).toHaveValue(item.street);

      expect(getByLabelText('products.admin.insureds.tableCols.city')).toBeInTheDocument();
      expect(container.querySelector(getFormText('city'))).toBeInTheDocument();
      expect(container.querySelector(getFormText('city'))).toHaveValue(item.city);

      expect(getByLabelText('products.admin.insureds.tableCols.zipCode')).toBeInTheDocument();
      expect(container.querySelector(getFormText('zipCode'))).toBeInTheDocument();
      expect(container.querySelector(getFormText('zipCode'))).toHaveValue(item.zipCode);

      expect(getByLabelText('products.admin.insureds.tableCols.county')).toBeInTheDocument();
      expect(container.querySelector(getFormText('county'))).toBeInTheDocument();
      expect(container.querySelector(getFormText('county'))).toHaveValue(item.county);

      expect(getByLabelText('products.admin.insureds.tableCols.state')).toBeInTheDocument();
      expect(container.querySelector(getFormText('state'))).toBeInTheDocument();
      expect(container.querySelector(getFormText('state'))).toHaveValue(item.state);

      expect(getByLabelText('products.admin.insureds.tableCols.country')).toBeInTheDocument();
      expect(container.querySelector(getFormAutocompleteMui('country'))).toBeInTheDocument();
    });
  });
});
