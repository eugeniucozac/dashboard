import React from 'react';
import { render } from 'tests';
import StylePicker from './StylePicker';

describe('COMPONENTS › StylePicker', () => {
  const defaultProps = {
    items: [
      { id: 1, color: 'red' },
      { id: 2, color: 'blue' },
      { id: 3, color: 'green' },
    ],
    el: { name: 'mockElement' },
  };

  it('renders without crashing', () => {
    render(<StylePicker />);
  });

  it('renders popover if el is passed', () => {
    const { getAllByRole } = render(<StylePicker {...defaultProps} />);
    const buttons = getAllByRole('button');
    expect(buttons.length).toBe(2);
  });
});
