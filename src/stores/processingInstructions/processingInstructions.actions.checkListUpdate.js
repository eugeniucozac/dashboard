import { addLoader, authLogout, removeLoader, storeProcessingInstruction } from 'stores';
import piSchema from '../../schemas/processingInstructions';
import * as utils from 'utils';
import config from 'config';

export const checkListUpdate = (values, instruction) => (dispatch, getState) => {
  // prettier-ignore
  const { user, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/processingInstructions.actions.checkListUpdate',
  };

  const now = utils.string.t('format.date', { value: { date: new Date(), format: config.ui.format.date.iso } });

  const createChecklistArray = (checklist = {}) => {
    return Object.entries(piSchema.content).reduce((acc, [key, list]) => {
      return [
        ...acc,
        ...list.map((l) => {
          const checklistObject = checklist[l.rowKey] || {};
          const signedDate = utils.string.t('format.date', {
            value: { date: checklistObject.signedDate, format: 'YYYY-MM-DD' },
          });

          return {
            instructionId: instruction.id,
            checkListDetails: l.rowKey,
            checkListType: key,
            accountHandler: checklistObject.accountHandler || '',
            authorisedSignatory: checklistObject.authorisedSignatory || false,
            signedDate: signedDate || '',
            createdBy: checklistObject.createdBy || user.id,
            createdDate: checklistObject.createdDate || now,
            updatedBy: user.id,
            updatedDate: now,
            isActive: checklistObject.isActive || 1,
          };
        }),
      ];
    }, []);
  };

  dispatch(checkListUpdateRequest(values, instruction));
  dispatch(addLoader('checkListUpdate'));

  if (!values || !instruction || !instruction?.id) {
    dispatch(checkListUpdateFailure(defaultError));
    return;
  }

  const payload = {
    ...instruction,
    checklist: createChecklistArray(values?.checklist),
    details: {
      ...instruction?.details,
      instructionId: instruction.details?.id,
      // Will uncomment once API send id info
      // ...(values?.accountExecutive && { accountExecutiveId: values.accountExecutive }),
      // ...(values.producingBroker && { producingBrokerId: values.producingBroker }),
      clientEmail: values.clientEmail?.trim() || '',
      clientName: values.clientName || '',
      contactName: values.contactName?.trim() || '',
      eocInvoiceContactName: values.eocInvoiceContactName?.trim() || '',
      eocInvoiceMail: values.eocInvoiceMail?.trim() || '',
      facilityTypeId: values.facilityType || null,
    },
  };

  return utils.api
    .put({
      token: user.auth.accessToken,
      endpoint: endpoint.ppService,
      path: `instruction/saveChecklist`,
      data: payload,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(checkListUpdateSuccess(data.data));
      dispatch(storeProcessingInstruction(data.data));
      return data;
    })
    .catch((err) => {
      utils.api.handleError(err, { ...defaultError, message: 'API fetch error (checkListUpdate)' });
      dispatch(checkListUpdateFailure(err));
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('checkListUpdate'));
    });
};

export const checkListUpdateRequest = (values, instruction) => {
  return {
    type: 'PROCESSING_INSTRUCTIONS_CHECKLIST_UPDATE_REQUEST',
    payload: { values, instruction },
  };
};

export const checkListUpdateSuccess = (json) => {
  return {
    type: 'PROCESSING_INSTRUCTIONS_CHECKLIST_UPDATE_SUCCESS',
    payload: json,
  };
};

export const checkListUpdateFailure = (error) => {
  return {
    type: 'PROCESSING_INSTRUCTIONS_CHECKLIST_UPDATE_FAILURE',
    payload: error,
  };
};
