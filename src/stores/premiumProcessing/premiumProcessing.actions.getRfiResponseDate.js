import * as utils from 'utils';
import { authLogout } from 'stores';
export const getRfiResponseDate = (params) => (dispatch, getState) => {
  const {
    user: { auth },
    config: {
      vars: { endpoint },
    },
  } = getState();

  const { sla = 0 } = params;
  const request = {
    considerDays: sla,
  };

  dispatch(getRfiResponseDateRequest());

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.bpmService,
      path: `workflow/holidayList/getSlaDate`,
      params: request,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(getRfiResponseDateSuccess(data?.data));
      return data;
    })
    .catch((err) => {
      dispatch(getRfiResponseDateFailure(err));
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      return err;
    });
};

export const getRfiResponseDateRequest = () => {
  return {
    type: 'PREMIUM_PROCESSING_RFI_RESPONSE_DATE_REQUEST',
  };
};

export const getRfiResponseDateSuccess = (data) => {
  return {
    type: 'PREMIUM_PROCESSING_RFI_RESPONSE_DATE_SUCCESS',
    payload: {
      responseDate: data.dueDate,
    },
  };
};

export const getRfiResponseDateFailure = (error) => {
  return {
    type: 'PREMIUM_PROCESSING_RFI_RESPONSE_DATE_FAILURE',
    payload: error,
  };
};
