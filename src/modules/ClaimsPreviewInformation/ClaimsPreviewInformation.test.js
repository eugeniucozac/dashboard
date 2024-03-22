import React from 'react';
import { render, screen } from 'tests';
import ClaimsPreviewInformation from './ClaimsPreviewInformation';
import fetchMock from 'fetch-mock';

beforeEach(() => {
  // fetchMock.get('glob:*api/data/gui/cat-codes*', {
  //     body: {
  //         content: [
  //             { id: '1', name: 'Client Bar' },
  //             { id: '2', name: 'Client Foo' },
  //         ],
  //     },
  // });
  // fetchMock.get('glob:*api/data/gui/loss-qualifiers*', {
  //     body: {
  //         content: [
  //             { id: '1', name: 'Various' },
  //             { id: '2', name: 'PGT' },
  //         ],
  //     },
  // });
  // fetchMock.get('glob:*api/data/policy/*/source/*/details*', {
  //     body: {
  //         content: {
  //             xbPolicyID: 2995,
  //             xbInstanceID: 1,
  //             policyRef: 'E13NY15430',
  //             insured: 'Lake Oswego Corporation',
  //             inceptionDate: '31/12/2013',
  //             expiryDate: '31/12/2014',
  //             company: 'XB_London',
  //             division: 'Equinox',
  //             policyType: 'Facultative',
  //             client: 'AmWINS Brokerage Of California',
  //             originalCurrency: 'USD',
  //             policyNote: 'Buildings, Contents and as Wdg'
  //         },
  //     },
  // });
  // fetchMock.get('glob:*api/data/claims/*/detail*', {
  //     body: {
  //         content: {
  //             xbPolicyID: 2995,
  //             xbInstanceID: 1,
  //             policyRef: 'E13NY15430',
  //             insured: 'Lake Oswego Corporation',
  //             inceptionDate: '31/12/2013',
  //             expiryDate: '31/12/2014',
  //             company: 'XB_London',
  //             division: 'Equinox',
  //             policyType: 'Facultative',
  //             client: 'AmWINS Brokerage Of California',
  //             originalCurrency: 'USD',
  //             policyNote: 'Buildings, Contents and as Wdg'
  //         },
  //     },
  // });
});

afterEach(() => {
  fetchMock.restore();
});

const renderClaimsPreviewInformation = (props, renderOptions) => {
  const componentProps = {
    ...props,
    catCodes: [
      { id: '11', name: '17H' },
      { id: '12', name: '13H' },
      { id: '13', name: '14H' },
    ],
    lossQualifiers: [
      { id: '1', name: 'Various' },
      { id: '2', name: 'PGT' },
    ],
    lossInformation: {
      catCodesID: 11,
      firstContactDate: '2021-06-07T23:00:00.000+00:00',
      isActive: 1,
      lossDescription: 'XYZ',
      lossDetailID: 1391,
      lossName: 'lossName data',
      lossQualifierId: 2,
      fromDate: '2021-06-07T23:00:00.000+00:00',
      toDate: '2021-06-07T23:00:00.000+00:00',
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
    policyInformation: {
      xbPolicyID: 2995,
      xbInstanceID: 1,
      policyRef: 'E13NY15430',
      insured: 'Lake Oswego Corporation',
      inceptionDate: '31/12/2013',
      expiryDate: '31/12/2014',
      company: 'XB_London',
      division: 'Equinox',
      policyType: 'Facultative',
      client: 'AmWINS Brokerage Of California',
      originalCurrency: 'USD',
      policyNote: 'Buildings, Contents and as Wdg',
    },
    columns: [
      { id: 'groupRef', label: 'Group Ref' },
      { id: 'percentage', label: 'Percentage' },
      { id: 'facility', label: 'Facility' },
      { id: 'facilityRef', label: 'Facility Ref' },
      { id: 'slipLeader', label: 'Slip Leader' },
      { id: 'narrative', label: 'Narrative' },
      { id: 'dateValidFrom', label: 'Date Valid From' },
      { id: 'dateValidTo', label: 'Date Valid To' },
    ],
    claimInformation: {
      claimant: 'Lake Oswego Corporation',
      status: 'DRAFT',
      claimRef: null,
      lossQualifierName: 'Various',
      lossDateFrom: '2021-05-24T14:48:00Z',
      lossDateTo: '2021-05-26T14:48:00Z',
      adjusterName: 298568,
      adjusterRef: '',
      priority: 'Medium',
      settlementCurrency: 'USD',
      interest: 'DC',
      complexity: null,
      referral: null,
      location: '123 brand budapest Hotel, Paris',
      fguNarrative: 'by self admission',
      processNotes: 'Some Notes',
      basisOfOrder: 'CLAIM 0%',
      orderPercentage: 100,
      certificateNumber: 'ABDC12345',
      certificateInceptionDate: '2021-03-01T00:00:00.000+00:00',
      certificateExpiryDate: '2022-02-28T00:00:00.000+00:00',
      isBordereau: 1,
      underWritingGroupData: [],
      documentInfo: {
        firmOrder: { name: 'Filename1.pdf', type: 'pdf' },
        processingInstructions: { name: 'Filename2.pdf', type: 'pdf' },
        transactionSheets: { name: 'Filename3.html', type: 'html' },
      },
    },
  };

  render(<ClaimsPreviewInformation {...componentProps} />, renderOptions);

  return {
    componentProps,
  };
};

// const renderPreviewClaimsFixedBottomBar = (props, renderOptions) => {
//     const componentProps = {
//         ...props,
//         policyRef: 'PN22222',
//         isAllStepsCompleted: false,
//         handleCancel: jest.fn(),
//         handleFinish: jest.fn(),
//         handleNext: jest.fn(),
//         handleBack: jest.fn(),
//         handleSave: jest.fn(),
//     };

//     render(<ClaimsPreviewInformation {...componentProps} />, renderOptions);
// };

describe('MODULES › ClaimsPreviewInformation', () => {
  const originalWarn = console.warn;
  afterEach(() => (console.warn = originalWarn));

  const mockedWarn = () => {};
  beforeEach(() => (console.warn = mockedWarn));

  describe('@render', () => {
    it('renders without crashing', () => {
      // arrange
      renderClaimsPreviewInformation();

      // assert
      expect(screen.getByText('claims.lossInformation.title')).toBeInTheDocument();
    });
    it('renders row labels', () => {
      // arrange
      renderClaimsPreviewInformation();

      // assert
      // Loss card
      expect(screen.getByText('claims.lossInformation.title')).toBeInTheDocument();
      expect(screen.getByText('claims.lossInformation.ref')).toBeInTheDocument();
      expect(screen.getByText('claims.lossInformation.name')).toBeInTheDocument();
      expect(screen.getByText('claims.lossInformation.details')).toBeInTheDocument();
      expect(screen.getByText('claims.lossInformation.catCode')).toBeInTheDocument();
      expect(screen.getByText('claims.lossInformation.dateAndTime')).toBeInTheDocument();
      // Claim card
      expect(screen.getByText('claims.claimInformation.title')).toBeInTheDocument();
      expect(screen.getByText('claims.claimInformation.claimant')).toBeInTheDocument();
      expect(screen.getByText('claims.claimInformation.claimRef')).toBeInTheDocument();
      expect(screen.getByText('claims.claimInformation.status')).toBeInTheDocument();
      expect(screen.getByText('claims.claimInformation.adjustorName')).toBeInTheDocument();
      expect(screen.getByText('claims.claimInformation.adjustorRefShort')).toBeInTheDocument();
      expect(screen.getByText('claims.claimInformation.priority')).toBeInTheDocument();
      expect(screen.getByText('claims.claimInformation.settlementCurrency')).toBeInTheDocument();
      expect(screen.getByText('claims.claimInformation.complexity')).toBeInTheDocument();
      expect(screen.getByText('claims.claimInformation.referral')).toBeInTheDocument();
      expect(screen.getByText('claims.claimInformation.location')).toBeInTheDocument();
      expect(screen.getByText('claims.claimInformation.fguNarrative')).toBeInTheDocument();
      expect(screen.getByText('claims.claimInformation.claimReceivedDateTime')).toBeInTheDocument();

      // expect(screen.getByText('claims.claimInformation.certificateNumber')).toBeInTheDocument();
      // expect(screen.getByText('claims.claimInformation.certificateInceptionDate')).toBeInTheDocument();
      // expect(screen.getByText('claims.claimInformation.certificateExpiryDate')).toBeInTheDocument();
      // settlement section
      expect(screen.getByText('claims.movementInformation.type')).toBeInTheDocument();
      expect(screen.getByText('claims.typeOfSettlement.orderBasis')).toBeInTheDocument();
      // Underwriting section
      expect(screen.getByText('claims.underWritingGroups.infoTitle')).toBeInTheDocument();
    });

    // it('renders bottombar button properly', () => {
    //     // arrange
    //     renderPreviewClaimsFixedBottomBar({
    //         activeStep: 3,
    //         save: true,
    //         next: true,
    //         cancel: true
    //     });

    //     // assert
    //     // expect(screen.getByRole('button', { name: 'app.go' })).toBeInTheDocument();
    //     expect(screen.getByRole('button', { name: 'Next' })).not.toBeInTheDocument();
    //     expect(screen.getByRole('button', { name: 'Next' })).not.toBeEnabled();
    //     expect(screen.getByRole('button', { name: 'app.cancel' })).toBeEnabled();
    //     expect(screen.getByRole('button', { name: 'app.save' })).not.toBeEnabled();
    //     expect(screen.getByRole('button', { name: 'app.back' })).toBeInTheDocument();
    //     expect(screen.getByRole('button', { name: 'app.back' })).toBeEnabled();
    // });
  });
});
