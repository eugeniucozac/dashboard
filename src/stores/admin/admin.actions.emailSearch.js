import { authLogout } from 'stores';
import * as utils from 'utils';

export const emailSearch = (email) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/admin.actions.emailSearch',
  };

  dispatch(adminEmailSearchRequest(email));

  return new Promise((resolve, reject) => {
    utils.api
      .get({
        token: auth.accessToken,
        endpoint: endpoint.edge,
        path: `api/user/emailId/${email}`,
      })
      .then((response) => utils.api.handleResponse(response))
      .then((json) => utils.api.handleData(json))
      .then((data) => {
        dispatch(adminEmailSearchSuccess(data));
        resolve(data);
      })
      .catch((err) => {
        utils.api.handleError(err, defaultError);
        utils.api.handleUnauthorized(err, dispatch, authLogout);
        dispatch(adminEmailSearchFailure(err));
        reject({
          ...err,
          file: 'stores/admin.actions.emailSearch',
          message: 'API fetch error (admin.emailSearch)',
        });
      });
  });
};

export const adminEmailSearchRequest = (payload) => {
  return {
    type: 'ADMIN_EMAIL_SEARCH_REQUEST',
    payload,
  };
};

export const adminEmailSearchSuccess = (userData) => {
  return {
    type: 'ADMIN_EMAIL_SEARCH_SUCCESS',
    payload: userData,
  };
};

export const adminEmailSearchFailure = (error) => {
  return {
    type: 'ADMIN_EMAIL_SEARCH_FAILURE',
    payload: error,
  };
};
