import * as utils from 'utils';
import { addLoader, removeLoader, authLogout } from 'stores';

export const getEmsInboxList = (params) => (dispatch, getState) => {
  const {
    user: { auth },
    config: {
      vars: { endpoint },
    },
  } = getState();

  const defaultError = {
    file: 'stores/emailManagementService.actions.getEmsInboxList',
  };

  dispatch(getEmsInboxListGetRequest(params));
  dispatch(addLoader('getEmsInboxList'));

  const validFormData = params?.objectId && params?.objectCode && params?.emailType;

  if (!validFormData) {
    dispatch(removeLoader('getEmsInboxList'));
    return;
  }

  const { objectId, objectCode, emailType } = params;

  const queryParams = {
    objectId,
    objectCode,
    emailType,
  };

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.notificationService,
      path: 'email/object',
      params: queryParams,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      // check that response is valid
      // sometimes API fails and return an empty string instead of array
      if (data?.data) {
        dispatch(getEmsInboxListSuccess(data.data));
      } else {
        return Promise.reject({ message: 'Invalid ems string returned by API' });
      }
      return data;
    })
    .catch((error) => {
      utils.api.handleError(error, { ...defaultError, message: 'API fetch error (getEmsInboxList)' });
      utils.api.handleUnauthorized(error, dispatch, authLogout);
      dispatch(getEmsInboxListError(error));
      return error;
    })
    .finally(() => {
      dispatch(removeLoader('getEmsInboxList'));
    });
};

export const getEmsInboxListGetRequest = (params) => {
  return {
    type: 'EMS_INBOX_LIST_REQUEST',
    payload: params,
  };
};

export const getEmsInboxListSuccess = (data) => {
  return {
    type: 'EMS_INBOX_LIST_SUCCESS',
    payload: data,
  };
};

export const getEmsInboxListError = (error) => {
  return {
    type: 'EMS_INBOX_LIST_ERROR',
    payload: error,
  };
};
