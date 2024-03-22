import moment from 'moment';
import get from 'lodash/get';

// app
import * as utils from 'utils';
import { authLogout } from 'stores';
import { CLAIM_TEAM_TYPE, CLAIMS_TAB_REQ_TYPES } from 'consts';

export const getClaimsTabDetails =
  (params = {}) =>
  (dispatch, getState) => {
    // prettier-ignore
    const { user: { auth }, config: { vars: { endpoint } }, claims } = getState();

    const defaultError = {
      file: 'stores/claims.actions.getClaimsTabDetails',
    };
    const newClaimsTabReqType = params?.requestType || CLAIMS_TAB_REQ_TYPES.search;

    const prevDirection = get(claims, 'claimsTab.tableDetails.sort.direction') || '';
    const newDirection = params.hasOwnProperty('direction') ? params.direction : prevDirection;

    const prevQuery = get(claims, 'claimsTab.tableDetails.query') || '';
    const newQuery = params.hasOwnProperty('term') ? params.term : prevQuery;

    const prevSortBy = get(claims, 'claimsTab.tableDetails.sort.by') || '';
    const newSortBy = params.hasOwnProperty('sortBy')
      ? params.sortBy
      : prevSortBy && params.hasOwnProperty('firstTimeSort')
      ? params.firstTimeSort
      : prevSortBy;

    const prevSearchBy = get(claims, 'claimsTab.tableDetails.searchBy') || '';
    const newSearchBy = params.hasOwnProperty('searchBy') ? params.searchBy : prevSearchBy;

    const datesExceptionFields = [];

    const prevFilterQuery = get(claims, 'claimsTab.tableDetails.selectedFilters') || '';
    const newFilterQuery = params.hasOwnProperty('filterTerm') && params.filterTerm !== '' ? params.filterTerm : prevFilterQuery;

    const constructFilter = Object.entries(newFilterQuery);
    const updatedFilter = utils.generic.isValidArray(constructFilter, true)
      ? constructFilter
          .map((filter) => {
            const column = filter[0];
            const values = filter[1];
            const isDateFilter = datesExceptionFields.includes(column) && values;

            let filterValue = values;
            if (isDateFilter)
              filterValue = [
                { id: 1, name: moment(new Date(values)).format('DD-MM-YYYY'), value: moment(new Date(values)).format('DD-MM-YYYY') },
              ];

            return utils.generic.isValidArray(filterValue, true) && { column, filterValue };
          })
          .filter((item) => item)
      : [];

    const appliedParams = { newClaimsTabReqType, newDirection, newQuery, newSortBy, newSearchBy, updatedFilter };

    dispatch(getClaimsTabDetailsRequest({ params, appliedParams }));

    return utils.api
      .post({
        token: auth.accessToken,
        endpoint: endpoint.bpmService,
        path: `workflow/process/claimProcess/${params?.claimsType}`,
        data: {
          requestType: newClaimsTabReqType,
          direction: newDirection,
          filterLossClaimsCriteria: null,
          filterSearch: constructFilter.length ? updatedFilter : null,
          page: (params && params.page) || 0,
          pageSize: (params && params.size) || claims.claimsTab.tableDetails.pageSize,
          search: newQuery,
          searchBy: newSearchBy,
          sortBy: newSortBy,
          ...(params?.claimsType !== CLAIM_TEAM_TYPE.allClaims && { pullClosedRecords: params?.pullClosedRecords }),
        },
      })
      .then((response) => utils.api.handleResponse(response))
      .then((json) => utils.api.handleNewData(json))
      .then((data) => {
        dispatch(getClaimsTabDetailsSuccess(data, newClaimsTabReqType, newQuery));
        return data;
      })
      .catch((err) => {
        if (newClaimsTabReqType === CLAIMS_TAB_REQ_TYPES.search) {
          dispatch(getClaimsTabTableDetailsFailure(err, defaultError));
        } else if (newClaimsTabReqType === CLAIMS_TAB_REQ_TYPES.filter) {
          dispatch(getClaimsTabFilterDetailsFailure(err, defaultError));
        }
        utils.api.handleUnauthorized(err, dispatch, authLogout);
        return err;
      });
  };

export const getClaimsTabDetailsRequest = (params) => {
  return {
    type: 'CLAIMS_TAB_DETAILS_GET_REQUEST',
    payload: params,
  };
};

export const getClaimsTabDetailsSuccess = (data, newClaimsTabReqType, newQuery) => {
  return {
    type: 'CLAIMS_TAB_DETAILS_GET_SUCCESS',
    payload: {
      items: data.data,
      pagination: { ...data.pagination, search: newQuery },
      requestType: newClaimsTabReqType,
    },
  };
};

export const getClaimsTabTableDetailsFailure = (error) => {
  return {
    type: 'CLAIMS_TAB_TABLE_DETAILS_FAILURE',
    payload: error,
  };
};

export const getClaimsTabFilterDetailsFailure = (error) => {
  return {
    type: 'CLAIMS_TAB_FILTER_DETAILS_FAILURE',
    payload: error,
  };
};
