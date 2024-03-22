import React from 'react';
import { render, screen } from 'tests';
import ClaimsComplexityManagementInsured from './ClaimsComplexityManagementInsured';

describe('MODULES › ClaimsComplexityManagementInsured', () => {
  it('renders without crashing', () => {
    // arrange
    const { container } = render(<ClaimsComplexityManagementInsured />);

    // assert
    expect(container).toBeInTheDocument();
  });
});
