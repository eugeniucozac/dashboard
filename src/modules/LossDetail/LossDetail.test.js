import React from 'react';
import { render, screen } from 'tests';
import LossDetail from './LossDetail';

const renderLossDetail = () => {
  const componentProps = {
    catCodes: [
      { id: '11', name: '17H' },
      { id: '12', name: '13H' },
      { id: '13', name: '14H' },
    ],
    
    lossInfo: {
      catCodesID: 11,
      firstContactDate: '2021-06-07T23:00:00.000+00:00',
      isActive: 1,
      lossDescription: 'XYZ',
      lossDetailID: 1391,
      lossName: 'lossName data',
      fromDate: '2021-06-07T23:00:00.000+00:00',
      toDate: '2021-06-07T23:00:00.000+00:00',
    },
    
    columns: [
      { id: 'claimReference', label: 'Claim Reference' },
      { id: 'claimant', label: 'Claimant' },
      { id: 'policyRef', label: 'Policy Reference' },
      { id: 'claimReceived', label: 'Claim Received' },
      { id: 'division', label: 'Division' },
      { id: 'insured', label: 'Insured' },
      { id: 'riskDetails', label: 'Risk Details' },
      { id: 'claimStatus', label: 'Claim Status' },
    ],
  };

  render(<LossDetail {...componentProps} />);
};

describe('MODULES › LossDetail', () => {
  describe('@render', () => {
    it('renders without crashing', () => {
      // arrange
      renderLossDetail();

      // assert
      expect(screen.getByText('claims.loss.lossInformation.title')).toBeInTheDocument();
      expect(screen.getByText('claims.loss.relatedClaims.title')).toBeInTheDocument();
    });
    it('renders row labels', () => {
      // arrange
      renderLossDetail();

      // assert
      // Loss card
      expect(screen.getByText('claims.lossInformation.ref')).toBeInTheDocument();
      expect(screen.getByText('claims.lossInformation.name')).toBeInTheDocument();
      expect(screen.getByText('claims.lossInformation.details')).toBeInTheDocument();
      expect(screen.getByText('claims.lossInformation.catCode')).toBeInTheDocument();
      expect(screen.getByText('claims.lossInformation.dateAndTime')).toBeInTheDocument();
      expect(screen.getByText('claims.lossInformation.fromDate')).toBeInTheDocument();
      expect(screen.getByText('claims.lossInformation.toDate')).toBeInTheDocument();
      expect(screen.getByText('claims.lossInformation.assignedTo')).toBeInTheDocument();
      
    });
  });
});
