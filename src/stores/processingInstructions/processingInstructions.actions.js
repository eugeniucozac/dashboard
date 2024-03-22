export const updateAdvancedSearchSelected = (riskRefDetails) => {
  return {
    type: 'PROCESSING_INSTRUCTIONS_UPDATE_ADVANCED_SEARCH_SELECTED',
    payload: riskRefDetails,
  };
};

export const storeProcessingInstruction = (data) => {
  return {
    type: 'PROCESSING_INSTRUCTIONS_STORE_BY_ID',
    payload: data,
    id: data.id,
  };
};

export const resetProcessingInstruction = () => {
  return {
    type: 'PROCESSING_INSTRUCTIONS_RESET',
  };
};

export const storeProcessingInstructionDocuments = (data) => {
  return {
    type: 'PROCESSING_INSTRUCTIONS_DOCUMENTS_STORE',
    payload: data,
  };
};

export const storeNonPremiumValue = (data) => {
  return {
    type: 'PROCESSING_INSTRUCTIONS_STORE_NON_PREMIUM_VALUE',
    payload: data,
  };
};

export const resetPiSearchParams = () => {
  return {
    type: 'PROCESSING_INSTRUCTIONS_GRID_DATA_RESET_SEARCH',
  };
};

export const storeRetainedBrokerageAmountForPdf = (retainedBrokerageAmount) => {
  return {
    type: 'PROCESSING_INSTRUCTIONS_STORE_RETAINED_BROKERAGE_AMOUNT',
    payload: retainedBrokerageAmount,
  };
};

export const storeTotalAmountForPdf = (totalAmount) => {
  return {
    type: 'PROCESSING_INSTRUCTIONS_STORE_TOTAL_AMOUNT',
    payload: totalAmount,
  };
};

export const storeResetAllState = (resetAllState) => {
  return {
    type: 'PROCESSING_INSTRUCTIONS_RESET_ALL',
    payload: resetAllState,
  };
};

export const setSelectedRiskRef = (riskRef) => {
  return {
    type: 'PROCESSING_INSTRUCTIONS_SELECTED_RISKREF',
    payload: riskRef,
  };
};

export const resetSelectedRiskRef = () => {
  return {
    type: 'PROCESSING_INSTRUCTIONS_RESET_SELECTED_RISKREF',
  };
};

export const updateReferenceDocumentCountDetails = (refData) => {
  return {
    type: 'REFERENCE_DOCUMENT_COUNT_DETAILS_UPDATE',
    payload: refData,
  };
};
export const updateReferenceDocumentCountLoading = (flagValue) => {
  return {
    type: 'RISK_REFERENCE_DOCUMENTS_COUNT_LOADING',
    payload: flagValue,
  };
};
export const updatePiGridDataLoading = (flagValue) => {
  return {
    type: 'PROCESSING_INSTRUCTIONS_GRID_DATA_LOADING',
    payload: flagValue,
  };
};
export const updatePiHasNoGridData = (flagValue) => {
  return {
    type: 'PROCESSING_INSTRUCTIONS_HAS_NO_GRID_DATA',
    payload: flagValue,
  };
};

export const updatePiFinancialCheckList = (dataList) => {
  return {
    type: 'PROCESSING_INSTRUCTIONS_UPDATE_FINANCIAL_CHECKLIST',
    payload: dataList,
  };
};
export const savePIRetainedBrokerageAmountData = (data) => {
  return {
    type: 'PROCESSING_INSTRUCTIONS_RETAINED_BROKERAGE_AMOUNT',
    payload: data,
  };
};

export const resetCopiedExcelData = () => {
  return {
    type: 'PROCESSING_INSTRUCTIONS_RESET_COPIED_EXCEL_DATA',
  };
};
