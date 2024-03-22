import * as utils from 'utils';
import { authLogout } from 'stores';
export const getCaseStatusesForDays = (days) => (dispatch, getState) => {
  const {
    user: { auth },
    config: {
      vars: { endpoint },
    },
  } = getState();

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.dataService,
      path: 'api/gui/PremiumProcessing/workbasket/summaryOfCasesByStatus/' + days,
    })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      dispatch(getCasesProgressSuccess(data, days));
    })
    .catch((error) => {
      dispatch(getCasesProgressError(error));
      utils.api.handleUnauthorized(error, dispatch, authLogout);
    });
};

export const getCasesProgressSuccess = (data, numDays) => {
  return {
    type: 'CASE_STATUSES_BY_DAYS',
    payload: data.data,
    days: numDays,
  };
};

export const getCasesProgressError = (data) => {
  return {
    type: 'CASE_STATUSES_BY_DAYS_ERROR',
    payload: data,
  };
};
