import get from 'lodash/get';
import { createSelector } from 'reselect';

export const selectRiskRefsForProcessingInstruction = (state) => get(state, 'processingInstructions.riskReferences') || [];
export const selectPiGridDataLoading = (state) => get(state, 'processingInstructions.isPiGridDataLoading') || false;
export const selectPiHasNoGridData = (state) => get(state, 'processingInstructions.isPiHasNoGridData') || false;
export const selectProcessingInstructions = (state) => get(state, 'processingInstructions.instructions') || {};
export const selectUsersInRoles = (state) => get(state, 'processingInstructions.usersInRoles') || [];
export const selectPiProducingBrokers = (state) => get(state, 'processingInstructions.producingBrokers') || [];
export const selectPiAccountExecutives = (state) => get(state, 'processingInstructions.accountExecutives') || [];
export const selectPiFacilityTypes = (state) => get(state, 'processingInstructions.facilityTypes') || [];
export const selectPiDepartmentList = (state) => get(state, 'processingInstructions.departmentList') || [];
export const getDocumentsInfo = (state) => get(state, 'processingInstructions.documents') || {};
export const selectWorkFlowFrontEndContactNamesForRiskReference = (state) =>
  get(state, 'processingInstructions.workFlowFrontEndContacts') || [];
export const selectProducingBrokerNamesForRiskReference = (state) => get(state, 'processingInstructions.producingBrokerNames') || [];
export const selectAccountExecutivesForRiskReference = (state) => get(state, 'processingInstructions.piAccountExecutives') || [];
export const getSelectedRiskRefInfo = (state) => get(state, 'processingInstructions.selectedRiskRef') || {};
export const getRiskReferencesDocumentsCountList = (state) => get(state, 'processingInstructions.riskReferencesDocumentsCountList') || [];
export const getIsRiskReferenceDocumentCountLoading = (state) =>
  get(state, 'processingInstructions.isRiskReferenceDocumentCountLoading') || false;

export const selectProcessingInstructionById = (id) => {
  return createSelector(selectProcessingInstructions, (items) => {
    return items[id];
  });
};
