import * as utils from 'utils';
import * as constants from 'consts';
import { resetFilesUploaded, resetDmsDocumentsUpload, resetDmsDocumentsView, resetDmsDocumentsHistory } from 'stores';

const utilsDms = {
  getFilesForm: (files) => {
    return files.map((file, ind) => {
      return {
        formFileName: file?.name || `file-${ind}`,
        formDocType: { id: 0, label: '' },
        formDocClassificationType: { id: 3 },
        paymentFields: { paymentDate: '', paymentReference: '', lossPayee: '', amount: '', currency: '' },
        isDuplicateFileName: false, // Duplicate means the file which was already uploaded to sharepoint before
        isInvalidFileName: false, // Invalid means the file which contains blacklisted special characters
      };
    });
  },

  checkIfClaimsScreenContext: (context) => {
    return constants.DMS_CLAIMS_CONTEXT_TYPES.includes(context);
  },

  getFileKey: (file) => {
    return `${file?.name}-${file?.lastModified}`;
  },

  checkIfInvalidFileName: (fileName) => {
    return constants.DMS_UPLOAD_FORBIDDEN_CHAR.test(fileName);
  },

  getDuplicateFileIndexes: (currentFiles, previousUploadedFiles) => {
    if (Boolean(previousUploadedFiles.length)) {
      const duplicateIndexes = [];
      previousUploadedFiles.forEach((prevItem, index) => {
        currentFiles.forEach((currentItem, index) => {
          if (currentItem?.name === prevItem?.documentName) {
            duplicateIndexes.push(index);
          }
        });
      });
      return duplicateIndexes;
    } else {
      return [];
    }
  },

  getFolderTypes: (documentTypes) => {
    return [
      ...new Set(
        utils.generic.isValidArray(documentTypes)
          ? documentTypes.filter((type) => type?.folderName !== null).map((type) => type?.folderName)
          : []
      ),
    ]
      .sort()
      .map((name) => ({ id: name, label: name }));
  },

  refinedDocTypeByFolderName: (folderNameFilter, documentTypes) => {
    const folderNameFilterKey = folderNameFilter?.label || '';
    return folderNameFilterKey ? documentTypes.filter((docType) => docType.folderName === folderNameFilterKey) : documentTypes;
  },

  getOnlyFileProperties: (files) => {
    return files.map((file) => ({
      name: file.name,
      path: file.path,
      lastModified: file.lastModifiedDate,
      size: file.size,
      type: file.lastModifiedDate,
    }));
  },

  trimFileProperties: (files) => {
    return files.map((file) => ({ name: file.name, path: file.path, lastModifiedDate: file.lastModifiedDate }));
  },

  getFullFileProperties: (files, liteFiles) => {
    const activePaths = liteFiles?.map((file) => file.path);
    return files.filter((file) => activePaths?.includes(file.path));
  },

  constructUploadDocsRequest: (context, files, filesFormData, documentMetaData) => {
    const fetchDocsDto = utilsDms.constructUploadDocsDto(files, filesFormData);
    // TODO documentMetaData to come as props rather than from metaData API
    const fileUploadRequestPayload = {
      // Loss
      lossId: documentMetaData?.lossId,
      lossName: documentMetaData?.lossName,
      catCodesID: documentMetaData?.catCodesID,
      lossCreatedDate: context === constants.DMS_CONTEXT_LOSS || context === constants.DMS_CONTEXT_TASK ? documentMetaData?.lossCreatedDate : null,
      // Policy
      policyId: documentMetaData?.policyId,
      policyRef: documentMetaData?.policyRef,
      year: documentMetaData?.year,
      xbInstanceId: documentMetaData?.xbInstanceId,
      departmentId: documentMetaData?.departmentId,
      subDepartmentId: documentMetaData?.subDepartmentId,
      departmentName: documentMetaData?.departmentName,
      insuredName: documentMetaData?.insuredName,
      // Claims
      claimId: documentMetaData?.claimId,
      uniqueMarketRef: documentMetaData?.uniqueMarketRef || null,
      ucr: documentMetaData?.ucr || null,
      // documentDto
      documentDto: fetchDocsDto,
    };
    return fileUploadRequestPayload;
  },

  constructUploadDocsDto: (files, filesFormData) => {
    let result = [];
    filesFormData?.forEach((fileForm, ind) => {
      result.push({
        documentName: fileForm?.formFileName,
        documentTypeId: fileForm?.formDocType?.id,
        documentTypeDescription: fileForm?.formDocType?.label,
        fileLastModifiedDate: files?.[ind]?.lastModifiedDate?.toISOString(),
        docClassification: fileForm?.formDocClassificationType?.id,
        tags: [],
        metadataFields: utilsDms.constructUploadDocsPaymentsData(fileForm),
      });
    });
    return result;
  },

  constructUploadDocsPaymentsData: (fileForm) => {
    const paymentFields = constants.DMS_DOCUMENT_TYPE_PAYMENT_PROPS;
    return [
      { prop: paymentFields.paymentReference, value: fileForm?.paymentFields?.paymentReference },
      { prop: paymentFields.lossPayee, value: fileForm?.paymentFields?.lossPayee },
      { prop: paymentFields.amount, value: fileForm?.paymentFields?.amount },
      { prop: paymentFields.currency, value: fileForm?.paymentFields?.currency },
      { prop: paymentFields.paymentDate, value: new Date().toISOString() },
    ];
  },

  getDocMetaDataAfterUpload: (filesMetaData) => {
    return filesMetaData?.map(({ createdDate, documentVersion, createdByName, fileLastModifiedDate, documentUploaded }) => ({
      createdDate,
      documentVersion,
      createdByName,
      fileLastModifiedDate,
      documentUploaded,
    }));
  },

  checkIfAllUploaded: (filesMetaData) => {
    return filesMetaData?.every(({ documentUploaded }) => documentUploaded);
  },

  dmsDocumentViewLauncher: (documentId, documentName) => {
    if (documentId && documentName) {
      const fileWindow = window.open();
      fileWindow.location.href = window.location.origin + '/document/' + documentId + '/' + documentName;
    }
  },

  checkDmsDocumentViewForbidden: (ext) => {
    return constants.DMS_DOC_VIEW_FORBIDDEN_FORMATS.includes(ext);
  },

  checkIsMsOfficeType: (ext) => {
    return constants.MS_OFFICE_DOC_TYPES.includes(ext);
  },

  resetDmsFiles: (dispatch) => {
    dispatch(resetFilesUploaded());
    dispatch(resetDmsDocumentsView());
    dispatch(resetDmsDocumentsHistory());
    dispatch(resetDmsDocumentsUpload());
  },
};

export default utilsDms;
