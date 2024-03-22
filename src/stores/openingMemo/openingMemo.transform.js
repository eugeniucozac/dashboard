import * as constants from 'consts';
import sectionMappings from './openingMemo.mappings.json';

const transformOpeningMemoOutPOST = (openingMemo) => {
  return {
    placementType: null,
    notes: null,
    listOfRisks: null,
    policyId: null,
    authorisedSignatory: null,
    authorisedSignatoryApprovalDate: null,
    isAuthorisedSignatoryApproved: null,
    accountHandler: null,
    accountHandlerApprovalDate: null,
    isAccountHandlerApproved: null,
    producingBroker: null,
    accountExecutive: null,
    originator: null,
    placingBroker: null,
    lineItems: null,
    status: null,
    newRenewalBusinessId: null,
    reInsured: null,
    clientEmail: null,
    invoicingClient: null,
    clientContactName: null,
    eocInvoiceContactName: null,
    eocInvoiceEmail: null,
    inceptionDate: null,
    expiryDate: null,
    ...openingMemo,
  };
};

const transformOpeningMemoInPUT = (openingMemo = {}) => {
  const premiumCurrency = openingMemo.premiumCurrency;
  delete openingMemo.premiumCurrency;

  return {
    status: 'NOT_STARTED',
    ...openingMemo,
    lineItems: addTabKeyToListItems([
      ...(openingMemo.lineItems || []),
      ...(premiumCurrency ? [{ itemKey: 'retainedBrokerageAmount', premiumCurrency }] : []),
    ]),
  };
};

const transformOpeningMemoOutPUT = (changes, openingMemo = {}) => {
  const lineItems = mergeLineItemChanges(changes.lineItems, openingMemo.lineItems);

  // we reset the value of attachedTo unless we have a placementType DECLARATION
  const omAttachedTo = changes.placementType === constants.PLACEMENT_DECLARATION ? changes.attachedTo : '';

  // if changes don't includes lineItems (ex: only approvals are changed)
  // then the premiumCurrency wouldn't be retrieved from the changes.lineItems
  // so we get it from the current OM state as a fallback
  const omPremiumCurrency = getPremiumCurrencyFromLineItems(openingMemo.lineItems);

  return {
    ...openingMemo,
    ...changes,
    ...(typeof changes.placementType !== 'undefined' && { attachedTo: omAttachedTo }),
    premiumCurrency: getPremiumCurrencyFromLineItems(lineItems) || omPremiumCurrency,
    lineItems: lineItems.filter((item) => item.itemKey !== 'retainedBrokerageAmount'),
  };
};

const mergeLineItemChanges = (lineItemObj = {}, lineItemArr = []) => {
  const mergedLineItems = Object.keys(lineItemObj).map((lineItemKey) => {
    return {
      itemKey: lineItemKey,
      ...lineItemArr.find((item) => item.itemKey === lineItemKey),
      ...lineItemObj[lineItemKey],
    };
  });

  // Remove rows that are just presentational
  return mergedLineItems.filter((row) => !['total', 'splitAsFollows'].includes(row.itemKey));
};

const getPremiumCurrencyFromLineItems = (lineItems = []) => {
  return (lineItems.find((item) => item.itemKey === 'retainedBrokerageAmount') || {}).premiumCurrency;
};

const addTabKeyToListItems = (lineItems) => lineItems.map((item) => ({ ...item, tabKey: sectionMappings[item.itemKey] }));

export { transformOpeningMemoInPUT, transformOpeningMemoOutPUT, transformOpeningMemoOutPOST };
