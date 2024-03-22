import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

// app
import { DmsUploadFilesView } from './DmsUploadFiles.view';
import {
  hideModal,
  getDmsMetaData,
  selectRefDataNewDocumentTypesByContextSource,
  selectRefDataNewDocumentTypeLookUpByContextSource,
  selectDmsMetaData,
  selectorDmsViewFiles,
  selectSettlementCurrency,
  removeLoader,
  postDmsDocuments,
  uploadClientSideDmsDocuments,
  selectDmsClientSideUploadFiles,
  selectUser,
} from 'stores';
import * as constants from 'consts';
import * as utils from 'utils';

DmsUploadFiles.propTypes = {
  files: PropTypes.array.isRequired,
  context: PropTypes.string.isRequired,
  referenceId: PropTypes.string.isRequired,
  sourceId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  documentTypeKey: PropTypes.oneOf(Object.values(constants.DMS_DOCUMENT_TYPE_SECTION_KEYS)),
  postDmsDocumentsSuccess: PropTypes.func,
  onClosingUploadModal: PropTypes.func,
  isClientSideUpload: PropTypes.bool,
};

DmsUploadFiles.defaultProps = {
  documentTypeKey: constants.DMS_DOCUMENT_TYPE_SECTION_KEYS.policy,
  postDmsDocumentsSuccess: () => {},
  onClosingUploadModal: () => {},
};

export default function DmsUploadFiles({
  files,
  context,
  referenceId,
  sourceId,
  documentTypeKey,
  postDmsDocumentsSuccess,
  onClosingUploadModal,
  isClientSideUpload,
}) {
  const dispatch = useDispatch();

  const filesLiteVersion = utils.dms.trimFileProperties(files);
  const isDmsFromPi = utils.dmsFormatter.isDmsFromPi(documentTypeKey);
  const showFolderFilter = !(isDmsFromPi || documentTypeKey === constants.DMS_DOCUMENT_TYPE_SECTION_KEYS.policy);

  // redux
  const selectCurrencies = useSelector(selectSettlementCurrency);
  const documentMetaData = useSelector(selectDmsMetaData);
  const previousUploadedFiles = useSelector(selectorDmsViewFiles);
  const clientUploadedFiles = useSelector(selectDmsClientSideUploadFiles);

  const xbInstanceId = sourceId ? sourceId : constants.DMS_CLAIM_SOURCE_ID;

  const user = useSelector(selectUser);

  const {
    dmsSectionKey,
    dmsSourceId: selectedSourceId,
    dmsDocTypeSource: documentTypeSource,
  } = utils.dmsFormatter.getDocumentTypeFilterKeys(context, xbInstanceId, documentTypeKey);

  const documentTypesBeforeFilter = useSelector(
    dmsSectionKey === constants.DMS_DOCUMENT_TYPE_SECTION_KEYS.policy
      ? selectRefDataNewDocumentTypeLookUpByContextSource(dmsSectionKey, selectedSourceId)
      : selectRefDataNewDocumentTypesByContextSource(dmsSectionKey, selectedSourceId, documentTypeSource)
  );

  const { documentTypeDescription, sectionKey, dmsSourceID } =
    isDmsFromPi && utils.dmsFormatter.getDocumentTypeInfo(documentTypeKey, selectedSourceId);

  const documentTypesAfterFilter =
    (context === constants.DMS_CONTEXT_POLICY || context === constants.DMS_CONTEXT_PROCESSING_INSTRUCTION) && isDmsFromPi
      ? documentTypesBeforeFilter?.filter(
          (type) =>
            type.documentTypeDescription === documentTypeDescription && type.sectionKey === sectionKey && type.sourceID === dmsSourceID
        )
      : documentTypesBeforeFilter;

  // state
  const [activeFiles, setActiveFiles] = useState(filesLiteVersion);
  const [refinedDocTypes, setRefinedDocTypes] = useState(documentTypesAfterFilter);
  const [isMetaDataLoaded, setIsMetaDataLoaded] = useState(false);
  const [showDocTypeRequired, setShowDocTypeRequired] = useState(false);
  const [canSubmit, setCanSubmit] = useState(true);
  const [filesSubmitted, setFilesSubmitted] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(filesLiteVersion?.map(() => false) || []);
  const [postUploadMetaData, setPostUploadMetaData] = useState([]);

  const tableFormArrayRef = useRef(utils.dms.getFilesForm(activeFiles || []));
  const duplicateFileIndexes = utils.dms.getDuplicateFileIndexes(activeFiles, previousUploadedFiles);
  const folderTypes = utils.dms.getFolderTypes(documentTypesAfterFilter);
  const currencies = utils.currency.listWithCodeAndCurrency(selectCurrencies);

  const cols = [
    {
      id: 'fileName',
      label: utils.string.t('claims.lossInformation.dmsUploadDocument.cols.fileName'),
    },
    {
      id: 'documentType',
      label: utils.string.t('claims.lossInformation.dmsUploadDocument.cols.documentType'),
    },
    {
      id: 'documentClassification',
      label: utils.string.t('claims.lossInformation.dmsUploadDocument.cols.documentClassification'),
    },
    {
      id: 'removeDoc',
      empty: true,
    },
  ];

  // handlers
  const handleFolderTypeSelection = (event, value) => {
    setRefinedDocTypes(utils.dms.refinedDocTypeByFolderName(value, documentTypesAfterFilter));
  };

  const handleRemoveFiles = (removalIndex) => {
    const newList = [...activeFiles];
    newList.splice(removalIndex, 1);

    const newForm = [...tableFormArrayRef?.current];
    newForm.splice(removalIndex, 1);
    tableFormArrayRef.current = [...newForm];

    setActiveFiles(newList);
    checkIfInvalidFiles(tableFormArrayRef?.current);
  };

  const handleTableForm = (index, rowFormState) => {
    const newForm = [...tableFormArrayRef?.current];
    newForm[index] = {
      formFileName: rowFormState?.formFileName || '',
      formDocType: rowFormState?.formDocType,
      formDocClassificationType: { id: rowFormState?.formDocClassificationType?.id || 0 },
      paymentFields: rowFormState?.paymentFields,
      isDuplicateFileName: rowFormState?.isDuplicateFileName || false,
      isInvalidFileName: rowFormState?.isInvalidFileName || false,
    };
    tableFormArrayRef.current = [...newForm];

    checkIfInvalidFiles(tableFormArrayRef?.current);
  };

  const checkIfInvalidFiles = (fileFormArray) => {
    const invalidCondition =
      utils.generic.isValidArray(fileFormArray, true) && fileFormArray.every((fileForm) => !fileForm?.isInvalidFileName);
    if (!canSubmit && invalidCondition) setCanSubmit(true);
    if (canSubmit && !invalidCondition) setCanSubmit(false);
  };

  const checkIfSubmittable = (fileFormArray) => {
    const submitCondition =
      utils.generic.isValidArray(fileFormArray, true) &&
      fileFormArray.every((fileForm) => {
        return fileForm?.formDocType?.id && !fileForm?.isInvalidFileName;
      });
    setCanSubmit(submitCondition);
    return submitCondition;
  };

  const handleFilesSubmission = (e) => {
    e.preventDefault();
    const filesFormData = tableFormArrayRef?.current;
    if (checkIfSubmittable(filesFormData)) {
      setIsUploading(true);
      makeUploadCall(filesFormData);
    } else {
      setShowDocTypeRequired(true);
    }
  };

  const makeUploadCall = (filesFormData) => {
    const submitData = utils.dms.constructUploadDocsRequest(context, filesLiteVersion, filesFormData, documentMetaData);
    const submitFiles = utils.dms.getFullFileProperties(files, activeFiles);

    if (isClientSideUpload) {
      let documentList = [...clientUploadedFiles?.documentTableList];
      if (!utils.generic.isInvalidOrEmptyArray(submitData?.documentDto)) {
        const docList = submitData?.documentDto?.map((item) => {
          const docDetails = {
            documentName: item?.documentName,
            docClassification: item?.docClassification,
            documentTypeDescription: item?.documentTypeDescription,
            documentTypeId: item?.documentTypeId,
            fileLastModifiedDate: item?.fileLastModifiedDate,
            srcApplication: constants.DMS_SHAREPATH_SOURCES.edge,
            updatedDate: new Date(),
            createdByName: user?.fullName,
          };
          return docDetails;
        });
        documentList = [...docList, ...documentList];
      }
      const fileDetails = { context, documentTypeKey, submitData, submitFiles };
      if (utils.generic.isValidObject(clientUploadedFiles?.uploadFileDetails, 'submitData')) {
        const documentDtoList = [...clientUploadedFiles?.uploadFileDetails?.submitData?.documentDto];
        if (!utils.generic.isInvalidOrEmptyArray(documentDtoList)) {
          fileDetails?.submitData?.documentDto?.push(...documentDtoList);
        }
      }
      if (utils.generic.isValidObject(clientUploadedFiles?.uploadFileDetails, 'submitFiles')) {
        const submitFilesList = [...clientUploadedFiles?.uploadFileDetails?.submitFiles];
        if (!utils.generic.isInvalidOrEmptyArray(submitFilesList)) {
          fileDetails?.submitFiles?.push(...submitFilesList);
        }
      }
      const uploadedFileContext = {
        fileDetails,
        documentList,
      };
      dispatch(uploadClientSideDmsDocuments(uploadedFileContext));
      dispatch(hideModal('DMS_UPLOAD_FILES'));
    } else {
      dispatch(postDmsDocuments({ context, documentTypeKey, submitData, submitFiles })).then((data) => {
        setIsUploading(false);
        setFilesSubmitted(true);
        if (data?.status?.toLowerCase() === constants.API_RESPONSE_OK.toLowerCase()) {
          markUploadFailedFiles(data?.data);
          postDmsDocumentsSuccess(data);
          setPostUploadMetaData(utils.dms.getDocMetaDataAfterUpload(data?.data?.documentDto));
          if (utils.dms.checkIfAllUploaded(data?.data?.documentDto)) {
            dispatch(hideModal('DMS_UPLOAD_FILES'));
            onClosingUploadModal();
          }
        }
      });
    }
  };

  const markUploadFailedFiles = (data) => {
    const docDtoInfo = data?.documentDto || [];

    const uploadFiles = docDtoInfo?.map((eachFile) => eachFile?.documentName);
    const uploadStatus = docDtoInfo?.map((eachFile) => eachFile?.documentUploaded);

    if (utils.dms.checkIfAllUploaded(docDtoInfo)) setCanSubmit(false);

    const newList = [...activeFiles]?.filter((item, index) => !uploadStatus[index]);

    const currentForm = [...tableFormArrayRef?.current];
    let removalIndex = [];

    const newForm = currentForm?.filter((item) => {
      const matchIndex = uploadFiles?.indexOf(item?.formFileName);
      removalIndex.push(matchIndex);
      return matchIndex > -1 && !uploadStatus[matchIndex];
    });

    if (utils.generic.isValidArray(removalIndex, true)) {
      removalIndex.forEach((ind) => {
        uploadStatus.splice(ind, 1);
      });
    }

    tableFormArrayRef.current = [...newForm];

    setActiveFiles(newList);
    setUploadStatus(uploadStatus);
  };

  const handleRetrySingleFile = (retryIndex) => {
    const submitData = utils.dms.constructUploadDocsRequest(
      context,
      [filesLiteVersion[retryIndex]],
      [tableFormArrayRef?.current[retryIndex]],
      documentMetaData
    );
    const submitFiles = utils.dms.getFullFileProperties([files[retryIndex]], [filesLiteVersion[retryIndex]]);

    setFilesSubmitted(false);
    setIsUploading(true);

    dispatch(postDmsDocuments({ context, documentTypeKey, submitData, submitFiles })).then((data) => {
      setIsUploading(false);
      setFilesSubmitted(true);
      if (data?.status?.toLowerCase() === constants.API_RESPONSE_OK.toLowerCase()) {
        setFilesSubmitted(true);
        markUploadFailedFiles(data?.data);
        if (utils.dms.checkIfAllUploaded(data?.data?.documentDto)) {
          dispatch(hideModal('DMS_UPLOAD_FILES'));
          postDmsDocumentsSuccess(data);
          onClosingUploadModal();
        }
      }
    });
  };

  const handleCancel = () => {
    dispatch(hideModal('DMS_UPLOAD_FILES'));
    onClosingUploadModal();
  };

  useEffect(() => {
    dispatch(getDmsMetaData(context, xbInstanceId, referenceId))
      .then((data) => {
        setIsMetaDataLoaded(data?.status === constants.API_RESPONSE_OK);
      })
      .catch(() => setIsMetaDataLoaded(false));
    dispatch(removeLoader('DmsUploadFiles'));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const resetDocTypeRequired = () => {
    setShowDocTypeRequired(false);
  };

  return (
    <DmsUploadFilesView
      context={context}
      files={activeFiles}
      duplicateFileIndexes={duplicateFileIndexes}
      cols={cols}
      currencies={currencies}
      folderTypes={folderTypes}
      documentTypes={refinedDocTypes}
      isMetaDataLoaded={isMetaDataLoaded}
      showDocTypeRequired={showDocTypeRequired}
      canSubmit={canSubmit}
      filesSubmitted={filesSubmitted}
      isUploading={isUploading}
      uploadStatus={uploadStatus}
      isDmsFromPi={isDmsFromPi}
      showFolderFilter={showFolderFilter}
      postUploadMetaData={postUploadMetaData}
      resetDocTypeRequired={resetDocTypeRequired}
      handlers={{
        handleFolderTypeSelection,
        handleRemoveFiles,
        handleTableForm,
        handleFilesSubmission,
        handleRetrySingleFile,
        handleCancel,
      }}
    />
  );
}
