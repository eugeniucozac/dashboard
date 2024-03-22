import { addLoader, authLogout, removeLoader } from 'stores';
import * as utils from 'utils';
import { SOURCE_ID_CLAIMS } from 'consts';

export const getQueryCodeList = () => (dispatch, getState) => {
  // prettier-ignore

  const { user: { auth }, config: { vars: { endpoint } } } = getState();

  const defaultError = {
    file: 'stores/claims.actions.getQueryCodeList',
  };

  const businessProcessCode = SOURCE_ID_CLAIMS;

  dispatch(getQueryCodeListRequest({ businessProcessCode }));
  dispatch(addLoader('getQueryCodeList'));

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.odsService,
      path: `referenceData/business/${businessProcessCode}`,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(getQueryCodeListSuccess(data.data));
      return data;
    })
    .catch((err) => {
      utils.api.handleError(err, defaultError);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(getQueryCodeListFailure(err));
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('getQueryCodeList'));
    });
};

export const getQueryCodeListRequest = (params) => {
  return {
    type: 'CLAIMS_QUERY_CODE_LIST_GET_REQUEST',
    payload: params,
  };
};

export const getQueryCodeListSuccess = (data) => {
  return {
    type: 'CLAIMS_QUERY_CODE_LIST_GET_SUCCESS',
    payload: data,
  };
};

export const getQueryCodeListFailure = (error) => {
  return {
    type: 'CLAIMS_QUERY_CODE_LIST_GET_FAILURE',
    payload: error,
  };
};
