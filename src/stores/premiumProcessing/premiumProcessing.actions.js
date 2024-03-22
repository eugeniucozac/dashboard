export const updateCasesSelected = (caseData) => {
  return {
    type: 'PREMIUM_PROCESSING_CASES_SELECTED_UPDATE',
    payload: caseData,
  };
};
export const updateMultiSelectedRows = (caseData) => {
  return {
    type: 'PREMIUM_PROCESSING_MULTI_SELECTED_CASES',
    payload: caseData,
  };
};
export const singleCaseSelectRows = (caseData) => {
  return {
    type: 'PREMIUM_PROCESSING_SINGLE_SELECTED_CASE',
    payload: caseData,
  };
};
export const casesSelectDeselection = (caseDetails) => {
  return {
    type: 'PREMIUM_PROCESSING_CASES_SELECTED_DESELECT',
    payload: caseDetails,
  };
};
export const resetCasesSelected = () => {
  return {
    type: 'PREMIUM_PROCESSING_CASES_SELECTED_RESET',
  };
};

export const resetPremiumProcessingTaskSearch = () => {
  return {
    type: 'PREMIUM_PROCESSING_TASK_SEARCH_RESET',
  };
};

export const resetPremiumProcessingTasksFilters = () => {
  return {
    type: 'PREMIUM_PROCESSING_TASK_FILTERS_RESET',
  };
};

export const resetPremiumProcessingTaskDetails = (type) => {
  return {
    type: 'PREMIUM_PROCESSING_TASK_CASE_VIEW_TYPE_FAILURE',
    payload: { type },
  };
};

export const resetPremiumProcessingTaskItems = (data) => {
  return {
    type: 'PREMIUM_PROCESSING_TASKS_RESET',
    payload: data,
  };
};
export const setResponseDate = (data) => {
  return {
    type: 'RFI_RESPONSE_DATE_SUCCESS',
    payload: data,
  };
};

export const chooseUnchooseCase = (payload) => {
  return {
    type: 'PREMIUM_PROCESSING_CASES_CHOOSE_TOGGLE',
    payload,
  };
};
export const setMultiSelectRows = (payload) => {
  return {
    type: 'PREMIUM_PROCESSING_CASES_MULTI_SELECT_TOGGLE',
    payload,
  };
};

export const setMultiSelectFlag = (payload) => {
  return {
    type: 'PREMIUM_PROCESSING_SET_MULTI_SELECT_FLAG',
    payload,
  };
};
export const changeCaseType = (payload) => {
  return {
    type: 'PREMIUM_PROCESSING_CASE_TYPE_CHANGE',
    payload,
  };
};

export const selectSingleCaseRow = (caseData) => {
  return {
    type: 'PREMIUM_PROCESSING_SINGLE_CASES_SELECTED',
    payload: caseData,
  };
};

export const setIsCaseTableHidden = (data) => {
  return {
    type: 'PREMIUM_PROCESSING_SET_IS_TABLEHIDDEN',
    payload: data,
  };
};

export const selectedPremiumProcessingTaskType = (data) => {
  return {
    type: 'PREMIUM_PROCESSING_TASK_TYPE_SELECTED',
    payload: data,
  };
};

export const udpateIsCheckSigningToggle = (type) => {
  return {
    type: 'PREMIUM_PROCESSING_CHECKSIGNING_TOGGLE',
    payload: type,
  };
};
