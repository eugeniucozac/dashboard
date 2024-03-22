import React from 'react';
import { render, screen } from 'tests';
import ClaimsNewLoss from './ClaimsNewLoss';

const renderClaimsNewLoss = () => {
  return render(<ClaimsNewLoss />);
};

describe('PAGES › Claims > claimsNewLoss', () => {
  it('renders without crashing', () => {
    // arrange
    renderClaimsNewLoss();

    // assert
    // expect(screen.getByText('claims.stepperLabel.registerLoss')).toBeInTheDocument();
  });
});
