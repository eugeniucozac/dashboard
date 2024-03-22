import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

// app
import { PremiumTaxSignedLinesDocumentUploadView } from './PremiumTaxSignedLinesDocumentUpload.view';
import { hideModal } from 'stores';
import * as utils from 'utils';
import * as constants from 'consts';

PremiumTaxSignedLinesDocumentUpload.propTypes = {
  riskRef: PropTypes.object.isRequired,
  uploadDocumentType: PropTypes.string.isRequired,
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
  showMaxFilesError: PropTypes.bool,
  handleFileUpload: PropTypes.func.isRequired,
};

PremiumTaxSignedLinesDocumentUpload.defaultProps = {
  multiple: constants.PROCESSING_INSTRUCTION_FILE_UPLOAD_ALLOW_MULTIPLE,
  maxFiles: constants.PROCESSING_INSTRUCTION_DETAILS_FILE_UPLOAD_MAX_FILES,
  maxSize: constants.PROCESSING_INSTRUCTION_FILE_UPLOAD_MAX_FILE_SIZE,
  accept: constants.PROCESSING_INSTRUCTION_FILE_UPLOAD_ALLOWED_FILE_EXT,
  showMaxFilesError: false,
};

export default function PremiumTaxSignedLinesDocumentUpload({
  riskRef,
  uploadDocumentType,
  files,
  rejectedFiles,
  multiple,
  maxFiles,
  maxSize,
  accept,
  showMaxFilesError,
  handleFileUpload,
}) {
  const dispatch = useDispatch();
  const [filesAttached, setFilesAttached] = useState(files);
  const [warnings, setWarnings] = useState({});

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

  useEffect(() => {
    setWarnings({
      ...warnings,
      ...setWarningTooManyFiles(filesAttached),
      ...setWarningMaxFileSize(rejectedFiles),
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fields = [
    {
      type: 'file',
      name: 'filesUpload',
      value: null,
      showUploadPreview: false,
      showMaxFilesError: showMaxFilesError,
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
        handleFileUpload(data, uploadDocumentType);
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
    <PremiumTaxSignedLinesDocumentUploadView
      riskRef={riskRef}
      files={files}
      fields={fields}
      actions={actions}
      warnings={warnings}
      handlers={{
        getFileKey,
        onFilesAdded: handleFilesAdded,
        onFilesRemoved: handleFilesRemoved,
      }}
    />
  );
}
