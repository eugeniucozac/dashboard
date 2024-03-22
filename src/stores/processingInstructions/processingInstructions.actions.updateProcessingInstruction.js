import { addLoader, authLogout, removeLoader, storeProcessingInstruction, enqueueNotification } from 'stores';
import * as utils from 'utils';

export const updateProcessingInstruction = (instruction) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/processingInstructions.actions.updateProcessingInstruction',
  };

  dispatch(updateProcessingInstructionRequest(instruction));
  dispatch(addLoader('updateProcessingInstruction'));

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.ppService,
      path: 'instruction/updateInstructionDetails',
      data: instruction,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(updateProcessingInstructionSuccess(data.data));
      dispatch(storeProcessingInstruction(data.data));
      return data;
    })
    .catch((err) => {
      utils.api.handleError(err, { ...defaultError, message: 'API fetch error (updateProcessingInstruction)' });
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(updateProcessingInstructionFailure(err));
      dispatch(enqueueNotification('app.somethingWentWrong', 'warning'));
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('updateProcessingInstruction'));
    });
};

export const updateProcessingInstructionRequest = (instruction) => {
  return {
    type: 'PROCESSING_INSTRUCTIONS_UPDATE_PROCESSING_INSTRUCTION_REQUEST',
    payload: instruction,
  };
};

export const updateProcessingInstructionSuccess = (json) => {
  return {
    type: 'PROCESSING_INSTRUCTIONS_UPDATE_PROCESSING_INSTRUCTION_SUCCESS',
    payload: json,
  };
};

export const updateProcessingInstructionFailure = (error) => {
  return {
    type: 'PROCESSING_INSTRUCTIONS_UPDATE_PROCESSING_INSTRUCTION_FAILURE',
    payload: error,
  };
};
