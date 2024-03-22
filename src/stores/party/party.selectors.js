import { createSelector } from 'reselect';
import get from 'lodash/get';
import orderBy from 'lodash/orderBy';
import * as utils from 'utils';

export const selectPartyInsuredsSorted = createSelector(
  (state) => get(state, 'party.insureds.items') || [],
  (items) => orderBy(items, ['name'], ['asc'])
);

export const selectPartyInsuredsPagination = (state) => {
  const insureds = get(state, 'party.insureds') || {};

  return utils.generic.getPagination(insureds);
};

export const selectPartyReinsuredsSorted = createSelector(
  (state) => get(state, 'party.reinsureds.items') || [],
  (items) => orderBy(items, ['name'], ['asc'])
);

export const selectPartyReInsuredsPagination = (state) => {
  const reInsureds = get(state, 'party.reinsureds') || {};

  return utils.generic.getPagination(reInsureds);
};

export const selectPartyCarriersSorted = createSelector(
  (state) => get(state, 'party.carriers.items') || [],
  (items) => orderBy(items, ['name'], ['asc'])
);

export const selectPartyClientsSorted = createSelector(
  (state) => get(state, 'party.clients.items') || [],
  (items) => orderBy(items, ['name'], ['asc'])
);

export const selectPricerModuleSorted = createSelector(
  (state) => get(state, 'party.pricerModule.items') || [],
  (items) => orderBy(items, ['label'], ['asc'])
);

export const selectPartyClientsPagination = (state) => {
  const clients = get(state, 'party.clients') || {};

  return utils.generic.getPagination(clients);
};

export const selectPartyCarriersPagination = (state) => {
  const carriers = get(state, 'party.carriers') || {};

  return utils.generic.getPagination(carriers);
};

export const selectPartyNotifiedUsersSorted = createSelector(
  (state) => get(state, 'party.notifiedUsers.items') || [],
  (items) => orderBy(items, ['name'], ['asc'])
);

export const selectPartyOptions = createSelector(
  selectPartyClientsSorted,
  selectPartyInsuredsSorted,
  selectPartyReinsuredsSorted,
  selectPartyNotifiedUsersSorted,
  (clients = [], insureds = [], reinsureds = []) => ({ clients, insureds, reinsureds })
);
