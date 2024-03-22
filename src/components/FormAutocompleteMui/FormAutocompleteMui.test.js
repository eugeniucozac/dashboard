import React from 'react';
import FormAutocompleteMui from './FormAutocompleteMui';
import { render, getFormAutocompleteMui } from 'tests';
import * as utils from 'utils';

describe('COMPONENTS › FormAutocompleteMui', () => {
  const fields = [
    {
      name: 'field-number',
      type: 'autocomplete',
      label: 'Autocomplete Label',
      placeholder: 'Placeholder...',
      hint: 'Hint text',
      value: null,
      options: [
        { value: 1, label: 'one' },
        { value: 2, label: 'two' },
        { value: 3, label: 'three' },
      ],
    },
  ];

  it('renders without crashing', () => {
    // arrange
    const { container } = render(<FormAutocompleteMui {...utils.form.getFieldProps(fields, 'field-number')} />);

    // assert
    expect(container.querySelector(getFormAutocompleteMui('field-number'))).toBeInTheDocument();
  });

  it('renders the form label text', () => {
    // arrange
    const { getByLabelText } = render(<FormAutocompleteMui {...utils.form.getFieldProps(fields, 'field-number')} />);

    // assert
    expect(getByLabelText('Autocomplete Label')).toBeInTheDocument();
  });

  it('renders the hint text', () => {
    // arrange
    const { getByText } = render(<FormAutocompleteMui {...utils.form.getFieldProps(fields, 'field-number')} />);

    // assert
    expect(getByText('Hint text')).toBeInTheDocument();
  });

  it("renders the error message and hides the hint if there's an error", () => {
    // arrange
    const { getByText, queryByText } = render(
      <FormAutocompleteMui
        {...utils.form.getFieldProps(fields, 'field-number', null, { 'field-number': { message: 'Dummy error', type: 'required' } })}
      />
    );

    // assert
    expect(getByText('Dummy error')).toBeInTheDocument();
    expect(queryByText('Hint text')).not.toBeInTheDocument();
  });

  it('renders the placeholder text', () => {
    // arrange
    const { getByPlaceholderText } = render(<FormAutocompleteMui {...utils.form.getFieldProps(fields, 'field-number')} />);

    // assert
    expect(getByPlaceholderText('Placeholder...')).toBeInTheDocument();
  });
});
