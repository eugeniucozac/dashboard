import * as utils from 'utils';
import { authLogout, addLoader, enqueueNotification, removeLoader, hideModal } from 'stores';

export const premiumProcessingCheckSigningRejectCreateCase = (params) => (dispatch, getState) => {
  const {
    user: { auth },
    config: {
      vars: { endpoint },
    },
  } = getState();

  const defaultError = {
    file: 'stores/premiumProcessing.actions.postCheckSigningRejectCreateCase',
  };

  const selectedCasesData = params?.selectedCases[0];
  const { workPackageReference, packageSubmittedDate, bureauList } = params?.checkSignData;
  const selectedBureauList = bureauList.map((list) => list.id);
  const requestBody = {
    caseId: selectedCasesData?.caseId,
    workPackageReference: workPackageReference,
    packageSubmittedOn: packageSubmittedDate,
    riskReferenceId: selectedCasesData?.policyRef,
    department: selectedCasesData?.departmentName,
    gxbInstance: selectedCasesData?.xbInstanceId,
    bureauList: selectedBureauList,
  };

  dispatch(premiumProcessingCheckSigningRejectCreateCaseRequest(requestBody));
  dispatch(addLoader('premiumProcessingCheckSigningRejectCreateCase'));

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.bpmService,
      path: 'checksigning/task/rejectAndCreateNewCase',
      data: requestBody,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(premiumProcessingCheckSigningRejectCreateCaseSuccess(data?.data));
      dispatch(enqueueNotification('premiumProcessing.checkSigningReject.rejectCreateCase', 'success'));
      dispatch(hideModal());
      return data;
    })
    .catch((error) => {
      utils.api.handleError(error, {
        ...defaultError,
        message: 'API fetch error (premiumProcessing.premiumProcessingCheckSigningRejectCreateCase)',
      });
      dispatch(premiumProcessingCheckSigningRejectCreateCaseError(error));
      dispatch(enqueueNotification('premiumProcessing.checkSigningReject.rejectFailureMessage', 'error'));
      utils.api.handleUnauthorized(error, dispatch, authLogout);
      return error;
    })
    .finally(() => {
      dispatch(removeLoader('premiumProcessingCheckSigningRejectCreateCase'));
      dispatch(hideModal());
    });
};

export const premiumProcessingCheckSigningRejectCreateCaseRequest = (payload) => {
  return {
    type: 'PREMIUM_PROCESSING_CHECK_SIGNING_REJECT_CREATE_REQUEST',
    payload,
  };
};

export const premiumProcessingCheckSigningRejectCreateCaseSuccess = (data) => {
  return {
    type: 'PREMIUM_PROCESSING_CHECK_SIGNING_REJECT_CREATE_SUCCESS',
    payload: data,
  };
};

export const premiumProcessingCheckSigningRejectCreateCaseError = (error) => {
  return {
    type: 'PREMIUM_PROCESSING_CHECK_SIGNING_REJECT_CREATE_ERROR',
    payload: error,
  };
};
