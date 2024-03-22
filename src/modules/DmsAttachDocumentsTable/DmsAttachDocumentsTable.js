import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectDmsClientSideUploadFiles, removeDmsClientSideUploadedDocuments, showModal } from 'stores';
import PropTypes from 'prop-types';

// app
import { DmsAttachDocumentsTableView } from './DmsAttachDocumentsTable.view';
import * as utils from 'utils';
import { useFlexiColumns } from 'hooks';

DmsAttachDocumentsTable.propTypes = {
  documentList: PropTypes.array,
};

export function DmsAttachDocumentsTable({ documentList }) {
  const dispatch = useDispatch();
  const [isMultiSelect, setIsMultiSelect] = useState(false);
  const [selectedDocs, setSelectedDocs] = useState([]);

  const clientUploadedFiles = useSelector(selectDmsClientSideUploadFiles);

  const cols = [
    {
      id: 'multiSelect',
      visible: true,
    },
    {
      id: 'documentName',
      label: utils.string.t('dms.view.columns.documentName'),
      sort: { type: 'lexical', direction: 'asc' },
      visible: true,
    },
    {
      id: 'documentSource',
      label: utils.string.t('dms.view.columns.documentSource'),
      sort: { type: 'lexical', direction: 'asc' },
      visible: true,
    },

    {
      id: 'documentTypeDescription',
      label: utils.string.t('dms.view.columns.documentType'),
      sort: { type: 'lexical', direction: 'asc' },
      visible: true,
    },
    {
      id: 'docClassification',
      label: utils.string.t('dms.view.columns.documentClassification'),
      sort: { type: 'lexical', direction: 'asc' },
      visible: true,
    },
    { id: 'updatedDate', label: utils.string.t('dms.view.columns.uploadedDate'), sort: { type: 'date', direction: 'asc' }, visible: true },
    {
      id: 'createdByName',
      label: utils.string.t('dms.view.columns.uploadedBy'),
      sort: { type: 'lexical', direction: 'asc' },
      visible: true,
    },
    { id: 'actions', menu: true, visible: true },
  ];

  const popoverActions = [
    {
      id: 'delete',
      label: utils.string.t('dms.view.popOverMenuItems.delete'),
      callback: ({ index }) => confirmDocumentDelete({ isMultiDelete: false, index }),
    },
    {
      id: 'unlink',
      label: utils.string.t('dms.view.popOverMenuItems.unlink'),
      callback: ({ index }) => confirmDocumentUnlink({ isMultiLink: false, index }),
    },
  ];

  const docClassification = utils?.dmsFormatter?.getDocumentClassificationList();

  const docClassificationMap = new Map(
    docClassification?.map((item) => {
      return [item?.id, item?.value];
    })
  );

  const getDocClassification = (value) => {
    return docClassificationMap?.get(Number(value));
  };

  const showCheckboxesClick = (event) => {
    setIsMultiSelect(event?.target?.checked);
  };

  const handleCheckboxClick = (e, doc) => {
    e.stopPropagation();
    let newlySelectedDocs = [...selectedDocs, doc];
    if (selectedDocs?.find((docs) => docs.documentName === doc.documentName)) {
      newlySelectedDocs = newlySelectedDocs.filter((selectedDoc) => selectedDoc.documentName !== doc.documentName);
    }

    setSelectedDocs(newlySelectedDocs);
  };

  const removeMultipleDocument = () => {
    const uploadedFiles = { ...clientUploadedFiles };
    const documentList = [...uploadedFiles?.documentTableList];
    selectedDocs?.forEach((item) => {
      const index = documentList?.findIndex((doc) => doc?.documentName === item?.documentName);
      if (!item?.isLink) {
        removeDocument(index);
      } else if (item?.isLink) {
        unlinkDocument(index);
      }
    });
  };

  const unlinkMultipleDocument = () => {
    const uploadedFiles = { ...clientUploadedFiles };
    const documentList = [...uploadedFiles?.documentTableList];
    selectedDocs?.forEach((item) => {
      const index = documentList?.findIndex((doc) => doc?.documentName === item?.documentName);
      if (item?.isLink) {
        unlinkDocument(index);
      } else if (!item?.isLink) {
        removeDocument(index);
      }
    });
  };

  const confirmDocumentDelete = (params) => {
    dispatch(
      showModal({
        component: 'CONFIRM',
        props: {
          fullWidth: true,
          title: utils.string.t('dms.view.deleteDocument.title'),
          maxWidth: 'xs',
          componentProps: {
            confirmLabel: utils.string.t('dms.view.deleteDocument.confirmLabel'),
            confirmMessage: params?.isMultiDelete
              ? utils.string.t('dms.view.deleteDocument.confirmMessageForMulti', {
                  count: selectedDocs?.length,
                })
              : utils.string.t('dms.view.deleteDocument.confirmMessage'),
            submitHandler: () => (params?.isMultiDelete ? removeMultipleDocument() : removeDocument(params?.index)),
          },
        },
      })
    );
  };

  const confirmDocumentUnlink = (params) => {
    dispatch(
      showModal({
        component: 'CONFIRM',
        props: {
          fullWidth: true,
          title: utils.string.t('dms.view.unlinkDocument.title'),
          maxWidth: 'xs',
          componentProps: {
            confirmLabel: utils.string.t('dms.view.unlinkDocument.confirmLabel'),
            confirmMessage: params?.isMultiLink
              ? utils.string.t('dms.view.unlinkDocument.confirmMessageForMulti', {
                  count: selectedDocs?.length,
                })
              : utils.string.t('dms.view.unlinkDocument.confirmMessage'),
            submitHandler: () => (params?.isMultiLink ? unlinkMultipleDocument() : unlinkDocument(params?.index)),
          },
        },
      })
    );
  };

  const removeDocument = (index) => {
    const uploadedFiles = { ...clientUploadedFiles };
    const documentList = [...uploadedFiles?.documentTableList];
    if (!utils.generic.isInvalidOrEmptyArray(documentList) && !documentList[index]?.isLink) {
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

  const unlinkDocument = (index) => {
    const uploadedFiles = { ...clientUploadedFiles };
    const documentList = [...uploadedFiles?.documentTableList];
    if (!utils.generic.isInvalidOrEmptyArray(documentList) && documentList[index]?.isLink) {
      const linkedDocId = documentList[index]?.documentId;
      const linkedDocList = [...uploadedFiles?.linkedDocumentList];
      const searchIndex = linkedDocList?.findIndex((linkedDocItem) => linkedDocItem?.documentId === linkedDocId);
      uploadedFiles?.linkedDocumentList?.splice(searchIndex, 1);
      uploadedFiles?.documentTableList?.splice(index, 1);
      uploadedFiles?.documentNameList?.splice(index, 1);
    }

    dispatch(removeDmsClientSideUploadedDocuments({ uploadedFiles: uploadedFiles }));
  };

  const handleMutipleDelete = () => {
    confirmDocumentDelete({ isMultiDelete: true });
  };

  const handleMutipleUnlinking = () => {
    confirmDocumentUnlink({ isMultiLink: true });
  };

  const { columns: columnsArray } = useFlexiColumns(cols);

  return (
    <DmsAttachDocumentsTableView
      columnsArray={columnsArray}
      documentList={documentList}
      popoverActions={popoverActions}
      isMultiSelect={isMultiSelect}
      selectedDocs={selectedDocs}
      handlers={{
        getDocClassification: getDocClassification,
        handleCheckboxClick: handleCheckboxClick,
        showCheckboxesClick: showCheckboxesClick,
        handleMutipleDelete: handleMutipleDelete,
        handleMutipleUnlinking: handleMutipleUnlinking,
      }}
    />
  );
}
