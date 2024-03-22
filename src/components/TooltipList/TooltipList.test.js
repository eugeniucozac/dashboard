import React from 'react';
import { render } from 'tests';
import TooltipList from './TooltipList';

describe('COMPONENTS › TooltipList', () => {
  it('renders without crashing', () => {
    // arrange
    const { container } = render(<TooltipList />);

    // assert
    expect(container).toBeInTheDocument();
  });

  it('renders nothing if no items passed', () => {
    // arrange
    const { container } = render(<TooltipList />);

    // assert
    expect(container).toBeEmptyDOMElement();
  });

  it('renders title, and list of items', () => {
    // arrange
    const props = {
      items: [
        {
          amount: 2344,
          id: 1234,
          label: 'Equinox',
        },
        {
          amount: 43546545,
          id: 2345,
          label: 'Property',
        },
      ],
    };
    const { getByText } = render(<TooltipList {...props} />);

    // assert
    expect(getByText('Equinox')).toBeInTheDocument();
    expect(getByText('format.currency(2344)')).toBeInTheDocument();
    expect(getByText('Property')).toBeInTheDocument();
    expect(getByText('format.currency(43546545)')).toBeInTheDocument();
  });
});
