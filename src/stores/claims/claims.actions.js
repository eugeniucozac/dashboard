export const resetClaimsPolicies = () => {
  return {
    type: 'CLAIMS_POLICIES_RESET',
  };
};

export const resetClaimsPoliciesTemp = () => {
  return {
    type: 'CLAIMS_POLICIES_RESET_TEMP',
  };
};

export const resetClaims = () => {
  return {
    type: 'CLAIMS_RESET',
  };
};

export const resetLossData = () => {
  return {
    type: 'RESET_LOSS_DATA',
  };
};

export const resetClaimNotes = () => {
  return {
    type: 'CLAIM_NOTES_RESET',
  };
};

export const resetClaimRfis = () => {
  return {
    type: 'CLAIM_RFIS_RESET',
  };
};

export const resetClaimAuditsFilters = () => {
  return {
    type: 'CLAIM_AUDIT_TRAIL_FILTERS_RESET',
  };
};

export const resetClaimAuditsItems = () => {
  return {
    type: 'CLAIM_AUDIT_TRAIL_ITEMS_RESET',
  };
};

export const resetClaimAuditsSearch = () => {
  return {
    type: 'CLAIM_AUDIT_TRAIL_SEARCH_RESET',
  };
};

export const resetClaimsProcessingFilters = () => {
  return {
    type: 'CLAIMS_PROCESSING_FILTERS_RESET',
  };
};
export const resetClaimsProcessingSearch = () => {
  return {
    type: 'CLAIMS_PROCESSING_SEARCH_RESET',
  };
};

export const resetClaimsProcessingItems = () => {
  return {
    type: 'CLAIMS_PROCESSING_ITEMS_RESET',
  };
};

export const resetClaimsAssignedToUsers = () => {
  return {
    type: 'CLAIMS_ASSIGNED_TO_USERS_RESET',
  };
};

export const resetComplexityBasisValues = () => {
  return {
    type: 'CLAIMS_COMPLEXITY_BASIS_VALUE_GET_RESET',
  };
};

export const selectLossItem = (lossObj) => {
  return {
    type: 'LOSS_SELECT',
    payload: { lossObj },
  };
};

export const resetSelectedLossItem = () => {
  return {
    type: 'RESET_SELECTED_LOSS_ITEM',
  };
};

export const selectClaimsProcessingItem = (claimObj, forceSingleItem) => {
  return {
    type: 'CLAIMS_PROCESSING_SELECT',
    payload: { claimObj, forceSingleItem },
  };
};

export const resetClaimsProcessingSelected = () => {
  return {
    type: 'CLAIMS_PROCESSING_SELECTED_RESET',
  };
};

export const claimsPolicyData = (data) => {
  return {
    type: 'CLAIMS_POLICIES_REFERENCE',
    payload: data,
  };
};

export const sortingUnderwritingGroups = (data) => {
  return {
    type: 'CLAIMS_UNDERWRITING_GROUPS_SORTING',
    payload: data,
  };
};

export const resetUnderwritingGroups = () => {
  return {
    type: 'RESET_CLAIMS_UNDERWRITING_GROUPS',
  };
};

export const resetClaimsInformation = () => {
  return {
    type: 'RESET_CLAIMS_INFORMATION',
  };
};

export const updateClaimantNamesSuccess = (data) => {
  return {
    type: 'CLAIMS_CLAIMANT_NAMES_UPDATE_SUCCESS',
    payload: data,
  };
};

export const updateClaimLossFilters = (data) => {
  return {
    type: 'UPDATE_CLAIMS_LOSS_FILTERS',
    payload: data,
  };
};

export const resetClaimLossFilters = () => {
  return {
    type: 'RESET_CLAIMS_LOSS_FILTERS',
  };
};

export const resetClaimProcessingFilters = () => {
  return {
    type: 'RESET_CLAIMS_PROCESSING_FILTERS',
  };
};

export const updateClaimProcessingFilters = (data) => {
  return {
    type: 'UPDATE_CLAIMS_PROCESSING_FILTERS',
    payload: data,
  };
};

export const addNewClaimUnderCurrentLoss = () => {
  return {
    type: 'ADD_NEW_CLAIM_FOR_LOSS',
  };
};

export const updateLossInformationById = (id, data) => {
  return {
    type: 'UPDATE_LOSS_INFORMATION_BY_ID',
    payload: {
      id,
      data,
    },
  };
};

export const setComplexityPolicies = (data) => {
  return {
    type: 'SELECT_CLAIMS_COMPLEXITY',
    payload: data,
  };
};

export const resetComplexityPolicies = () => {
  return {
    type: 'CLAIMS_COMPLEXITY_RESET',
  };
};

export const selectedPolicyItems = (data) => {
  return {
    type: 'SELECTED_ADD_POLICY_ITEMS_LIST',
    payload: data,
  };
};

export const checkedPolicyDetails = (data) => {
  return {
    type: 'CHECKED_COMPLEX_ADD_POLICY',
    payload: data,
  };
};

export const savedPoliciesData = (data) => {
  return {
    type: 'SAVED_POLICIES_DATA',
    payload: data,
  };
};

export const setClaimData = (data) => {
  return {
    type: 'CLAIM_SET_DATA',
    payload: data,
  };
};

export const resetClaimData = (data) => {
  return {
    type: 'CLAIM_RESET_DATA',
  };
};

export const saveComplexityDivisionMatrixChange = (data) => {
  return {
    type: 'CLAIMS_COMPLEXITY_DIVISION_SET_CHANGE',
    payload: data,
  };
};

export const resetComplexityDivisionMatrix = () => {
  return {
    type: 'CLAIMS_COMPLEXITY_DIVISION_RESET',
  };
};

export const setComplexityManagementTab = (data) => {
  return {
    type: 'CLAIMS_COMPLEXITY_TAB_SET',
    payload: data,
  };
};

export const saveComplexityDivisionMatrixByComplexIdChange = (data) => {
  return {
    type: 'CLAIMS_COMPLEXITY_DIVISION_BY_COMPLEX_ID_SET_CHANGE',
    payload: data,
  };
};

export const setComplexityBasisValueId = (data) => {
  return {
    type: 'CLAIMS_COMPLEXITY_SET_COMPLEX_VALUE_ID',
    payload: data,
  };
};

export const resetComplexityDivisionMatrixByComplexId = () => {
  return {
    type: 'CLAIMS_COMPLEXITY_DIVISION_BY_COMPLEX_ID_RESET',
  };
};

export const saveComplexityDivisionMatrixByReferralIdChange = (data) => {
  return {
    type: 'CLAIMS_COMPLEXITY_DIVISION_BY_REFERRAL_ID_SET_CHANGE',
    payload: data,
  };
};

export const setComplexityReferralValueId = (data) => {
  return {
    type: 'CLAIMS_COMPLEXITY_SET_REFERRAL_VALUE_ID',
    payload: data,
  };
};

export const resetComplexityDivisionMatrixByReferralId = () => {
  return {
    type: 'CLAIMS_COMPLEXITY_DIVISION_BY_REFERRAL_ID_RESET',
  };
};

export const resetClaimsInsured = () => {
  return {
    type: 'CLAIMS_INSURED_RESET',
  };
};

export const updateComplexStatus = (data) => {
  return {
    type: 'CLAIM_UPDATE_COMPLEX_STATUS',
    payload: data,
  };
};

export const resetPopupClaimsInsured = () => {
  return {
    type: 'CLAIMS_POPUP_INSURED_RESET',
  };
};

export const checkedInsuredDetails = (data) => {
  return {
    type: 'CHECKED_COMPLEX_ADD_INSURED',
    payload: data,
  };
};

export const savedInsuredData = (data) => {
  return {
    type: 'SAVED_INSURED_DATA',
    payload: data,
  };
};

export const selectedClaimsProcessingTaskType = (data) => {
  return {
    type: 'CLAIM_PROCESSING_TASK_TYPE_SELECTED',
    payload: data,
  };
};

export const selectedClaimsProcessingPreviousTaskType = (data) => {
  return {
    type: 'CLAIM_PROCESSING_PREVIOUS_TASK_TYPE_SELECTED',
    payload: data,
  };
};

export const resetClaimProcessingData = () => {
  return {
    type: 'CLAIM_PROCESSING_RESET_DATA',
  };
};

export const setClaimsStepperControl = (data) => {
  return {
    type: 'CLAIMS_SET_STEPPER_CONTROL',
    payload: data,
  };
};

// Claims Tasks processing
export const selectClaimsProcessingTasksSelected = (taskObj, keepPreviousTasks) => {
  return {
    type: 'CLAIMS_TASKS_PROCESSING_SELECT',
    payload: { taskObj, keepPreviousTasks },
  };
};

export const setClaimsProcessingTasksListSelected = (taskObj, keepPreviousTasks) => {
  return {
    type: 'CLAIMS_TASKS_PROCESSING_LIST_SELECT',
    payload: { taskObj, keepPreviousTasks },
  };
};

export const resetClaimsProcessingTasksItems = () => {
  return {
    type: 'CLAIMS_TASKS_PROCESSING_RESET',
  };
};

export const resetClaimsProcessingTasksFilters = () => {
  return {
    type: 'CLAIMS_TASKS_PROCESSING_FILTERS_RESET',
  };
};

export const resetClaimsProcessingTasksListFilters = () => {
  return {
    type: 'CLAIMS_TASKS_PROCESSING_LIST_FILTERS_RESET',
  };
};

export const resetClaimsProcessingTaskSearch = () => {
  return {
    type: 'CLAIMS_TASKS_PROCESSING_SEARCH_RESET',
  };
};

export const resetClaimsProcessingTaskListSearch = () => {
  return {
    type: 'CLAIMS_TASKS_PROCESSING_LIST_SEARCH_RESET',
  };
};

export const setTaskProcessingChecklistChanges = () => {
  return {
    type: 'CLAIMS_TASK_PROCESSING_SET_CHECKLIST_CHANGES',
  };
};

export const resetTaskProcessingChecklistChanges = () => {
  return {
    type: 'CLAIMS_TASK_PROCESSING_RESET_CHECKLIST_DATA',
  };
};

export const resetAdhocTaskStatus = () => {
  return {
    type: 'CLAIMS_ADHOC_TASK_RESET_STATUS',
  };
};

export const isPurchaseCurrencyRequired = (taskId) => {
  return {
    type: 'IS_PURCHASED_CURRENCY_REQUIRED',
    payload: taskId,
  };
};

export const processingNavigation = (tabName) => {
  return {
    type: 'PROCESSING_NAVIGATION',
    payload: tabName,
  };
};

export const processingClaimViewNavigation = (claimType) => {
  return {
    type: 'PROCESSING_CLAIM_VIEW_NAVIGATION',
    payload: claimType,
  };
};

export const checkIsUserClaim = (status) => {
  return {
    type: 'CHECK_IS_USER_CLAIM',
    payload: status,
  };
};

export const checkIsClosedClaim = (status) => {
  return {
    type: 'CHECK_IS_CLOSED_CLAIM',
    payload: status,
  };
};

export const checkIsTeamClaim = (status) => {
  return {
    type: 'CHECK_IS_TEAM_CLAIM',
    payload: status,
  };
};

export const resetPolicyInformation = () => {
  return {
    type: 'RESET_POLICY_INFORMATION',
  };
};

export const getDmsDocumentList = (title, data) => {
  switch (title) {
    case 'LOSS_INFORMATION':
      return {
        type: 'GET_LOSS_DOCUMENT_DETAILS',
        payload: data,
      };
    case 'CLAIM_INFORMATION':
      return {
        type: 'GET_CLAIMS_DOCUEMENT_DETAILS',
        payload: data,
      };
    case 'LINK_POLICY':
      return {
        type: 'GET_LINK_POLICY_DOCUEMENT_DETAILS',
        payload: data,
      };
    case 'MANAGE_DOCUMENT_LOSS_INFORMATION':
      return {
        type: 'GET_MANAGE_DOC_LOSS_DOCUMENT_DETAILS',
        payload: data,
      };
    case 'MANAGE_DOCUMENT_CLAIM_INFORMATION':
      return {
        type: 'GET_MANAGE_DOC_CLAIM_DOCUMENT_DETAILS',
        payload: data,
      };
    default:
  }
};

export const resetLinkPolicyDocDetails = () => {
  return {
    type: 'RESET_LINK_POLICY_DOCUMENT_DETAILS',
  };
};

export const resetClaimDocDetails = () => {
  return {
    type: 'RESET_ClAIM_DOCUMENT_DETAILS',
  };
};

export const getLinkPoliciesData = (data) => {
  return {
    type: 'GET_LINK_POLICIES_DATA',
    payload: data,
  };
};

export const resetLinkPolicies = () => {
  return {
    type: 'RESET_LINK_POLICY_DATA',
  };
};

export const getLossesTabData = (data) => {
  return {
    type: 'GET_LOSSES_TAB_DATA',
    payload: data,
  };
};

export const resetLossesTabData = () => {
  return {
    type: 'RESET_LOSSES_TAB_DATA',
  };
};

export const getClaimsTabData = (data) => {
  return {
    type: 'GET_CLAIMS_TAB_DATA',
    payload: data,
  };
};

export const setClaimsTabSelectedItem = (claimObj, forceSingleItem) => {
  return {
    type: 'CLAIMS_TAB_TABLE_SELECT',
    payload: { claimObj, forceSingleItem },
  };
};

export const getLossesTableFilterValues = (data) => {
  return {
    type: 'GET_LOSSES_TABLE_FILTER_VALUES',
    payload: data,
  };
};

export const setClaimsFnolPushBackRoute = (route) => {
  return {
    type: 'CLAIMS_FNOL_PUSH_BACK_ROUTES',
    payload: route,
  };
};

export const resetLossPolicyClaimData = () => {
  return {
    type: 'RESET_LOSS_POLICY_CLAIM_DATA',
  };
};

export const resetClaimsTabFilters = () => {
  return {
    type: 'RESET_CLAIMS_TAB_FILTERS',
  };
};

export const resetClaimsTabSearch = () => {
  return {
    type: 'RESET_CLAIMS_TAB_SEARCH',
  };
};

export const resetClaimsDMSDocumentDetails = () => {
  return {
    type: 'RESET_CLAIMS_DMS_DOCUMENT_DETAILS',
  };
};

export const resetLossSubmission = () => {
  return {
    type: 'RESET_LOSS_SUBMISSION',
    payload: false,
  };
};

export const setAdvanceSearchTabSearchDetails = (data) => {
  return {
    type: 'SET_ADVANCE_SEARCH_TAB_SEARCH_DETAILS',
    payload: data,
  };
};

export const setAdvanceSearchTblFilterValues = (data) => {
  return {
    type: 'SET_ADVANCE_SEARCH_TABLE_FILTER_VALUES',
    payload: data,
  };
};

export const resetAdvanceSearchTabDetails = () => {
  return {
    type: 'RESET_ADVANCE_SEARCH_TAB_DETAILS',
    payload: false,
  };
};

export const setPullClosedRecords = (data) => {
  return {
    type: 'SET_PULL_CLOSED_RECORDS',
    payload: data,
  };
};

export const resetCaseIncidentDetails = () => {
  return {
    type: 'RESET_CASE_INCIDENT_DETAILS',
  };
};

export const resetTaskDashboardData = () => {
  return {
    type: 'CLAIMS_TASK_DASHBOARD_DETAIL_RESET',
  };
};
export const resetRfiDashboardData = () => {
  return {
    type: 'CLAIMS_RFI_DASHBOARD_DETAIL_RESET',
  };
};

export const setRFIDocuments = (docs) => {
  return {
    type: 'SET_RFI_DOCUMENTS',
    payload: docs,
  };
};
export const setAdhocTaskDocuments = (docs) => {
  return {
    type: 'SET_ADHOC_TASK_DOCUMENTS',
    payload: docs,
  };
};
