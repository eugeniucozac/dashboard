import React from 'react';
import { render, screen } from 'tests';
import ClaimsEnterPolicyCardInformation from './ClaimsEnterPolicyCardInformation';
import fetchMock from 'fetch-mock';

const policyCardInformation = {
  client: 'CRC Insurance Services Inc',
  company: 'XB_London',
  division: 'Equinox',
  expiryDate: '29/12/2014',
  inceptionDate: '29/12/2013',
  insured: 'Lakewood Villa Condo',
  originalCurrency: 'USD',
  policyNote: 'Buildings and as Wdg',
  policyRef: 'E13NY15400',
  policyType: 'Facultative',
  xbInstanceID: 1,
  xbPolicyID: 2994,
};

beforeEach(() => {
  fetchMock.get('glob:*api/data/policy/*/source/*/details*', {
    body: {
      data: policyCardInformation,
    },
  });
});

afterEach(() => {
  fetchMock.restore();
});

const renderClaimsEnterPolicyCardInformation = () => {
  return render(<ClaimsEnterPolicyCardInformation />);
};

describe('MODULES › ClaimsEnterPolicyCardInformation', () => {
  describe('@render', () => {
    it('renders without crashing', () => {
      // arrange
      renderClaimsEnterPolicyCardInformation();

      // assert
      expect(screen.getByText('claims.claimInformation.policyTitle')).toBeInTheDocument();
    });

    it('renders row labels', () => {
      // arrange
      renderClaimsEnterPolicyCardInformation();

      // assert
      expect(screen.getByText('claims.claimInformation.policyRef')).toBeInTheDocument();
      expect(screen.getByText('claims.claimInformation.insured')).toBeInTheDocument();
      expect(screen.getByText('claims.claimInformation.client')).toBeInTheDocument();
      expect(screen.getByText('app.inceptionDate')).toBeInTheDocument();
      expect(screen.getByText('app.expiryDate')).toBeInTheDocument();
      expect(screen.getByText('claims.claimInformation.policyType')).toBeInTheDocument();
      expect(screen.getByText('app.company')).toBeInTheDocument();
      expect(screen.getByText('claims.claimInformation.division')).toBeInTheDocument();
      expect(screen.getByText('claims.claimInformation.originalCurrency')).toBeInTheDocument();
      expect(screen.getByText('claims.claimInformation.riskDetails')).toBeInTheDocument();
    });

    it('renders row values', () => {
      // arrange
      const { componentProps } = renderClaimsEnterPolicyCardInformation();

      // assert
      //expect(screen.getByText(componentProps.policyCardInformation.lossDetailID)).toBeInTheDocument();
    });
  });
});
