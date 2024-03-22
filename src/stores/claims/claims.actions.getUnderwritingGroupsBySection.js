import { addLoader, authLogout, removeLoader } from 'stores';
import * as utils from 'utils';
import { v4 as uuidv4 } from 'uuid';

export const getUnderwritingGroupsBySection =
  (params = {}) =>
  (dispatch, getState) => {
    // prettier-ignore
    const { user: { auth }, config: { vars: { endpoint } }, claims: { policyData, underWritingGroups } } = getState();

    const defaultError = {
      component: 'getUnderwritingGroupsBySection',
      file: 'stores/claims.actions.getUnderwritingGroupsBySection',
    };

    const prevDirection = underWritingGroups?.sort?.direction || '';
    const newDirection = params.hasOwnProperty('direction') ? params.direction.toUpperCase() : prevDirection;

    const prevSortBy = underWritingGroups?.sort?.by || '';
    const newSortBy = params.hasOwnProperty('sortBy') ? params.sortBy : prevSortBy;

    const policyID = policyData.xbPolicyID || '';
    const sourceID = policyData.xbInstanceID || '';
    const viewLoader = params?.viewLoader ?? false;

    dispatch(getUnderwritingGroupsBySectionRequest());
    viewLoader && dispatch(addLoader('getUnderwritingGroupsBySection'));

    return utils.api
      .get({
        token: auth.accessToken,
        endpoint: endpoint.claimService,
        path: `api/data/policy/${policyID}/source/${sourceID}/underwriting-groups?sortBy=${newSortBy}&direction=${newDirection}`,
      })
      .then((response) => utils.api.handleResponse(response))
      .then((json) => utils.api.handleNewData(json))
      .then((data) => {
        const sortedUnderwritingGroups = data.data.map((item) => {
          return { ...item, id: uuidv4() };
        });
        dispatch(getUnderwritingGroupsBySectionSuccess({ sortedUnderwritingGroups, newSortBy, newDirection }));
        return sortedUnderwritingGroups;
      })
      .catch((err) => {
        dispatch(getUnderwritingGroupsBySectionFailure(err, defaultError));
        utils.api.handleUnauthorized(err, dispatch, authLogout);
        return err;
      })
      .finally(() => {
        viewLoader && dispatch(removeLoader('getUnderwritingGroupsBySection'));
      });
  };

export const getUnderwritingGroupsBySectionRequest = () => {
  return {
    type: 'CLAIMS_UNDERWRITING_GROUPS_BY_SECTION_GET_REQUEST',
  };
};

export const getUnderwritingGroupsBySectionSuccess = (data) => {
  return {
    type: 'CLAIMS_UNDERWRITING_GROUPS_BY_SECTION_GET_SUCCESS',
    payload: data,
  };
};

export const getUnderwritingGroupsBySectionFailure = (err) => {
  return {
    type: 'CLAIMS_UNDERWRITING_GROUPS_BY_SECTION_GET_FAILURE',
    payload: err,
  };
};
