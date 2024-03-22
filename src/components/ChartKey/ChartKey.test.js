import React from 'react';
import { render } from 'tests';
import ChartKey from './ChartKey';

describe('COMPONENTS › ChartKey', () => {
  it('renders without crashing', () => {
    // arrange
    const { container } = render(<ChartKey />);

    // assert
    expect(container).toBeInTheDocument();
  });

  it('renders nothing if no items passed', () => {
    // arrange
    const { container } = render(<ChartKey />);

    // assert
    expect(container).toBeEmptyDOMElement();
  });

  it('renders title, and list of items', () => {
    // arrange
    const props = {
      items: [{ color: 'red', avatarText: 'mock avatar text', checked: true, name: '1234', label: 'mock label' }],
      title: 'mock title',
    };
    const { getByText } = render(<ChartKey {...props} />);

    // assert
    expect(getByText('mock avatar text')).toBeInTheDocument();
    expect(getByText('mock label')).toBeInTheDocument();
    expect(getByText('mock title')).toBeInTheDocument();
  });

  it('renders checkbox', () => {
    // arrange
    const props = {
      items: [{ color: 'red', avatarText: 'mock avatar text', checked: true, name: '1234', label: 'mock label' }],
      title: 'mock title',
      onToggle: jest.fn(),
    };
    const { container } = render(<ChartKey {...props} />);
    const checkbox = container.querySelector('input[type=checkbox');

    // assert
    expect(checkbox).toBeInTheDocument();
  });
});
