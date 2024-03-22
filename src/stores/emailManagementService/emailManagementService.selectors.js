import get from 'lodash/get';

export const selectEmsInboxList = (state) => get(state, 'emailManagementService.emsInboxList') || [];
export const selectEmsExistingDocuments = (state) => get(state, 'emailManagementService.emsExistingDocuments') || [];
