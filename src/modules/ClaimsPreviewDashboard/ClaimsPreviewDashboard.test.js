import React from 'react';
import { render, screen } from 'tests';
import ClaimsPreviewDashboard from './ClaimsPreviewDashboard';
import fetchMock from 'fetch-mock';

const renderClaimsPreviewDashboard = () => {
  const claimData = {
    claim: {
      claimRef: 'CL55690',
      firstAdvicePac: '13/05/2021',
      firstAdviceDtu: '13/05/2021',
    },
  };
  return render(<ClaimsPreviewDashboard {...claimData} />);
};

describe('MODULES › ClaimsPreviewDashboard', () => {
  it('renders without crashing', () => {
    //   //arrange
    //   renderClaimsPreviewDashboard();
    //   //assert
    //   expect(screen.getByText('claims.acknowledgement.letter')).toBeInTheDocument();
    //   expect(screen.getByTestId('claims-table')).toBeInTheDocument();
    //   expect(screen.getByRole('button', { name: 'claims.acknowledgement.newClaim' })).toBeEnabled();
  });
  it('render acknowledgement data', () => {
    //   //arrange
    //   renderClaimsPreviewDashboard();
    //   //assert
    //   expect(screen.getByTestId('row-col-generateLetter')).toBeInTheDocument();
  });
});
