import React from 'react';
import { render, screen } from 'tests';
import ClaimAction from './ClaimAction';

const renderClaimAction = () => {
  return render(<ClaimAction />);
};

describe('MODULES › ClaimAction', () => {
  it('renders without crashing', () => {
    // arrange
    renderClaimAction();

    // assert
    expect(screen.getByTestId('claim-action')).toBeInTheDocument();
  });

  it('renders table', () => {
    // arrange
    renderClaimAction();

    // assert
    expect(screen.getByTestId('claim-action-table')).toBeInTheDocument();
    expect(screen.getByTestId('claim-action-search-table')).toBeInTheDocument();
  });
});
