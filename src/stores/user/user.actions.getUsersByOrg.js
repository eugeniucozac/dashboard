import * as utils from 'utils';
import { addLoader, removeLoader } from 'stores';
import { ORGANIZATIONS, CREATE_RFI_FORM } from 'consts';

export const getUsersByOrg =
  (org, selectedWorkItem, type, showLoader = true) =>
  (dispatch, getState) => {
    // prettier-ignore
    const { user: { auth, businessProcess }, config: { vars: { endpoint } } } = getState();

    const newTeam = org?.toLowerCase() || ORGANIZATIONS.mphasis.name;
    const orgId = ORGANIZATIONS[newTeam]?.id || ORGANIZATIONS.mphasis.id;

    if (!utils.generic.isValidArray(selectedWorkItem, true)) return null;

    let departmentSourceId = [];
    (selectedWorkItem || []).forEach((item) => {
      departmentSourceId = [
        ...departmentSourceId,
        `${item.departmentID || item.divisionID || item.divisionId}-${item.sourceID || item.sourceId}`,
      ];
    });

    dispatch(getClaimsAssignedToUsersListRequest({ org, selectedWorkItem, type, showLoader }));
    if (showLoader) dispatch(addLoader('getAssignedToUsersList'));

    return utils.api
      .post({
        token: auth.accessToken,
        endpoint: endpoint.authService,
        path: 'api/users/genericUserSearch',
        data: {
          organisationId: type === CREATE_RFI_FORM ? [] : [`${orgId}`],
          businessProcessId: [businessProcess?.[0]?.id?.toString()],
          departmentSourceId: type === CREATE_RFI_FORM ? [] : departmentSourceId,
        },
      })
      .then((response) => utils.api.handleResponse(response))
      .then((json) => utils.api.handleNewData(json))
      .then((data) => {
        dispatch(getClaimsAssignedToUsersListSuccess(newTeam, type, data?.data));
        return data.data;
      })
      .catch((error) => {
        dispatch(
          getClaimsAssignedToUsersListFailure(error, {
            file: 'stores/claims.actions.getAssignedToUsersList',
          })
        );
        return error;
      })
      .finally(() => {
        if (showLoader) dispatch(removeLoader('getAssignedToUsersList'));
      });
  };

export const getClaimsAssignedToUsersListRequest = (params) => {
  return {
    type: 'USER_GET_USERS_BY_ORG_REQUEST',
    payload: params,
  };
};

export const getClaimsAssignedToUsersListSuccess = (orgName, type, data) => {
  return {
    type: 'USER_GET_USERS_BY_ORG_SUCCESS',
    payload: { type, orgName, items: data },
  };
};

export const getClaimsAssignedToUsersListFailure = (error) => {
  return {
    type: 'USER_GET_USERS_BY_ORG_FAILURE',
    payload: error,
  };
};
