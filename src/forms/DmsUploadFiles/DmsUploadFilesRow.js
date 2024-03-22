import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

// app
import { DmsUploadFilesRowView } from './DmsUploadFilesRow.view';
import * as utils from 'utils';

DmsUploadFilesRow.propTypes = {
  index: PropTypes.number,
  file: PropTypes.any,
  duplicateFileIndexes: PropTypes.array,
  filesSubmitted: PropTypes.bool,
  currencies: PropTypes.array,
  documentTypes: PropTypes.array,
  showDocTypeRequired: PropTypes.bool,
  isUploading: PropTypes.bool,
  uploadStatus: PropTypes.bool,
  resetDocTypeRequired: PropTypes.func,
  handlers: PropTypes.shape({
    removeFiles: PropTypes.func,
    updateTableForm: PropTypes.func,
    retrySingleFile: PropTypes.func,
  }),
};

export default function DmsUploadFilesRow({
  index,
  file,
  duplicateFileIndexes,
  filesSubmitted,
  currencies,
  documentTypes,
  showDocTypeRequired,
  isUploading,
  uploadStatus,
  resetDocTypeRequired,
  handlers,
}) {
  const fileName = file?.name;

  // View Reference Data
  const docTypesActions = utils.generic.isValidArray(documentTypes, true)
    ? documentTypes.map((docType) => {
        const typeID = docType?.documentTypeID || 0;
        const typeDesc = docType?.documentTypeDescription || '';
        return {
          id: typeID,
          label: typeDesc,
          callback: () => handleSelectDocType(typeID, typeDesc),
        };
      })
    : [];

  const docClassificationTypes = utils.dmsFormatter.getDocumentClassificationList();

  const docClassificationTypesActions = docClassificationTypes.map((item, ind) => {
    const classificationId = item?.id || '';
    const classificationVal = item?.value || '';
    return {
      id: classificationId,
      label: classificationVal,
      callback: () => handleSelectDocClassification(classificationId, classificationVal),
    };
  });

  // State
  const [isDuplicateFileName, setIsDuplicateFileName] = useState(duplicateFileIndexes.includes(index));
  const initialDuplicateState = useRef(isDuplicateFileName);
  const [isInvalidFileName, setIsInvalidFileName] = useState(utils.dms.checkIfInvalidFileName(fileName));
  const [fileRowForm, setFileRowForm] = useState({
    formFileName: fileName,
    formDocType: docTypesActions.length === 1 ? { id: docTypesActions[0].id, label: docTypesActions[0].label } : { id: 0, label: '' },
    formDocClassificationType: docClassificationTypesActions[2],
    paymentFields: { paymentDate: '', paymentReference: '', lossPayee: '', amount: '', currency: '' },
    isDuplicateFileName: isDuplicateFileName,
    isInvalidFileName: isInvalidFileName,
  });

  // handlers
  const handleFileNameChange = () => (e) => {
    let newName = e?.target?.value || '';
    const extension = fileName ? fileName?.substr(fileName?.lastIndexOf('.')) : '';
    newName = newName ? newName.concat('', extension) : '';
    setFileRowForm({
      ...fileRowForm,
      formFileName: newName,
      isDuplicateFileName: checkDuplicateFileNameState(fileName, newName),
      isInvalidFileName: checkInvalidFileNameState(newName),
    });
  };

  const handleSelectDocType = (typeID, typeDesc) => {
    setFileRowForm({ ...fileRowForm, formDocType: { id: typeID, label: typeDesc } });
  };

  const handleSelectDocClassification = (id, value) => {
    setFileRowForm({ ...fileRowForm, formDocClassificationType: { id: id, label: value } });
  };

  const handlePaymentDateChange = () => (e) => {
    setFileRowForm({
      ...fileRowForm,
      paymentFields: {
        ...fileRowForm?.paymentFields,
        paymentDate: new Date(e.target.value).toISOString() || null,
      },
    });
  };

  const handlePaymentRefChange = () => (e) => {
    setFileRowForm({
      ...fileRowForm,
      paymentFields: {
        ...fileRowForm?.paymentFields,
        paymentReference: e?.target?.value || '',
      },
    });
  };

  const handleLossPayeeChange = () => (e) => {
    setFileRowForm({
      ...fileRowForm,
      paymentFields: {
        ...fileRowForm?.paymentFields,
        lossPayee: e?.target?.value || '',
      },
    });
  };

  const handlePaymentAmountChange = () => (e) => {
    setFileRowForm({
      ...fileRowForm,
      paymentFields: {
        ...fileRowForm?.paymentFields,
        amount: e?.target?.value || '',
      },
    });
  };

  const handlePaymentCurrencyChange = (name, value) => {
    setFileRowForm({
      ...fileRowForm,
      paymentFields: {
        ...fileRowForm?.paymentFields,
        currency: value,
      },
    });
  };

  const checkDuplicateFileNameState = (initVal, newVal) => {
    if (initialDuplicateState.current && initVal !== newVal) {
      setIsDuplicateFileName(false);
      return false;
    } else if (initialDuplicateState.current && initVal === newVal) {
      setIsDuplicateFileName(true);
      return true;
    }
  };

  const checkInvalidFileNameState = (newName) => {
    if (!utils.dms.checkIfInvalidFileName(newName)) {
      setIsInvalidFileName(false);
      return false;
    } else {
      setIsInvalidFileName(true);
      return true;
    }
  };

  useEffect(() => {
    if (utils.generic.isValidObject(fileRowForm)) {
      handlers.updateTableForm(index, fileRowForm);
    }
  }, [fileRowForm]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (documentTypes?.length === 1) {
      setFileRowForm({ ...fileRowForm, formDocType: { id: docTypesActions[0].id, label: docTypesActions[0].label } });
    } else if (documentTypes?.length > 1) {
      setFileRowForm({ ...fileRowForm, formDocType: { id: 0, label: '' } });
      resetDocTypeRequired();
    }
  }, [documentTypes]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <DmsUploadFilesRowView
      index={index}
      file={file}
      getFileKey={utils.dms.getFileKey}
      docTypesActions={docTypesActions}
      docClassificationTypesActions={docClassificationTypesActions}
      currencies={currencies}
      fileRowForm={fileRowForm}
      errors={{
        isDuplicateFileName,
        isInvalidFileName,
      }}
      filesSubmitted={filesSubmitted}
      showDocTypeRequired={showDocTypeRequired}
      isUploading={isUploading}
      uploadStatus={uploadStatus}
      handlers={{
        removeFiles: handlers.removeFiles,
        fileNameChange: handleFileNameChange,
        retrySingleFile: handlers.retrySingleFile,
        paymentDateInput: handlePaymentDateChange,
        paymentRefInput: handlePaymentRefChange,
        lossPayeeInput: handleLossPayeeChange,
        paymentAmountInput: handlePaymentAmountChange,
        paymentCurrencyInput: handlePaymentCurrencyChange,
      }}
    />
  );
}
