import { createSelector } from 'reselect';
import get from 'lodash/get';
import orderBy from 'lodash/orderBy';
import config from 'config';

export const selectRiskListItems = (state) => get(state, 'risk.list.items') || [];
export const selectDraftListItems = (state) => get(state, 'risk.draftList.items') || [];

export const selectRiskListPagination = (state) => {
  const list = get(state, 'risk.list') || {};

  return {
    page: list.page ? list.page - 1 : 0,
    rowsTotal: list.itemsTotal || 0,
    rowsPerPage: list.pageSize || config.ui.pagination.default,
  };
};

export const selectRiskListSort = (state) => {
  const list = get(state, 'risk.list') || {};

  return {
    by: list.sortBy || '',
    type: list.sortType || '',
    direction: list.sortDirection || 'desc',
  };
};

export const selectRiskListLoading = (state) => get(state, 'risk.list.loading');
export const selectDraftRiskListLoading = (state) => get(state, 'risk.draftList.loading');

export const selectDraftListPagination = (state) => {
  const list = get(state, 'risk.draftList') || {};

  return {
    page: list.page ? list.page - 1 : 0,
    rowsTotal: list.itemsTotal || 0,
    rowsPerPage: list.pageSize || config.ui.pagination.default,
  };
};

export const selectDraftListSort = (state) => {
  const list = get(state, 'risk.draftList') || {};

  return {
    by: list.sortBy || '',
    type: list.sortType || '',
    direction: list.sortDirection || 'desc',
  };
};

export const selectRiskSelected = (state) => get(state, 'risk.selected') || {};
export const selectRiskSelectedLoading = (state) => get(state, 'risk.selected.loading');
export const selectRiskSelectedAugmentVersion = (state) => get(state, 'risk.selected.augmentVersion');

export const selectRiskQuotes = (state) => get(state, 'risk.quotes.items') || [];
export const selectRiskQuotesLoading = (state) => get(state, 'risk.quotes.loading');

export const selectRiskCountries = (state) => get(state, 'risk.countries.items') || [];
export const selectRiskCountriesLoading = (state) => get(state, 'risk.countries.loading');

export const selectRiskDefinitionsFieldsByType = (type) => {
  return createSelector(
    (state) => get(state, 'risk.definitions') || {},
    (definitions) => (type ? get(definitions, `[${type}].fields`) || [] : [])
  );
};

export const selectCoverageDefinitionsFieldsByType = (type) => {
  return createSelector(
    (state) => get(state, 'risk.coverageDefinitions') || {},
    (definitions) => (type ? get(definitions, `[${type}]`) || [] : [])
  );
};

export const selectCoverageDefinitionsLoading = (state) => get(state, 'risk.coverageDefinitions.loading');

export const selectCoverages = (state) => get(state, 'risk.coverages.selected') || [];

export const selectRiskFieldOptionsByType = (type) => {
  return createSelector(
    (state) => get(state, 'risk.definitions') || {},
    (definitions) => (type ? get(definitions, `[${type}].fieldOptions`) || [] : [])
  );
};

export const selectFacilitiesListItems = (state) => get(state, 'risk.facilities.list.items') || [];
export const selectFacilitiesRatesLoaded = (state) => get(state, 'risk.facilities.ratesLoaded') || {};

export const selectFacilitiesById = (id) => {
  return createSelector(selectFacilitiesListItems, (facilities) => {
    return facilities.find((facility) => {
      return facility.id === id;
    });
  });
};

export const selectFacilitiesPagination = (state) => {
  const list = get(state, 'risk.facilities.list') || {};

  return {
    page: list.page ? list.page - 1 : 0,
    rowsTotal: list.itemsTotal || 0,
    rowsPerPage: list.pageSize || config.ui.pagination.default,
  };
};

export const selectProductsSorted = createSelector(
  (state) => get(state, 'risk.products.items') || [],
  (items) => orderBy(items)
);

export const selectProductsWithReportsSorted = createSelector(
  (state) => get(state, 'risk.productsWithReports.items') || [],
  (items) => orderBy(items)
);

export const selectDownloadStatus = (state) => get(state, 'risk.download') || {};

export const selectPreBindInfo = (state) => get(state, 'risk.preBindDefinitions.fields' || {});
export const selectIsPreBindInfoLoading = (state) => get(state, 'risk.preBindDefinitions.loading') || false;

export const selectFacilityLimits = (state) => get(state, 'risk.limits.items') || [];
export const selectFacilitiesLimitsLoading = (state) => get(state, 'risk.facilities.loading');
export const selectIsLimitsLoading = (state) => get(state, 'risk.limits.loading') || false;
export const selectFacilitiesLimitsLoaded = (state) => get(state, 'risk.facilities.limitsLoaded') || {};
export const selectFacilitiesLoading = (state) => get(state, 'risk.facilities.loading') || false;
export const selectFacilityAggregateLimits = (state) => get(state, 'risk.limits.aggregateLimits') || [];
