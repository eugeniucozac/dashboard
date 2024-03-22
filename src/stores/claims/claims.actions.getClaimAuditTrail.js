import moment from 'moment';
import get from 'lodash/get';

// app
import { authLogout, addLoader, removeLoader, enqueueNotification } from 'stores';
import * as utils from 'utils';

export const getClaimAudits = (params) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}, claims} = getState();
  const { claimId, filterTerm, page, size, sortBy, direction, query } = params;

  const defaultError = {
    file: 'stores/claims.actions.getClaimAudits',
  };

  dispatch(getClaimAuditsRequest(params));
  dispatch(addLoader('getClaimAudits'));

  if (!claimId) {
    dispatch(getClaimAuditsFailure({ ...defaultError, message: 'Missing claimID param' }));
    dispatch(enqueueNotification('claims.audits.notifications.getFailure', 'error'));
    dispatch(removeLoader('getClaimAudits'));
    return;
  }

  const prevQuery = get(claims, 'audits.query') || '';
  const newQuery = params.hasOwnProperty('query') ? query : prevQuery;

  const constructFilters = (filtersObj) => {
    const filteredArray = [];
    for (const key in filtersObj) {
      if (typeof filtersObj[key] === 'string' && filtersObj[key] !== '') {
        filteredArray.push({
          column: key,
          filterValue: [{ id: 0, name: key, value: moment(new Date(filtersObj[key])).format('DD-MM-YYYY') }],
        });
      }
    }
    return filteredArray;
  };

  const prevFilters = get(claims, 'audits.filters') || [];
  const newFilters = params.hasOwnProperty('filterTerm') ? constructFilters(filterTerm) : prevFilters;

  const apiParams = {
    page: page || 0,
    pageSize: size || claims.audits?.pageSize,
    sortBy: sortBy || claims.audits?.sort?.by,
    direction: direction || claims.audits?.sort?.direction || '',
    search: newQuery || '',
    searchBy: null,
    filterLossClaimsCriteria: null,
    filterSearch: newFilters,
  };

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.claimService,
      path: `api/data/claims/audit/${claimId}/search`,
      data: apiParams,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((data) => utils.api.handleNewData(data))
    .then((json) => {
      dispatch(getClaimAuditsSuccess(json));
      return json;
    })
    .catch((err) => {
      dispatch(getClaimAuditsFailure(err, defaultError));
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('getClaimAudits'));
    });
};

export const getClaimAuditsRequest = (claimID) => {
  return {
    type: 'CLAIM_AUDIT_TRAIL_GET_REQUEST',
    payload: claimID,
  };
};

export const getClaimAuditsSuccess = (json) => {
  return {
    type: 'CLAIM_AUDIT_TRAIL_GET_SUCCESS',
    payload: {
      items: json.data?.searchValue,
      pagination: json.pagination,
    },
  };
};

export const getClaimAuditsFailure = (err) => {
  return {
    type: 'CLAIM_AUDIT_TRAIL_GET_FAILURE',
    payload: err,
  };
};
