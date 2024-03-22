import * as utils from 'utils';
import * as constants from 'consts';
import { authLogout, getDmsDocumentList } from 'stores';

export const getViewTableDocuments = (params) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint } } } = getState();

  const defaultError = {
    file: 'stores/processingInstructions.actions.getViewTableDocuments',
  };

  const {
    referenceId,
    sectionType,
    policyRef,
    instructionId,
    documentTypeKey = '',
    parentLossRef,
    isFromDmsWidget,
    dmsWidgetReqParams,
  } = params;

  if (isFromDmsWidget) {
    dispatch(getDmsWidgetDocumentsRequest(params));
  } else {
    dispatch(getViewTableDocumentsRequest(params));
  }

  if (!referenceId || !sectionType) {
    if (!(isFromDmsWidget && dmsWidgetReqParams)) {
      dispatch(getViewTableDocumentsFailure({ ...defaultError, message: 'Missing or invalid params' }));
      return;
    }
  }

  const isDmsFromPiRiskRef = documentTypeKey && utils.dmsFormatter.isDmsFromPiRiskRef(documentTypeKey);
  const { documentTypeDescription } = isDmsFromPiRiskRef && utils.dmsFormatter.getDocumentTypeInfo(documentTypeKey);

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.dmsService,
      path: `dms/document/list?srcApplication=BOTH${isDmsFromPiRiskRef ? '&documentTypes=' + documentTypeDescription : ''}${
        parentLossRef ? '&parentLossRef=' + parentLossRef : ''
      }`,
      data: isFromDmsWidget
        ? dmsWidgetReqParams
        : [
            {
              referenceId: referenceId,
              sectionType: sectionType,
            },
            ...(policyRef && instructionId
              ? [
                  {
                    referenceId: policyRef,
                    sectionType: constants.DMS_CONTEXT_POLICY,
                  },
                  {
                    referenceId: instructionId,
                    sectionType: constants.DMS_CONTEXT_PROCESSING_INSTRUCTION,
                  },
                ]
              : []),
          ],
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      if (isFromDmsWidget) {
        dispatch(getDmsWidgetDocumentsSuccess(data.data));
      } else {
        dispatch(getViewTableDocumentsSuccess(data.data));
        dispatch(getDmsWidgetDocumentsSuccess(data.data));
      }
      if (data?.data) {
        switch (sectionType) {
          case 'Loss':
            dispatch(getDmsDocumentList('LOSS_INFORMATION', data?.data));
            break;

          case 'Policy':
            dispatch(getDmsDocumentList('LINK_POLICY', data?.data));
            break;

          case 'Claim':
            if (!parentLossRef) {
              !isFromDmsWidget && dispatch(getDmsDocumentList('CLAIM_INFORMATION', data?.data));
            } else {
              const documentDetails = [...data?.data];
              const linkedFromLossList = [];
              const claimsList = [];
              documentDetails?.forEach((doc) => {
                if (doc?.isLinkedFromLoss) {
                  linkedFromLossList.push(doc);
                } else if (!doc?.isLinkedFromLoss) {
                  claimsList.push(doc);
                }
              });
              dispatch(getDmsDocumentList('MANAGE_DOCUMENT_LOSS_INFORMATION', linkedFromLossList));
              dispatch(getDmsDocumentList('LOSS_INFORMATION', linkedFromLossList));
              dispatch(getDmsDocumentList('MANAGE_DOCUMENT_CLAIM_INFORMATION', claimsList));
              dispatch(getDmsDocumentList('CLAIM_INFORMATION', data?.data));
            }
            break;

          default:
        }
      }
      return data.data;
    })
    .catch((err) => {
      utils.api.handleError(err, { ...defaultError, message: 'API fetch error (dms.getViewTableDocuments)' });
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      if (isFromDmsWidget) {
        dispatch(getDmsWidgetDocumentsFailure(err));
      } else {
        dispatch(getViewTableDocumentsFailure(err));
      }
      return err;
    });
};

export const getViewTableDocumentsRequest = (payload) => {
  return {
    type: 'DMS_VIEW_TABLE_DOCUMENTS_REQUEST',
    payload,
  };
};

export const getDmsWidgetDocumentsRequest = (payload) => {
  return {
    type: 'DMS_WIDGET_DOCUMENT_REQUEST',
    payload,
  };
};

export const getViewTableDocumentsSuccess = (responseData) => {
  return {
    type: 'DMS_VIEW_TABLE_DOCUMENTS_SUCCESS',
    payload: responseData,
  };
};

export const getDmsWidgetDocumentsSuccess = (responseData) => {
  return {
    type: 'DMS_WIDGET_DOCUMENTS_SUCCESS',
    payload: responseData,
  };
};

export const getViewTableDocumentsFailure = (error) => {
  return {
    type: 'DMS_VIEW_TABLE_DOCUMENTS_FAILURE',
    payload: error,
  };
};

export const getDmsWidgetDocumentsFailure = (error) => {
  return {
    type: 'DMS_WIDGET_DOCUMENTS_FAILURE',
    payload: error,
  };
};
