import React from 'react';
import { render, screen } from 'tests';

import ClaimDetailsSidebar from './ClaimDetailsSidebar';

const claim = {
  client: '19',
  coverHolder: 'NA',
  lossQualifierName: 'Not assigned',
  lossDetails: 'lossDetails',
  ucr: 'NA',
};

describe('MODULES › ClaimDetailsSidebar', () => {
  describe('@render', () => {
    it('renders Info titles', () => {
      // arrange
      render(<ClaimDetailsSidebar claim={claim} />);

      //assert
      expect(screen.getByText('claims.claimDetailsSidebar.coloum.client')).toBeInTheDocument();
      expect(screen.getByText('claims.claimDetailsSidebar.coloum.coverHolder')).toBeInTheDocument();
      expect(screen.getByText('claims.claimDetailsSidebar.coloum.dateTimeCreated')).toBeInTheDocument();
      expect(screen.getByText('claims.claimDetailsSidebar.coloum.lossQualifier')).toBeInTheDocument();
      expect(screen.getByText('claims.claimDetailsSidebar.coloum.lossDetails')).toBeInTheDocument();
      expect(screen.getByText('claims.claimDetailsSidebar.coloum.ucr')).toBeInTheDocument();
    });

    it('renders data', () => {
      // arrange
      render(<ClaimDetailsSidebar claim={claim} />);

      // assert
      expect(screen.getByText(claim.client)).toBeInTheDocument();
      expect(screen.getAllByText(claim.coverHolder).length).toBeGreaterThan(0);
      expect(screen.getByText(claim.lossQualifierName)).toBeInTheDocument();
      expect(screen.getByText(claim.lossDetails)).toBeInTheDocument();
      expect(screen.getAllByText(claim.ucr).length).toBeGreaterThan(0);
    });
  });
});
