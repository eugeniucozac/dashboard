import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

// app
import { AddManageSettingView } from './AddManageSetting.view';
import { hideModal, uploadDocumentList, selectRefDataNewDocumentTypes } from 'stores';
import * as utils from 'utils';
import * as constants from 'consts';

AddManageSetting.propTypes = {
  instruction: PropTypes.object,
  documents: PropTypes.object,
  riskRef: PropTypes.object.isRequired,
  files: PropTypes.arrayOf(
    PropTypes.shape({
      file: PropTypes.object,
      name: PropTypes.string,
      type: PropTypes.object,
    })
  ),
  rejectedFiles: PropTypes.array,
  multiple: PropTypes.bool,
  maxFiles: PropTypes.number,
  maxSize: PropTypes.number,
  accept: PropTypes.string,
};

AddManageSetting.defaultProps = {
  multiple: constants.PROCESSING_INSTRUCTION_FILE_UPLOAD_ALLOW_MULTIPLE,
  maxFiles: constants.PROCESSING_INSTRUCTION_FILE_UPLOAD_MAX_FILES,
  maxSize: constants.PROCESSING_INSTRUCTION_FILE_UPLOAD_MAX_FILE_SIZE,
  accept: constants.PROCESSING_INSTRUCTION_FILE_UPLOAD_ALLOWED_FILE_EXT,
};

export default function AddManageSetting({ instruction, documents, riskRef, files, rejectedFiles, multiple, maxFiles, maxSize, accept }) {
  const dispatch = useDispatch();
  const [filesAttached, setFilesAttached] = useState(files);
  const [warnings, setWarnings] = useState({});
  const documentTypes = useSelector(selectRefDataNewDocumentTypes);

  const setWarningDuplicates = (hasDuplicates) => {
    return hasDuplicates
      ? { duplicates: { message: utils.string.t('fileUpload.messages.duplicates'), type: 'alert' } }
      : { duplicates: {} };
  };

  const setWarningTooManyFiles = (filesCurrentlyAttached) => {
    return filesCurrentlyAttached && filesCurrentlyAttached.length > maxFiles
      ? { tooManyFiles: { message: utils.string.t('fileUpload.messages.tooManyFiles', { max: maxFiles }), type: 'error' } }
      : { tooManyFiles: {} };
  };

  const setWarningMaxFileSize = (rejectedFiles) => {
    return rejectedFiles && rejectedFiles.length > 0 && rejectedFiles.some((f) => f.size > maxSize)
      ? {
          maxFileSize: {
            message: utils.string.t('fileUpload.messages.maxFileSize', {
              max: utils.string.t('format.number', {
                value: { number: maxSize, format: { output: 'byte', base: 'decimal', mantissa: 0 } },
              }),
              filename: rejectedFiles
                .map((f) => f.name)
                .filter(Boolean) // filter out empty array item, in case f.name is falsy or empty ''
                .join(', '),
            }),
            type: 'alert',
          },
        }
      : { maxFileSize: {} };
  };

  const setWarningForRejectedFile = (rejectedFiles) => {
    const acceptSplittedExtension = accept?.split(',');
    const slicedExtensionArray = acceptSplittedExtension?.map((s) => s?.slice(1));
    return rejectedFiles?.length > 0 && slicedExtensionArray?.indexOf(rejectedFiles?.[0]?.path.split('.').pop()) === -1
      ? { rejectedFormat: { message: utils.string.t('fileUpload.messages.rejectedFileFormat'), type: 'alert' } }
      : { rejectedFormat: {} };
  };

  const isEndorsement = utils.processingInstructions.isEndorsement(instruction?.processTypeId);
  const isBordereau = utils.processingInstructions.isBordereau(instruction?.processTypeId);
  const isFeeAndAmendment = utils.processingInstructions.isFeeAndAmendment(instruction?.processTypeId);
  const faBorderProcessType = isBordereau || isFeeAndAmendment;
  const endorseFaBorderProcessType = isEndorsement || isBordereau || isFeeAndAmendment;

  const cols = [
    { id: 'filename', label: utils.string.t('app.filename') },
    ...(isEndorsement || isBordereau || isFeeAndAmendment
      ? [
          {
            id: 'documentType',
            label: utils.string.t('fileUpload.fields.documentType.label'),
          },
        ]
      : []),
    { id: 'actions', empty: true, menu: true },
  ];

  useEffect(() => {
    setWarnings({
      ...warnings,
      ...setWarningTooManyFiles(filesAttached),
      ...setWarningMaxFileSize(rejectedFiles),
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const documentType = isEndorsement
    ? constants.PI_ENDORSEMENT_TYPE_DOCUMENT
    : faBorderProcessType
    ? constants.PI_FABORDER_TYPE_DOCUMENT
    : constants.PI_CLOSING_FDO_TYPE_DOCUMENT;

  const documentTypeField = {
    name: 'documentType',
    type: 'autocompletemui',
    value:
      documentTypes?.find(
        (type) =>
          type.documentTypeDescription === documentType.documentTypeDescription &&
          type.sectionKey === documentType.sectionKey &&
          type.sourceID === documentType.sourceID
      ) || null,
    options: documentTypes,
    optionKey: 'documentTypeID',
    optionLabel: 'documentTypeDescription',
    muiComponentProps: {
      size: 'small',
      disabled: true,
      disableClearable: true,
    },
    callback: (event, data, values) => {
      setFilesAttached(values?.files || []);
    },
  };

  const fields = [
    {
      type: 'file',
      name: 'filesUpload',
      value: null,
      showUploadPreview: false,
      showMaxFilesError: false,
      componentProps: {
        multiple,
        maxFiles,
        maxSize,
        accept,
      },
    },
  ];

  const actions = [
    {
      name: 'cancel',
      label: utils.string.t('app.cancel'),
      handler: () => dispatch(hideModal()),
    },
    {
      name: 'submit',
      label: utils.string.t('app.save'),
      handler: (data) => {
        const files = data.files;
        const objectType = 'Policy';

        dispatch(uploadDocumentList({ instruction, documents, riskRef, files, objectType }));
      },
    },
  ];

  const handleFilesAdded = (filesCurrentlyAttached, rejectedFiles, hasDuplicates) => {
    setWarnings({
      ...warnings,
      ...setWarningDuplicates(hasDuplicates),
      ...setWarningTooManyFiles(filesCurrentlyAttached),
      ...setWarningMaxFileSize(rejectedFiles),
      ...setWarningForRejectedFile(rejectedFiles),
    });

    setFilesAttached(filesCurrentlyAttached);
  };

  const handleFilesRemoved = (filesCurrentlyAttached) => {
    setWarnings({
      ...warnings,
      ...setWarningDuplicates(false),
      ...setWarningTooManyFiles(filesCurrentlyAttached),
      ...setWarningMaxFileSize(false),
      ...setWarningForRejectedFile(false),
    });

    setFilesAttached(filesCurrentlyAttached);
  };

  const getFileKey = (file) => {
    return `${file.name}-${file.size}-${file.lastModified}`;
  };

  return (
    <AddManageSettingView
      riskRef={riskRef}
      cols={cols}
      files={files}
      fields={fields}
      actions={actions}
      warnings={warnings}
      documentTypeField={documentTypeField}
      endorseFaBorderProcessType={endorseFaBorderProcessType}
      handlers={{
        getFileKey,
        onFilesAdded: handleFilesAdded,
        onFilesRemoved: handleFilesRemoved,
      }}
    />
  );
}
