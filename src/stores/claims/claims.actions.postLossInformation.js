import * as utils from 'utils';
import { authLogout, addLoader, enqueueNotification, removeLoader } from 'stores';

export const postLossInformation = (formData) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, user, config: { vars: { endpoint } } } = getState();

  const defaultError = {
    file: 'stores/claims.actions.postLossInformation',
  };

  dispatch(postLossInformationRequest(formData));
  dispatch(addLoader('postLossInformation'));

  const nowIsoString = utils.date.toISOString(new Date());
  const { catCodesID } = formData;

  // remove unwanted form values
  delete formData.file;
  delete formData.catCodesID;

  const concatDateAndTime = (contactDate, contactTime) => {
    let partDate = utils.string.t('format.date', { value: { date: contactDate || new Date(), format: 'D MMM YYYY' } });
    return utils.date.toISOString(partDate + ' ' + (contactTime ? contactTime + ':00' : '00:00:00'));
  };

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.claimService,
      path: 'api/data/loss',
      data: {
        ...formData,
        catCodesID: catCodesID?.id,
        toDate: utils.date.toISOString(formData?.toDate),
        fromDate: utils.date.toISOString(formData?.fromDate),
        firstContactDate: concatDateAndTime(formData.firstContactDate, formData.firstContactTime),
        isActive: 1,
        createdBy: user.id,
        createdDate: nowIsoString,
        lossDetailID: null,
        updatedBy: user.id,
        updatedDate: nowIsoString,
      },
    })
    .then((response) => utils.api.handleResponse(response))
    .then((data) => {
      dispatch(postLossInformationSuccess(data.data));
      dispatch(enqueueNotification('notification.lossInformation.success', 'success'));
      return data.data;
    })
    .catch((err) => {
      const errorParams = {
        ...defaultError,
        message: 'API post error',
      };

      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(postLossInformationFailure(err));
      dispatch(enqueueNotification('notification.lossInformation.fail', 'error'));
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('postLossInformation'));
    });
};

export const postLossInformationRequest = (data) => {
  return {
    type: 'LOSS_INFORMATION_POST_REQUEST',
    payload: data,
  };
};

export const postLossInformationSuccess = (responseData) => {
  return {
    type: 'LOSS_INFORMATION_POST_SUCCESS',
    payload: responseData,
  };
};

export const postLossInformationFailure = (error) => {
  return {
    type: 'LOSS_INFORMATION_POST_FAILURE',
    payload: error,
  };
};
