import get from 'lodash/get';
import moment from 'moment';

// app
import config from 'config';
import { authLogout, addLoader, removeLoader, enqueueNotification } from 'stores';
import * as utils from 'utils';

export const getClaimTaskNotes = (params) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}, claims} = getState();
  const { taskId, page, size, sortBy, direction, query, filters = {} } = params;

  const defaultError = {
    file: 'stores/claims.actions.getClaimTaskNotes',
  };

  dispatch(getClaimTaskNotesRequest(params));
  dispatch(addLoader('getClaimTaskNotes'));

  if (!taskId) {
    dispatch(getClaimTaskNotesFailure({ ...defaultError, message: 'Missing taskId param' }));
    dispatch(enqueueNotification('claims.notes.notifications.getFailure', 'error'));
    dispatch(removeLoader('getClaimTaskNotes'));
    return;
  }

  const prevQuery = get(claims, 'taskNotes.query') || '';
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

  const prevFilters = get(claims, 'taskNotes.filters') || [];
  const newFilters = params.hasOwnProperty('filters') ? constructFilters(filters) : prevFilters;

  const apiParams = {
    page: page || 0,
    pageSize: size || claims?.taskNotes?.pageSize || config.ui.pagination.options[0],
    sortBy: sortBy || claims?.taskNotes?.sort?.by,
    direction: (direction || claims?.taskNotes?.sort?.direction || '').toUpperCase(),
    search: newQuery || '',
    filters: newFilters?.length > 0 ? newFilters : null,
  };
  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.bpmService,
      path: `notes/task/${taskId}/search`,
      data: apiParams,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((data) => utils.api.handleNewData(data))
    .then((json) => {
      dispatch(getClaimTaskNotesSuccess(json));
      return json;
    })
    .catch((err) => {
      dispatch(getClaimTaskNotesFailure(err, defaultError));
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('getClaimTaskNotes'));
    });
};

export const getClaimTaskNotesRequest = (taskId) => {
  return {
    type: 'CLAIM_TASK_NOTES_GET_REQUEST',
    payload: taskId,
  };
};

export const getClaimTaskNotesSuccess = (json) => {
  return {
    type: 'CLAIM_TASK_NOTES_GET_SUCCESS',
    payload: {
      items: json.data?.searchValue,
      filters: json.data?.filterValue,
      pagination: json?.pagination,
    },
  };
};

export const getClaimTaskNotesFailure = (err) => {
  return {
    type: 'CLAIM_TASK_NOTES_GET_FAILURE',
    payload: err,
  };
};
