import { authLogout, enqueueNotification } from 'stores';
import * as utils from 'utils';
import isEmpty from 'lodash/isEmpty';

export const putQuoteRates = (commissionRates, quoteID) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/risk.actions.putQuoteRates',
    message: 'Data missing for PUT request',
  };

  if (isEmpty(commissionRates) || !quoteID) {
    dispatch(enqueueNotification('notification.generic.request', 'error'));
    return;
  }

  const body = {
    ...commissionRates,
  };

  const path = `api/v1/quotes/${quoteID}/rates`;

  return utils.api
    .put({
      token: auth.accessToken,
      endpoint: endpoint.auth,
      path,
      data: body,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleResponseJsonObject(json))
    .then((data) => {
      dispatch(enqueueNotification('notification.putQuoteRates.success', 'success'));
      return data;
    })

    .catch((err) => {
      const errorParams = {
        ...defaultError,
        message: 'API post error (risk.putQuoteRates)',
      };

      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(enqueueNotification(utils.api.getErrorMessage(err), 'error'));
      return err;
    });
};
