import React from 'react';
import {
  render,
  within,
  getFormText,
  getFormAutocompleteMui,
  getFormCheckbox,
  getFormDatepicker,
  getFormNumber,
  getFormRadio,
  getFormSelect,
  getFormToggle,
} from 'tests';
import AddRisk from './AddRisk';
import * as utils from 'utils';

describe('FORMS › AddRisk', () => {
  const parsedFields = [
    // general
    { name: 'general-text', type: 'TEXT', group: 'GENERAL', label: 'GENERAL Text' },
    { name: 'general-radio', type: 'RADIO', group: 'GENERAL', label: 'GENERAL Radio', options: [{ label: 'radio1', value: 'one' }] },

    // party
    { name: 'party-toggle', type: 'BOOLEAN', group: 'PARTY', label: 'PARTY Toggle' },

    // effective
    { name: 'effective-number', type: 'NUMBER', group: 'EFFECTIVE', label: 'EFFECTIVE Number' },
    {
      name: 'effective-checkbox',
      type: 'CHECKBOX',
      group: 'EFFECTIVE',
      label: 'EFFECTIVE Checkbox',
      options: [{ label: 'checkbox1', name: 'effective-one', value: true }],
    },
    { name: 'effective-boolean', type: 'BOOLEAN', group: 'EFFECTIVE', label: 'EFFECTIVE Boolean' },

    // tabs
    { name: 'tab1-date', type: 'DATE', group: 'TAB1', label: 'TAB1 Date' },
    {
      name: 'tab1-radio',
      type: 'RADIO',
      group: 'TAB1',
      label: 'TAB1 Radio',
      options: [
        { label: 'radio1', value: 'one' },
        { label: 'radio2', value: 'two' },
      ],
    },
    {
      name: 'tab1-select',
      type: 'SELECT',
      group: 'TAB1',
      label: 'TAB1 Select',
      options: [
        { label: 'United Kingdom', value: 'UK' },
        { label: 'France', value: 'FR' },
      ],
    },
    {
      name: 'tab1-autocomplete',
      type: 'SELECT',
      group: 'TAB1',
      label: 'TAB1 Autocomplete',
      autocomplete: true,
      options: [
        { label: 'United Kingdom', value: 'UK' },
        { label: 'France', value: 'FR' },
      ],
    },
    {
      name: 'tab1-checkbox',
      type: 'CHECKBOX',
      group: 'TAB1',
      label: 'TAB1 Checkbox',
      options: [
        { label: 'checkbox1', name: 'one', value: false },
        { label: 'checkbox2', name: 'two', value: false },
      ],
    },
    { name: 'tab1-something-else', type: 'YAHOOOOOOO', group: 'TAB1', label: 'TAB1 Some Field Not Supported' },
  ];

  it('renders without crashing', () => {
    // arrange
    const { container } = render(<AddRisk />);

    // assert
    expect(container).toBeInTheDocument();
  });

  describe('layout', () => {
    describe('@render', () => {
      it("renders nothing if there's no fields", () => {
        // arrange
        const { container } = render(<AddRisk />);

        // assert
        expect(container.querySelectorAll('input')).toHaveLength(0);
      });

      it('renders the form buttons', () => {
        // arrange
        const { queryByText } = render(<AddRisk />);

        // assert
        expect(queryByText('app.cancel')).toBeInTheDocument();
        expect(queryByText('app.submit')).toBeInTheDocument();
      });

      it('renders form elements', () => {
        // arrange
        const { getByTestId } = render(<AddRisk />);

        // assert
        expect(getByTestId('risk-form')).toBeInTheDocument();
      });

      it("renders the grid container empty if there aren't valid form inputs", () => {
        // arrange
        const { getByTestId } = render(<AddRisk />);

        // assert
        expect(getByTestId('grid-container')).toBeEmptyDOMElement();
      });

      it('renders the top grid if there are valid GENERAL form inputs', () => {
        // arrange
        const definitions = [{ name: 'field-text', type: 'TEXT', group: 'GENERAL', label: 'Label Text' }];
        const { getByTestId, queryByTestId } = render(<AddRisk fields={utils.risk.parseFields(definitions)} />);

        // assert
        expect(getByTestId('grid-generic')).toBeInTheDocument();
        expect(queryByTestId('grid-specific')).not.toBeInTheDocument();
      });

      it('renders the top grid if there are valid PARTY form inputs', () => {
        // arrange
        const definitions = [{ name: 'field-text', type: 'TEXT', group: 'PARTY', label: 'Label Text' }];
        const { getByTestId, queryByTestId } = render(<AddRisk fields={utils.risk.parseFields(definitions)} />);

        // assert
        expect(getByTestId('grid-generic')).toBeInTheDocument();
        expect(queryByTestId('grid-specific')).not.toBeInTheDocument();
      });

      it('renders the top grid if there are valid EFFECTIVE form inputs', () => {
        // arrange
        const definitions = [{ name: 'field-text', type: 'TEXT', group: 'EFFECTIVE', label: 'Label Text' }];
        const { getByTestId, queryByTestId } = render(<AddRisk fields={utils.risk.parseFields(definitions)} />);

        // assert
        expect(getByTestId('grid-generic')).toBeInTheDocument();
        expect(queryByTestId('grid-specific')).not.toBeInTheDocument();
      });

      it("doesn't render the top grid if there aren't valid form inputs", () => {
        // arrange
        const definitions = [{ name: 'field-text', type: 'TEXT', group: 'OTHER', label: 'Label Text' }];
        const { getByTestId, queryByTestId } = render(<AddRisk fields={utils.risk.parseFields(definitions)} />);

        // assert
        expect(queryByTestId('grid-generic')).not.toBeInTheDocument();
        expect(getByTestId('grid-specific')).toBeInTheDocument();
      });

      it('renders the bottom grid if there are valid form inputs', () => {
        // arrange
        const definitions = [{ name: 'field-text', type: 'TEXT', group: 'OTHER', label: 'Label Text' }];
        const { getByTestId, queryByTestId } = render(<AddRisk fields={utils.risk.parseFields(definitions)} />);

        // assert
        expect(queryByTestId('grid-generic')).not.toBeInTheDocument();
        expect(getByTestId('grid-specific')).toBeInTheDocument();
      });
    });
  });

  describe('definitions', () => {
    describe('@render', () => {
      it('renders text form components', () => {
        // arrange
        const definitions = [{ name: 'field-text', type: 'TEXT', group: 'TAB', label: 'Label Text' }];
        const { container, getByLabelText } = render(<AddRisk fields={utils.risk.parseFields(definitions)} />);

        // assert
        expect(getByLabelText('Label Text')).toBeInTheDocument();
        expect(container.querySelector(getFormText('field-text'))).toBeInTheDocument();
      });

      it('renders number form components', () => {
        // arrange
        const definitions = [{ name: 'field-number', type: 'NUMBER', group: 'TAB', label: 'Label Number' }];
        const { container, getByLabelText } = render(<AddRisk fields={utils.risk.parseFields(definitions)} />);

        // assert
        expect(getByLabelText('Label Number')).toBeInTheDocument();
        expect(container.querySelector(getFormNumber('field-number'))).toBeInTheDocument();
      });

      it('renders datepicker form components', () => {
        // arrange
        const definitions = [{ name: 'field-datepicker', type: 'DATE', group: 'TAB', label: 'Label Datepicker', datepicker: true }];
        const { container, getByLabelText } = render(<AddRisk fields={utils.risk.parseFields(definitions)} />);

        // assert
        expect(getByLabelText('Label Datepicker')).toBeInTheDocument();
        expect(container.querySelector(getFormDatepicker('field-datepicker'))).toBeInTheDocument();
      });

      it('renders select form components', () => {
        // arrange
        const definitions = [{ name: 'field-select', type: 'SELECT', group: 'TAB', label: 'Label Select' }];
        const { container, getByText } = render(<AddRisk fields={utils.risk.parseFields(definitions)} />);

        // assert
        expect(getByText('Label Select')).toBeInTheDocument();
        expect(container.querySelector(getFormSelect('field-select'))).toBeInTheDocument();
      });

      it('renders autocomplete form components', () => {
        // arrange
        const definitions = [
          {
            name: 'field-autocomplete',
            type: 'SELECT',
            group: 'TAB',
            label: 'Label Autocomplete',
            autocomplete: true,
            options: [
              { label: '1', value: 1 },
              { label: '2', value: 2 },
            ],
          },
        ];
        const { container, getByText } = render(<AddRisk fields={utils.risk.parseFields(definitions)} />);

        // assert
        expect(getByText('Label Autocomplete', { selector: 'label' })).toBeInTheDocument();
        expect(container.querySelector(getFormAutocompleteMui('field-autocomplete'))).toBeInTheDocument();
      });

      it('renders radio form components', () => {
        // arrange
        const definitions = [
          {
            name: 'field-radio',
            type: 'RADIO',
            group: 'TAB',
            label: 'Label Radio',
            options: [
              { label: 'radio1', value: '1' },
              { label: 'radio2', value: 2 },
            ],
          },
        ];
        const { container, getByText, getByLabelText } = render(<AddRisk fields={utils.risk.parseFields(definitions)} />);

        // assert
        expect(getByText('Label Radio')).toBeInTheDocument();
        expect(getByLabelText('radio1')).toBeInTheDocument();
        expect(getByLabelText('radio2')).toBeInTheDocument();
        expect(container.querySelector(getFormRadio('field-radio', '1'))).toBeInTheDocument();
        expect(container.querySelector(getFormRadio('field-radio', '2'))).toBeInTheDocument();
      });

      it('renders toggle form components', () => {
        // arrange
        const definitions = [{ name: 'field-boolean', type: 'BOOLEAN', group: 'TAB', label: 'Label Boolean' }];
        const { container, getByText } = render(<AddRisk fields={utils.risk.parseFields(definitions)} />);

        // assert
        expect(getByText('Label Boolean')).toBeInTheDocument();
        expect(getByText('app.yes')).toBeInTheDocument();
        expect(getByText('app.no')).toBeInTheDocument();
        expect(container.querySelector(getFormToggle('field-boolean', 'true'))).toBeInTheDocument();
        expect(container.querySelector(getFormToggle('field-boolean', 'false'))).toBeInTheDocument();
      });

      it('renders checkbox form components with single option', () => {
        // arrange
        const definitions = [
          {
            name: 'field-checkbox',
            type: 'CHECKBOX',
            group: 'TAB',
            label: 'Label Checkbox',
            options: [{ label: 'checkbox1', name: 'checkbox1-name', value: true }],
          },
        ];
        const { container, getByText, getByLabelText } = render(<AddRisk fields={utils.risk.parseFields(definitions)} />);

        // assert
        expect(getByText('Label Checkbox')).toBeInTheDocument();
        expect(getByLabelText('checkbox1')).toBeInTheDocument();
        expect(container.querySelector(getFormCheckbox('checkbox1-name'))).toBeInTheDocument();
      });

      it('renders checkbox form components with multiple options', () => {
        // arrange
        const definitions = [
          {
            name: 'field-checkbox',
            type: 'CHECKBOX',
            group: 'TAB',
            label: 'Label Checkbox',
            options: [
              { label: 'checkbox1', name: 'one', value: null },
              { label: 'checkbox2', name: 'two', value: null },
            ],
          },
        ];
        const { container, getByText, getByLabelText } = render(<AddRisk fields={utils.risk.parseFields(definitions)} />);

        // assert
        expect(getByText('Label Checkbox')).toBeInTheDocument();
        expect(getByLabelText('checkbox1')).toBeInTheDocument();
        expect(getByLabelText('checkbox2')).toBeInTheDocument();
        expect(container.querySelector(getFormCheckbox('one'))).toBeInTheDocument();
        expect(container.querySelector(getFormCheckbox('two'))).toBeInTheDocument();
      });

      it('renders form fields in tabs', () => {
        // arrange
        const { getByTestId } = render(<AddRisk fields={utils.risk.parseFields(parsedFields)} />);
        const gridGeneric = getByTestId('grid-generic');
        const gridSpecific = getByTestId('grid-specific');
        const tabGeneral = within(gridGeneric).queryAllByTestId('tabs-content')[0];
        const tabParty = within(gridGeneric).queryAllByTestId('tabs-content')[1];
        const tabEffective = within(gridGeneric).queryAllByTestId('tabs-content')[2];
        const tab1 = gridSpecific.querySelectorAll('[data-swipeable]')[0];

        // assert
        expect(tabGeneral.querySelectorAll(getFormText('general-text'))).toHaveLength(1);
        expect(tabGeneral.querySelectorAll(getFormRadio('general-radio'))).toHaveLength(1);
        expect(tabParty.querySelectorAll(getFormToggle('party-toggle'))).toHaveLength(2);
        expect(tabParty.querySelectorAll(getFormToggle('party-toggle', 'true'))).toHaveLength(1);
        expect(tabParty.querySelectorAll(getFormToggle('party-toggle', 'false'))).toHaveLength(1);
        expect(tabEffective.querySelectorAll(getFormNumber('effective-number'))).toHaveLength(1);
        expect(tabEffective.querySelectorAll(getFormCheckbox('effective-one'))).toHaveLength(1);
        expect(tabEffective.querySelectorAll(getFormToggle('effective-boolean'))).toHaveLength(2);
        expect(tabEffective.querySelectorAll(getFormToggle('effective-boolean', 'true'))).toHaveLength(1);
        expect(tabEffective.querySelectorAll(getFormToggle('effective-boolean', 'false'))).toHaveLength(1);
        expect(tab1.querySelectorAll(getFormDatepicker('tab1-date'))).toHaveLength(1);
        expect(tab1.querySelectorAll(getFormRadio('tab1-radio'))).toHaveLength(2);
        expect(tab1.querySelectorAll(getFormSelect('tab1-select'))).toHaveLength(1);
        expect(tab1.querySelectorAll(getFormAutocompleteMui('tab1-autocomplete'))).toHaveLength(1);
        expect(tab1.querySelectorAll(getFormCheckbox('one'))).toHaveLength(1);
        expect(tab1.querySelectorAll(getFormCheckbox('two'))).toHaveLength(1);
        expect(tab1.querySelector('input[name="tab1-something-else"]')).toBeNull();
      });

      it('renders grid spacer', () => {
        // arrange
        const { getByTestId } = render(
          <AddRisk
            fields={utils.risk.parseFields([
              { name: 'a1', type: 'TEXT', group: 'TAB', label: 'a1' },
              { name: 'a2', type: 'TEXT', group: 'TAB', label: 'a2' },
              { type: 'SPACER', group: 'TAB', gridSize: { xs: 12 } },
              { name: 'a3', type: 'TEXT', group: 'TAB', label: 'a3' },
            ])}
          />
        );
        const gridSpecific = getByTestId('grid-specific');
        const tab1 = gridSpecific.querySelectorAll('[data-swipeable]')[0];

        // assert
        expect(tab1.querySelectorAll('input[name="a1"]')).toHaveLength(1);
        expect(tab1.querySelectorAll('input[name="a2"]')).toHaveLength(1);
        expect(tab1.querySelectorAll('input[name="a3"]')).toHaveLength(1);
        expect(getByTestId('spacer-TAB-2')).toBeInTheDocument();
      });
    });
  });
});
