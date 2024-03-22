import { addLoader, authLogout, removeLoader } from 'stores';
import * as utils from 'utils';

export const getReportList = (reportGroupId) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint } } } = getState();

  const defaultError = {
    file: 'stores/reporting.actions.getReportList',
  };

  dispatch(getReportListRequest(reportGroupId));
  dispatch(addLoader('getReportList'));

  if (!reportGroupId) {
    dispatch(getReportListFailure(defaultError));
    dispatch(removeLoader('getReportList'));
    return;
  }
  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.edge,
      path: `api/reportgroup/${reportGroupId}`,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => {
      return utils.api.handleData(json);
    })
    .then((data) => {
      dispatch(getReportListSuccess(data));
    })
    .catch((err) => {
      utils.api.handleError(err, defaultError);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(getReportListFailure(err));
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('getReportList'));
    });
};

export const getReportListRequest = (payload) => {
  return {
    type: 'REPORTING_LIST_GET_REQUEST',
    payload,
  };
};

export const getReportListSuccess = (data) => {
  const payload = {
    selected: { id: data?.id, name: data?.name },
    reports: data?.reports.sort((a, b) => new Date(b.lastUpdateDate) - new Date(a.lastUpdateDate)),
    users: data?.users,
  };
  return {
    type: 'REPORTING_LIST_GET_SUCCESS',
    payload,
  };
};

export const getReportListFailure = (error) => {
  return {
    type: 'REPORTING_LIST_FAILURE',
    payload: error,
  };
};
