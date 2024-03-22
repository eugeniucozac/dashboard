import React from 'react';
import EnterClaimCardInformation from './EnterClaimCardInformation';
import { render, getFormAutocompleteMui, getFormDatepicker, getFormSelect, getFormText } from 'tests';

const props = {
  policyInformation: {
    policyRef: 'E13NY15400',
    insured: 'Lakewood Villa Condo',
    inceptionDate: '29/12/2013',
    expiryDate: '29/12/2014',
    company: 'XB_London',
    division: 'Equinox',
    policyType: 'Facultative',
    client: 'CRC Insurance Services Inc',
    originalCurrency: 'USD',
    policyNote: 'Buildings and as Wdg',
  },
  claimantNames: [
    {
      id: 1,
      name: 'Lakewood Villa Condo',
    },
  ],
};

const renderEnterClaimCardInformation = () => {
  return render(<EnterClaimCardInformation {...props} />);
};

describe('COMPONENTS › EnterClaimCardInformation', () => {
  const originalWarn = console.warn;
  afterEach(() => (console.warn = originalWarn));

  const mockedWarn = () => {};
  beforeEach(() => (console.warn = mockedWarn));

  it('renders without crashing', () => {
    // arrange
    // const { container } = renderEnterClaimCardInformation();
    // assert
    // expect(container).toBeInTheDocument();
  });

  it('renders the form', () => {
    // arrange
    // const { getByTestId } = renderEnterClaimCardInformation();
    // assert
    // expect(getByTestId('form-claimcard-information')).toBeInTheDocument();
  });

  it('renders the Autocomplete input', () => {
    // arrange
    // const { container, getByText } = renderEnterClaimCardInformation();
    // assert
    //expect(getByText('claims.claimInformation.claimant')).toBeInTheDocument();
    //expect(container.querySelector(getFormAutocompleteMui('claimantAutocomplete'))).toBeInTheDocument();
  });

  it('renders the Loss from and to date inputs', () => {
    // arrange
    // const { container, getByText } = renderEnterClaimCardInformation();
    // assert
    // expect(getByText('claims.lossInformation.fromDate')).toBeInTheDocument();
    // expect(container.querySelector(getFormDatepicker('fromDate'))).toBeInTheDocument();
    // expect(getByText('claims.lossInformation.toDate')).toBeInTheDocument();
    // expect(container.querySelector(getFormDatepicker('toDate'))).toBeInTheDocument();
  });

  it('renders rfl response options', () => {
    // arrange
    // const { container, getByText } = renderEnterClaimCardInformation();
    // assert
    //expect(container.querySelector(getFormSelect('rfiResponse'))).toBeInTheDocument();
  });

  it('renders the claim Information fields', () => {
    //arrange
    // const { container } = renderEnterClaimCardInformation();
    // assert
    /* 
    expect(container.querySelector(getFormSelect('settlementCurrency'))).toBeInTheDocument();
    expect(container.querySelector(getFormText('interest'))).toBeInTheDocument();
    expect(container.querySelector(getFormSelect('complexity'))).toBeInTheDocument();
    expect(container.querySelector(getFormSelect('adjustorName'))).toBeInTheDocument();
    expect(container.querySelector(getFormText('adjustorRef'))).toBeInTheDocument();
    expect(container.querySelector(getFormSelect('lossQualifierId'))).toBeInTheDocument();
    expect(container.querySelector(getFormText('adjustorRef'))).toBeInTheDocument();
    expect(container.querySelector(getFormText('fguNarrative'))).toBeInTheDocument();
    expect(container.querySelector(getFormText('processNotes'))).toBeInTheDocument();
    expect(container.querySelector(getFormSelect('referral'))).toBeInTheDocument(); 
    expect(container.querySelector(getFormAutocompleteMui('beAdjuster'))).toBeInTheDocument();
    expect(container.querySelector(getFormSelect('adjuster'))).toBeInTheDocument();
    expect(container.querySelector(getFormText('nonBeAdjuster'))).toBeInTheDocument();
    */
  });
});
