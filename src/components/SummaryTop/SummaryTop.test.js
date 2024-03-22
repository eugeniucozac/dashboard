import React from 'react';
import { render } from 'tests';
import SummaryTop from './SummaryTop';
import { mockClasses, mockTheme } from 'setupMocks';

describe('COMPONENTS › SummaryTop', () => {
  const props = {
    theme: mockTheme,
    classes: mockClasses,
    placement: { selected: { id: 1 } },
  };

  it('renders without crashing', () => {
    render(<SummaryTop {...props} />);
  });
});
