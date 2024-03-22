import { addLoader, removeLoader, enqueueNotification } from 'stores';
import * as utils from 'utils';

export const postEmail = (params) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { emailId, auth }, config: { vars: { endpoint }}} = getState();

  const { emailTo, emailCc, message, subject, objectId, objectCode, emailType, attachments = [] } = params;

  const defaultError = {
    file: 'stores/emailManagementService.actions.postEmail',
  };

  dispatch(addLoader('postEmail'));
  dispatch(postEmailRequest(params));

  if (!(emailTo && objectId && objectCode && emailType)) {
    dispatch(postEmailFailure({ ...defaultError, message: 'Missing some params' }));
    dispatch(enqueueNotification('ems.missingParams', 'error'));
    dispatch(removeLoader('postEmail'));
    return Promise.reject({ message: 'Missing some params' });
  }

  const emailData = {
    emailTo,
    emailCc: `${emailId};${emailCc}`,
    replyTo: `${emailId};${emailCc}`,
    message,
    subject,
    objectId,
    objectCode,
    emailType,
    isPriority: 1,
    templateName: 'Template1', //Will remove once we got confirmation from api team
    eventType: 'PP_ISSUE_DOC', //Will remove once we got confirmation from api team
    attachments,
  };

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.notificationService,
      path: 'email/send',
      data: emailData,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(postEmailSuccess(data));
      dispatch(enqueueNotification('ems.mailSentSuccess', 'success'));
      return data;
    })
    .catch((err) => {
      utils.api.handleError(err, { ...defaultError, message: 'API fetch error (postEmail)' });
      dispatch(postEmailFailure(err));
      dispatch(enqueueNotification('ems.mailSentFailure', 'error'));
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('postEmail'));
    });
};

export const postEmailRequest = (params) => {
  return {
    type: 'EMS_POST_EMAIL_REQUEST',
    payload: params,
  };
};

export const postEmailSuccess = (data) => {
  return {
    type: 'EMS_POST_EMAIL_SUCCESS',
    payload: data,
  };
};

export const postEmailFailure = (error) => {
  return {
    type: 'EMS_POST_EMAIL_FAILURE',
    payload: error,
  };
};
