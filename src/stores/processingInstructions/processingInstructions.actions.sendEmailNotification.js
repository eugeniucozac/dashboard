import * as utils from 'utils';

export const sendEmailNotification = (formData) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();
  const { instruction, frontEndContactEmail, frontEndContactName } = formData;

  const defaultError = {
    file: 'stores/processingInstructions.actions.sendEmailNotification',
  };

  dispatch(sendEmailNotificationRequest(formData));

  if (!instruction || !frontEndContactEmail || !frontEndContactName) {
    dispatch(sendEmailNotificationFailure({ ...defaultError, message: 'Missing form data' }));
    return;
  }

  const emailBody = {
    recipient: [frontEndContactEmail],
    subject: utils.string.t('processingInstructions.emailNotification.subject', {
      instructionId: instruction?.id,
    }),
    body: utils.string.t('processingInstructions.emailNotification.body', {
      fecName: frontEndContactName,
      instructionId: instruction?.id,
    }),
  };

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.emailNotification,
      data: emailBody,
      path: 'api/sendEmail',
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(sendEmailNotificationSuccess(data.data));
      return data.data;
    })
    .catch((err) => {
      utils.api.handleError(err, { ...defaultError, message: 'API fetch error (sendEmailNotification)' });
      dispatch(sendEmailNotificationFailure(err));
      return err;
    });
};

export const sendEmailNotificationRequest = (values, instruction) => {
  return {
    type: 'PROCESSING_INSTRUCTION_SEND_EMAIL_NOTIFICATION_REQUEST',
    payload: { values, instruction },
  };
};

export const sendEmailNotificationSuccess = (json) => {
  return {
    type: 'PROCESSING_INSTRUCTION_SEND_EMAIL_NOTIFICATION_SUCCESS',
    payload: json,
  };
};

export const sendEmailNotificationFailure = (error) => {
  return {
    type: 'PROCESSING_INSTRUCTION_SEND_EMAIL_NOTIFICATION_FAILURE',
    payload: error,
  };
};
