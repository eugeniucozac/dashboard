import * as utils from 'utils';
import types from './types';
import { authLogout, addLoader, removeLoader } from 'stores';

export const getDmsDocuments = () => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint } }, ui: { dmsContext }, dms: { contextSubType: { type } } } = getState();

  // eslint-disable-next-line
  const referenceId = utils.dmsFormatter.getContextReferenceId(getState(), dmsContext, type);

  const params = {
    sectionType: dmsContext,
    referenceId,
    // TODO - to be removed. Hardcode it for now
    sourceId: 1,
    srcApplication: 'edge',
  };

  dispatch(getDmsDocumentsRequest());
  dispatch(addLoader('getDmsDocuments'));

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.dmsService,
      path: 'dms/document',
      params,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then(({ data }) => {
      return dispatch(getDmsDocumentsSuccess(data));
    })
    .catch((err) => {
      const defaultError = {
        file: 'stores/dms.actions.getDmsDocuments',
      };

      utils.api.handleError(err, defaultError);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      return dispatch(getDmsDocumentsFailure(err));
    })
    .finally(() => {
      dispatch(removeLoader('getDmsDocuments'));
    });
};

export const getDmsDocumentsRequest = () => {
  return {
    type: types.GET_DMS_DOCUMENT_PENDING,
  };
};

export const getDmsDocumentsSuccess = (data) => {
  return {
    type: types.GET_DMS_DOCUMENT_SUCCESS,
    payload: data,
  };
};

export const getDmsDocumentsFailure = (err) => {
  return {
    type: types.GET_DMS_DOCUMENT_REJECTED,
    payload: err,
  };
};
