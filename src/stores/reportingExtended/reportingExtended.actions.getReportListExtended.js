import get from 'lodash/get';

// app
import * as utils from 'utils';
import config from 'config';
import { authLogout } from 'stores';

export const getReportListExtended =
  (params = {}, reportGroupId) =>
  (dispatch, getState) => {
    // prettier-ignore
    const { user: { auth }, config: { vars: { endpoint } }, reportingExtended: { reportListExtended } } = getState();

    const { page, size, sortBy, direction, searchBy } = params;

    const defaultError = {
      file: 'stores/reportingExtended.actions.getReportListExtended',
    };

    const prevQuery = get(reportListExtended, 'query') || '';
    const newQuery = params.hasOwnProperty('searchBy') ? searchBy : prevQuery;

    const apiParams = {
      page: page || 1,
      pageSize: size || reportListExtended?.pageSize,
      sortBy: sortBy || reportListExtended?.sortBy,
      direction: direction || reportListExtended?.sortDirection || '',
      ...(newQuery && { query: newQuery }),
    };

    dispatch(getReportListExtendedRequest(params));

    if (!reportGroupId) {
      dispatch(getReportListExtendedFailure(defaultError));
      return;
    }

    return utils.api
      .get({
        token: auth.accessToken,
        endpoint: endpoint.odsService,
        path: `reports/group/${reportGroupId}`,
        params: apiParams,
      })
      .then((response) => utils.api.handleResponse(response))
      .then((json) => utils.api.handleNewData(json))
      .then((data) => {
        dispatch(getReportListExtendedSuccess(data));
      })
      .catch((err) => {
        utils.api.handleError(err, defaultError);
        utils.api.handleUnauthorized(err, dispatch, authLogout);
        dispatch(getReportListExtendedFailure(err));
        return err;
      });
  };

export const getReportListExtendedRequest = (params) => {
  return {
    type: 'REPORTING_EXTENDED_GET_REPORT_LIST_REQUEST',
    payload: params,
  };
};

export const getReportListExtendedSuccess = (data) => {
  return {
    type: 'REPORTING_EXTENDED_GET_REPORT_LIST_SUCCESS',
    payload: {
      content: data?.data?.reports,
      pagination: {
        itemsTotal: data?.pagination?.totalElements || 0,
        page: data?.pagination?.page || 1,
        pageSize: data?.pagination?.size || config.ui.pagination.default,
        pageTotal: data?.pagination?.totalPages || 0,
        query: data?.pagination?.searchBy || '',
      },
      selectedReportGroup: {
        description: data?.data?.description,
        id: data?.data?.id,
        name: data?.data?.name,
      },
      sort: {
        sortBy: data?.pagination?.orderBy,
        sortDirection: data?.pagination?.direction || '',
      },
    },
  };
};

export const getReportListExtendedFailure = (err) => {
  return {
    type: 'REPORTING_EXTENDED_GET_REPORT_LIST_FAILURE',
    payload: err,
  };
};
