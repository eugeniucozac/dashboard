import { createSelector } from 'reselect';
import get from 'lodash/get';
import config from 'config';

export const selectTechnicians = (state) => get(state, 'premiumProcessing.technicians.items') || [];
export const selectCasesList = (state) => get(state, 'premiumProcessing.casesList') || {};
export const selectCaseStatusesGroupedByNumberOfDays = (state) => get(state, 'premiumProcessing.caseProgressByType') || [];
export const selectTeamListByCase = (state) => get(state, 'premiumProcessing.teamListByCaseId') || [];
export const selectCasesListItems = (state) => get(state, 'premiumProcessing.casesList.items') || [];
export const selectCasesListType = (state) => get(state, 'premiumProcessing.casesList.type');
export const selectPremiumProcessingSort = (state) => get(state, 'premiumProcessing.casesList.sort');
export const selectIssueDocuments = (state) => get(state, 'premiumProcessing.issueDocuments') || {};
export const selectRfiSaveDraft = (state) => get(state, 'premiumProcessing.rfi.saveDraft') || [];
export const selectRfiHistory = (state) => get(state, 'premiumProcessing.rfi.history') || [];
export const selectRfiResponseDate = (state) => get(state, 'premiumProcessing.rfi.responseDate') || '';
export const selectRfiQueryCodes = (state) => get(state, 'premiumProcessing.rfi.queryCodes') || [];
export const selectAssignedToUsers = (state) => get(state, 'premiumProcessing.assignedToUsers') || {};
export const selectPremiumProcessingCasesSelected = (state) => get(state, 'premiumProcessing.selected') || [];
export const selectPostAssignToUser = (state) => get(state, 'premiumProcessing.postAssignToUser') || {};
export const selectcaseTeamModule = (state) => get(state, 'premiumProcessing.caseTeamModule') || {};
export const selectcaseFilters = (state) => get(state, 'premiumProcessing.casesList.filters') || {};
export const selectPremiumProcessingBordereauType = (state) => get(state, 'premiumProcessing.bordereauType') || {};
export const selectPremiumProcessingBpmFlag = (state) => get(state, 'premiumProcessing.bpmFlag') || {};
export const selectPremiumProcessingBpmStage = (state) => get(state, 'premiumProcessing.bpmStage') || {};
export const selectPremiumProcessingFacilityType = (state) => get(state, 'premiumProcessing.facilityType') || {};
export const selectPremiumProcessingDepartments = (state) => get(state, 'premiumProcessing.departments') || {};
export const selectCaseDetails = (state) => get(state, 'premiumProcessing.caseDetails') || {};
export const selectCaseHistoryLoadingFlag = (state) => get(state, 'premiumProcessing.caseDetails.caseHistoryDetails.isCaseHistoryDetailsLoading') || false;
export const selectCaseRfiDetails = (state) => get(state, 'premiumProcessing.caseRfiDetails') || {};
export const selectCheckSigningCaseHistory = (state) => get(state, 'premiumProcessing.caseDetails.checkSigningCaseHistory') || [];
export const selectCaseHistoryDetails = (state) => get(state, 'premiumProcessing.caseDetails.caseHistoryDetails') || {};
export const selectMultiSelectedCase = (state) => get(state, 'premiumProcessing.multiSelectedRows') || {};
export const selectcaseRfiSubTabs = (state) => get(state, 'premiumProcessing.caseRfiSubTabs') || [];
export const selectCaseTaskTypeView = (state) => get(state, 'premiumProcessing.casesList.selectedTaskType') || '';
export const selectPremiumProcessingFilterValues = (state) => get(state, 'premiumProcessing.casesList.filters') || '';
export const selectRfiResolutionCodes = (state) => get(state, 'premiumProcessing.rfiResolutionCodes') || [];
export const selectEmailSentStatus = (state) => get(state, 'premiumProcessing.emailSentStatus') || false;
export const selectCaseIsCheckSigning = (state) => get(state, 'premiumProcessing.caseDetails.isCheckSigning') || false;
export const selectTaskGridLoadingFlag = (state) => get(state, 'premiumProcessing.casesList.isTaskGridLoading') || false;
export const selectTaskGridDataFetchingError = (state) => get(state, 'premiumProcessing.casesList.isTaskGridDataFetchingError') || false;
export const selectCaseTeamLoadingFlag = (state) => get(state, 'premiumProcessing.isCaseTeamLoading') || false;
export const selectCaseHistoryDetailsAPIError = (state) => get(state, 'premiumProcessing.caseDetails.caseHistoryDetails.error') || false;

export const selectPremiumProcessingPagination = (state) => {
  const tasksList = get(state, 'premiumProcessing.casesList', {});

  return {
    page: tasksList?.page - 1 || 0,
    rowsTotal: tasksList?.itemsTotal || 0,
    rowsPerPage: tasksList?.pageSize || config.ui.pagination.default,
  };
};
export const selectCaseByTaskId = (id) => {
  return createSelector(selectCasesListItems, (items) => {
    return items.find((oneCase) => {
      return oneCase.taskId === id;
    });
  });
};

export const selectCaseStatusByDays = (numDays) => {
  return createSelector(selectCaseStatusesGroupedByNumberOfDays, (caseStatusesByDays) => {
    return caseStatusesByDays[numDays];
  });
};

export const selectTeamListByCaseId = (caseId) => {
  return createSelector(selectTeamListByCase, (teamListByCaseId) => {
    return teamListByCaseId[caseId];
  });
};
