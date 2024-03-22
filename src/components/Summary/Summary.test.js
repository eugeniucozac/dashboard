import React from 'react';
import { render } from 'tests';
import { Summary } from './Summary';
import { mockClasses, mockTheme } from 'setupMocks';

describe('COMPONENTS › Summary', () => {
  const props = {
    theme: mockTheme,
    classes: mockClasses,
    placement: { selected: { id: 1 } },
  };

  const component = <Summary {...props} />;

  it('renders without crashing', () => {
    render(component);
  });
});
