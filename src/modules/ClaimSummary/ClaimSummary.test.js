import React from 'react';
import { render, screen } from 'tests';

import ClaimSummary from './ClaimSummary';

const renderClaimSummary = () => {
  return render(<ClaimSummary claim={{ claimID: 1 }} />);
};

describe('MODULES › ClaimSummary', () => {
  describe('@render', () => {
    it('renders without crashing', () => {
      //arrange
      renderClaimSummary();

      //assert
      expect(screen.getByText('claims.processing.summary.accordions.details')).toBeInTheDocument();
      expect(screen.getByText('claims.processing.summary.accordions.actions')).toBeInTheDocument();
      expect(screen.getByText('claims.processing.summary.accordions.documents')).toBeInTheDocument();
      expect(screen.getByText('claims.processing.summary.accordions.notes')).toBeInTheDocument();
    });
  });
});
