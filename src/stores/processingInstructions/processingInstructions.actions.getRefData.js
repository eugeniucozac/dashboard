import * as utils from 'utils';
import { authLogout } from 'stores';

export const getPiRefData = (type, query) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/processingInstructions.actions.getPiRefData',
  };

  dispatch(getPiRefDataRequest(type, query));

  const typeObj = {
    assureds: {
      path: `instruction/refdata/assured/${query}`,
      isQueryMandatory: true,
    },
    ids: {
      path: `instruction/refdata/instructionId/${query}`,
      isQueryMandatory: true,
    },
    status: {
      path: 'instruction/refdata/instructionStatus',
      isQueryMandatory: false,
    },
  };

  if (!type || !Object.keys(typeObj).includes(type)) {
    dispatch(getPiRefDataFailure({ ...defaultError, message: 'Missing or invalid refData type' }));
    return;
  }

  if (!query && typeObj[type].isQueryMandatory) {
    dispatch(getPiRefDataFailure({ ...defaultError, message: 'Missing search query' }));
    return;
  }

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.ppService,
      path: typeObj[type].path,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(getPiRefDataSuccess(type, data.data));
      return data.data;
    })
    .catch((err) => {
      utils.api.handleError(err, { ...defaultError, message: 'API fetch error (processingInstructions.getPiRefData)' });
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(getPiRefDataFailure(err));
      return err;
    });
};

export const getPiRefDataRequest = (type, query) => {
  return {
    type: 'PROCESSING_INSTRUCTIONS_GET_REF_DATA_REQUEST',
    payload: { type, query },
  };
};

export const getPiRefDataSuccess = (type, responseData) => {
  switch (type) {
    case 'assureds':
      return {
        type: 'PROCESSING_INSTRUCTIONS_GET_ASSUREDS_BY_NAME_SUCCESS',
        payload: responseData,
      };
    case 'ids':
      return {
        type: 'PROCESSING_INSTRUCTIONS_GET_IDS_SUCCESS',
        payload: responseData,
      };
    case 'status':
      return {
        type: 'PROCESSING_INSTRUCTIONS_GET_STATUSES_SUCCESS',
        payload: responseData,
      };
    default:
      return {
        type: 'PROCESSING_INSTRUCTIONS_GET_REF_DATA_SUCCESS',
        payload: responseData,
      };
  }
};

export const getPiRefDataFailure = (error) => {
  return {
    type: 'PROCESSING_INSTRUCTIONS_GET_REF_DATA_FAILURE',
    payload: error,
  };
};
