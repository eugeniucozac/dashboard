const initialState = {
  emsInboxList: [],
  emsExistingDocuments: [],
};

const emailManagementServiceReducers = (state = initialState, action) => {
  switch (action.type) {
    case 'EMS_INBOX_LIST_SUCCESS':
      return {
        ...state,
        emsInboxList: action.payload,
      };
    case 'EMS_EXISTING_DOCUMENTS_SUCCESS':
      return {
        ...state,
        emsExistingDocuments: action.payload,
      };

    case 'EMS_INBOX_LIST_RESET':
      return {
        ...state,
        emsInboxList: [],
      };
    case 'EMS_EXISTING_DOCUMENTS_RESET':
      return {
        ...state,
        emsExistingDocuments: [],
      };

    default:
      return state;
  }
};

export default emailManagementServiceReducers;
