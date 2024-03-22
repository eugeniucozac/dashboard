import * as utils from 'utils';

//app
import { authLogout } from 'stores';

export const getNewInstructionsId = (params) => (dispatch, getState) => {
  const state = getState();
  const {
    user: { auth },
    user,
    config: {
      vars: { endpoint },
    },
  } = state;

  const { businessProcessID, processTypeID } = params;

  const defaultError = {
    file: 'stores/processingInstructions.actions.getNewInstructionsId',
  };

  dispatch(getNewInstructionsIdRequest());

  const getParams = {
    businessProcessId: businessProcessID,
    processTypeId: processTypeID,
    lastVisitedPage: 'grid',
    createdDate: utils.date.toISOString(new Date()),
    updatedDate: utils.date.toISOString(new Date()),
    createdBy: user.id,
    updatedBy: user.id,
  };

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.ppService,
      path: 'instruction',
      data: getParams,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(getNewInstructionsIdSuccess(data.data));
      return data.data;
    })
    .catch((err) => {
      utils.api.handleError(err, { ...defaultError, message: 'API fetch error (processingInstructions.getNewInstructionsId)' });
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(getNewInstructionsIdFailure(err));
      return err;
    });
};

export const getNewInstructionsIdRequest = () => {
  return {
    type: 'PROCESSING_INSTRUCTIONS_GET_NEW_INSTRUCTIONS_ID_REQUEST',
  };
};

export const getNewInstructionsIdSuccess = (response) => {
  return {
    type: 'PROCESSING_INSTRUCTIONS_GET_NEW_INSTRUCTIONS_ID_SUCCESS',
    payload: response,
  };
};

export const getNewInstructionsIdFailure = (error) => {
  return {
    type: 'PROCESSING_INSTRUCTIONS_GET_NEW_INSTRUCTIONS_ID_FAILURE',
    payload: error,
  };
};
