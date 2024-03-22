import React from 'react';
import RegisterClaimCardInformation from './RegisterClaimCardInformation';
import { render, screen } from 'tests';

const props = {
  activeStep: 2,
  isAllStepsCompleted: 2,
  handleBack: () => {},
  handleSave: () => {},
  handleNext: () => {},
  save: false,
  index: 2,
};

const renderRegisterClaimCardInformation = () => {
  return render(<RegisterClaimCardInformation {...props} />);
};

describe('COMPONENTS ›RegisterClaimCardInformation', () => {
  it('renders without crashing', () => {
    // arrange
    renderRegisterClaimCardInformation();

    // assert
    expect(screen.getByTestId('register-claim-card-information')).toBeInTheDocument();
  });

  it('renders the form', () => {
    // arrange
    renderRegisterClaimCardInformation();

    // assert
    expect(screen.getByTestId('form-claimsCardInformation')).toBeInTheDocument();
  });

  it('renders the fields', () => {
    //arrange
    renderRegisterClaimCardInformation();

    // assert
    expect(screen.queryAllByText('claims.claimInformation.claimRef').length).toBe(2);
    expect(screen.getByLabelText('claims.claimInformation.claimant')).toBeInTheDocument();
    expect(screen.getByText('claims.claimInformation.claimReceivedDateTime')).toBeInTheDocument();
    expect(screen.getByLabelText('claims.lossInformation.fromDate')).toBeInTheDocument();
    expect(screen.getByLabelText('claims.lossInformation.toDate')).toBeInTheDocument();
    expect(screen.getByLabelText('claims.claimInformation.location')).toBeInTheDocument();
    expect(screen.getByLabelText('claims.claimInformation.adjustorRef')).toBeInTheDocument();
    expect(screen.getByLabelText('claims.claimInformation.complexityBasis')).toBeInTheDocument();
    expect(screen.getByLabelText('claims.claimInformation.referral')).toBeInTheDocument();
    expect(screen.getByLabelText('claims.claimInformation.rfiResponse')).toBeInTheDocument();
    expect(screen.getByLabelText('claims.claimInformation.fguNarrative')).toBeInTheDocument();
    expect(screen.getByLabelText('claims.claimInformation.adjustorName')).toBeInTheDocument();
    expect(screen.getByLabelText('claims.claimInformation.beAdjuster')).toBeInTheDocument();
    expect(screen.getByLabelText('claims.claimInformation.nonBeAdjuster')).toBeInTheDocument();
    expect(screen.getByText('claims.claimInformation.adjustorType')).toBeInTheDocument();
  });
});
