import get from 'lodash/get';

// app
import config from 'config';

export const selectReportGroupListExtended = (state) => get(state, 'reportingExtended.reportGroupListExtended.items') || [];

export const selectReportGroupListExtendedPagination = (state) => {
  const reportGroupListExtended = get(state, 'reportingExtended.reportGroupListExtended');

  return {
    page: reportGroupListExtended?.page - 1 || 0,
    rowsTotal: reportGroupListExtended?.itemsTotal || 0,
    rowsPerPage: reportGroupListExtended?.pageSize || config.ui.pagination.default,
  };
};

export const selectReportGroupListExtendedSort = (state) => {
  const reportGroupListExtended = get(state, 'reportingExtended.reportGroupListExtended');

  return {
    by: reportGroupListExtended?.sortBy || '',
    type: reportGroupListExtended?.sortType || '',
    direction: reportGroupListExtended?.sortDirection || 'asc',
  };
};

export const selectReportListExtended = (state) => get(state, 'reportingExtended.reportListExtended.items') || [];

export const selectReportListExtendedPagination = (state) => {
  const reportListExtended = get(state, 'reportingExtended.reportListExtended');

  return {
    page: reportListExtended?.page - 1 || 0,
    rowsTotal: reportListExtended?.itemsTotal || 0,
    rowsPerPage: reportListExtended?.pageSize || config.ui.pagination.default,
  };
};

export const selectReportListExtendedSort = (state) => {
  const reportListExtended = get(state, 'reportingExtended.reportListExtended');

  return {
    by: reportListExtended?.sortBy || '',
    type: reportListExtended?.sortType || '',
    direction: reportListExtended?.sortDirection || 'asc',
  };
};

export const selectSelectedReportGroupExtended = (state) => get(state, 'reportingExtended.reportListExtended.selectedReportGroup') || {};

export const selectReportDetailsExtended = (state) => get(state, 'reportingExtended.reportDetails') || {};

export const selectReportGroupListExtendedLoading = (state) => get(state, 'reportingExtended.reportGroupListExtended.loading') || false;

export const selectReportListExtendedLoading = (state) => get(state, 'reportingExtended.reportListExtended.loading') || false;

export const selectReportDetailsExtendedLoading = (state) => get(state, 'reportingExtended.reportDetailsLoading') || false;
