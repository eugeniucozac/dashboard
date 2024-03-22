import get from 'lodash/get';

// app
import * as utils from 'utils';
import { authLogout, addLoader, enqueueNotification, hideModal, removeLoader } from 'stores';

export const duplicateLine = (lineId, formData) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint } } } = getState();

  const defaultError = {
    file: 'stores/placement.actions.duplicateLine',
    message: 'Data missing for POST request',
  };

  dispatch(duplicateLineRequest(formData));
  dispatch(addLoader('duplicateLine'));

  if (!formData || !get(formData.market, 'market.id') || !lineId) {
    dispatch(duplicateLineFailure(defaultError));
    dispatch(enqueueNotification('notification.duplicateLine.fail', 'error'));
    dispatch(hideModal());
    dispatch(removeLoader('duplicateLine'));
    return;
  }

  const id = lineId;
  return utils.api
    .put({
      token: auth.accessToken,
      endpoint: endpoint.edge,
      path: `api/placementlayerMarket/${id}/duplicate-line`,
      data: {
        marketId: get(formData.market, 'market.id'),
      },
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleData(json))
    .then((data) => {
      dispatch(duplicateLineSuccess(data));
      dispatch(enqueueNotification('notification.duplicateLine.success', 'success'));
      dispatch(hideModal());
      dispatch(removeLoader('duplicateLine'));
      return data;
    })
    .catch((err) => {
      const errorParams = {
        ...defaultError,
        message: 'API post error (placement.duplicateLine)',
      };
      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(duplicateLineFailure(err));
      dispatch(enqueueNotification('notification.duplicateLine.fail', 'error'));
      dispatch(hideModal());
      dispatch(removeLoader('duplicateLine'));
      return err;
    });
};

export const duplicateLineRequest = (data) => {
  return {
    type: 'DUPLICATE_LINE_PUT_REQUEST',
    payload: data,
  };
};

export const duplicateLineSuccess = (data) => {
  return {
    type: 'PLACEMENT_LAYER_MARKET_POST_SUCCESS',
    payload: data,
  };
};

export const duplicateLineFailure = (error) => {
  return {
    type: 'DUPLICATE_LINE_PUT_FAILURE',
    payload: error,
  };
};
