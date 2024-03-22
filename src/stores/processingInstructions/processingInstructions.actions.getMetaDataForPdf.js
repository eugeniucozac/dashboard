import * as utils from 'utils';
import * as constants from 'consts';

export const getMetaDataForPdf = (params) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }, } } = getState();

  const { leadRef, instruction } = params;

  const defaultError = {
    file: 'stores/processingInstructions.actions.getMetaDataForPdf',
  };

  dispatch(getMetaDataForPdfRequest(params));

  const queryParams = {
    sectionType: constants.DMS_CONTEXT_POLICY,
    sourceId: leadRef?.xbInstanceId,
    referenceId: leadRef?.xbPolicyId,
    sectionRef: instruction?.id,
  };

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.dmsService,
      path: 'data/context/details',
      params: queryParams,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(getMetaDataForPdfSuccess(data.data));
      return data;
    })
    .catch((err) => {
      utils.api.handleError(err, { ...defaultError, message: 'API fetch error (processingInstructions.getMetaDataForPdf)' });
      dispatch(getMetaDataForPdfFailure(err));
      return err;
    });
};

export const getMetaDataForPdfRequest = (params) => {
  return {
    type: 'PROCESSING_INSTRUCTIONS_GET_META_DATA_REQUEST',
    payload: params,
  };
};

export const getMetaDataForPdfSuccess = (data) => {
  return {
    type: 'PROCESSING_INSTRUCTIONS_GET_META_DATA_SUCCESS',
    payload: data,
  };
};

export const getMetaDataForPdfFailure = (error) => {
  return {
    type: 'PROCESSING_INSTRUCTIONS_GET_META_DATA_FAILURE',
    payload: error,
  };
};
