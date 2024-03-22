export const resetDmsDocumentsSearch = () => (dispatch) => {
  dispatch({
    type: 'DMS_SEARCH_DOCUMENTS_RESET',
  });
};

export const resetDmsDocumentsUpload = () => (dispatch) => {
  dispatch({
    type: 'DMS_UPLOAD_DOCUMENTS_RESET',
  });
};

export const resetDmsDocumentsView = () => (dispatch) => {
  dispatch({
    type: 'DMS_VIEW_DOCUMENTS_RESET',
  });
};

export const resetDmsDocumentsHistory = () => (dispatch) => {
  dispatch({
    type: 'DMS_HISTORY_DOCUMENTS_RESET',
  });
};

export const resetDmsEditMetadata = () => (dispatch) => {
  dispatch({
    type: 'DMS_EDIT_META_DATA_RESET',
  });
};

export const setDmsTaskContextType = (data) => (dispatch) => {
  dispatch({
    type: 'DMS_TASK_CONTEXT_TYPE_SET',
    payload: data,
  });
};

export const resetDmsTaskTypeContext = () => (dispatch) => {
  dispatch({
    type: 'DMS_TASK_CONTEXT_TYPE_RESET',
  });
};

export const resetPostStatus = (payload) => {
  return {
    type: 'RESET_DMS_UPLOAD_STATUS',
    payload,
  };
};

export const setDmsWidgetExpand = (payload) => {
  return {
    type: 'DMS_WIDGET_EXPANDED',
    payload,
  };
};

export const setDmsDocViewerState = (payload) => {
  return {
    type: 'DMS_DOC_VIEWER_SET_STATE',
    payload,
  };
};

export const setDmsAdvSearchData = (payload) => {
  return {
    type: 'DMS_ADVANCE_SEARCH_VALUES',
    payload,
  };
};

export const resetDmsAdvSearchValues = () => {
  return {
    type: 'RESET_ADVANCE_SEARCH_VALUES',
  };
};

export const resetWidgetClaimsMetadata = () => {
  return {
    type: 'RESET_WIDGET_CLAIMS_METADATA',
  };
};

export const resetDmsWidgetDocuments = () => {
  return {
    type: 'RESET_DMS_WIDGET_DOCUMENTS',
  };
};

export const uploadClientSideDmsDocuments = (payload) => {
  return {
    type: 'DMS_CLIENT_SIDE_UPLOAD_DOCUMENTS',
    payload,
  };
};

export const setDmsClientSideUploadedDocumentsName = (payload) => {
  return {
    type: 'DMS_CLIENT_SIDE_GET_UPLOADED_DOCUMENT_NAMES',
    payload,
  };
};

export const resetDmsClientSideUploadedDocuments = (payload) => {
  return {
    type: 'RESET_DMS_CLIENT_SIDE_UPLOADED_DOCUMENT',
    payload,
  };
};

export const removeDmsClientSideUploadedDocuments = (payload) => {
  return {
    type: 'REMOVE_DMS_CLIENT_SIDE_UPLOADED_DOCUMENT',
    payload,
  };
};

export const linkClientSideDmsDocuments = (payload) => {
  return {
    type: 'DMS_CLIENT_SIDE_LINK_DOCUMENTS',
    payload,
  };
};

export const resetDmsClientSideLinkedDocuments = (payload) => {
  return {
    type: 'RESET_DMS_CLIENT_SIDE_LINKED_DOCUMENT',
    payload,
  };
};
