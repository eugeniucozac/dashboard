import moment from 'moment';
import get from 'lodash/get';

// app
import { authLogout, addLoader, removeLoader, enqueueNotification } from 'stores';
import * as utils from 'utils';

export const getClaimNotes = (params) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}, claims} = getState();
  const { caseIncidentID, claimId, page, size, sortBy, direction, query, filters = {} } = params;

  const defaultError = {
    file: 'stores/claims.actions.getClaimNotes',
  };

  dispatch(getClaimNotesRequest(params));
  dispatch(addLoader('getClaimNotes'));

  if (!claimId && !caseIncidentID) {
    dispatch(getClaimNotesFailure({ ...defaultError, message: 'Missing claimId param' }));
    dispatch(enqueueNotification('claims.notes.notifications.getFailure', 'error'));
    dispatch(removeLoader('getClaimNotes'));
    return;
  }

  const prevQuery = get(claims, 'notes.query') || '';
  const newQuery = params.hasOwnProperty('query') ? query : prevQuery;

  const constructFilters = (filtersObj) => {
    const filteredArray = [];
    for (const key in filtersObj) {
      const selectedFilterValue =
        key === 'createdDate' || key === 'updatedDate' ? moment(new Date(filtersObj[key])).format('DD-MM-YYYY') : filtersObj[key];
      if (filtersObj[key]?.length > 0 && typeof filtersObj[key] !== 'string') {
        filteredArray.push({
          column: key,
          filterValue: selectedFilterValue,
        });
      } else if (typeof filtersObj[key] === 'string' && filtersObj[key] !== '') {
        filteredArray.push({
          column: key,
          filterValue: [{ id: 0, name: selectedFilterValue }],
        });
      }
    }
    return filteredArray;
  };

  const prevFilters = get(claims, 'notes.filters') || [];
  const newFilters = params.hasOwnProperty('filters') ? constructFilters(filters) : prevFilters;

  const apiParams = {
    caseIncidentID: caseIncidentID,
    claimID: claimId,
    page: page || 0,
    pageSize: size || claims?.notes?.pageSize,
    sortBy: sortBy || claims?.notes?.sort?.by,
    direction: (direction || claims?.notes?.sort?.direction || '').toUpperCase(),
    search: newQuery || '',
    filters: newFilters?.length > 0 ? newFilters : null,
  };

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.bpmService,
      path: `case/bpm/claim/searchNotes`,
      data: apiParams,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((data) => utils.api.handleNewData(data))
    .then((json) => {
      dispatch(getClaimNotesSuccess(json));
      return json;
    })
    .catch((err) => {
      dispatch(getClaimNotesFailure(err, defaultError));
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('getClaimNotes'));
    });
};

export const getClaimNotesRequest = (caseIncidentID) => {
  return {
    type: 'CLAIM_NOTES_GET_REQUEST',
    payload: caseIncidentID,
  };
};

export const getClaimNotesSuccess = (json) => {
  return {
    type: 'CLAIM_NOTES_GET_SUCCESS',
    payload: {
      items: json.data?.searchValue,
      filters: json.data?.filterValue,
      pagination: json.pagination,
    },
  };
};

export const getClaimNotesFailure = (err) => {
  return {
    type: 'CLAIM_NOTES_GET_FAILURE',
    payload: err,
  };
};
