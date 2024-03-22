import { transformOpeningMemoInPUT, transformOpeningMemoOutPUT } from './openingMemo.transform';
import merge from 'lodash/merge';

describe('OpeningMemo transform', () => {
  const omFromServer = {
    accountExecutive: { id: 901, fullName: 'bar baz' },
    accountHandler: { id: 939, fullName: 'foo bar' },
    accountHandlerApprovalDate: null,
    authorisedSignatory: null,
    authorisedSignatoryApprovalDate: null,
    clientEmail: null,
    id: 10,
    isAccountHandlerApproved: true,
    isAuthorisedApproved: null,
    lineItems: [
      {
        id: 7,
        itemKey: 'quotesPutUp',
        itemDate: null,
        accountHandler: 'YES',
        isAuthorised: true,
      },
      {
        id: 2,
        itemKey: 'allUnderwriter',
        itemDate: null,
        accountHandler: 'NA',
        isAuthorised: false,
      },
      {
        id: 3,
        itemKey: 'confirmSanctioned',
        itemDate: null,
        accountHandler: 'NO',
        isAuthorised: true,
      },
      {
        id: 8,
        itemKey: 'grossPremium',
        itemDate: null,
        accountHandler: '1000',
        isAuthorised: false,
      },
    ],
    listOfRisks: 'list of risks mock',
    newRenewalBusinessId: null,
    notes: 'notes mock',
    originator: null,
    placingBroker: null,
    policyId: 1234,
    premiumCurrency: 'USD',
    producingBroker: null,
    status: 'awaitingapproval',
    uniqueMarketReference: 'ABCD',
  };

  const omFromServerTransformed = {
    accountExecutive: { id: 901, fullName: 'bar baz' },
    accountHandler: { id: 939, fullName: 'foo bar' },
    accountHandlerApprovalDate: null,
    authorisedSignatory: null,
    authorisedSignatoryApprovalDate: null,
    clientEmail: null,
    id: 10,
    isAccountHandlerApproved: true,
    isAuthorisedApproved: null,
    lineItems: [
      {
        id: 7,
        itemKey: 'quotesPutUp',
        itemDate: null,
        accountHandler: 'YES',
        isAuthorised: true,
        tabKey: 'prePlacing',
      },
      {
        id: 2,
        itemKey: 'allUnderwriter',
        itemDate: null,
        accountHandler: 'NA',
        isAuthorised: false,
        tabKey: 'mrc',
      },
      {
        id: 3,
        itemKey: 'confirmSanctioned',
        itemDate: null,
        accountHandler: 'NO',
        isAuthorised: true,
        tabKey: 'other',
      },
      {
        id: 8,
        itemKey: 'grossPremium',
        itemDate: null,
        accountHandler: '1000',
        isAuthorised: false,
        tabKey: 'instructions',
      },
      {
        itemKey: 'retainedBrokerageAmount',
        premiumCurrency: 'USD',
        tabKey: 'instructions',
      },
    ],
    listOfRisks: 'list of risks mock',
    newRenewalBusinessId: null,
    notes: 'notes mock',
    originator: null,
    placingBroker: null,
    policyId: 1234,
    producingBroker: null,
    status: 'awaitingapproval',
    uniqueMarketReference: 'ABCD',
  };

  const omFromUIOriginal = {
    accountExecutive: { id: 901, fullName: 'bar baz' },
    accountHandler: { id: 939, fullName: 'foo bar' },
    accountHandlerApprovalDate: null,
    authorisedSignatory: null,
    authorisedSignatoryApprovalDate: null,
    clientEmail: null,
    id: 10,
    isAccountHandlerApproved: true,
    isAuthorisedApproved: null,
    lineItems: [
      {
        id: 7,
        itemKey: 'quotesPutUp',
        itemDate: null,
        accountHandler: 'YES',
        isAuthorised: true,
      },
      {
        id: 2,
        itemKey: 'allUnderwriter',
        itemDate: null,
        accountHandler: 'NA',
        isAuthorised: false,
      },
      {
        id: 3,
        itemKey: 'confirmSanctioned',
        itemDate: null,
        accountHandler: 'NO',
        isAuthorised: true,
      },
      {
        id: 8,
        itemKey: 'grossPremium',
        itemDate: null,
        accountHandler: '1000',
        isAuthorised: false,
      },
      {
        itemKey: 'retainedBrokerageAmount',
        premiumCurrency: 'USD',
      },
    ],
    listOfRisks: 'list of risks mock',
    newRenewalBusinessId: null,
    notes: 'notes mock',
    originator: null,
    placingBroker: null,
    policyId: 1234,
    producingBroker: null,
    status: 'awaitingapproval',
    uniqueMarketReference: 'ABCD',
  };

  const omFromUIChanges = {
    accountExecutive: { id: 901, fullName: 'bar baz' },
    accountHandler: { id: 939, fullName: 'foo baz' },
    accountHandlerApprovalDate: null,
    placementType: 'LINESLIP',
    attachedTo: 'TEST 123456',
    authorisedSignatory: null,
    authorisedSignatoryApprovalDate: null,
    clientEmail: null,
    id: 10,
    isAccountHandlerApproved: true,
    isAuthorisedApproved: null,
    lineItems: [
      {
        id: 7,
        itemKey: 'quotesPutUp',
        itemDate: null,
        accountHandler: 'NO',
        isAuthorised: true,
      },
      {
        id: 2,
        itemKey: 'allUnderwriter',
        itemDate: null,
        accountHandler: 'NA',
        isAuthorised: false,
      },
      {
        id: 3,
        itemKey: 'confirmSanctioned',
        itemDate: null,
        accountHandler: 'NO',
        isAuthorised: true,
      },
      {
        id: 8,
        itemKey: 'grossPremium',
        itemDate: null,
        accountHandler: '1000',
        isAuthorised: false,
      },
      {
        itemKey: 'retainedBrokerageAmount',
        premiumCurrency: 'CAD',
      },
    ],
    listOfRisks: 'list of risks mock',
    newRenewalBusinessId: null,
    notes: 'notes mock',
    originator: null,
    placingBroker: null,
    policyId: 1234,
    producingBroker: null,
    status: 'awaitingapproval',
    uniqueMarketReference: 'ABCD',
  };

  const omFromUITransformed = {
    accountExecutive: { id: 901, fullName: 'bar baz' },
    accountHandler: { id: 939, fullName: 'foo baz' },
    accountHandlerApprovalDate: null,
    placementType: 'LINESLIP',
    attachedTo: '',
    authorisedSignatory: null,
    authorisedSignatoryApprovalDate: null,
    clientEmail: null,
    id: 10,
    isAccountHandlerApproved: true,
    isAuthorisedApproved: null,
    lineItems: [
      {
        id: 7,
        itemKey: 'quotesPutUp',
        itemDate: null,
        accountHandler: 'NO',
        isAuthorised: true,
      },
      {
        id: 2,
        itemKey: 'allUnderwriter',
        itemDate: null,
        accountHandler: 'NA',
        isAuthorised: false,
      },
      {
        id: 3,
        itemKey: 'confirmSanctioned',
        itemDate: null,
        accountHandler: 'NO',
        isAuthorised: true,
      },
      {
        id: 8,
        itemKey: 'grossPremium',
        itemDate: null,
        accountHandler: '1000',
        isAuthorised: false,
      },
    ],
    listOfRisks: 'list of risks mock',
    newRenewalBusinessId: null,
    notes: 'notes mock',
    originator: null,
    placingBroker: null,
    policyId: 1234,
    premiumCurrency: 'CAD',
    producingBroker: null,
    status: 'awaitingapproval',
    uniqueMarketReference: 'ABCD',
  };

  describe('transformIn', () => {
    it('transforms opening memo from server', () => {
      // arrange
      const transformed = transformOpeningMemoInPUT(omFromServer);

      // assert
      expect(transformed).toEqual(omFromServerTransformed);
    });

    it('creates empty opening memo', () => {
      // arrange
      const openingMemo = {};
      const transformed = transformOpeningMemoInPUT(openingMemo);
      const expected = {
        lineItems: [],
        status: 'NOT_STARTED',
      };

      // assert
      expect(transformed).toEqual(expected);
    });
  });

  describe('transformOut', () => {
    it('transforms opening memo from UI to server', () => {
      // arrange
      const transformed = transformOpeningMemoOutPUT(omFromUIChanges, omFromUIOriginal);

      // assert
      expect(transformed).toEqual(omFromUITransformed);
    });

    it('transforms opening memo from UI to server with placement type DECLARATION', () => {
      // arrange
      const transformed = transformOpeningMemoOutPUT(merge({}, omFromUIChanges, { placementType: 'DECLARATION' }), omFromUIOriginal);

      // assert
      expect(transformed).toEqual(
        merge({}, omFromUITransformed, {
          placementType: 'DECLARATION',
          attachedTo: 'TEST 123456',
        })
      );
    });
  });
});
