import { addLoader, authLogout, enqueueNotification, removeLoader, hideModal } from 'stores';
import * as utils from 'utils';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';

export const postInsured =
  (body, isCreateInsuredModal, reInsured, isEdit = false) =>
  (dispatch, getState) => {
    // prettier-ignore
    const { user: { auth }, config: { vars: { endpoint }}} = getState();

    const defaultError = {
      file: 'stores/risk.actions.postInsured',
      message: 'Data missing for POST request',
    };
    const success = isEdit ? 'postEditSuccess' : 'postSuccess';
    const successNotification = reInsured ? `notification.reInsured.${success}` : `notification.insured.${success}`;

    dispatch(postInsuredRequest(body));
    dispatch(addLoader('postInsured'));

    if (!body || isEmpty(body)) {
      dispatch(postInsuredFailure(defaultError));
      dispatch(enqueueNotification('notification.generic.request', 'error'));
      dispatch(removeLoader('postInsured'));
      return;
    }

    const path = reInsured ? 'api/v1/reinsured' : 'api/v1/insured';

    return utils.api
      .post({
        token: auth.accessToken,
        endpoint: endpoint.auth,
        path,
        data: {
          ...(body?.id && { id: body.id }),
          name: body.name || '',
          clientId: get(body, 'clientId.value', ''),
          partyType: get(body, 'partyType.value', ''),
          genderType: get(body, 'genderType.value', null),
          dateOfBirth: body.dateOfBirth ? utils.date.toISOString(body.dateOfBirth) : null,
          address: {
            street: body.street || '',
            city: body.city || '',
            zipCode: body.zipCode || '',
            county: body.county || '',
            state: body.state || '',
            country: get(body, 'country.value', ''),
            distanceToCoast: '',
          },
        },
      })
      .then((response) => utils.api.handleResponse(response))
      .then((data) => {
        reInsured ? dispatch(postReInsuredSuccess(data, isEdit)) : dispatch(postInsuredSuccess(data, isEdit));
        dispatch(enqueueNotification(successNotification, 'success'));
        return data;
      })
      .catch((err) => {
        const errorParams = {
          ...defaultError,
          message: 'API post error (risk.postInsured)',
        };

        utils.api.handleError(err, errorParams);
        utils.api.handleUnauthorized(err, dispatch, authLogout);
        dispatch(postInsuredFailure(err));
        dispatch(enqueueNotification(utils.api.getErrorMessage(err), 'error'));
        return err;
      })
      .finally(() => {
        dispatch(hideModal(isCreateInsuredModal ? (isEdit ? 'EDIT_PRODUCTS_INSURED' : 'ADD_INSURED') : undefined));
        dispatch(removeLoader('postInsured'));
      });
  };

export const postInsuredRequest = (formData) => {
  return {
    type: 'INSURED_POST_REQUEST',
    payload: formData,
  };
};

export const postInsuredSuccess = (responseData, isEdit) => {
  return {
    type: isEdit ? 'INSURED_POST_EDIT_SUCCESS' : 'INSURED_POST_SUCCESS',
    payload: responseData,
  };
};

export const postReInsuredSuccess = (responseData, isEdit) => {
  return {
    type: isEdit ? 'REINSURED_POST_EDIT_SUCCESS' : 'REINSURED_POST_SUCCESS',
    payload: responseData,
  };
};

export const postInsuredFailure = (error) => {
  return {
    type: 'INSURED_POST_FAILURE',
    payload: error,
  };
};
