import React from 'react';
import { render, screen } from 'tests';
import ClaimsProcessing from './ClaimsProcessing';

const renderClaimsProcessing = () => {
  return render(<ClaimsProcessing />);
};

describe('PAGES › Claims > ClaimsProcessing', () => {
  it('renders without crashing', () => {
    // arrange
    renderClaimsProcessing();

    // assert
    expect(screen.getByText('claims.processing.title')).toBeInTheDocument();
  });

  it('renders tabs buttons', () => {
    // arrange
    renderClaimsProcessing();

    // assert
    expect(screen.getByRole('tab', { name: 'claims.processing.tabs.claims' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'claims.processing.tabs.tasks' })).toBeInTheDocument();
  });
});
