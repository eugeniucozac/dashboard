import React from 'react';
import { render } from 'tests';
import { Button } from './Button';
import { mockClasses, mockTheme } from 'setupMocks';

describe('COMPONENTS › Button', () => {
  const defaultProps = {
    classes: mockClasses,
    theme: mockTheme,
  };

  it('renders without crashing', () => {
    const { container } = render(<Button {...defaultProps} />);

    // assert
    expect(container).toBeInTheDocument();
  });
});
