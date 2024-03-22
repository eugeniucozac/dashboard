import React from 'react';
import { render } from 'tests';
import FormText from './FormText';

describe('COMPONENTS › FormText', () => {
  it('renders text field component', () => {
    const field = {
      name: 'name',
      type: 'text',
      label: 'label',
      placeholder: 'mock placeholder',
      hint: 'hint',
    };
    const { getByText, getByPlaceholderText } = render(<FormText {...field} />);

    expect(getByText('label', { selector: 'label' })).toBeInTheDocument();
    expect(getByText('hint')).toBeInTheDocument();
    expect(getByPlaceholderText('mock placeholder')).toBeInTheDocument();
  });

  it('renders the placeholder text', () => {
    const field = {
      name: 'name',
      type: 'text',
      placeholder: 'mock placeholder',
    };
    const { getByPlaceholderText } = render(<FormText {...field} />);

    expect(getByPlaceholderText('mock placeholder')).toBeInTheDocument();
  });

  it('renders the value', () => {
    const field = {
      name: 'name',
      type: 'text',
      placeholder: 'mock placeholder',
      value: 'initial value',
    };
    const { container } = render(<FormText {...field} />);

    expect(container.querySelector('input[value="initial value"]')).toBeInTheDocument();
  });
});
