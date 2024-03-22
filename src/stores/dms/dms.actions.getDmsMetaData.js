//app
import { authLogout } from 'stores';
import * as utils from 'utils';

export const getDmsMetaData = (context, selectedSourceId, metaDataSectionRef) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint } }, dms: { contextSubType = ''} } = getState();

  const defaultError = {
    file: 'stores/claims.actions.getDmsMetaData',
  };

  // eslint-disable-next-line
  const { sectionType, sourceId, divisionId, sectionRef, referenceId } = utils.dmsFormatter.getMetaDataParams(
    getState(),
    context,
    selectedSourceId,
    metaDataSectionRef,
    contextSubType
  ); // TODO once it is converted to prop approach, we can get rid of this function

  // abort invalid call
  if (!sectionType || !sourceId || !referenceId) {
    dispatch(getDmsMetaDataFailure({ ...defaultError, message: 'Missing requests params' }));
    return;
  }

  const params = {
    sectionType, // corresponds to contexts: Loss, Claims, Tasks, Case
    sourceId, // is non-mandatory for Loss context
    ...(divisionId ? { divisionId } : {}), // is needed for Claims and Loss contexts
    referenceId, // corresponds to ClaimId, lossDetailID, policyId etc
    sectionRef, // corresponds to ClaimRef, lossDetailRef, policyRef etc
  };

  dispatch(getDmsMetaDataRequest({ context, referenceId, sectionRef })); // In future referenceId, sectionRef will be passed as params

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.dmsService,
      path: 'data/context/details',
      params,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(getDmsMetaDataSuccess(data?.data));
      return data;
    })
    .catch((err) => {
      const defaultError = {
        file: 'stores/dms.actions.getMetaData',
      };

      utils.api.handleError(err, defaultError);
      dispatch(getDmsMetaDataFailure(err));
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      return err;
    });
};

export const getDmsMetaDataRequest = (params) => {
  return {
    type: 'DMS_METADATA_GET_REQUEST',
    payload: params,
  };
};

export const getDmsMetaDataSuccess = (data) => {
  return {
    type: 'DMS_METADATA_GET_SUCCESS',
    payload: data,
  };
};

export const getDmsMetaDataFailure = (err) => {
  return {
    type: 'DMS_METADATA_GET_ERROR',
    payload: err,
  };
};
