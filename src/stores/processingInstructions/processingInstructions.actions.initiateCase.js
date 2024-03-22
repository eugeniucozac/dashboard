import * as utils from 'utils';
import { authLogout, enqueueNotification, storeProcessingInstruction } from 'stores';

export const initiateCase = (instruction) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();
  const { id } = instruction;
  const defaultError = {
    file: 'stores/processingInstructions.actions.initiateCase',
  };

  dispatch(initiateCaseRequest(id));

  if (!id) {
    dispatch(initiateCaseFailure({ ...defaultError, message: 'Missing instruction id' }));
    return;
  }
  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.ppService,
      path: `instruction/initiateCase/${id}`,
      data: instruction,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      const instruction = data.data;
      dispatch(initiateCaseSuccess(instruction));
      dispatch(storeProcessingInstruction(instruction));
      dispatch(enqueueNotification('processingInstructions.authorisations.caseInitiation', 'success'));
      return instruction;
    })
    .catch((err) => {
      utils.api.handleError(err, { ...defaultError, message: 'API fetch error (processingInstructions.initiateCase)' });
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(initiateCaseFailure(err));
      return err;
    });
};

export const initiateCaseRequest = (payload) => {
  return {
    type: 'PROCESSING_INSTRUCTIONS_INITIATE_CASE_REQUEST',
    payload,
  };
};

export const initiateCaseSuccess = (responseData) => {
  return {
    type: 'PROCESSING_INSTRUCTIONS_INITIATE_CASE_SUCCESS',
    payload: responseData,
  };
};

export const initiateCaseFailure = (error) => {
  return {
    type: 'PROCESSING_INSTRUCTIONS_INITIATE_CASE_FAILURE',
    payload: error,
  };
};
