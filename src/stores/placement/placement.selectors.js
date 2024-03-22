import { createSelector } from 'reselect';
import get from 'lodash/get';
import * as utils from 'utils';

// private
const _refDataDepartments = (state) => get(state, 'referenceData.departments') || [];

// public
export const selectPlacement = (state) => get(state, 'placement.selected');
export const selectPlacementId = (state) => get(state, 'placement.selected.id');
export const selectPlacementLayers = (state) => get(state, 'placement.selected.layers');
export const selectPlacementMarkets = (state) => get(state, 'placement.selectedMarkets');
export const selectPlacementDepartmentId = (state) => get(state, 'placement.selected.departmentId');
export const selectPlacementConfig = (state) => get(state, 'placement.selected.config');
export const selectPlacementBulkType = (state) => get(state, 'placement.bulk.type');
export const selectPlacementBulkItems = (state) => get(state, 'placement.bulk.items', []);
export const selectPlacementBulkItemsLayers = (state) => get(state, 'placement.bulkItems.layers', []);
export const selectPlacementBulkItemsMarkets = (state) => get(state, 'placement.bulkItems.layerMarkets', []);
export const selectPlacementList = (state) => get(state, 'placement.list');
export const selectPlacementSort = (state) => get(state, 'placement.sort');
export const selectBulkToggleSelect = (state) => get(state, 'placement.showBulkSelect');
export const selectBulkToggleSelectMarketingMarkets = (state) => get(state, 'placement.showBulkSelectMarketingMarkets');
export const selectPlacementBulkItemsMarketingMarkets = (state) => get(state, 'placement.bulkItemsMarketingMarkets.marketingMarkets', []);
export const selectCalendarViewEdit = (state) => get(state, 'placement.calendarViewEdit');

export const selectPlacementPolicies = createSelector(selectPlacement, (placement) => {
  if (!placement || !typeof placement === 'object' || !Array.isArray(placement.policies)) return [];
  return placement.policies;
});

export const selectPlacementDepartmentName = createSelector(selectPlacement, _refDataDepartments, (placement, departments) => {
  return utils.placement.getDepartmentName(placement, departments);
});
