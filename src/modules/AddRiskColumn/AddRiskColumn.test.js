import React from 'react';
import { render, fireEvent } from 'tests';
import { useForm } from 'react-hook-form';
import AddRiskColumn from './AddRiskColumn';
import * as utils from 'utils';

export function AddRiskArrayComponent({ field }) {
  const { control, register, watch, errors, setValue, trigger } = useForm({
    defaultValues: utils.form.getInitialValues([field]),
  });

  return <AddRiskColumn field={field} formProps={{ control, register, watch, errors, setValue, trigger }} />;
}

describe('MODULES › AddRiskColumn', () => {
  const parsedFields = [
    {
      name: 'field-array',
      type: 'ARRAY',
      group: 'TAB',
      label: 'Text',
      arrayItemDef: [
        { name: 'field-text', type: 'TEXT', group: 'TAB', label: 'Text' },
        { name: 'field-toggle', type: 'DATE', group: 'TAB', label: 'Toggle' },
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

  const fieldParsed = utils.risk.parseFields(parsedFields)[0];

  describe('@render', () => {
    it('renders without crashing', () => {
      // arrange
      const { container } = render(<AddRiskColumn />);

      // assert
      expect(container).toBeInTheDocument();
    });

    it('renders nothing if not passed required props', () => {
      // arrange
      const { container } = render(<AddRiskColumn />);

      // assert
      expect(container).toBeEmptyDOMElement();
    });

    it('renders the first array group', () => {
      // arrange
      const { container } = render(<AddRiskArrayComponent field={fieldParsed} />);

      // assert
      expect(container.querySelector('#field-array\\[0\\]\\.field-text')).toBeInTheDocument();
      expect(container.querySelector('#field-array\\[0\\]\\.field-toggle')).toBeInTheDocument();
      expect(container.querySelector('#field-array\\[0\\]\\.field-select')).toBeInTheDocument();
    });

    it('renders the add button', () => {
      // arrange
      const { getByText } = render(<AddRiskArrayComponent field={fieldParsed} />);

      // assert
      expect(getByText('risks.add')).toBeInTheDocument();
    });

    it('renders the delete row button', () => {
      // arrange
      const { getByTestId } = render(<AddRiskArrayComponent field={fieldParsed} />);

      // assert
      expect(getByTestId('btn-delete')).toBeInTheDocument();
    });
  });

  describe('@actions', () => {
    it('renders an extra array item when clicking the add button', () => {
      // arrange
      const { container, getByText } = render(<AddRiskArrayComponent field={fieldParsed} />);

      // assert
      expect(container.querySelector('#field-array\\[0\\]\\.field-text')).toBeInTheDocument();
      expect(container.querySelector('#field-array\\[1\\]\\.field-text')).not.toBeInTheDocument();

      // act
      fireEvent.click(getByText('risks.add'));

      // assert
      expect(container.querySelector('#field-array\\[0\\]\\.field-text')).toBeInTheDocument();
      expect(container.querySelector('#field-array\\[1\\]\\.field-text')).toBeInTheDocument();
    });

    it('removes a row when clicking the delete button', () => {
      // arrange
      const { container, queryAllByTestId, getByText } = render(<AddRiskArrayComponent field={fieldParsed} />);

      // assert
      expect(container.querySelector('#field-array\\[0\\]\\.field-text')).toBeInTheDocument();
      expect(container.querySelector('#field-array\\[1\\]\\.field-text')).not.toBeInTheDocument();

      // act
      fireEvent.click(getByText('risks.add'));
      fireEvent.click(getByText('risks.add'));

      // assert
      expect(container.querySelector('#field-array\\[0\\]\\.field-text')).toBeInTheDocument();
      expect(container.querySelector('#field-array\\[1\\]\\.field-text')).toBeInTheDocument();
      expect(container.querySelector('#field-array\\[2\\]\\.field-text')).toBeInTheDocument();

      // act
      fireEvent.click(queryAllByTestId('btn-delete')[1]);

      // assert
      expect(container.querySelector('#field-array\\[0\\]\\.field-text')).toBeInTheDocument();
      expect(container.querySelector('#field-array\\[1\\]\\.field-text')).toBeInTheDocument();
      expect(container.querySelector('#field-array\\[2\\]\\.field-text')).not.toBeInTheDocument();

      // act
      fireEvent.click(queryAllByTestId('btn-delete')[0]);

      // assert
      expect(container.querySelector('#field-array\\[0\\]\\.field-text')).toBeInTheDocument();
      expect(container.querySelector('#field-array\\[1\\]\\.field-text')).not.toBeInTheDocument();
      expect(container.querySelector('#field-array\\[2\\]\\.field-text')).not.toBeInTheDocument();

      // act
      fireEvent.click(queryAllByTestId('btn-delete')[0]);

      // assert
      expect(container.querySelector('#field-array\\[0\\]\\.field-text')).toBeInTheDocument();
      expect(container.querySelector('#field-array\\[1\\]\\.field-text')).not.toBeInTheDocument();
      expect(container.querySelector('#field-array\\[2\\]\\.field-text')).not.toBeInTheDocument();
    });

    it('renders a divider between the 1st and subsequent array item(s)', () => {
      // arrange
      const { container, getByText } = render(<AddRiskArrayComponent field={fieldParsed} />);

      // assert
      expect(container.querySelector('[class*="MuiDivider"]')).not.toBeInTheDocument();

      // act
      fireEvent.click(getByText('risks.add'));

      // assert
      expect(container.querySelector('[class*="MuiDivider"]')).toBeInTheDocument();
    });
  });
});
