import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useHistory } from 'react-router';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

//app
import * as utils from 'utils';
import { RfiQueryFormView } from './RfiQueryForm.view';
import { Loader } from 'components';
import config from 'config';
import { CREATE_RFI_FORM, TASK_TAB_COMPLETED_STATUS } from 'consts';
import {
  getUsersByOrg,
  selectClaimsAssignedToUsers,
  postSendRFI,
  postCloseRFI,
  showModal,
  selectUserEmail,
  resetClaimsAssignedToUsers,
  setDmsTaskContextType,
  selectDmsClientSideUploadFiles,
  postDmsDocuments,
  resetDmsClientSideUploadedDocuments,
  removeDmsClientSideUploadedDocuments,
  linkMultipleDmsDocuments,
  resetDmsClientSideLinkedDocuments,
} from 'stores';
import * as constants from 'consts';

// mui
import { Box } from '@material-ui/core';

export default function RfiQueryForm(props) {
  const dispatch = useDispatch();
  const history = useHistory();

  const assignedToUsers = useSelector(selectClaimsAssignedToUsers)?.items || null;
  const userEmail = useSelector(selectUserEmail);
  const [resetKey, setResetKey] = useState();
  const [isDataReady, setIsDataReady] = useState(false);

  const clientUploadedFiles = useSelector(selectDmsClientSideUploadFiles);
  const [isUploading, setIsUploading] = useState(false);
  const [isLinking, setIsLinking] = useState(false);
  const documentNameList = clientUploadedFiles?.documentNameList;
  const { rfiTask } = props;

  const defaultAssignedUser = () =>
    userEmail?.toLowerCase() === rfiTask?.requestedBy?.toLowerCase()
      ? assignedToUsers?.find(({ email }) => email?.toLowerCase() === rfiTask?.rfiSentTo?.toLowerCase())
      : utils.generic.isValidArray(assignedToUsers, true)
      ? assignedToUsers?.find(({ email }) => email?.toLowerCase() === rfiTask?.requestedBy?.toLowerCase())
      : null;

  const fields = [
    {
      name: 'sendTo',
      type: 'autocompletemui',
      value: defaultAssignedUser(),
      options: utils.generic.isValidArray(assignedToUsers, true) ? assignedToUsers : [],
      optionKey: 'email',
      optionLabel: 'fullName',
      muiComponentProps: {
        disabled: rfiTask?.status === TASK_TAB_COMPLETED_STATUS,
      },
      validation: Yup.object().required(utils.string.t('validation.required')),
    },
    {
      name: 'description',
      type: 'textarea',
      hint: utils.string.t('claims.processing.validation.rfiHistoryMaxDesc', { char: 1000 }),
      muiComponentProps: {
        inputProps: { maxLength: 1000 },
        multiline: true,
        rows: 3,
        rowsMax: 3,
        'data-testid': 'details',
      },
      validation: Yup.string()
        .required(utils.string.t('validation.required'))
        .max(1000, utils.string.t('claims.processing.validation.rfiHistoryMaxDesc', { char: 1000 })),
    },
  ];

  const actions = [
    {
      name: 'secondary',
      label: utils.string.t('app.close'),
      disabled: userEmail.toLowerCase() !== rfiTask?.requestedBy?.toLowerCase(),
      handler: () => {
        handleCloseRFI();
      },
    },
    {
      name: 'submit',
      label: utils.string.t('app.reply'),
      handler: (values) => {
        handleRFISend(values);
      },
    },
  ];

  const handleRFISend = (values) => {
    if (values) {
      const sendToObj = assignedToUsers.find((user) => user.email === values?.sendTo?.email);
      const rfiSendData = {
        assignedTo: sendToObj?.email,
        bpmTaskID: rfiTask?.taskId,
        caseIncidentID: rfiTask?.caseIncidentID,
        notes: values?.description,
        team: sendToObj?.organisationName,
        queryCodeDescription: props?.selectedQueryCode?.queryCodeDescription || '',
      };

      dispatch(postSendRFI(rfiSendData)).then((data) => {
        if (data.status === constants.API_RESPONSE_OK) {
          setValue('sendTo', null);
          setValue('description', '');
          const { caseIncidentID, caseIncidentNotesID } = data.data;
          if (caseIncidentID && caseIncidentNotesID) {
            dispatch(setDmsTaskContextType({ caseIncidentID, caseIncidentNotesID }));

            const uploadedFileDetails = { ...clientUploadedFiles?.uploadFileDetails };
            const { documentTypeKey, submitData, submitFiles } = uploadedFileDetails;
            const linkedDocList = [...clientUploadedFiles?.linkedDocumentList];

            if (utils.generic.isInvalidOrEmptyArray(linkedDocList) && utils.generic.isInvalidOrEmptyArray(submitFiles)) {
              props.handlers?.getRfiHistoryDetails();
            }

            if (!utils.generic.isInvalidOrEmptyArray(linkedDocList)) {
              makeLinkDocumentCall(caseIncidentNotesID);
            }

            if (!utils.generic.isInvalidOrEmptyArray(submitFiles)) {
              makeUploadDocumentCall(documentTypeKey, submitData, submitFiles);
            }
          }
        }
      });
    }
  };

  const makeLinkDocumentCall = (caseIncidentNotesID) => {
    setIsLinking(true);
    const linkedDocList = [...clientUploadedFiles?.linkedDocumentList];
    const linkedDocParamList = linkedDocList?.map((item) => {
      const linkItem = { ...item };
      return {
        documentId: linkItem.documentId,
        referenceId: `${linkItem.referenceId}-${caseIncidentNotesID}`,
        sectionType: linkItem.sectionType,
      };
    });
    dispatch(linkMultipleDmsDocuments(linkedDocParamList)).then((response) => {
      setIsLinking(false);
      if (response?.status === constants.API_RESPONSE_OK) {
        const linkedResponseList = [...response?.data];
        const linkedDocIdList = linkedResponseList?.map((doc) => doc?.documentDataId);
        const docTableViewList = clientUploadedFiles?.documentTableList;
        const docsTableList = docTableViewList?.filter((doc) => {
          return !linkedDocIdList?.includes(doc?.documentId);
        });
        const docsNameList = docsTableList?.map((doc) => doc?.documentName);
        dispatch(resetDmsClientSideLinkedDocuments({ documentTableList: docsTableList, documentNameList: docsNameList }));
        props.handlers?.getRfiHistoryDetails();
      }
    });
  };

  const makeUploadDocumentCall = (documentTypeKey, submitData, submitFiles) => {
    setIsUploading(true);
    dispatch(postDmsDocuments({ context: constants.DMS_CONTEXT_TASK, documentTypeKey, submitData, submitFiles })).then((data) => {
      setIsUploading(false);
      if (data.status === constants.API_RESPONSE_OK) {
        const documentDtoList = [...data?.data?.documentDto];
        const documentNameDtoList = documentDtoList?.map((document) => document?.documentName);
        const documentTableList = [...clientUploadedFiles?.documentTableList];

        const docTableList = documentTableList?.filter((doc) => {
          return !documentNameDtoList.includes(doc?.documentName);
        });
        const documentNameList = [...clientUploadedFiles?.documentNameList];
        const docNameList = documentNameList?.filter((doc) => {
          return !documentNameDtoList.includes(doc);
        });
        dispatch(resetDmsClientSideUploadedDocuments({ documentTableList: docTableList, documentNameList: docNameList }));
        props.handlers?.getRfiHistoryDetails();
      }
    });
  };

  const handleCloseRFI = () => {
    dispatch(
      showModal({
        component: 'CONFIRM',
        props: {
          fullWidth: true,
          title: utils.string.t('status.alert'),
          maxWidth: 'xs',
          componentProps: {
            confirmLabel: utils.string.t('app.yes'),
            cancelLabel: utils.string.t('app.no'),
            confirmMessage: utils.string.t('claims.processing.modal.rfiCloseConfirm'),
            buttonColors: { confirm: 'secondary', cancel: 'default' },
            submitHandler: () => {
              dispatch(postCloseRFI(rfiTask?.taskId, history)).then((data) => {
                if (data.status === 'OK') {
                  setTimeout(() => history.replace(config.routes.claimsFNOL.taskTab), 1000);
                }
              });
            },
          },
        },
      })
    );
  };

  const handleAttachDocuments = () => {
    dispatch(
      showModal({
        component: 'DMS_UPLOAD_FILES_CLIENT_SIDE',
        props: {
          title: utils.string.t('claims.rfiDashboard.attachDocuments'),
          fullWidth: true,
          maxWidth: 'xl',
          componentProps: {
            referenceId: rfiTask?.taskId,
            sourceId: rfiTask?.sourceID,
            documentTypeKey: constants.DMS_DOCUMENT_TYPE_SECTION_KEYS.claim,
          },
        },
      })
    );
  };

  const confirmDocumentDelete = (index) => {
    dispatch(
      showModal({
        component: 'CONFIRM',
        props: {
          fullWidth: true,
          title: utils.string.t('dms.view.deleteDocument.title'),
          maxWidth: 'xs',
          componentProps: {
            confirmLabel: utils.string.t('dms.view.deleteDocument.confirmLabel'),
            confirmMessage: utils.string.t('dms.view.deleteDocument.confirmMessage'),
            submitHandler: () => removeDocument(index),
          },
        },
      })
    );
  };

  const removeDocument = (index) => {
    const uploadedFiles = { ...clientUploadedFiles };
    const documentList = [...uploadedFiles?.documentTableList];
    if (!utils.generic.isInvalidOrEmptyArray(documentList) && documentList[index]?.isLink) {
      const linkedDocName = documentList[index]?.documentName;
      const linkedDocList = [...uploadedFiles?.linkedDocumentList];
      const searchIndex = linkedDocList?.findIndex((linkedDocItem) => linkedDocItem?.documentName === linkedDocName);
      uploadedFiles?.linkedDocumentList?.splice(searchIndex, 1);
      uploadedFiles?.documentTableList?.splice(index, 1);
      uploadedFiles?.documentNameList?.splice(index, 1);
    } else if (!utils.generic.isInvalidOrEmptyArray(documentList) && !documentList[index]?.isLink) {
      const uploadedDocName = documentList[index]?.documentName;
      const submitFiles = [...uploadedFiles?.uploadFileDetails?.submitFiles];
      const searchSubmitIndex = submitFiles?.findIndex((uploadSubmitItem) => uploadSubmitItem?.name === uploadedDocName);
      !utils.generic.isInvalidOrEmptyArray(uploadedFiles?.uploadFileDetails?.submitFiles) &&
        uploadedFiles?.uploadFileDetails?.submitFiles?.splice(searchSubmitIndex, 1);

      const documentDto = [...uploadedFiles?.uploadFileDetails?.submitData?.documentDto];
      const searchDtoIndex = documentDto?.findIndex((docDtoItem) => docDtoItem?.documentName === uploadedDocName);
      !utils.generic.isInvalidOrEmptyArray(uploadedFiles?.uploadFileDetails?.submitData?.documentDto) &&
        uploadedFiles?.uploadFileDetails?.submitData?.documentDto?.splice(searchDtoIndex, 1);
      uploadedFiles?.documentTableList?.splice(index, 1);
      uploadedFiles?.documentNameList?.splice(index, 1);
    }

    dispatch(removeDmsClientSideUploadedDocuments({ uploadedFiles: uploadedFiles }));
  };

  useEffect(() => {
    dispatch(getUsersByOrg('', [rfiTask], CREATE_RFI_FORM, false));
    dispatch(resetClaimsAssignedToUsers());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (assignedToUsers?.length > 0) {
      setResetKey(new Date().getTime());
      setIsDataReady(true);
    }
  }, [assignedToUsers]);

  const defaultValues = utils.form.getInitialValues(fields);
  const validationSchema = utils.form.getValidationSchema(fields);

  const { control, reset, errors, handleSubmit, formState, setValue } = useForm({
    defaultValues,
    ...(validationSchema && { resolver: yupResolver(validationSchema) }),
  });

  if (!isDataReady) {
    return (
      <Box height="300px">
        <Loader visible absolute />
      </Box>
    );
  }

  return (
    <RfiQueryFormView
      {...props}
      fields={fields}
      actions={actions}
      formProps={{ control, handleSubmit, setValue, errors, formState, reset }}
      resetKey={resetKey}
      documentNameList={documentNameList}
      isUploading={isUploading}
      isLinking={isLinking}
      handlers={{ handleAttachDocuments: handleAttachDocuments, confirmDocumentDelete: confirmDocumentDelete }}
    />
  );
}
