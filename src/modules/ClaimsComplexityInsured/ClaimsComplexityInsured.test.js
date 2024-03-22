import React from 'react';
import { render, screen } from 'tests';
import userEvent from '@testing-library/user-event';
import ClaimsComplexityInsured from './ClaimsComplexityInsured';

const props = { setIsSelectedTabDirty: () => {} };

const renderClaimsComplexityInsured = () => {
  return render(<ClaimsComplexityInsured {...props} />);
};

describe('MODULES › ClaimsComplexityInsured', () => {
  it('renders without crashing', () => {
    // arrange
    const { container } = renderClaimsComplexityInsured();

    // assert
    expect(container).toBeInTheDocument();
  });

  it('renders Add and Remove Button', () => {
    renderClaimsComplexityInsured();

    // assert
    expect(screen.getByTestId('addInsured')).toBeInTheDocument();
    expect(screen.getByTestId('removeInsured')).toBeInTheDocument();
  });

  it('after typing value with less than 4 chars in the search field', () => {
    // arrange
    renderClaimsComplexityInsured();
    userEvent.type(screen.getByRole('textbox'), 'Te');

    // assert
    expect(screen.getByRole('textbox')).toHaveValue('Te');
    expect(screen.getByTestId('search-button-go')).not.toBeEnabled();
  });

  it('after typing value with more than 4 chars in the search field', () => {
    // arrange
    renderClaimsComplexityInsured();
    userEvent.type(screen.getByRole('textbox'), 'Ramesh2');

    // assert
    expect(screen.getByRole('textbox')).toHaveValue('Ramesh2');
    expect(screen.getByTestId('search-button-go')).toBeEnabled();
  });
});
