import get from 'lodash/get';
import config from 'config';
import * as utils from 'utils';

export const selectLossQualifiers = (state) => get(state, 'claims.lossQualifiers') || [];
export const selectCatCodes = (state) => get(state, 'claims.catCodes') || [];
export const selectClaimAssociateWithLoss = (state) => get(state, 'claims.claimsAssociateWithLoss') || [];
export const selectClaimAssociateWithLossLoading = (state) => get(state, 'claims.isClaimsAssociateWithLossLoading') || false;
export const selectLossInformation = (state) => get(state, 'claims.lossInformation') || {};
export const selectLossSelected = (state) => get(state, 'claims.selectedLossInformation') || {};
export const selectClaimsInformation = (state) => get(state, 'claims.claimsInformation') || {};
export const selectClaimInfoIsLoading = (state) => get(state, 'claims.isClaimsInfoLoading') || false;
export const selectLossInfoIsLoading = (state) => get(state, 'claims.isLossInfoLoading') || false;
export const selectPolicyInfoIsLoading = (state) => get(state, 'claims.isPolicyInfoLoading') || false;
export const selectPolicySectionIsLoading = (state) => get(state, 'claims.isPolicySectionsLoading') || false;
export const selectClaimsFnolPushBackRoute = (state) => get(state, 'claims.pushBackRoute') || '';
export const selectClaimsTabSelectedClaimData = (state) => get(state, 'claims.selectedClaimsDetails') || {};

export const selectSettlementCurrency = (state) => {
  const referenceCurrencyData = get(state, 'referenceData.currencyCodes') || [];
  if (utils.generic.isInvalidOrEmptyArray(get(state, 'claims.settlementCurrencies'))) {
    const currencies = referenceCurrencyData.map((currency) => ({
      id: currency?.currencyCd,
      name: currency?.currencyName,
      description: '',
    }));
    return currencies;
  }
  return get(state, 'claims.settlementCurrencies');
};

export const selectPolicies = (state) => get(state, 'claims.policies') || {};
export const selectPoliciesFilterLoading = (state) => get(state, 'claims.policies.isloadingFilters') || false;
export const selectClaimsPolicySections = (state) => get(state, 'claims.policySections') || [];
export const selectClaimantNames = (state) => get(state, 'claims.claimantNames') || [];
export const selectClaimsPolicyData = (state) => get(state, 'claims.policyData') || {};
export const selectClaimsPolicyInformation = (state) => get(state, 'claims.policyInformation') || {};
export const selectClaimsInterest = (state) => get(state, 'claims.interest') || [];
export const selectClaimsInterestItems = (state) => get(state, 'claims.interest.items') || [];
export const selectSectionEnabledUG = (state) => get(state, 'claims.sectionEnabledUG') || false;
export const selectClaimsUnderwritingGroups = (state) => get(state, 'claims.underWritingGroups') || [];
export const selectAllClaimDetails = (state) => get(state, 'claims.allClaimDetails') || {};
export const selectedAllClaimDetails = (state) => get(state, 'claims.claimDetailInformation') || {};
export const selectClaims = (state) => get(state, 'claims.claims') || {};
export const selectBEAdjusterList = (state) => get(state, 'claims.beAdjuster') || {};
export const selectSelectedBEAdjusterList = (state) => get(state, 'claims.beAdjuster.selectedbeAdjuster') || {};
export const selectPriorities = (state) => get(state, 'claims.priorities') || [];
export const selectPrioritiesLoaded = (state) => get(state, 'claims.prioritiesLoaded') || false;
export const selectIsPrioritiesLoading = (state) => get(state, 'claims.isPrioritiesLoading') || false;
export const selectReopenTaskList = (state) => get(state, 'claims.reopenTaskList') || {};
export const selectClaimLossFilters = (state) => get(state, 'claims.claimsRefData') || {};
export const selectClaimLossFilterValues = (state) => get(state, 'claims.claimLossSearchFilters') || {};
export const selectClaimIdUnderProgress = (state) => get(state, 'claims.claimDetailInformationSuccess') || null;
export const selectClaimIdFromGrid = (state) => get(state, 'claims.claimsInformation') || null;
export const selectClaimsStatuses = (state) => get(state, 'claims.statuses') || [];

export const selectClaimBordereauPeriods = (state) => get(state, 'claims.claimBordereauPeriods') || [];
export const selectBordereauPeriodsLoading = (state) => get(state, 'claims.isBordereauPeriodsLoading') || false;

export const selectClaimPolicyInsures = (state) => get(state, 'claims.claimPolicyInsures') || [];
export const selectisClaimPolicyInsuresLoading = (state) => get(state, 'claims.isClaimPolicyInsuresLoading') || false;

export const selectClaimPolicyClients = (state) => get(state, 'claims.claimPolicyClients') || [];
export const selectIsClaimPolicyClientsLoading = (state) => get(state, 'claims.isPolicyClientsLoading') || false;

export const selectClaimStatusObj = (state) => get(state, 'claims.claimsStatusObj') || {};
export const selectFnolSelectedTab = (state) => state?.claims?.fnolSelectedTab || '';

// claim notes
export const selectClaimNotes = (state) => get(state, 'claims.notes.items') || [];
export const selectClaimNotesQuery = (state) => get(state, 'claims.notes.query') || '';
export const selectClaimNotesFilters = (state) => get(state, 'claims.notes.filters') || [];
export const selectClaimNotesPagination = (state) => {
  const notes = get(state, 'claims.notes');

  return {
    page: notes?.page || 0,
    rowsTotal: notes?.itemsTotal || 0,
    rowsPerPage: notes?.pageSize || config.ui.pagination.options[0],
  };
};
export const selectClaimNotesSort = (state) => {
  const notes = get(state, 'claims.notes');

  return {
    by: notes?.by || 'updatedDate',
    type: notes?.type || 'date',
    direction: notes?.direction || 'desc',
  };
};

// claim audits
export const selectClaimAudits = (state) => get(state, 'claims.audits.items') || {};
export const selectClaimAuditsQuery = (state) => get(state, 'claims.audits.query') || '';
export const selectClaimAuditsFilters = (state) => get(state, 'claims.audits.filters') || {};
export const selectClaimAuditsPagination = (state) => {
  const audits = get(state, 'claims.audits');

  return {
    page: audits?.page || 0,
    rowsTotal: audits?.itemsTotal || 0,
    rowsPerPage: audits?.pageSize || config.ui.pagination.options[0],
  };
};
export const selectClaimAuditsSort = (state) => {
  const audits = get(state, 'claims.audits');

  return {
    by: audits?.by || 'createdDate',
    type: audits?.type || 'date',
    direction: audits?.direction || 'desc',
  };
};

// claim ref data
export const selectClaimRefTaskData = (state) => get(state, 'claims.refTabTasks.items') || {};
export const selectClaimRefTaskFilters = (state) => get(state, 'claims.refTabTasks.filters') || {};
export const selectClaimRefTasksPagination = (state) => {
  const tasksList = get(state, 'claims.refTabTasks', {});

  return {
    page: tasksList?.page - 1 || 0,
    rowsTotal: tasksList?.itemsTotal || 0,
    rowsPerPage: tasksList?.pageSize || config.ui.pagination.default,
  };
};

// Claim Dashboard Rfis
export const selectClaimRefRfis = (state) => get(state, 'claims.rfis.items') || [];
export const selectClaimRefRfiFilters = (state) => get(state, 'claims.rfis.filters') || {};
export const selectClaimRefRfiPagination = (state) => {
  const rfisList = get(state, 'claims.rfis', {});
  return {
    page: rfisList?.page || 0,
    rowsTotal: rfisList?.itemsTotal || 0,
    rowsPerPage: rfisList?.pageSize || config.ui.pagination.options[1],
  };
};
export const selectClaimRfisSort = (state) => {
  const rfis = get(state, 'claims.rfis');
  return {
    by: rfis?.by || 'dateOfQuery',
    type: rfis?.type || 'date',
    direction: rfis?.direction || 'desc',
  };
};

// claim task notes
export const selectClaimTaskNotes = (state) => get(state, 'claims.taskNotes.items') || [];
export const selectClaimTaskNotesQuery = (state) => get(state, 'claims.taskNotes.query') || '';
export const selectClaimTaskNotesFilters = (state) => get(state, 'claims.taskNotes.filters') || {};
export const selectClaimTaskNotesPagination = (state) => {
  const taskNotes = get(state, 'claims.taskNotes');
  return {
    page: taskNotes?.page || 0,
    rowsTotal: taskNotes?.itemsTotal || 0,
    rowsPerPage: taskNotes?.pageSize || config.ui.pagination.options[0],
  };
};
export const selectClaimTaskNotesSort = (state) => {
  const taskNotes = get(state, 'claims.taskNotes');
  return {
    by: taskNotes?.by || 'updatedDate',
    type: taskNotes?.type || 'date',
    direction: taskNotes?.direction || 'desc',
  };
};

export const selectComplexityPolicies = (state) => get(state, 'claims.complexityPolicies') || [];
export const selectComplexityPoliciesAdded = (state) => get(state, 'claims.complexityPolicies.checkedComplexity') || false;
export const selectComplexityInsuredAdded = (state) => get(state, 'claims.complexInsured.checkedComplexity') || false;
export const selectComplexityPoliciesFlagged = (state) => get(state, 'claims.complexityPoliciesFlagged') || [];
export const selectedCheckedComplexPolicies = (state) => get(state, 'claims.complexityPolicies.selectedComplexityPolicies') || [];
export const selectSelectedComplexityPolicies = (state) => get(state, 'claims.checkedComplexAddPolicies') || [];
export const selectComplexityDivisionMatrix = (state) => get(state, 'claims.complexityManagement.division') || [];
export const selectComplexityDivisionMatrixChanges = (state) => get(state, 'claims.complexityManagement.divisionChanges') || {};
export const selectComplexityBasisValues = (state) => get(state, 'claims.complexityBasisValues') || [];
export const selectComplexityBasisValueId = (state) => get(state, 'claims.complexityManagement.complexityBasisValueId') || {};
export const selectComplexityBasisDivisionMatrix = (state) => get(state, 'claims.complexityManagement.complexityBasisDivisionMatrix') || [];
export const selectComplexityBasisDivisionMatrixChanges = (state) =>
  get(state, 'claims.complexityManagement.complexityBasisDivisionMatrixChanges') || {};
export const selectComplexityReferralValues = (state) => get(state, 'claims.complexityReferralValues') || {};
export const selectComplexityReferralValueId = (state) => get(state, 'claims.complexityManagement.complexityReferralValueId') || {};
export const selectComplexityReferralDivisionMatrix = (state) =>
  get(state, 'claims.complexityManagement.complexityReferralDivisionMatrix') || [];
export const selectComplexityReferralDivisionMatrixChanges = (state) =>
  get(state, 'claims.complexityManagement.complexityReferralDivisionMatrixChanges') || {};
export const selectComplexityManagementTab = (state) => get(state, 'claims.complexityManagement.activeTab') || '';
export const selectClaimData = (state) => get(state, 'claims.claimData') || {};
export const selectClaimsStepper = (state) => get(state, 'claims.claimsStepper') || 0;
export const selectCheckedComplexAddInsured = (state) => get(state, 'claims.checkedComplexAddInsured') || [];
export const selectComplexitySearchClaimsInsured = (state) => get(state, 'claims.complexInsured') || {};
export const selectComplexityInsured = (state) => get(state, 'claims.insured') || [];
export const selectedCheckedComplexInsured = (state) => get(state, 'claims.complexInsured.selectedComplexityInsured') || [];
export const selectComplexityValues = (state) => get(state, 'claims.complexityValues') || [];
export const selectComplexityValuesLoaded = (state) => get(state, 'claims.complexityValuesLoaded') || false;
export const selectComplexityTypes = (state) => get(state, 'claims.complexityTypes') || [];
export const selectComplexityTypesLoaded = (state) => get(state, 'claims.complexityTypesLoaded') || false;
export const selectReferralValues = (state) => get(state, 'claims.referralValues') || [];

export const selectClaimsProcessing = (state) => get(state, 'claims.processing') || {};
export const selectClaimsProcessingItems = (state) => get(state, 'claims.processing.items') || [];
export const selectClaimsProcessingSelected = (state) => get(state, 'claims.processing.selected') || [];
export const selectClaimsProcessingFilterLoading = (state) => get(state, 'claims.processing.isloadingFilters') || false;
export const selectClaimProcessingFilterValues = (state) => get(state, 'claims.processing.filters') || {};
export const selectClaimsProcessingPagination = (state) => {
  const claimsList = get(state, 'claims.processing', {});

  return {
    page: claimsList?.page - 1 || 0,
    rowsTotal: claimsList?.itemsTotal || 0,
    rowsPerPage: claimsList?.pageSize || config.ui.pagination.default,
  };
};

export const selectClaimsSearchTablePagination = (state) => {
  const claimsList = get(state, 'dms.search.files', {});

  return {
    page: claimsList?.page - 1 || 0,
    rowsTotal: claimsList?.itemsTotal || 0,
    rowsPerPage: claimsList?.pageSize || config.ui.pagination.default,
  };
};

// Claims List
export const selectClaimsListFilterLoading = (state) => get(state, 'claims.list.isloadingFilters') || false;
export const selectClaimsListFilterValues = (state) => get(state, 'claims.list.filters') || {};

// Claims Tasks Processing
export const selectClaimsTasksProcessing = (state) => get(state, 'claims.tasksProcessing') || {};
export const selectClaimsTasksProcessingType = (state) => get(state, 'claims.tasksProcessing.selectedTaskType') || '';
export const selectClaimsTasksProcessingSelected = (state) => get(state, 'claims.tasksProcessing.selected') || [];
export const selectClaimsTasksProcessingFilterLoading = (state) => get(state, 'claims.tasksProcessing.isloadingFilters') || false;
export const selectClaimsTasksProcessingFilterValues = (state) => get(state, 'claims.tasksProcessing.filters') || {};
export const selectSancCheckAssociatedTask = (state) => get(state, 'claims.tasksProcessing.associatedTaskDetails') || {};
export const selectClaimsTasksProcessingPagination = (state) => {
  const tasksList = get(state, 'claims.tasksProcessing', {});

  return {
    page: tasksList?.page - 1 || 0,
    rowsTotal: tasksList?.itemsTotal || 0,
    rowsPerPage: tasksList?.pageSize || config.ui.pagination.default,
  };
};

export const selectReferralResponse = (state) => get(state, 'claims.referralResponse') || [];
export const selectQueryCodes = (state) => get(state, 'claims.queryCode') || [];
export const selectClaimsAssignedToUsers = (state) => get(state, 'claims.claimsAssignedToUsers') || {};
export const selectIsLoadingClaimsAssignedToUsers = (state) => get(state, 'claims.isClaimsAssignedToUsersLoading') || false;

export const selectEditAdhocTaskStatus = (state) => get(state, 'claims.adhocTask.status') || '';
export const selectAdhocTaskData = (state) => get(state, 'claims.adhocTask.data') || '';
export const selectCreateRfiInfo = (state) => get(state, 'claims.rfiInfo.data') || {};
export const selectCreateRFIDocs = (state) => get(state, 'claims.rfiInfo.documents') || [];
export const selectAdhocTaskDocuments = (state) => get(state, 'claims.adhocTask.documents');
export const selectRfiHistoryList = (state) => get(state, 'claims.rfiHistory.data') || [];
export const selectRfiHistoryListLoader = (state) => get(state, 'claims.rfiHistory.isLoading') || false;
export const selectClaimsTasksReporting = (state) => get(state, 'claims.tasksClaimsReporting.data') || {};
export const selectClaimsTasksReportingLoader = (state) => get(state, 'claims.tasksClaimsReporting.isDataLoading') || false;
export const selectBpmClaimInformation = (state) => get(state, 'claims.bpmClaimInformation') || { data: {}, isLoading: false };

// Claims Tasks Processing Task Dashbard
export const selectTaskDashboardTaskDetails = (state) => get(state, 'claims.taskDashboard.taskDetails.items')?.[0] || {};
export const selectIsTaskDashboardTaskDetailsLoading = (state) => get(state, 'claims.taskDashboard.taskDetails.isLoading') || false;
export const selectTaskCheckList = (state) => get(state, 'claims.taskDashboard.checkList') || [];
export const selectTaskNextActionList = (state) => get(state, 'claims.taskDashboard.nextActions') || [];
export const selectTaskCheckListChanges = (state) => get(state, 'claims.taskDashboard.checkListChanges') || [];
export const selectTaskCheckListChangesPushed = (state) => get(state, 'claims.taskDashboard.checkListChangesPushed') || [];
export const selectTaskNextActionChangesPushed = (state) => get(state, 'claims.taskDashboard.nextActionChangesPushed') || [];
export const selectCurrencyPurchasedValue = (state) => get(state, 'claims.taskDashboard.purchasedCurrencyRequired') || '';

// Claim Processing Navigation
export const selectClaimNavigation = (state) => get(state, 'claims.processingNavigation.navigationItem') || 'tasks';
export const selectClaimViewNavigation = (state) => get(state, 'claims.processingNavigation.selectedView') || 'myClaims';

export const selectIsUserClaim = (state) => get(state, 'claims.processing.isUserClaim');
export const selectIsClosedClaim = (state) => get(state, 'claims.processing.isClosedClaim');
export const selectIsTeamClaim = (state) => get(state, 'claims.processing.isTeamClaim');

export const selectDmsDocDetails = (state) => get(state, 'claims.dmsDocDetails');
export const selectLinkPoliciesData = (state) => get(state, 'claims.linkPolicies');

export const selectLossActions = (state) => get(state, 'claims.lossActions');
export const selectLossActionsItems = (state) => get(state, 'claims.lossActions.items');
export const selectLossActionsFilterValues = (state) => get(state, 'claims.lossActions.filters');
export const selectLossesData = (state) => get(state, 'claims.lossesTab');
export const selectLossesTblData = (state) => get(state, 'claims.lossesTab.items');
export const selectLossesFilterData = (state) => get(state, 'claims.lossesTab.filters' || {});
export const selectIsLossSubmittedStatus = (state) => get(state, 'claims.isLossSubmitted' || false);
export const selectClaimsTabData = (state) => get(state, 'claims.claimsTab');

export const selectTasksTabGridList = (state) => get(state, 'claims.tasksTab') || {};
export const selectTasksTabGridListFilterValues = (state) => get(state, 'claims.tasksTab.filters') || {};
export const selectTasksTabGridListFilterLoading = (state) => get(state, 'claims.tasksTab.isloadingFilters') || false;
export const selectTasksTabGridListType = (state) => get(state, 'claims.tasksTab.selectedTaskType') || '';
export const selectTasksTabGridListSelected = (state) => get(state, 'claims.tasksTab.selected') || [];
export const selectTasksTabGridListPagination = (state) => getPaginationDetails(state, 'claims.tasksTab');
export const selectTasksTabGridListAppliedFilters = (state) => get(state, 'claims.tasksTab.appliedFilters') || [];

export const selectAdvanceSearchData = (state) => get(state, 'claims.advanceTab');
export const selectAdvanceSearchTblData = (state) => get(state, 'claims.advanceTab.items');
export const selectAdvanceSearchFilterData = (state) => get(state, 'claims.advanceTab.filters');

const getPaginationDetails = (state, stateParams) => {
  const list = get(state, stateParams, {});

  return {
    page: list?.page - 1 || 0,
    rowsTotal: list?.itemsTotal || 0,
    rowsPerPage: list?.pageSize || config.ui.pagination.default,
  };
};

export const selectClaimsTabPagination = (state) => getPaginationDetails(state, 'claims.claimsTab.tableDetails');
export const selectClaimsTabRows = (state) => get(state, 'claims.claimsTab.tableDetails.items') || [];
export const selectClaimsTabRowSelected = (state) => get(state, 'claims.claimsTab.tableDetails.selected') || [];
export const selectCaseIncidentDetails = (state) => get(state, 'claims.caseIncidentDetails') || {};
export const selectSanctionsCheckStatus = (state) => get(state, 'claims.sanctionCheckStatus') || {};
export const selectRfiHistoryDocumentList = (state) => get(state, 'claims.rfiHistoryDocuments.documentList') || [];
export const selectRfiHistoryDocumentListLoader = (state) => get(state, 'claims.rfiHistoryDocuments.isLoading');

// RFI dashboard
export const selectRfiDashboardDetails = (state) => get(state, 'claims.rfiDashboard.rfiDetails.items')?.[0] || {};
export const selectIsRfiDashboardDetailsLoading = (state) => get(state, 'claims.rfiDashboard.rfiDetails.isLoading') || false;
