import React from 'react';
import { render, screen } from 'tests';
import ClaimsAcknowledgement from './ClaimsAcknowledgement';
import fetchMock from 'fetch-mock';

const renderClaimsAcknowledgement = () => {
  const claimData = {
    claim: {
      claimRef: 'CL55690',
      firstAdvicePac: '13/05/2021',
      firstAdviceDtu: '13/05/2021',
    },
  };
  return render(<ClaimsAcknowledgement {...claimData} />);
};

describe('MODULES › ClaimsAcknowledgement', () => {
  it('renders without crashing', () => {
    //   //arrange
    //   renderClaimsAcknowledgement();
    //   //assert
    //   expect(screen.getByText('claims.acknowledgement.letter')).toBeInTheDocument();
    //   expect(screen.getByTestId('claims-table')).toBeInTheDocument();
    //   expect(screen.getByRole('button', { name: 'claims.acknowledgement.newClaim' })).toBeEnabled();
  });
  it('render acknowledgement data', () => {
    //   //arrange
    //   renderClaimsAcknowledgement();
    //   //assert
    //   expect(screen.getByTestId('row-col-generateLetter')).toBeInTheDocument();
  });
});
