import React from 'react';
import AddProductsInsured from './AddProductsInsured';
import { render, getFormText, getFormAutocompleteMui, getFormHidden, waitFor } from 'tests';
import userEvent from '@testing-library/user-event';
import fetchMock from 'fetch-mock';

describe('FORMS › AddProductsInsured', () => {
  const fields = [
    {
      id: 'name',
      name: 'name',
      type: 'text',
      defaultValue: '',
      label: 'products.admin.insureds.tableCols.name',
    },
    {
      id: 'partyType',
      name: 'partyType',
      label: 'products.admin.insureds.tableCols.partyType',
      value: [],
      type: 'autocompletemui',
      options: [
        { value: 'BUSINESS', label: 'products.admin.insureds.typeOptions.business' },
        { value: 'INDIVIDUAL', label: 'products.admin.insureds.typeOptions.individual' },
      ],
    },
    {
      id: 'genderType',
      name: 'genderType',
      label: 'products.admin.insureds.gender',
      value: [],
      type: 'autocompletemui',
      options: [
        { value: 'MALE', label: 'products.admin.insureds.genderOptions.male' },
        { value: 'FEMALE', label: 'products.admin.insureds.genderOptions.female' },
        { value: 'UNKNOWN', label: 'products.admin.insureds.genderOptions.unknown' },
        { value: 'NONE', label: 'products.admin.insureds.genderOptions.none' },
      ],
      conditional: {
        conditional: true,
        conditionalField: 'partyType',
        conditionValue: 'INDIVIDUAL',
      },
      gridSize: { xs: 12, md: 5 },
    },
    {
      id: 'dateOfBirth',
      name: 'dateOfBirth',
      transform: 'date',
      label: 'products.admin.insureds.dateOfBirth',
      conditional: {
        conditional: true,
        conditionalField: 'partyType',
        conditionValue: 'INDIVIDUAL',
      },
      type: 'datepicker',
      value: null,
      gridSize: { xs: 12, md: 3 },
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
    it("renders nothing if there's no fields", () => {
      // arrange
      const { getByTestId } = render(<AddProductsInsured />);

      // assert
      expect(getByTestId('empty-placeholder')).toBeInTheDocument();
    });

    it('renders the form, buttons and inputs', async () => {
      fetchMock.get('glob:*/api/v1/facilities/countries', { body: countries });
      fetchMock.get('glob:*/api/v1/clients*', {
        body: { content: [{ id: '5e9ec9610daf9932fa4f0de0', label: 'Client Name' }] },
      });

      // arrange
      const { container, queryByText, queryByTestId, getByLabelText } = render(<AddProductsInsured fields={fields} />);

      // assert
      // form
      await waitFor(() => {
        expect(queryByTestId('form-add-products-insured')).toBeInTheDocument();
      });

      // buttons
      expect(queryByText('app.cancel')).toBeInTheDocument();
      expect(queryByText('products.admin.insureds.create')).toBeInTheDocument();

      // inputs
      expect(getByLabelText('products.admin.insureds.tableCols.name')).toBeInTheDocument();
      expect(container.querySelector(getFormText('name'))).toBeInTheDocument();

      expect(getByLabelText('products.admin.insureds.tableCols.partyType')).toBeInTheDocument();
      expect(container.querySelector(getFormAutocompleteMui('partyType'))).toBeInTheDocument();

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

    it('renders the form Gender and DOB if individual is selected', async () => {
      // arrange
      const { container, queryByText, getByTestId, getByLabelText, getByRole } = render(<AddProductsInsured fields={fields} />);
      await waitFor(() => {
        expect(getByTestId('form-add-products-insured')).toBeInTheDocument();
      });

      const partType = container.querySelector(getFormAutocompleteMui('partyType'));

      userEvent.click(partType);
      const option = queryByText('products.admin.insureds.typeOptions.individual');
      expect(option).toBeInTheDocument();

      userEvent.click(option);

      expect(partType).toHaveProperty('value', 'products.admin.insureds.typeOptions.individual');

      // assert
      // form
      expect(getByTestId('form-add-products-insured')).toBeInTheDocument();

      // buttons
      expect(queryByText('app.cancel')).toBeInTheDocument();
      expect(queryByText('products.admin.insureds.create')).toBeInTheDocument();

      // inputs
      expect(getByLabelText('products.admin.insureds.tableCols.name')).toBeInTheDocument();
      expect(container.querySelector(getFormText('name'))).toBeInTheDocument();

      expect(getByLabelText('products.admin.insureds.tableCols.partyType')).toBeInTheDocument();
      expect(container.querySelector(getFormAutocompleteMui('partyType'))).toBeInTheDocument();

      expect(getByLabelText('products.admin.insureds.gender')).toBeInTheDocument();
      expect(container.querySelector(getFormAutocompleteMui('genderType'))).toBeInTheDocument();

      expect(getByLabelText('products.admin.insureds.dateOfBirth')).toBeInTheDocument();
      expect(getByRole('textbox', { name: /products\.admin\.insureds\.dateofbirth/i })).toBeInTheDocument();

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
