import React from 'react';
import { cleanup } from '@testing-library/react';
import { render, screen } from 'tests';
import ClaimsPolicySearch from './ClaimsPolicySearch';

const renderClaimsPolicySearch = (props, renderOptions) => {
  const componentProps = {
    ...props,
    catCodes: [
      {
        id: '11',
        name: '17H',
      },
      {
        id: '12',
        name: '13H',
      },
      {
        id: '13',
        name: '14H',
      },
    ],
    lossQualifiers: [
      {
        id: '1',
        name: 'Various',
      },
      {
        id: '2',
        name: 'PGT',
      },
    ],
    lossInformation: {
      catCodesID: 11,
      firstContactDate: '2021-06-07T23:00:00.000+00:00',
      isActive: 1,
      lossDescription: '',
      lossDetailID: 1391,
      lossName: 'lossName data',
      lossQualifierId: 2,
    },
    policyList: [
      {
        id: 1,
        number: 'PN235789',
        insured: 'Sony',
        riskDetails: 'lorem ipsum lorem ipsum',
        inceptionDate: '11/01/2020',
        expiryDate: '12/03/2021',
        company: 'Live (Porto)',
        division: 'Software',
      },
      {
        id: 2,
        number: 'PN234467',
        insured: 'Aviva',
        riskDetails: 'lorem ipsum lorem ipsum',
        inceptionDate: '12/03/2020',
        expiryDate: '12/03/2020',
        company: 'Live (London)',
        division: 'Mining',
      },
    ],
    selectedPolicy: [
      {
        id: 1,
        number: 'PN235789',
        insured: 'Sony',
        riskDetails: 'lorem ipsum lorem ipsum',
        inceptionDate: '11/01/2020',
        expiryDate: '12/03/2021',
        company: 'Live (Porto)',
        division: 'Software',
      },
    ],
  };

  render(<ClaimsPolicySearch {...componentProps} />, renderOptions);

  return {
    componentProps,
  };
};

const renderSearchPolicyClaimsFixedBottomBar = (props, renderOptions) => {
  const componentProps = {
    ...props,
    policyRef: 'PN22222',
    isAllStepsCompleted: false,
    handleCancel: jest.fn(),
    handleFinish: jest.fn(),
    handleNext: jest.fn(),
    handleBack: jest.fn(),
    handleSave: jest.fn(),
  };

  render(<ClaimsPolicySearch {...componentProps} />, renderOptions);
};

describe('MODULES › ClaimsPolicySearch', () => {
  const originalWarn = console.warn;
  afterEach(() => (console.warn = originalWarn));

  const mockedWarn = () => {};
  beforeEach(() => (console.warn = mockedWarn));
  afterEach(cleanup);

  describe('@render', () => {
    it('renders Search Policy Screen', () => {
      //arrange
      renderClaimsPolicySearch();

      //assert
      expect(screen.getByText('claims.searchPolicy.newClaim')).toBeInTheDocument();
    });

    it('renders Search Control Buttons', () => {
      // arrange
      renderSearchPolicyClaimsFixedBottomBar();

      // assert
      // expect(screen.getByRole('button', { name: 'app.go' })).toBeInTheDocument();
    });

    it('renders button next disabled', () => {
      // arrange
      renderSearchPolicyClaimsFixedBottomBar({
        activeStep: 2,
      });

      // assert
      expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Next' })).not.toBeEnabled();
    });

    it('renders with Back and Save Buttons', () => {
      // arrange
      renderSearchPolicyClaimsFixedBottomBar({});

      // assert
      expect(screen.getByRole('button', { name: 'app.cancel' })).toBeEnabled();
      expect(screen.getByRole('button', { name: 'app.save' })).not.toBeEnabled();
    });

    it('renders button back', () => {
      // arrange
      renderSearchPolicyClaimsFixedBottomBar({
        activeStep: true,
      });

      // assert
      expect(screen.getByRole('button', { name: 'app.back' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'app.back' })).toBeEnabled();
    });
  });
});
