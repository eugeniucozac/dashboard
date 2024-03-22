import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, openMuiSelect, changeMuiSelectOption, within, waitForElementToBeRemoved } from 'tests';
import AddRiskContainer from './AddRiskContainer';
import fetchMock from 'fetch-mock';

describe('MODULES › AddRiskContainer', () => {
  const productTypesData = [
    { label: 'Label Foo', value: 'FOO' },
    { label: 'Label Bar', value: 'BAR' },
  ];

  const definitionsData = [
    { name: 'party-text', type: 'TEXT', group: 'PARTY', label: 'PARTY Text' },
    { name: 'party-radio', type: 'RADIO', group: 'PARTY', label: 'PARTY Radio', options: [{ label: 'radio1', value: 1 }] },
    { name: 'effective-textarea', type: 'TEXTAREA', group: 'EFFECTIVE', label: 'EFFECTIVE Textarea' },
    { name: 'effective-number', type: 'NUMBER', group: 'EFFECTIVE', label: 'EFFECTIVE Number' },
    {
      name: 'effective-checkbox',
      type: 'CHECKBOX',
      group: 'EFFECTIVE',
      label: 'EFFECTIVE Checkbox',
      options: [{ label: 'checkbox1', name: 'checkbox1', value: 1 }],
    },
    { name: 'tab1-date', type: 'DATE', group: 'TAB1', label: 'TAB1 Date' },
    {
      name: 'tab1-radio',
      type: 'RADIO',
      group: 'TAB1',
      label: 'TAB1 Radio',
      options: [
        { label: 'radio1', value: 1 },
        { label: 'radio2', value: 2 },
      ],
    },
    {
      name: 'tab2-select',
      type: 'SELECT',
      group: 'TAB2',
      label: 'TAB2 Select',
      options: [
        { label: 'United Kingdom', value: 'UK' },
        { label: 'France', value: 'FR' },
      ],
    },
    {
      name: 'tab2-autocomplete',
      type: 'SELECT',
      group: 'TAB2',
      label: 'TAB2 Autocomplete',
      options: [
        { label: 'United Kingdom', value: 'UK' },
        { label: 'France', value: 'FR' },
      ],
      autocomplete: true,
    },
    {
      name: 'tab3-checkbox',
      type: 'CHECKBOX',
      group: 'TAB3',
      label: 'TAB3 Checkbox',
      options: [
        { label: 'checkbox1', name: 'checkbox1', value: 1 },
        { label: 'checkbox2', name: 'checkbox2', value: 1 },
      ],
    },
    { name: 'tab3-something-else', type: 'YAHOOOOOOO', group: 'TAB3', label: 'TAB3 Some Field Not Supported' },
  ];

  const fieldOptionsData = {
    countryOfOrigin: [
      {
        label: 'France',
        value: 'FR',
      },
      {
        label: 'United Kingdom',
        value: 'GB',
      },
    ],
  };

  beforeEach(() => {
    fetchMock.get(
      'glob:*/api/v1/products/*',
      { body: { status: 'success', data: { product: definitionsData, fieldOptions: fieldOptionsData } } },
      { overwriteRoutes: true }
    );
    fetchMock.get('glob:*/api/v1/products', { body: { status: 'success', data: productTypesData } });
    fetchMock.get('glob:*/api/v1/clients*', { body: { content: [], pagination: {} } });
    fetchMock.get('glob:*/api/v1/insured*', { body: { content: [], pagination: {} } });
    fetchMock.get('glob:*/api/v1/reinsured*', { body: { content: [], pagination: {} } });
  });

  afterEach(() => {
    fetchMock.restore();
  });

  describe('layout', () => {
    describe('@render', () => {
      it('renders an empty placeholder', () => {
        // arrange
        const { getByTestId, queryByText } = render(<AddRiskContainer />);

        // assert
        expect(getByTestId('empty-placeholder')).toBeInTheDocument();
        expect(queryByText('app.cancel')).toBeNull();
        expect(queryByText('app.submit')).toBeNull();
      });
    });

    describe('@actions', () => {
      it('should hide the empty placeholder and render form buttons when definitions are loaded', async () => {
        // arrange
        const { getByTestId, queryByText } = render(<AddRiskContainer />);
        const select = getByTestId('select-product-type');
        const input = select.querySelector('input[name="product"]');

        // act
        await waitForElementToBeRemoved(() => within(select).queryByText('app.loading'));
        await changeMuiSelectOption(input, 'Label Foo');

        // assert
        expect(getByTestId('empty-placeholder')).not.toBeVisible();
        // assert
        expect(queryByText('app.cancel')).toBeInTheDocument();
        expect(queryByText('app.submit')).toBeInTheDocument();
      });
    });
  });

  describe('product types', () => {
    describe('@render', () => {
      it('renders the product select field', () => {
        // arrange
        const { container, getByTestId } = render(<AddRiskContainer />);

        // assert
        expect(getByTestId('select-product-type')).toBeInTheDocument();
        expect(container.querySelector('input[name="product"]')).toBeInTheDocument();
      });

      it('renders the loading svg before fetch is complete', () => {
        // arrange
        const { getByTestId } = render(<AddRiskContainer />);
        const select = getByTestId('select-product-type');

        // assert
        expect(select.querySelector('svg')).toBeInTheDocument();
        expect(select.querySelector('svg > circle')).toBeInTheDocument();
        expect(within(select).queryByText('app.loading')).toBeInTheDocument();
        expect(within(select).queryByText('risks.chooseProduct')).toBeNull();
      });

      it('displays loading and empty products on first render', async () => {
        // arrange
        const { getByTestId } = render(<AddRiskContainer />);
        const select = getByTestId('select-product-type');

        // assert
        expect(within(select).queryByText('app.loading')).toBeInTheDocument();
        expect(within(select).queryByText('risks.chooseProduct')).toBeNull();
      });
    });

    describe('@actions', () => {
      it('triggers a product types fetch on first render', async () => {
        // arrange
        const { getByTestId } = render(<AddRiskContainer />);
        const select = getByTestId('select-product-type');

        // act
        await waitForElementToBeRemoved(() => within(select).queryByText('app.loading'));

        // assert
        expect(within(select).queryByText('app.loading')).toBeNull();
        expect(within(select).queryByText('risks.chooseProduct')).toBeInTheDocument();
        expect(select.querySelector('svg > circle')).not.toBeVisible();
      });

      it('renders product types after fetch', async () => {
        // arrange
        const { queryAllByRole, getByRole, getByTestId } = render(<AddRiskContainer />);
        const select = getByTestId('select-product-type');
        const input = select.querySelector('input[name="product"]');

        // act
        await waitForElementToBeRemoved(() => within(select).queryByText('app.loading'));
        await openMuiSelect(input);

        // assert
        expect(document.body.querySelector('#menu-product')).toBeInTheDocument();
        expect(getByRole('listbox')).toBeInTheDocument();
        expect(queryAllByRole('option')).toHaveLength(3);
        expect(within(getByRole('listbox')).getByText('risks.chooseProduct')).toBeInTheDocument();
        expect(within(getByRole('listbox')).getByText('Label Foo')).toBeInTheDocument();
        expect(within(getByRole('listbox')).getByText('Label Bar')).toBeInTheDocument();
      });

      it('should display error message if fieldOption->CountryOfOrigin is empty', async () => {
        fetchMock.get(
          'glob:*/api/v1/products/*',
          { body: { status: 'success', data: { product: definitionsData, fieldOptions: { countryOfOrigin: [] } } } },
          { overwriteRoutes: true }
        );
        // arrange
        const { getByTestId } = render(<AddRiskContainer />);
        const select = getByTestId('select-product-type');
        const input = select.querySelector('input[name="product"]');

        // act
        await waitForElementToBeRemoved(() => within(select).queryByText('app.loading'));
        await changeMuiSelectOption(input, 'Label Foo');

        // assert
        expect(screen.queryByText('products.error.noCountryOfOrigin')).toBeInTheDocument();
        expect(screen.getByTestId('select-product-type')).toBeInTheDocument();
      });

      it('should select the product type on click', async () => {
        // arrange
        const { getByTestId } = render(<AddRiskContainer />);
        const select = getByTestId('select-product-type');
        const input = select.querySelector('input[name="product"]');

        // act
        await waitForElementToBeRemoved(() => within(select).queryByText('app.loading'));
        await changeMuiSelectOption(input, 'Label Foo');

        // assert
        expect(within(select).queryByText('app.loading')).toBeNull();
        expect(within(select).queryByText('risks.chooseProduct')).toBeNull();
        expect(within(select).queryByText('Label Foo')).toBeInTheDocument();
      });
    });
  });

  describe('definitions', () => {
    describe('@render', () => {
      it('form to not be present on initial load', async () => {
        // arrange
        const { queryByTestId } = render(<AddRiskContainer />);

        // assert
        expect(queryByTestId('risk-form')).toBeNull();
      });
    });

    describe('@actions', () => {
      it('triggers a definitions fetch on product type change', async () => {
        // arrange
        const { getByTestId, queryByTestId } = render(<AddRiskContainer />);
        const select = getByTestId('select-product-type');
        const input = select.querySelector('input[name="product"]');

        // act
        await waitForElementToBeRemoved(() => within(select).queryByText('app.loading'));
        await changeMuiSelectOption(input, 'Label Foo');

        // assert
        expect(queryByTestId('risk-form')).toBeInTheDocument();
      });
    });
  });
});
