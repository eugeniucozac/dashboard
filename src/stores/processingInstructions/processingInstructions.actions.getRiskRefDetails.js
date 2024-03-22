import * as utils from 'utils';

//app
import { authLogout, addLoader, removeLoader, enqueueNotification, getEndorsementValues } from 'stores';

export const getRiskReferenceDetails = (referenceId, selectedProcess) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/fileUpload.actions.getRiskRefDetails',
  };
  const endpointParams = {
    processType: selectedProcess.split(' ').join(''),
  };

  dispatch(getRiskReferenceDetailsRequest(referenceId));
  dispatch(addLoader('getRiskReferenceDetails'));

  if (!referenceId) {
    dispatch(getRiskReferenceDetailsFailure({ ...defaultError, message: 'Missing parameters' }));
    return;
  }

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.ppService,
      path: `risk/reference/details/${referenceId}`,
      params: endpointParams,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(getRiskReferenceDetailsSuccess(data.data[0]));
      const isEndorsement = utils.processingInstructions.isEndorsement(data.data[0]?.processTypeId);
      const isFeeAndAmendment = utils.processingInstructions.isEndorsement(data.data[0]?.processTypeId);
      if (data.data[0]) {
        if (isEndorsement || isFeeAndAmendment) {
          dispatch(getEndorsementValues(data.data[0].xbPolicyId, data.data[0].xbInstanceId));
        }
        dispatch(enqueueNotification('processingInstructions.successfulRiskRefAdded', 'success'));
        return data.data[0];
      } else {
        dispatch(
          enqueueNotification(
            utils.string.t('processingInstructions.addRiskReference.noEndorsementValueAssociatedWithRiskRef', {
              riskRefId: referenceId,
            }),
            'warning'
          )
        );
      }
    })
    .catch((err) => {
      utils.api.handleError(err, { ...defaultError, message: 'API fetch error (processingInstructions.getRiskRefDetails)' });
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(getRiskReferenceDetailsFailure(err));
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('getRiskReferenceDetails'));
    });
};

export const getRiskReferenceDetailsRequest = (referenceId) => {
  return {
    type: 'PROCESSING_INSTRUCTIONS_GET_RISK_REF_DETAILS_REQUEST',
    payload: referenceId,
  };
};

export const getRiskReferenceDetailsSuccess = (guiResponseList) => {
  return {
    type: 'PROCESSING_INSTRUCTIONS_GET_RISK_REF_DETAILS_SUCCESS',
    payload: guiResponseList,
  };
};

export const getRiskReferenceDetailsFailure = (error) => {
  return {
    type: 'PROCESSING_INSTRUCTIONS_GET_RISK_REF_DETAILS_FAILURE',
    payload: error,
  };
};
