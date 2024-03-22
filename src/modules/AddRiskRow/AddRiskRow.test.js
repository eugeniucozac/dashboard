import React from 'react';
import { render, fireEvent, within } from 'tests';
import { useForm } from 'react-hook-form';
import AddRiskRow from './AddRiskRow';
import * as utils from 'utils';

export function AddRiskTableComponent({ field }) {
  const { control, register, watch, errors, setValue, trigger } = useForm({
    defaultValues: utils.form.getInitialValues([field]),
  });

  return <AddRiskRow field={field} formProps={{ control, register, watch, errors, setValue, trigger }} />;
}

describe('MODULES › AddRiskRow', () => {
  const parsedFields = [
    {
      name: 'field-array',
      type: 'ARRAY',
      display: 'ROW',
      group: 'TAB',
      arrayItemDef: [
        { name: 'field-text', type: 'TEXT', group: 'TAB', label: 'Text' },
        { name: 'field-toggle', type: 'BOOLEAN', group: 'TAB', label: 'Toggle' },
        { name: 'field-date', type: 'DATE', group: 'TAB', label: 'Date' },
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
      const { container } = render(<AddRiskRow />);

      // assert
      expect(container).toBeInTheDocument();
    });

    it('renders nothing if not passed required props', () => {
      // arrange
      const { container } = render(<AddRiskRow />);

      // assert
      expect(container).toBeEmptyDOMElement();
    });

    it('renders field labels in the table head', () => {
      // arrange
      const { container } = render(<AddRiskTableComponent field={fieldParsed} />);

      // assert
      expect(within(container.querySelector('th:nth-child(1)')).getByText('Text')).toBeInTheDocument();
      expect(within(container.querySelector('th:nth-child(2)')).getByText('Toggle')).toBeInTheDocument();
      expect(within(container.querySelector('th:nth-child(3)')).getByText('Date')).toBeInTheDocument();
      expect(within(container.querySelector('th:nth-child(4)')).getByText('Select')).toBeInTheDocument();
    });

    it('renders the first array group', () => {
      // arrange
      const { container } = render(<AddRiskTableComponent field={fieldParsed} />);

      // assert
      expect(container.querySelector('#field-array\\[0\\]\\.field-text')).toBeInTheDocument();
      expect(container.querySelector('#field-array\\[0\\]\\.field-toggle')).toBeInTheDocument();
      expect(container.querySelector('#field-array\\[0\\]\\.field-date')).toBeInTheDocument();
      expect(container.querySelector('#field-array\\[0\\]\\.field-select')).toBeInTheDocument();
    });

    it('renders each array in a table row', () => {
      // arrange
      const { container } = render(<AddRiskTableComponent field={fieldParsed} />);

      // assert
      expect(container.querySelectorAll('tr')).toHaveLength(2); // the table head is also a <tr>
    });

    it('renders the add buttons', () => {
      // arrange
      const { getByText } = render(<AddRiskTableComponent field={fieldParsed} />);

      // assert
      expect(getByText('app.add')).toBeInTheDocument();
      expect(getByText('app.pasteFromExcel')).toBeInTheDocument();
    });

    it('renders the delete row button', () => {
      // arrange
      const { getByTestId } = render(<AddRiskTableComponent field={fieldParsed} />);

      // assert
      expect(getByTestId('btn-row-delete')).toBeInTheDocument();
    });

    it("renders the delete row button disabled if there's only one row", () => {
      // arrange
      const { getByTestId } = render(<AddRiskTableComponent field={fieldParsed} />);

      // assert
      expect(getByTestId('btn-row-delete')).toHaveAttribute('disabled');
    });

    it("renders the delete row button enabled when there's multiple rows", () => {
      // arrange
      const { container, getByText } = render(<AddRiskTableComponent field={fieldParsed} />);

      // act
      fireEvent.click(getByText('app.add'));

      // assert
      expect(container.querySelectorAll('[data-testid="btn-row-delete"]')[0]).not.toHaveAttribute('disabled');
      expect(container.querySelectorAll('[data-testid="btn-row-delete"]')[1]).not.toHaveAttribute('disabled');
    });
  });

  describe('@actions', () => {
    it('renders an extra array item when clicking the add button', () => {
      // arrange
      const { container, getByText } = render(<AddRiskTableComponent field={fieldParsed} />);

      // assert
      expect(container.querySelector('#field-array\\[0\\]\\.field-text')).toBeInTheDocument();
      expect(container.querySelector('#field-array\\[1\\]\\.field-text')).not.toBeInTheDocument();

      // act
      fireEvent.click(getByText('app.add'));

      // assert
      expect(container.querySelector('#field-array\\[0\\]\\.field-text')).toBeInTheDocument();
      expect(container.querySelector('#field-array\\[1\\]\\.field-text')).toBeInTheDocument();
    });

    it('removes a row when clicking the delete button', () => {
      // arrange
      const { container, queryAllByTestId, getByText } = render(<AddRiskTableComponent field={fieldParsed} />);

      // assert
      expect(container.querySelector('#field-array\\[0\\]\\.field-text')).toBeInTheDocument();
      expect(container.querySelector('#field-array\\[1\\]\\.field-text')).not.toBeInTheDocument();

      // act
      fireEvent.click(getByText('app.add'));
      fireEvent.click(getByText('app.add'));

      // assert
      expect(container.querySelector('#field-array\\[0\\]\\.field-text')).toBeInTheDocument();
      expect(container.querySelector('#field-array\\[1\\]\\.field-text')).toBeInTheDocument();
      expect(container.querySelector('#field-array\\[2\\]\\.field-text')).toBeInTheDocument();

      // act
      fireEvent.click(queryAllByTestId('btn-row-delete')[1]);

      // assert
      expect(container.querySelector('#field-array\\[0\\]\\.field-text')).toBeInTheDocument();
      expect(container.querySelector('#field-array\\[1\\]\\.field-text')).toBeInTheDocument();
      expect(container.querySelector('#field-array\\[2\\]\\.field-text')).not.toBeInTheDocument();

      // act
      fireEvent.click(queryAllByTestId('btn-row-delete')[0]);

      // assert
      expect(container.querySelector('#field-array\\[0\\]\\.field-text')).toBeInTheDocument();
      expect(container.querySelector('#field-array\\[1\\]\\.field-text')).not.toBeInTheDocument();
      expect(container.querySelector('#field-array\\[2\\]\\.field-text')).not.toBeInTheDocument();

      // act
      fireEvent.click(queryAllByTestId('btn-row-delete')[0]);

      // assert
      expect(container.querySelector('#field-array\\[0\\]\\.field-text')).toBeInTheDocument();
      expect(container.querySelector('#field-array\\[1\\]\\.field-text')).not.toBeInTheDocument();
      expect(container.querySelector('#field-array\\[2\\]\\.field-text')).not.toBeInTheDocument();
    });

    it('renders a divider between the 1st and subsequent array item(s)', () => {
      // arrange
      const { container, getByText } = render(<AddRiskTableComponent field={fieldParsed} />);

      // assert
      expect(container.querySelector('[class*="MuiDivider"]')).not.toBeInTheDocument();

      // act
      fireEvent.click(getByText('app.add'));

      // assert
      expect(container.querySelector('[class*="MuiDivider"]')).toBeInTheDocument();
    });
  });
});
