import get from 'lodash/get';

// app
import * as utils from 'utils';
import config from 'config';
import { authLogout } from 'stores';

export const getReportGroupListExtended =
  (params = {}) =>
  (dispatch, getState) => {
    // prettier-ignore
    const { user: { auth }, config: { vars: { endpoint } }, reportingExtended: { reportGroupListExtended } } = getState();

    const { page, size, sortBy, direction, searchBy } = params;

    const defaultError = {
      file: 'stores/reportingExtended.actions.getReportGroupListExtended',
    };

    const prevQuery = get(reportGroupListExtended, 'query') || '';
    const newQuery = params.hasOwnProperty('searchBy') ? searchBy : prevQuery;

    const apiParams = {
      page: page || 1,
      pageSize: size || reportGroupListExtended?.pageSize,
      sortBy: sortBy || reportGroupListExtended?.sortBy,
      direction: direction || reportGroupListExtended?.sortDirection || '',
      ...(newQuery && { query: newQuery }),
    };

    dispatch(getReportGroupListExtendedRequest(params));

    return utils.api
      .get({
        token: auth.accessToken,
        endpoint: endpoint.odsService,
        path: 'reports/group',
        params: apiParams,
      })
      .then((response) => utils.api.handleResponse(response))
      .then((json) => utils.api.handleNewData(json))
      .then((data) => {
        dispatch(getReportGroupListExtendedSuccess(data));
      })
      .catch((err) => {
        utils.api.handleError(err, defaultError);
        utils.api.handleUnauthorized(err, dispatch, authLogout);
        dispatch(getReportGroupListExtendedFailure(err));
        return err;
      });
  };

export const getReportGroupListExtendedRequest = (params) => {
  return {
    type: 'REPORTING_EXTENDED_GET_REPORT_GROUP_LIST_REQUEST',
    payload: params,
  };
};

export const getReportGroupListExtendedSuccess = (data) => {
  return {
    type: 'REPORTING_EXTENDED_GET_REPORT_GROUP_LIST_SUCCESS',
    payload: {
      content: data?.data,
      pagination: {
        itemsTotal: data?.pagination?.totalElements || 0,
        page: data?.pagination?.page || 1,
        pageSize: data?.pagination?.size || config.ui.pagination.default,
        pageTotal: data?.pagination?.totalPages || 0,
        query: data?.pagination?.searchBy || '',
      },
      sort: {
        sortBy: data?.pagination?.orderBy,
        sortDirection: data?.pagination?.direction || '',
      },
    },
  };
};

export const getReportGroupListExtendedFailure = (err) => {
  return {
    type: 'REPORTING_EXTENDED_GET_REPORT_GROUP_LIST_FAILURE',
    payload: err,
  };
};
