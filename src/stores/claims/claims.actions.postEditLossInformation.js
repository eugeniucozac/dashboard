// app
import * as utils from 'utils';
import get from 'lodash/get';
import { authLogout, addLoader, enqueueNotification, hideModal, removeLoader } from 'stores';

export const postEditLossInformation = (formData) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint } } } = getState();

  const state = getState();
  const lossInformation = get(state, 'claims.lossInformation', {});
  const lossDetailID = lossInformation.lossDetailID || formData.lossDetailID;
  const { catCodesID } = formData;

  const defaultError = {
    file: 'stores/claims.actions.postEditLossInformation',
  };

  dispatch(postEditLossInformationRequest(formData));
  dispatch(addLoader('postEditLossInformation'));

  if (!formData || !lossDetailID) {
    dispatch(postEditLossInformationFailure({ ...defaultError, message: 'Data missing for PUT request' }));
    dispatch(enqueueNotification('notification.lossInformation.fail', 'error'));
    dispatch(hideModal());
    dispatch(removeLoader('postEditLossInformation'));
    return;
  }

  const addDateAndTime = (contactDate, contactTime) => {
    if (!contactDate) return contactDate;
    let actualDate = new Date(
      utils.string.t('format.date', { value: { date: contactDate, format: 'D MMM YYYY' } }) +
        ' ' +
        (contactTime ? contactTime + ':00' : '00:00:00')
    );
    return actualDate || contactDate;
  };

  // remove unwanted form values
  delete formData.catCodesID;

  const body = {
    ...formData,
    catCodesID: catCodesID?.id,
    firstContactDate: addDateAndTime(formData?.firstContactDate, formData?.firstContactTime),
    isActive: 1,
    lossDetailID,
  };

  return utils.api
    .put({
      token: auth.accessToken,
      endpoint: endpoint.claimService,
      path: `api/data/loss/${lossDetailID}`,
      data: body,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((data) => {
      dispatch(postEditLossInformationSuccess(data.data));
      dispatch(enqueueNotification('notification.lossInformation.updatedSuccess', 'success'));
      dispatch(removeLoader('postEditLossInformation'));
      return data;
    })
    .catch((err) => {
      const errorParams = {
        ...defaultError,
        message: 'API fetch error',
      };

      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(postEditLossInformationFailure(err));
      dispatch(enqueueNotification('notification.lossInformation.fail', 'error'));
      dispatch(hideModal());
      dispatch(removeLoader('postEditLossInformation'));
      return err;
    });
};

export const postEditLossInformationRequest = (data) => {
  return {
    type: 'LOSS_INFORMATION_EDIT_REQUEST',
    payload: data,
  };
};

export const postEditLossInformationSuccess = (data) => {
  return {
    type: 'LOSS_INFORMATION_EDIT_SUCCESS',
    payload: data,
  };
};

export const postEditLossInformationFailure = (error) => {
  return {
    type: 'LOSS_INFORMATION_EDIT_FAILURE',
    payload: error,
  };
};
