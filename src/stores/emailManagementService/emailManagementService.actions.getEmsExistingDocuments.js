import * as utils from 'utils';
import { addLoader, removeLoader, authLogout } from 'stores';
import * as constants from 'consts';

export const getEmsExistingDocuments = (params) => (dispatch, getState) => {
  const {
    user: { auth },
    config: {
      vars: { endpoint },
    },
  } = getState();

  const defaultError = {
    file: 'stores/emailManagementService.actions.getEmsExistingDocuments',
  };

  dispatch(getEmsExistingDocumentsGetRequest(params));
  dispatch(addLoader('getEmsExistingDocuments'));

  const validFormData = params?.referenceId && params?.sectionType && params?.policyRef && params?.instructionId;

  if (!validFormData) {
    dispatch(removeLoader('getEmsExistingDocuments'));
    return;
  }

  const { referenceId, sectionType, policyRef, instructionId } = params;

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.dmsService,
      path: `dms/document/list?srcApplication=BOTH`,
      data: [
        {
          referenceId: referenceId,
          sectionType: sectionType,
        },
        {
          referenceId: policyRef,
          sectionType: constants.DMS_CONTEXT_POLICY,
        },
        {
          referenceId: instructionId,
          sectionType: constants.DMS_CONTEXT_PROCESSING_INSTRUCTION,
        },
      ],
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(getEmsExistingDocumentsSuccess(data?.data));
      return data?.data;
    })
    .catch((err) => {
      utils.api.handleError(err, { ...defaultError, message: 'API fetch error (dms.getViewTableDocuments)' });
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(getEmsExistingDocumentsError(err));
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('getEmsExistingDocuments'));
    });
};

export const getEmsExistingDocumentsGetRequest = (params) => {
  return {
    type: 'EMS_EXISTING_DOCUMENTS_REQUEST',
    payload: params,
  };
};

export const getEmsExistingDocumentsSuccess = (data) => {
  return {
    type: 'EMS_EXISTING_DOCUMENTS_SUCCESS',
    payload: data,
  };
};

export const getEmsExistingDocumentsError = (error) => {
  return {
    type: 'EMS_EXISTING_DOCUMENTS_ERROR',
    payload: error,
  };
};
