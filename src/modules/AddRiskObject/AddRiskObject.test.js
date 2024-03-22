import React from 'react';
import { render } from 'tests';
import { useForm } from 'react-hook-form';
import AddRiskObject from './AddRiskObject';
import * as utils from 'utils';

export function AddRiskObjectComponent({ field }) {
  const { control, register, watch, errors, setValue, trigger } = useForm({
    defaultValues: utils.form.getInitialValues([field]),
  });

  return <AddRiskObject field={field} formProps={{ control, register, watch, errors, setValue, trigger }} />;
}

describe('MODULES › AddRiskObject', () => {
  const fields = [
    {
      name: 'field-object',
      type: 'OBJECT',
      group: 'TAB',
      label: 'Field Object',
      objectDef: [
        { name: 'field-text', type: 'TEXT', group: 'TAB', label: 'Text' },
        { name: 'field-boolean', type: 'BOOLEAN', group: 'TAB', label: 'Boolean' },
        {
          name: 'field-select',
          type: 'SELECT',
          group: 'TAB',
          label: 'Select',
          options: [
            { label: 'United Kingdom', value: 'UK' },
            { label: 'France', value: 'FR' },
          ],
        },
      ],
    },
  ];

  const fieldParsed = utils.risk.parseFields(fields)[0];

  describe('@render', () => {
    it('renders without crashing', () => {
      // arrange
      const { container } = render(<AddRiskObject />);

      // assert
      expect(container).toBeInTheDocument();
    });

    it('renders nothing if not passed required props', () => {
      // arrange
      const { container } = render(<AddRiskObject />);

      // assert
      expect(container).toBeEmptyDOMElement();
    });

    it('renders the object fields', () => {
      // arrange
      const { container } = render(<AddRiskObjectComponent field={fieldParsed} />);

      // assert
      expect(container.querySelector('#field-object\\.field-text')).toBeInTheDocument();
      expect(container.querySelector('#field-object\\.field-boolean')).toBeInTheDocument();
      expect(container.querySelector('#field-object\\.field-select')).toBeInTheDocument();
    });
  });
});
