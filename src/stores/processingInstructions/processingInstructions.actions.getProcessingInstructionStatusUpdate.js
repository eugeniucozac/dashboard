import { authLogout, addLoader, removeLoader, storeProcessingInstruction } from 'stores';
import * as utils from 'utils';

export const getProcessingInstructionStatusUpdate = (instructionId) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = { file: 'stores/processingInstructions.actions.getProcessingInstruction' };
  const putBody = {
    id: instructionId,
    statusId: 5,
  };

  dispatch(getProcessingInstructionStatusRequest({ putBody }));
  dispatch(addLoader('getProcessingInstruction'));

  return utils.api
    .patch({
      token: auth.accessToken,
      endpoint: endpoint.ppService,
      path: `instruction`,
      data: putBody,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      const processingInstruction = data.data;
      dispatch(getProcessingInstructionStatusSuccess(processingInstruction));
      dispatch(storeProcessingInstruction(processingInstruction));
    })
    .catch((err) => {
      utils.api.handleError(err, { ...defaultError, message: 'API fetch error (processingInstructions.getProcessingInstructionId)' });
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(getProcessingInstructionStatusFailure(err));
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('getProcessingInstruction'));
    });
};

export const getProcessingInstructionStatusRequest = (payload) => {
  return {
    type: 'PROCESSING_INSTRUCTIONS_GET_INSTRUCTION_STATUS_REQUEST',
    payload,
  };
};

export const getProcessingInstructionStatusSuccess = (data) => {
  return {
    type: 'PROCESSING_INSTRUCTIONS_GET_INSTRUCTION_STATUS_SUCCESS',
    payload: data,
  };
};

export const getProcessingInstructionStatusFailure = (error) => {
  return {
    type: 'PROCESSING_INSTRUCTIONS_GET_INSTRUCTION_FAILURE',
    payload: error,
  };
};
