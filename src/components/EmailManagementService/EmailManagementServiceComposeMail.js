import React, { useState } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import isEmpty from 'lodash/isEmpty';

//app
import styles from './EmailManagementService.styles';
import EmailManagementServiceComposeMailView from './EmailManagementServiceComposeMail.view';
import * as constants from 'consts';
import * as utils from 'utils';
import { MultiSelect } from 'components';

//mui
import { makeStyles } from '@material-ui/core';

EmailManagementServiceComposeMail.propTypes = {
  emsExistingDocuments: PropTypes.array.isRequired,
  forwardAttachments: PropTypes.array.isRequired,
  forwardMessage: PropTypes.string.isRequired,
  forwardSubject: PropTypes.string.isRequired,
  handlers: PropTypes.shape({
    sendEmail: PropTypes.func,
  }).isRequired,
  caseDetailsObject: PropTypes.object,
  accountDetails: PropTypes.object,
};

function EmailManagementServiceComposeMail({
  emsExistingDocuments,
  forwardAttachments,
  forwardSubject,
  forwardMessage,
  handlers,
  caseDetailsObject,
  accountDetails,
}) {
  const classes = makeStyles(styles, { name: 'EmailManagementService' })();

  const docList = emsExistingDocuments?.map((doc) => ({ id: doc?.documentId, name: doc?.documentName }));

  const [attachedMailDocuments, setAttachedMailDocuments] = useState(
    utils.generic.isValidArray(forwardAttachments, true)
      ? forwardAttachments?.map((doc) => ({ id: doc?.documentId, name: doc?.documentName }))
      : []
  );

  const yupString = Yup.string();
  const fields = [
    {
      type: 'file',
      name: 'filesUpload',
      value: null,
      showUploadPreview: false,
      showMaxFilesError: true,
      dragLabel: utils.string.t('form.dragDrop.dragFileHere'),
      showButton: false,
      componentProps: {
        multiple: constants.PROCESSING_INSTRUCTION_FILE_UPLOAD_ALLOW_MULTIPLE,
        maxFiles: constants.PROCESSING_INSTRUCTION_DETAILS_FILE_UPLOAD_MAX_FILES,
        maxSize: constants.PROCESSING_INSTRUCTION_FILE_UPLOAD_MAX_FILE_SIZE,
        accept: constants.PROCESSING_INSTRUCTION_FILE_UPLOAD_ALLOWED_FILE_EXT,
      },
    },
    {
      name: 'emailTo',
      type: 'text',
      value:
        (caseDetailsObject?.frontEndSendDocs &&
          accountDetails?.documentSentType === utils.string.t('premiumProcessing.processingClientTable.tableColumns.backOfficeToFEC') &&
          !accountDetails?.sendDate &&
          caseDetailsObject?.fecEmail) ||
        '',
      variant: 'standard',
      validation: yupString.required(utils.string.t('validation.required')).test({
        name: 'mailTo',
        test: function (value) {
          let mandatoryEmail;
          if (
            caseDetailsObject?.frontEndSendDocs &&
            accountDetails?.documentSentType === utils.string.t('premiumProcessing.processingClientTable.tableColumns.backOfficeToFEC') &&
            !accountDetails?.sendDate &&
            caseDetailsObject?.fecEmail
          ) {
            mandatoryEmail = value
              .split(';')
              .map((email) => email.trim())
              .filter((v) => !isEmpty(v))
              .find((v) => v === caseDetailsObject?.fecEmail);
          }
          const firstInvalidEmail = value
            .split(';')
            .map((email) => email.trim())
            .filter((v) => !isEmpty(v))
            .find((v) => !yupString.email().isValidSync(v));
          return firstInvalidEmail
            ? this.createError({
                message: utils.string.t('validation.inValidEmail', { firstInvalidEmail }),
              })
            : caseDetailsObject?.frontEndSendDocs &&
              accountDetails?.documentSentType === utils.string.t('premiumProcessing.processingClientTable.tableColumns.backOfficeToFEC') &&
              !accountDetails?.sendDate &&
              caseDetailsObject?.fecEmail &&
              !mandatoryEmail
            ? this.createError({
                message: utils.string.t('validation.mandatoryEmail', {
                  mandatoryEmail: caseDetailsObject?.fecEmail,
                }),
              })
            : true;
        },
      }),
      muiComponentProps: {
        fullWidth: true,
        classes: {
          root: classes.input,
        },
      },
    },
    {
      name: 'emailCc',
      type: 'text',
      value: '',
      variant: 'standard',
      validation: yupString.test({
        name: 'mailCc',
        test: function (value) {
          const firstInvalidEmail = value
            .split(';')
            .map((email) => email.trim())
            .filter((v) => !isEmpty(v))
            .find((v) => !yupString.email().isValidSync(v));

          return !firstInvalidEmail
            ? true
            : this.createError({
                message: utils.string.t('validation.inValidEmail', { firstInvalidEmail }),
              });
        },
      }),
      muiComponentProps: {
        fullWidth: true,
        classes: {
          root: classes.input,
        },
      },
    },
    {
      name: 'subject',
      type: 'text',
      value: forwardSubject || '',
      variant: 'standard',
      validation: yupString.required(utils.string.t('validation.required')),
      muiComponentProps: {
        fullWidth: true,
        classes: {
          root: classes.input,
        },
      },
    },
    {
      name: 'message',
      type: 'textarea',
      value: forwardMessage || '',
      validation: yupString.required(utils.string.t('validation.required')),
      muiComponentProps: {
        inputProps: { maxLength: 4000 },
        multiline: true,
        rows: 6,
        rowsMax: 6,
        fullWidth: true,
        classes: {
          root: classes.input,
        },
      },
    },
  ];

  const actions = [
    {
      name: 'sendMail',
      handler: (formData) =>
        handlers.sendEmail({
          ...formData,
          attachments: attachedMailDocuments?.map((doc) => ({ documentId: doc?.id, documentName: doc?.name })),
        }),
    },
  ];

  const toggleOption = (controlId, selectedDoc) => {
    setAttachedMailDocuments((oldArray) => {
      const isFileAlreadyAdded = oldArray.some((o) => o?.id === selectedDoc?.id);
      if (isFileAlreadyAdded) {
        return oldArray.filter((item) => item.id !== selectedDoc?.id);
      }

      return [...oldArray, selectedDoc];
    });
  };

  const attachmentProps = {
    id: 'attachments',
    type: 'multiSelect',
    label: utils.string.t('ems.useExistingFiles'),
    value: attachedMailDocuments,
    options: docList || [],
    content: <MultiSelect id="attachments" search options={docList || []} />,
    handlers: { toggleOption },
  };

  const removeAttachedDocument = (selectedDoc) => {
    setAttachedMailDocuments((oldArray) => oldArray.filter((item) => item?.id !== selectedDoc?.value));
  };

  return (
    <EmailManagementServiceComposeMailView
      actions={actions}
      attachedMailDocuments={attachedMailDocuments}
      attachmentProps={attachmentProps}
      fields={fields}
      handlers={{ removeAttachedDocument }}
    />
  );
}

export default EmailManagementServiceComposeMail;
