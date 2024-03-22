import * as utils from 'utils';
import * as constants from 'consts';
import { authLogout, addLoader, enqueueNotification, removeLoader, hideModal } from 'stores';

export const premiumProcessingCheckSigningCase = (params) => (dispatch, getState) => {
  const {
    user: { auth },
    config: {
      vars: { endpoint },
    },
  } = getState();

  dispatch(addLoader('premiumProcessingCheckSigningCase'));
  const defaultError = {
    file: 'stores/premiumProcessing.actions.postCheckSigningCase',
  };
  if (!params) {
    dispatch(premiumProcessingCheckSigningCaseError({ ...defaultError, message: 'Missing parameters' }));
    dispatch(enqueueNotification('notification.submission.fail', 'error'));
    dispatch(removeLoader('premiumProcessingCheckSigningCase'));
    return;
  }

  const selectedCasesData = params?.selectedCase;
  const { workPackageReference, bureauList, riskReferenceId, department, packageSubmittedOn } = params.checkSignData;
  const selectedBureauList = bureauList.map((list) => list.id);

  const checkSigningCase = {
    caseId: selectedCasesData?.caseId,
    workPackageReference: workPackageReference.toUpperCase(),
    bureauList: selectedBureauList,
    riskReferenceId: riskReferenceId,
    department: department,
    gxbInstance: selectedCasesData?.caseTeamData?.xbInstanceId,
    packageSubmittedOn: packageSubmittedOn,
  };

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.bpmService,
      path: 'checksigning/task/createcase',
      data: checkSigningCase,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(premiumProcessingCheckSigningCaseSuccess(data?.data));
      if(data?.data?.status === 1){
        dispatch(enqueueNotification('premiumProcessing.checkSigningCase.checkSigningCaseSuccessMsg', 'success'));
      }
      else{
        dispatch(enqueueNotification(data?.message, 'success'));
      }
     
      dispatch(hideModal());
      return data;
    })
    .catch((err) => {
      dispatch(
        premiumProcessingCheckSigningCaseError(err, {
          file: 'stores/premiumProcessing.actions.postCheckSigningCase',
        })
      );
      if (err.response.status === constants.API_STATUS_NOT_FOUND) {
        dispatch(enqueueNotification('premiumProcessing.checkSigningCase.checkSigningCaseErrorMsg', 'error'));
      } else {
        dispatch(enqueueNotification('premiumProcessing.checkSigningCase.checkSigningCaseErrorMsg', 'error'));
      }
      utils.api.handleUnauthorized(err, dispatch, authLogout);
    })
    .finally(() => {
      dispatch(removeLoader('premiumProcessingCheckSigningCase'));
      dispatch(hideModal());
    });
};

export const premiumProcessingCheckSigningCaseRequest = (payload) => {
  return {
    type: 'PREMIUM_PROCESSING_CHECK_SIGNING_CASE_REQUEST',
    payload,
  };
};

export const premiumProcessingCheckSigningCaseSuccess = (data) => {
  return {
    type: 'PREMIUM_PROCESSING_CHECK_SIGNING_CASE_SUCCESS',
    payload: data,
  };
};

export const premiumProcessingCheckSigningCaseError = (error) => {
  return {
    type: 'PREMIUM_PROCESSING_CHECK_SIGNING_CASE_ERROR',
    payload: error,
  };
};
