import React from 'react';
import { render, fireEvent, screen, within } from 'tests';
import { useForm } from 'react-hook-form';
import FormDataGrid from './FormDataGrid';
import * as utils from 'utils';

export function FormDataGridComponent({ field }) {
  const { control, register, watch, errors, setValue, trigger } = useForm({
    defaultValues: utils.form.getInitialValues([field]),
  });

  return <FormDataGrid field={field} formProps={{ control, register, watch, errors, setValue, trigger }} />;
}

describe('MODULES › FormDataGrid', () => {
  const copyRowData = jest.fn();

  const fieldParsed = {
    name: 'field-array',
    type: 'array',
    arrayDefaultValues: [
      {
        UUID: 'REF-1',
        firstName: '',
        lastName: '',
      },
      {
        UUID: 'REF-2',
        firstName: '',
        lastName: '',
      },
    ],
    arrayItemDef: [
      {
        name: 'UUID',
        type: 'text',
        label: 'UUID',
        value: '',
        disabled: true,
        excludeCopy: true,
        width: 80,
      },
      {
        name: 'firstName',
        type: 'text',
        label: 'First Name',
        value: '',
        width: 120,
      },
      {
        name: 'lastName',
        type: 'text',
        label: 'Last Name',
        value: '',
        width: 120,
      },
    ],
  };

  it('renders each array in a table row, copy button will update values from previous row', () => {
    // arrange
    const { container } = render(
      <FormDataGridComponent
        field={fieldParsed}
        handlers={{
          copyRowData: copyRowData,
        }}
      />
    );

    // assert
    expect(container.querySelectorAll('tr')).toHaveLength(3); // the table head is also two <tr>

    expect(within(container.querySelector('th:nth-child(1)')).getByText('UUID')).toBeInTheDocument();
    expect(within(container.querySelector('th:nth-child(2)')).getByText('First Name')).toBeInTheDocument();
    expect(within(container.querySelector('th:nth-child(3)')).getByText('Last Name')).toBeInTheDocument();

    expect(screen.queryByTestId('btn-row-copy-0')).not.toBeInTheDocument();
    expect(container.querySelector('#field-array\\[0\\]\\.UUID')).toBeDisabled();
    expect(container.querySelector('#field-array\\[0\\]\\.firstName')).toHaveValue('');
    expect(container.querySelector('#field-array\\[0\\]\\.lastName')).toHaveValue('');

    expect(screen.queryByTestId('btn-row-copy-1')).toBeInTheDocument();
    expect(container.querySelector('#field-array\\[1\\]\\.UUID')).toBeDisabled();
    expect(container.querySelector('#field-array\\[1\\]\\.firstName')).toHaveValue('');
    expect(container.querySelector('#field-array\\[1\\]\\.lastName')).toHaveValue('');

    fireEvent.change(container.querySelector('#field-array\\[0\\]\\.firstName'), { target: { value: 'foo' } });
    fireEvent.change(container.querySelector('#field-array\\[0\\]\\.lastName'), { target: { value: 'bar' } });

    fireEvent.click(screen.queryByTestId('btn-row-copy-1'));

    expect(container.querySelector('#field-array\\[1\\]\\.firstName')).toHaveValue('foo');
    expect(container.querySelector('#field-array\\[1\\]\\.lastName')).toHaveValue('bar');
  });
});
