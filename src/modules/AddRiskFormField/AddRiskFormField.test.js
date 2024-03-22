import React from 'react';
import {
  render,
  getFormCheckbox,
  getFormSelect,
  getFormHidden,
  getFormTextarea,
  getFormDatepicker,
  getFormText,
  getFormNumber,
  getFormToggle,
  getFormRadio,
  getFormAutocompleteMui,
} from 'tests';
import AddRiskFormField from './AddRiskFormField';
import { useForm } from 'react-hook-form';
import * as utils from 'utils';

export function AddRiskFormFieldComponent({ field }) {
  const { control, register, watch, errors, setValue, trigger } = useForm({
    defaultValues: utils.form.getInitialValues([field]),
  });
  return <AddRiskFormField field={field} formProps={{ control, register, watch, errors, setValue, trigger }} />;
}

describe('MODULES › AddRiskFormField', () => {
  describe('@render', () => {
    it('renders text form component', () => {
      // arrange
      const field = { name: 'field-text', type: 'TEXT', label: 'Label Text' };
      const fieldParsed = utils.risk.parseFields([field])[0];
      const { container } = render(<AddRiskFormFieldComponent field={fieldParsed} />);

      // assert
      expect(container.querySelector(getFormText('field-text'))).toBeInTheDocument();
    });

    it('renders textarea form component', () => {
      // arrange
      const field = { name: 'field-textarea', type: 'TEXT', display: 'MULTI', label: 'Label Text' };
      const fieldParsed = utils.risk.parseFields([field])[0];
      const { container } = render(<AddRiskFormFieldComponent field={fieldParsed} />);

      // assert
      expect(container.querySelector(getFormTextarea('field-textarea'))).toBeInTheDocument();
    });

    it('renders number form components', () => {
      // arrange
      const field = { name: 'field-number', type: 'NUMBER', label: 'Label Number' };
      const fieldParsed = utils.risk.parseFields([field])[0];
      const { container } = render(<AddRiskFormFieldComponent field={fieldParsed} />);

      // assert
      expect(container.querySelector(getFormNumber('field-number'))).toBeInTheDocument();
    });

    it('renders datepicker form components', () => {
      // arrange
      const field = { name: 'field-datepicker', type: 'DATE', label: 'Label Datepicker', datepicker: true };
      const fieldParsed = utils.risk.parseFields([field])[0];
      const { container } = render(<AddRiskFormFieldComponent field={fieldParsed} />);

      // assert
      expect(container.querySelector(getFormDatepicker('field-datepicker'))).toBeInTheDocument();
    });

    it('renders select form components', () => {
      // arrange
      const field = { name: 'field-select', type: 'SELECT', label: 'Label Select', options: [{ id: 1, name: '1' }] };
      const fieldParsed = utils.risk.parseFields([field])[0];
      const { container } = render(<AddRiskFormFieldComponent field={fieldParsed} />);

      // assert
      expect(container.querySelector(getFormSelect('field-select'))).toBeInTheDocument();
    });

    it('renders autocomplete form components', () => {
      // arrange
      const field = {
        name: 'field-autocomplete',
        type: 'SELECT',
        label: 'Label Autocomplete',
        autocomplete: true,
        options: [
          { label: '1', value: 1 },
          { label: '2', value: 2 },
        ],
      };
      const fieldParsed = utils.risk.parseFields([field])[0];
      const { container } = render(<AddRiskFormFieldComponent field={fieldParsed} />);

      // assert
      expect(container.querySelector(getFormAutocompleteMui('field-autocomplete'))).toBeInTheDocument();
    });

    it('renders radio form components', () => {
      // arrange
      const field = {
        name: 'field-radio',
        type: 'RADIO',
        label: 'Label Radio',
        options: [
          { label: 'radio1', value: '1' },
          { label: 'radio2', value: 2 },
        ],
      };
      const fieldParsed = utils.risk.parseFields([field])[0];
      const { container } = render(<AddRiskFormFieldComponent field={fieldParsed} />);

      // assert
      expect(container.querySelector(getFormRadio('field-radio'))).toBeInTheDocument();
    });

    it('renders checkbox form components', () => {
      // arrange
      const field = {
        name: 'field-checkbox',
        type: 'CHECKBOX',
        label: 'Label Checkbox',
        options: [
          { label: 'checkbox1', name: 'one', value: false },
          { label: 'checkbox2', name: 'two', value: false },
        ],
      };
      const fieldParsed = utils.risk.parseFields([field])[0];
      const { container } = render(<AddRiskFormFieldComponent field={fieldParsed} />);

      // assert
      expect(container.querySelector(getFormCheckbox('one'))).toBeInTheDocument();
    });

    it('renders toggle form components', () => {
      // arrange
      const field = { name: 'field-toggle', type: 'BOOLEAN', label: 'Label Toggle' };
      const fieldParsed = utils.risk.parseFields([field])[0];
      const { container } = render(<AddRiskFormFieldComponent field={fieldParsed} />);

      // assert
      expect(container.querySelector(getFormToggle('field-toggle'))).toBeInTheDocument();
    });

    it('renders hidden form components', () => {
      // arrange
      const field = { name: 'field-hidden', type: 'HIDDEN', label: 'Label Hidden' };
      const fieldParsed = utils.risk.parseFields([field])[0];
      const { container } = render(<AddRiskFormFieldComponent field={fieldParsed} />);

      // assert
      expect(container.querySelector(getFormHidden('field-hidden'))).toBeInTheDocument();
    });
  });
});
