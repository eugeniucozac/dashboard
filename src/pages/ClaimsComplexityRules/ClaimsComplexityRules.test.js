import React from 'react';
import { render, screen } from 'tests';
import ClaimsComplexityRules from './ClaimsComplexityRules';

const renderClaimsComplexityRules = () => {
  return render(<ClaimsComplexityRules />);
};

describe('PAGES › Claims > ClaimsComplexityRules', () => {
  it('renders without crashing', () => {
    // arrange
    renderClaimsComplexityRules();

    // assert
    expect(screen.getByText('claims.complexityRulesManagementDetails.title')).toBeInTheDocument();
  });

  it('renders tabs buttons', () => {
    // arrange
    renderClaimsComplexityRules();

    // assert
    expect(screen.getByRole('tab', { name: 'claims.complexityRulesManagementDetails.contractPolicyRef' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'claims.complexityRulesManagementDetails.insured' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'claims.complexityRulesManagementDetails.division' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'claims.complexityRulesManagementDetails.complexityValues' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'claims.complexityRulesManagementDetails.referralValues' })).toBeInTheDocument();
  });
});
