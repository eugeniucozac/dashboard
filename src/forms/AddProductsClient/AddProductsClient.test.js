import React from 'react';
import AddProductsClient from './AddProductsClient';
import { render, getFormText, getFormAutocompleteMui, getFormHidden, waitFor } from 'tests';
import fetchMock from 'fetch-mock';

describe('FORMS › AddProductsClient', () => {
  const fields = [
    {
      id: 'name',
      name: 'name',
      type: 'text',
      defaultValue: '',
      label: 'products.admin.clients.tableCols.name',
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

  const countries = [{ value: 'US', label: 'United States' }];

  describe('@render', () => {
    it('renders without crashing', () => {
      // arrange
      const { container } = render(<AddProductsClient />);

      // assert
      expect(container).toBeInTheDocument();
    });

    it('renders the form', async () => {
      fetchMock.get('glob:*/api/v1/facilities/countries', { body: countries });
      // arrange
      const { container, getByLabelText, getByTestId, queryByText } = render(<AddProductsClient fields={fields} />);

      // assert
      await waitFor(() => {
        expect(getByTestId('form-add-products-client')).toBeInTheDocument();
      });

      expect(queryByText('app.cancel')).toBeInTheDocument();
      expect(queryByText('products.admin.clients.create')).toBeInTheDocument();

      expect(getByLabelText('products.admin.clients.tableCols.name')).toBeInTheDocument();
      expect(container.querySelector(getFormText('name'))).toBeInTheDocument();

      expect(getByLabelText('products.admin.insureds.tableCols.street')).toBeInTheDocument();
      expect(container.querySelector(getFormText('street'))).toBeInTheDocument();

      expect(getByLabelText('products.admin.insureds.tableCols.city')).toBeInTheDocument();
      expect(container.querySelector(getFormText('city'))).toBeInTheDocument();

      expect(getByLabelText('products.admin.insureds.tableCols.zipCode')).toBeInTheDocument();
      expect(container.querySelector(getFormText('zipCode'))).toBeInTheDocument();

      expect(getByLabelText('products.admin.insureds.tableCols.county')).toBeInTheDocument();
      expect(container.querySelector(getFormText('county'))).toBeInTheDocument();

      expect(getByLabelText('products.admin.insureds.tableCols.state')).toBeInTheDocument();
      expect(container.querySelector(getFormText('state'))).toBeInTheDocument();

      expect(getByLabelText('products.admin.insureds.tableCols.country')).toBeInTheDocument();
      expect(container.querySelector(getFormAutocompleteMui('country'))).toBeInTheDocument();

      expect(container.querySelector(getFormHidden('distanceToCoast'))).toBeInTheDocument();
    });
  });
});
