import { addLoader, removeLoader, authLogout, enqueueNotification, storeProcessingInstruction } from 'stores';
import * as utils from 'utils';

export const approveOrRejectInstruction = (id, comments, type) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/processingInstructions.actions.submit',
  };

  if (!id || !['APPROVE', 'REJECT'].includes(type)) {
    dispatch(approveInstructionFailure({ ...defaultError, message: 'Invalid data for approve/reject api' }));
    return;
  }

  dispatch(addLoader('approveInstruction'));

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.ppService,
      data: { notes: comments, type: type },
      path: `instruction/approval/${id}`,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      const instruction = data.data;
      dispatch(approveInstructionSuccess(instruction));
      dispatch(storeProcessingInstruction(instruction));
      dispatch(enqueueNotification(`processingInstructions.authorisations.${type.toLowerCase()}.notification.success`, 'success'));
      return instruction;
    })
    .catch((err) => {
      utils.api.handleError(err, { ...defaultError, message: 'API fetch error (approveInstruction)' });
      dispatch(enqueueNotification(`processingInstructions.authorisations.${type.toLowerCase()}.notification.failed`, 'error'));
      dispatch(approveInstructionFailure(err));
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('approveInstruction'));
    });
};

export const approveInstructionRequest = (values, instruction) => {
  return {
    type: 'PROCESSING_INSTRUCTION_APPROVE_REQUEST',
    payload: { values, instruction },
  };
};

export const approveInstructionSuccess = (json) => {
  return {
    type: 'PROCESSING_INSTRUCTION_APPROVE_SUCCESS',
    payload: json,
  };
};

export const approveInstructionFailure = (error) => {
  return {
    type: 'PROCESSING_INSTRUCTION_APPROVE_FAILURE',
    payload: error,
  };
};
