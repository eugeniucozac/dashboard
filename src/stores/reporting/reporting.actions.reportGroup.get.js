import { addLoader, authLogout, removeLoader } from 'stores';
import * as utils from 'utils';

export const getReportGroupList = (params) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/reporting.actions.getReportGroupList',
  };

  const reporting = getState().reporting;

  const endpointParams = {
    page: (params && params.page) || 1,
    size: (params && params.size) || reporting.reportGroupList.pageSize,
    orderBy: reporting.reportGroupList.sortBy,
    direction: reporting.reportGroupList.sortDirection,
  };

  dispatch(getReportGroupListRequest({ endpointParams }));
  dispatch(addLoader('getReportGroupList'));

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.edge,
      path: 'api/reportgroup',
      params: endpointParams,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleData(json))
    .then((data) => {
      dispatch(getReportGroupListSuccess(data));
    })
    .catch((err) => {
      utils.api.handleError(err, defaultError);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(getReportGroupListFailure(err));
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('getReportGroupList'));
    });
};

export const getReportGroupListRequest = (payload) => {
  return {
    type: 'REPORTING_GROUP_LIST_GET_REQUEST',
    payload,
  };
};

export const getReportGroupListSuccess = (data) => {
  return {
    type: 'REPORTING_GROUP_LIST_GET_SUCCESS',
    payload: {
      content: data.content,
      pagination: data.pagination,
    },
  };
};

export const getReportGroupListFailure = (error) => {
  return {
    type: 'REPORTING_GROUP_LIST_FAILURE',
    payload: error,
  };
};
