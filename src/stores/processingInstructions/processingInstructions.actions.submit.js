import { addLoader,authLogout, removeLoader, storeProcessingInstruction } from 'stores';
import * as utils from 'utils';

export const submitProcessingInstruction = (instruction) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/processingInstructions.actions.submit',
  };

  dispatch(addLoader('submitInstruction'));

  if (!instruction || !instruction?.id) {
    dispatch(submitInstructionFailure({ ...defaultError, message: 'Missing instruction or invalid instruction ID' }));
    dispatch(removeLoader('submitInstruction'));
    return;
  }
  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.ppService,
      data: instruction,
      path: 'instruction/submit',
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(submitInstructionSuccess(data.data));
      dispatch(storeProcessingInstruction(data.data));
      return data;
    })
    .catch((err) => {
      utils.api.handleError(err, { ...defaultError, message: 'API fetch error (submitInstruction)' });    
      dispatch(submitInstructionFailure(err));
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('submitInstruction'));
    });
};

export const submitInstructionRequest = (values, instruction) => {
  return {
    type: 'PROCESSING_INSTRUCTION_SUBMIT_REQUEST',
    payload: { values, instruction },
  };
};

export const submitInstructionSuccess = (json) => {
  return {
    type: 'PROCESSING_INSTRUCTION_SUBMIT_SUCCESS',
    payload: json,
  };
};

export const submitInstructionFailure = (error) => {
  return {
    type: 'PROCESSING_INSTRUCTION_SUBMIT_FAILURE',
    payload: error,
  };
};
