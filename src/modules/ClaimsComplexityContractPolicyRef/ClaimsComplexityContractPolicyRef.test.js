import React from 'react';
import { render, screen } from 'tests';
import userEvent from '@testing-library/user-event';
import ClaimsComplexityContractPolicyRef from './ClaimsComplexityContractPolicyRef';

const props = { setIsSelectedTabDirty: () => {} };

const renderClaimsComplexityContractPolicyRef = () => {
  return render(<ClaimsComplexityContractPolicyRef {...props} />);
};

describe('MODULES › ClaimsComplexityContractPolicyRef', () => {
  it('renders without crashing', () => {
    // arrange
    const { container } = renderClaimsComplexityContractPolicyRef();

    // assert
    expect(container).toBeInTheDocument();
  });

  it('renders Add and Remove Button', () => {
    renderClaimsComplexityContractPolicyRef();

    // assert
    expect(screen.getByTestId('addComplexPolicy')).toBeInTheDocument();
    expect(screen.getByTestId('removeComplexPolicy')).toBeInTheDocument();
  });

  it('after typing value with less than 4 chars in the search field', () => {
    // arrange
    renderClaimsComplexityContractPolicyRef();
    userEvent.type(screen.getByRole('textbox'), 'Te');

    // assert
    expect(screen.getByRole('textbox')).toHaveValue('Te');
    expect(screen.getByTestId('search-button-go')).not.toBeEnabled();
  });

  it('after typing value with more than 4 chars in the search field', () => {
    // arrange
    renderClaimsComplexityContractPolicyRef();
    userEvent.type(screen.getByRole('textbox'), 'Ramesh2');

    // assert
    expect(screen.getByRole('textbox')).toHaveValue('Ramesh2');
    expect(screen.getByTestId('search-button-go')).toBeEnabled();
  });
});
