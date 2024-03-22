import get from 'lodash/get';

// app
import { addLoader, authLogout, enqueueNotification, hideModal, removeLoader } from 'stores';
import * as utils from 'utils';

export const postNewEnquiry =
  ({ formData, addDocuments = false, redirectionCallback }) =>
  (dispatch, getState) => {
    // prettier-ignore
    const { user: { auth }, config: { vars: { endpoint }}} = getState();

    const defaultError = {
      file: 'stores/placement.actions.newEnquiry',
      message: 'Data missing for POST request',
    };

    dispatch(postNewEnquiryRequest(formData));
    dispatch(addLoader('postNewEnquiry'));

    if (!formData) {
      dispatch(postNewEnquiryFailure(defaultError));
      dispatch(enqueueNotification('notification.submission.fail', 'error'));
      dispatch(hideModal());
      dispatch(removeLoader('postNewEnquiry'));
      return;
    }

    // build the data for POST
    const body = {
      sourceSystemId: get(getState(), 'placement.selected.sourceSystemId'),
      departmentId: get(formData, 'department[0].id'),
      description: get(formData, 'description'),
      inceptionDate: get(formData, 'inceptionDate'),
      clients: get(formData, 'clients', []).map((client) => ({ id: client.id })),
      insureds: get(formData, 'insureds', [])
        .filter((insured) => !Boolean(insured.__isNew__))
        .map((insured) => ({ id: insured.id })),
      provisionalInsureds: get(formData, 'insureds', [])
        .filter((insured) => Boolean(insured.__isNew__))
        .map((insured) => ({ name: insured.id })),
    };

    return utils.api
      .post({
        token: auth.accessToken,
        endpoint: endpoint.edge,
        path: 'api/placement',
        data: body,
      })
      .then((response) => utils.api.handleResponse(response))
      .then((json) => utils.api.handleData(json))
      .then((data) => {
        dispatch(postNewEnquirySuccess([data]));
        dispatch(enqueueNotification('notification.submission.success', 'success'));
        if (!addDocuments) {
          dispatch(hideModal());
        }
        dispatch(removeLoader('postNewEnquiry'));

        if (utils.generic.isFunction(redirectionCallback)) {
          redirectionCallback(data.id);
        }

        return data;
      })
      .catch((err) => {
        const errorParams = {
          ...defaultError,
          message: 'API post error (placement.newEnquiry)',
        };

        utils.api.handleError(err, errorParams);
        utils.api.handleUnauthorized(err, dispatch, authLogout);
        dispatch(postNewEnquiryFailure(err));
        dispatch(enqueueNotification('notification.submission.fail', 'error'));
        dispatch(hideModal());
        dispatch(removeLoader('postNewEnquiry'));
        return err;
      });
  };

export const postNewEnquiryRequest = (formData) => {
  return {
    type: 'PLACEMENT_NEW_ENQUIRY_POST_REQUEST',
    payload: formData,
  };
};

export const postNewEnquirySuccess = (responseData) => {
  return {
    type: 'PLACEMENT_NEW_ENQUIRY_POST_SUCCESS',
    payload: responseData,
  };
};

export const postNewEnquiryFailure = (error) => {
  return {
    type: 'PLACEMENT_NEW_ENQUIRY_POST_FAILURE',
    payload: error,
  };
};
