import { removeLoader, addLoader, enqueueNotification, authLogout, hideModal } from 'stores';
import * as utils from 'utils';

export const postAssignToUser = (userDetails) => (dispatch, getState) => {
  const {
    user: { auth },
    config: {
      vars: { endpoint },
    },
  } = getState();

  const defaultError = {
    file: 'stores/premiumProcessing.actions.postAssignToUser',
  };
  dispatch(postAssignToUserRequest(userDetails));
  dispatch(addLoader('postAssignToUser'));

  if (!userDetails) {
    dispatch(postAssignToUserFailure({ ...defaultError, message: 'Missing parameters' }));
    dispatch(enqueueNotification('notification.submission.fail', 'error'));
    dispatch(removeLoader('postAssignToUser'));
    return;
  }

  const assignCaseDetails = [];
  userDetails.rowDetails.forEach((element) => {
    assignCaseDetails.push({
      processInstanceId: element.bpmProcessId,
      taskId: element.taskId,
      caseIncidentId: element.caseId,
    });
  });
  let roleDetails = {
    email: '',
    role: '',
  };
  userDetails.userDetails.forEach((element) => {
    roleDetails.email = element.emailId;
    roleDetails.role = element.userRole;
  });
  const processAssignDTO = {
    assignCaseRequest: assignCaseDetails,
    assignedTo: roleDetails.email,
    roleId: roleDetails.role,
    assign: true,
  };

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.bpmService,
      path: 'workflow/tasks/assign',
      data: processAssignDTO,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(postAssignToUserSuccess(data?.data));
      dispatch(hideModal());
      return data;
    })
    .catch((error) => {
      utils.api.handleError(error, { ...defaultError, message: 'API fetch error (premiumProcessing.postAssignToUser)' });
      utils.api.handleUnauthorized(error, dispatch, authLogout);
      dispatch(
        postAssignToUserFailure(error, {
          file: 'stores/premiumProcessing.actions.postAssignToUser',
        })
      );
      dispatch(enqueueNotification('notification.assignToUser.fail', 'error'));
      return error;
    })
    .finally(() => {
      dispatch(hideModal());
      dispatch(removeLoader('postAssignToUser'));
    });
};

export const postAssignToUserRequest = (payload) => {
  return {
    type: 'PREMIUM_PROCESSING_ASSIGNTO_USER_REQUEST',
    payload,
  };
};

export const postAssignToUserSuccess = (data) => {
  return {
    type: 'PREMIUM_PROCESSING_ASSIGNTO_USER_SUCCESS',
    payload: data,
  };
};

export const postAssignToUserFailure = (error) => {
  return {
    type: 'PREMIUM_PROCESSING_ASSIGNTO_USER_FAILURE',
    payload: error,
  };
};
