import MockDate from 'mockdate';
import merge from 'lodash/merge';

// app
import { getData } from './OpeningMemo.pdf.helpers';

describe('OpeningMemo.pdf.helpers', () => {
  beforeEach(() => {
    MockDate.set('2020');
  });

  afterEach(() => {
    MockDate.reset();
  });

  const inputProps = {
    openingMemo: {
      accountExecutive: { id: 4444, fullName: 'Gracie-Mai Watts' },
      accountHandler: { id: 2222, fullName: 'Allana Gillespie' },
      accountHandlerApprovalDate: '2020-03-04T15:44:06.592+0000',
      attachedTo: 'TEST 1234',
      authorisedSignatory: { id: 1111, fullName: 'Clarke Martins' },
      authorisedSignatoryApprovalDate: '2020-03-04T15:44:10.338+0000',
      clientContactName: 'John Smith',
      clientEmail: 'john.smith@test.com',
      eocInvoiceContactName: 'Jane Smith',
      eocInvoiceEmail: 'jane.smith@test.com',
      expiryDate: '2021-03-07',
      id: 58,
      inceptionDate: '2020-03-07',
      invoicingClient: 'CRC Insurance Services Inc (3223900C)',
      isAccountHandlerApproved: true,
      isAuthorisedSignatoryApproved: true,
      lineItems: [
        {
          id: 1,
          itemKey: 'quotesPutUp',
          itemDate: '2020-03-17T00:00:00.000+0000',
          accountHandler: 'NO',
          isAuthorised: false,
          tabKey: 'prePlacing',
        },
        {
          id: 2,
          itemKey: 'dutyOfDisclosure',
          itemDate: '2020-04-17T00:00:00.000+0000',
          accountHandler: 'NA',
          isAuthorised: false,
          tabKey: 'prePlacing',
        },
        {
          id: 3,
          itemKey: 'demandsNeeds',
          itemDate: null,
          accountHandler: 'NO',
          isAuthorised: true,
          tabKey: 'prePlacing',
        },
        {
          id: 4,
          itemKey: 'slipsSigned',
          itemDate: null,
          accountHandler: 'YES',
          isAuthorised: true,
          tabKey: 'prePlacing',
        },
        {
          id: 5,
          itemKey: 'evidence',
          itemDate: '2020-02-17T00:00:00.000+0000',
          accountHandler: 'YES',
          isAuthorised: true,
          tabKey: 'prePlacing',
        },
        {
          id: 6,
          itemKey: 'atlas',
          itemDate: null,
          accountHandler: 'NA',
          isAuthorised: false,
          tabKey: 'prePlacing',
        },
        {
          id: 7,
          itemKey: 'bars',
          itemDate: null,
          accountHandler: 'NO',
          isAuthorised: true,
          tabKey: 'prePlacing',
        },
        {
          id: 8,
          itemKey: 'allWrittenLines',
          itemDate: null,
          accountHandler: 'YES',
          isAuthorised: true,
          tabKey: 'mrc',
        },
        {
          id: 9,
          itemKey: 'allUnderwriter',
          itemDate: null,
          accountHandler: 'YES',
          isAuthorised: true,
          tabKey: 'mrc',
        },
        {
          id: 10,
          itemKey: 'informationClearlyStated',
          itemDate: null,
          accountHandler: 'NA',
          isAuthorised: false,
          tabKey: 'mrc',
        },
        {
          id: 11,
          itemKey: 'allMarketsApproved',
          itemDate: null,
          accountHandler: 'YES',
          isAuthorised: true,
          tabKey: 'mrc',
        },
        {
          id: 12,
          itemKey: 'paymentTerms',
          itemDate: null,
          accountHandler: 'NO',
          isAuthorised: false,
          tabKey: 'mrc',
        },
        {
          id: 13,
          itemKey: 'subscriptionAgreement',
          itemDate: null,
          accountHandler: 'YES',
          isAuthorised: true,
          tabKey: 'mrc',
        },
        {
          id: 14,
          itemKey: 'riskCodes',
          itemDate: null,
          accountHandler: 'YES',
          isAuthorised: true,
          tabKey: 'mrc',
        },
        {
          id: 15,
          itemKey: 'marketSheet',
          itemDate: null,
          accountHandler: 'YES',
          isAuthorised: true,
          tabKey: 'other',
        },
        {
          id: 16,
          itemKey: 'confirmSanctioned',
          itemDate: null,
          accountHandler: 'YES',
          isAuthorised: false,
          tabKey: 'other',
        },
        {
          id: 17,
          itemKey: 'thirdParty',
          itemDate: null,
          accountHandler: 'YES',
          isAuthorised: false,
          tabKey: 'other',
        },
        {
          id: 18,
          itemKey: 'contractCertainty',
          itemDate: null,
          accountHandler: 'YES',
          isAuthorised: true,
          tabKey: 'other',
        },
        {
          id: 19,
          itemKey: 'premiumTax',
          itemDate: null,
          accountHandler: 'YES',
          isAuthorised: false,
          tabKey: 'instructions',
        },
        {
          id: 20,
          itemKey: 'signedLines',
          itemDate: null,
          accountHandler: 'NO',
          isAuthorised: true,
          tabKey: 'instructions',
        },
        {
          id: 21,
          itemKey: 'grossPremium',
          itemDate: null,
          accountHandler: 124230,
          isAuthorised: true,
          tabKey: 'instructions',
        },
        {
          id: 22,
          itemKey: 'slipOrder',
          itemDate: null,
          accountHandler: 100,
          isAuthorised: true,
          tabKey: 'instructions',
        },
        {
          id: 23,
          itemKey: 'totalBrokerage',
          itemDate: null,
          accountHandler: 50.5,
          isAuthorised: false,
          tabKey: 'instructions',
        },
        {
          id: 24,
          itemKey: 'totalClientDiscount',
          itemDate: null,
          accountHandler: 10,
          isAuthorised: false,
          tabKey: 'instructions',
        },
        {
          id: 25,
          itemKey: 'totalThirdParty',
          itemDate: null,
          accountHandler: 20,
          isAuthorised: true,
          tabKey: 'instructions',
        },
        {
          id: 26,
          itemKey: 'thirdPartyName',
          itemDate: null,
          accountHandler: 'Test Name',
          isAuthorised: true,
          tabKey: 'instructions',
        },
        {
          id: 27,
          itemKey: 'totalPfInternal',
          itemDate: null,
          accountHandler: 30,
          isAuthorised: false,
          tabKey: 'instructions',
        },
        {
          id: 28,
          itemKey: 'pfInternalDepartment',
          itemDate: null,
          accountHandler: 'Test Department',
          isAuthorised: false,
          tabKey: 'instructions',
        },
        {
          id: 29,
          itemKey: 'totalRetainedBrokerage',
          itemDate: null,
          accountHandler: 3.75,
          isAuthorised: true,
          tabKey: 'instructions',
        },
        {
          id: 30,
          itemKey: 'fees',
          itemDate: null,
          accountHandler: 120,
          isAuthorised: true,
          tabKey: 'instructions',
        },
        {
          id: 31,
          itemKey: 'otherDeductions',
          itemDate: null,
          accountHandler: 240,
          isAuthorised: true,
          tabKey: 'instructions',
        },
        {
          id: 32,
          itemKey: 'settlementCurrency',
          itemDate: null,
          accountHandler: '142',
          isAuthorised: true,
          tabKey: 'instructions',
        },
        {
          id: 33,
          itemKey: 'paymentBasis',
          itemDate: null,
          accountHandler: 'QUARTERLY',
          isAuthorised: false,
          tabKey: 'instructions',
        },
        {
          id: 34,
          itemKey: 'ppwPPC',
          itemDate: null,
          accountHandler: 'PPW',
          isAuthorised: false,
          tabKey: 'instructions',
        },
        {
          id: 35,
          itemKey: 'retainedBrokerageAmount',
          premiumCurrency: 'CAD',
        },
      ],
      listOfRisks: 'list of risks mock',
      newRenewalBusinessId: 3,
      notes: 'notes mock',
      originator: { id: 5555, fullName: 'Mandeep Lam' },
      placementType: 'OPEN_MARKET',
      placingBroker: { id: 6666, fullName: 'Marni Ritter' },
      policyId: 99382,
      producingBroker: { id: 3333, fullName: 'Haroon Yates' },
      reInsured: 'Myrtle Beach Properties',
      status: 'APPROVED',
      uniqueMarketReference: 'UMRK34535',
    },
    departmentName: 'Property & Casualty',
    referenceData: {
      newRenewalBusinesses: [
        {
          id: 3,
          code: 'NB',
          description: 'New Business',
          newRenewalType: 'N',
        },
      ],
    },
  };

  it('should create the PDF', () => {
    // act
    const { tableHeader, summaryBody, checklistBody, instructionBody, specialBody, approvalBody } = getData(inputProps);

    // assert
    expect(tableHeader).toEqual([
      [
        'placement.openingMemo.columnNames.detail',
        'placement.openingMemo.columnNames.accountHandler',
        'placement.openingMemo.columnNames.isAuthorised',
      ],
    ]);
    expect(summaryBody).toEqual([
      ['placement.openingMemo.riskReference', 'UMRK34535'],
      ['placement.openingMemo.summary.rows.placementType.label', 'form.options.placementType.open_market'],
      ['', ''],
      ['placement.openingMemo.summary.rows.newRenewalBusinessId.label', 'New Business'],
      ['placement.openingMemo.summary.rows.department.label', 'Property & Casualty'],
      ['placement.openingMemo.summary.rows.reInsured.label', 'Myrtle Beach Properties'],
      ['placement.openingMemo.summary.rows.period.label', 'format.date(2020-03-07) - format.date(2021-03-07)'],
      ['', ''],
      ['placement.openingMemo.summary.rows.invoicingClient.label', 'CRC Insurance Services Inc (3223900C)'],
      ['placement.openingMemo.summary.rows.clientContactName.label', 'John Smith'],
      ['placement.openingMemo.summary.rows.clientEmail.label', 'john.smith@test.com'],
      ['placement.openingMemo.summary.rows.eocInvoiceContactName.label', 'Jane Smith'],
      ['placement.openingMemo.summary.rows.eocInvoiceEmail.label', 'jane.smith@test.com'],
      ['', ''],
      ['placement.openingMemo.specialInstructions.producingBroker.label', 'Haroon Yates'],
      ['placement.openingMemo.specialInstructions.accountExecutive.label', 'Gracie-Mai Watts'],
      ['placement.openingMemo.specialInstructions.placingBroker.label', 'Marni Ritter'],
      ['placement.openingMemo.specialInstructions.originator.label', 'Mandeep Lam'],
    ]);
    expect(checklistBody[0]).toEqual([{ colSpan: 3, content: 'placement.openingMemo.prePlacing.label' }]);
    expect(checklistBody[1]).toEqual([
      'placement.openingMemo.prePlacing.rows.quotesPutUp.label (format.date(2020-03-17T00:00:00.000+0000))',
      'form.options.yesNoNa.no',
      '-',
    ]);
    expect(checklistBody[2]).toEqual([
      'placement.openingMemo.prePlacing.rows.dutyOfDisclosure.label (format.date(2020-04-17T00:00:00.000+0000))',
      'form.options.yesNoNa.na',
      '-',
    ]);
    expect(checklistBody[3]).toEqual([
      'placement.openingMemo.prePlacing.rows.demandsNeeds.label',
      'form.options.yesNoNa.no',
      'app.authorised',
    ]);
    expect(checklistBody[4]).toEqual([
      'placement.openingMemo.prePlacing.rows.slipsSigned.label',
      'form.options.yesNoNa.yes',
      'app.authorised',
    ]);
    expect(checklistBody[5]).toEqual([
      'placement.openingMemo.prePlacing.rows.evidence.label (format.date(2020-02-17T00:00:00.000+0000))',
      'form.options.yesNoNa.yes',
      'app.authorised',
    ]);
    expect(checklistBody[6]).toEqual(['placement.openingMemo.prePlacing.rows.atlas.label', 'form.options.yesNoNa.na', '-']);
    expect(checklistBody[7]).toEqual(['placement.openingMemo.prePlacing.rows.bars.label', 'form.options.yesNoNa.no', 'app.authorised']);
    expect(checklistBody[8]).toEqual([{ colSpan: 3, content: 'placement.openingMemo.mrc.label' }]);
    expect(checklistBody[9]).toEqual([
      'placement.openingMemo.mrc.rows.allWrittenLines.label',
      'form.options.yesNoNa.yes',
      'app.authorised',
    ]);
    expect(checklistBody[10]).toEqual([
      'placement.openingMemo.mrc.rows.allUnderwriter.label',
      'form.options.yesNoNa.yes',
      'app.authorised',
    ]);
    expect(checklistBody[11]).toEqual(['placement.openingMemo.mrc.rows.informationClearlyStated.label', 'form.options.yesNoNa.na', '-']);
    expect(checklistBody[12]).toEqual([
      'placement.openingMemo.mrc.rows.allMarketsApproved.label',
      'form.options.yesNoNa.yes',
      'app.authorised',
    ]);
    expect(checklistBody[13]).toEqual(['placement.openingMemo.mrc.rows.paymentTerms.label', 'form.options.yesNoNa.no', '-']);
    expect(checklistBody[14]).toEqual([
      'placement.openingMemo.mrc.rows.subscriptionAgreement.label',
      'form.options.yesNoNa.yes',
      'app.authorised',
    ]);
    expect(checklistBody[15]).toEqual(['placement.openingMemo.mrc.rows.riskCodes.label', 'form.options.yesNoNa.yes', 'app.authorised']);
    expect(checklistBody[16]).toEqual([{ colSpan: 3, content: 'placement.openingMemo.other.label' }]);
    expect(checklistBody[17]).toEqual(['placement.openingMemo.other.rows.marketSheet.label', 'form.options.yesNoNa.yes', 'app.authorised']);
    expect(checklistBody[18]).toEqual(['placement.openingMemo.other.rows.confirmSanctioned.label', 'form.options.yesNoNa.yes', '-']);
    expect(checklistBody[19]).toEqual(['placement.openingMemo.other.rows.thirdParty.label', 'form.options.yesNoNa.yes', '-']);
    expect(checklistBody[20]).toEqual([
      'placement.openingMemo.other.rows.contractCertainty.label',
      'form.options.yesNoNa.yes',
      'app.authorised',
    ]);
    expect(instructionBody[0]).toEqual([{ colSpan: 3, content: 'placement.openingMemo.instructions.subHeader' }]);
    expect(instructionBody[1]).toEqual(['placement.openingMemo.instructions.rows.premiumTax.label', 'form.options.yesNoNa.yes', '-']);
    expect(instructionBody[2]).toEqual([
      'placement.openingMemo.instructions.rows.signedLines.label',
      'form.options.yesNoNa.no',
      'app.authorised',
    ]);
    expect(instructionBody[3]).toEqual(['placement.openingMemo.instructions.rows.grossPremium.label', 124230, 'app.authorised']);
    expect(instructionBody[4]).toEqual(['placement.openingMemo.instructions.rows.slipOrder.label', 100, 'app.authorised']);
    expect(instructionBody[5]).toEqual(['placement.openingMemo.instructions.rows.totalBrokerage.label', 50.5, '-']);
    expect(instructionBody[6]).toEqual(['placement.openingMemo.instructions.rows.splitAsFollows.label', undefined, '-']);
    expect(instructionBody[7]).toEqual(['placement.openingMemo.instructions.rows.totalClientDiscount.label', 10, '-']);
    expect(instructionBody[8]).toEqual(['placement.openingMemo.instructions.rows.totalThirdParty.label', 20, 'app.authorised']);
    expect(instructionBody[9]).toEqual(['placement.openingMemo.instructions.rows.thirdPartyName.label', 'Test Name', 'app.authorised']);
    expect(instructionBody[10]).toEqual(['placement.openingMemo.instructions.rows.totalPfInternal.label', 30, '-']);
    expect(instructionBody[11]).toEqual(['placement.openingMemo.instructions.rows.pfInternalDepartment.label', 'Test Department', '-']);
    expect(instructionBody[12]).toEqual(['placement.openingMemo.instructions.rows.totalRetainedBrokerage.label', 3.75, 'app.authorised']);
    expect(instructionBody[13]).toEqual([
      'placement.openingMemo.instructions.rows.retainedBrokerageAmount.label',
      'CAD 4658.62 / GBP 2662.06 @ format.number(1.75)',
      '-',
    ]);
    expect(instructionBody[14]).toEqual(['placement.openingMemo.instructions.rows.total.label', 63.75, '-']);
    expect(instructionBody[15]).toEqual(['placement.openingMemo.instructions.rows.fees.label', 120, 'app.authorised']);
    expect(instructionBody[16]).toEqual(['placement.openingMemo.instructions.rows.otherDeductions.label', 240, 'app.authorised']);
    expect(instructionBody[17]).toEqual(['placement.openingMemo.instructions.rows.settlementCurrency.label', '', 'app.authorised']);
    expect(instructionBody[18]).toEqual([
      'placement.openingMemo.instructions.rows.paymentBasis.label',
      'form.options.paymentBasis.quarterly',
      '-',
    ]);
    expect(instructionBody[19]).toEqual(['placement.openingMemo.instructions.rows.ppwPPC.label', 'form.options.ppwPPC.ppw', '-']);
    expect(specialBody[0]).toEqual([{ colSpan: 2, content: 'notes mock' }]);
    expect(specialBody[1]).toEqual([{ colSpan: 2, content: 'list of risks mock' }]);
    expect(approvalBody[0]).toEqual(['Allana Gillespie', 'Clarke Martins']);
    expect(approvalBody[1]).toEqual([
      'app.approved: format.date(2020-03-04T15:44:06.592+0000)',
      'app.approved: format.date(2020-03-04T15:44:10.338+0000)',
    ]);
  });

  it('should create the specific PDF summary for type DECLARATION', () => {
    // act
    const { summaryBody } = getData(merge({}, inputProps, { openingMemo: { placementType: 'DECLARATION' } }));

    // assert
    expect(summaryBody).toEqual([
      ['placement.openingMemo.riskReference', 'UMRK34535'],
      ['placement.openingMemo.summary.rows.placementType.label', 'form.options.placementType.declaration'],
      ['placement.openingMemo.summary.rows.attachedTo.label', 'TEST 1234'],
      ['', ''],
      ['placement.openingMemo.summary.rows.newRenewalBusinessId.label', 'New Business'],
      ['placement.openingMemo.summary.rows.department.label', 'Property & Casualty'],
      ['placement.openingMemo.summary.rows.reInsured.label', 'Myrtle Beach Properties'],
      ['placement.openingMemo.summary.rows.period.label', 'format.date(2020-03-07) - format.date(2021-03-07)'],
      ['', ''],
      ['placement.openingMemo.summary.rows.invoicingClient.label', 'CRC Insurance Services Inc (3223900C)'],
      ['placement.openingMemo.summary.rows.clientContactName.label', 'John Smith'],
      ['placement.openingMemo.summary.rows.clientEmail.label', 'john.smith@test.com'],
      ['placement.openingMemo.summary.rows.eocInvoiceContactName.label', 'Jane Smith'],
      ['placement.openingMemo.summary.rows.eocInvoiceEmail.label', 'jane.smith@test.com'],
      ['', ''],
      ['placement.openingMemo.specialInstructions.producingBroker.label', 'Haroon Yates'],
      ['placement.openingMemo.specialInstructions.accountExecutive.label', 'Gracie-Mai Watts'],
      ['placement.openingMemo.specialInstructions.placingBroker.label', 'Marni Ritter'],
      ['placement.openingMemo.specialInstructions.originator.label', 'Mandeep Lam'],
    ]);
  });
});
