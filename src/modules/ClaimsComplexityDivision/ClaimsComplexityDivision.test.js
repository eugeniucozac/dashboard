import React from 'react';
import { render } from 'tests';
import ClaimsComplexityDivision from './ClaimsComplexityDivision';

const props = { setIsSelectedTabDirty: () => {} };

const renderClaimsComplexityDivision = () => {
  return render(<ClaimsComplexityDivision {...props} />);
};

describe('MODULES › ClaimsComplexityDivision', () => {
  it('renders without crashing', () => {
    // arrange
    const { container } = renderClaimsComplexityDivision();

    // assert
    expect(container).toBeInTheDocument();
  });
});
