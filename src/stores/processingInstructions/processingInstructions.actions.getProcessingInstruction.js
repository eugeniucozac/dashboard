import { authLogout, addLoader, removeLoader, storeProcessingInstruction, storeProcessingInstructionDocuments } from 'stores';
import * as utils from 'utils';

export const getProcessingInstruction = (id) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = { file: 'stores/processingInstructions.actions.getProcessingInstruction' };

  dispatch(getProcessingInstructionRequest(id));
  dispatch(addLoader('getProcessingInstruction'));

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.ppService,
      path: `instruction/${id}`,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      const processingInstruction = data.data;
      dispatch(getProcessingInstructionSuccess(processingInstruction));
      dispatch(storeProcessingInstruction(processingInstruction));

      // add all documents data to documents redux store to handle upload and download
      const documents = {
        riskReferences: processingInstruction?.riskReferences || [],
        premiumTaxDocument: processingInstruction?.details?.premiumTaxDocument || null,
        signedLinesDocument: processingInstruction?.details?.signedLinesDocument || null,
      };

      dispatch(storeProcessingInstructionDocuments(documents));
      return processingInstruction;
    })
    .catch((err) => {
      utils.api.handleError(err, { ...defaultError, message: 'API fetch error (processingInstructions.getProcessingInstructionId)' });
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(getProcessingInstructionFailure(err));
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('getProcessingInstruction'));
    });
};

export const getProcessingInstructionRequest = (id) => {
  return {
    type: 'PROCESSING_INSTRUCTIONS_GET_INSTRUCTION_REQUEST',
    payload: id,
  };
};

export const getProcessingInstructionSuccess = (data) => {
  return {
    type: 'PROCESSING_INSTRUCTIONS_GET_INSTRUCTION_SUCCESS',
    payload: data,
    id: data.id,
  };
};

export const getProcessingInstructionFailure = (error) => {
  return {
    type: 'PROCESSING_INSTRUCTIONS_GET_INSTRUCTION_FAILURE',
    payload: error,
  };
};
