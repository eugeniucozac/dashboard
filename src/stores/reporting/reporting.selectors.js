import get from 'lodash/get';

// public
export const selectReportGroupList = (state) => get(state, 'reporting.reportGroupList' || []);
export const selectReportList = (state) => get(state, 'reporting.reportList' || {});
export const selectReportAdminList = (state) => get(state, 'reporting.reportList.reportingGroupUser' || []);
export const selectReportDetails = (state) => get(state, 'reporting.report' || {});
export const selectSelectedGroup = (state) => get(state, 'reporting.reportList.selectedGroup' || {});
