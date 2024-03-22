import React from 'react';
import EditProductsInsured from './EditProductsInsured';
import { render, getFormText, getFormAutocompleteMui, getFormHidden, waitFor } from 'tests';
import fetchMock from 'fetch-mock';

describe('FORMS › EditProductsInsured', () => {
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

  const item = {
    id: '6065ca9ba0442f3e4a42e83f',
    clientId: '5e9ec9610daf9932fa4f0de0',
    name: 'NameONBuzJYpmL',
    genderType: 'FEMALE',
    dateOfBirth: '1992-01-05T00:00:00',
    address: {
      street: 'testt',
      city: 'South test',
      zipCode: 'SE1 test',
      county: 'testt',
      state: 'Test testt',
      distanceToCoast: '',
      country: 'US',
      partyType: 'INDIVIDUAL',
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
      const { getByTestId } = render(<EditProductsInsured />);

      // assert
      expect(getByTestId('empty-placeholder')).toBeInTheDocument();
    });

    it('renders the form, buttons, inputs and input values', async () => {
      fetchMock.get('glob:*/api/v1/facilities/countries', { body: countries });
      fetchMock.get('glob:*/api/v1/clients*', {
        body: { content: [{ id: '5e9ec9610daf9932fa4f0de0', label: 'Client Name' }] },
      });
      fetchMock.get('glob:*/api/v1/insured/6065ca9ba0442f3e4a42e83f', { body: item });

      // arrange
      const { container, queryByText, queryByTestId, getByLabelText } = render(
        <EditProductsInsured id={item.id} submitHandler={() => {}} handleClose={() => {}} />,
        {
          initialState: { ...initialState },
        }
      );

      // assert
      // form
      await waitFor(() => {
        expect(queryByTestId('form-edit-products-insured')).toBeInTheDocument();
      });
      // buttons
      expect(queryByText('app.cancel')).toBeInTheDocument();
      expect(queryByText('products.admin.insureds.update')).toBeInTheDocument();

      // inputs
      expect(getByLabelText('products.admin.insureds.tableCols.name')).toBeInTheDocument();
      expect(container.querySelector(getFormText('name'))).toBeInTheDocument();
      expect(container.querySelector(getFormText('name'))).toHaveValue(item.name);
      expect(container.querySelector(getFormText('name'))).toBeDisabled();

      expect(getByLabelText('products.admin.insureds.tableCols.partyType')).toBeInTheDocument();
      expect(container.querySelector(getFormAutocompleteMui('partyType'))).toBeInTheDocument();
      expect(container.querySelector(getFormAutocompleteMui('partyType'))).toBeDisabled();
      expect(container.querySelector(getFormAutocompleteMui('partyType'))).toHaveValue('products.admin.insureds.typeOptions.individual');

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
      expect(container.querySelector(getFormAutocompleteMui('country'))).toBeDisabled();

      expect(container.querySelector(getFormHidden('distanceToCoast'))).toBeInTheDocument();
    });
  });
});
