import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

// app
import { DmsAttachDocumentsView } from './DmsAttachDocuments.view';
import { showModal, addLoader, selectContextSubType, selectDmsClientSideUploadFiles } from 'stores';
import * as utils from 'utils';
import * as constants from 'consts';

DmsAttachDocuments.propTypes = {
  referenceId: PropTypes.string,
  sourceId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  documentTypeKey: PropTypes.string,
};

export default function DmsAttachDocuments({ referenceId, sourceId, documentTypeKey }) {
  const dispatch = useDispatch();
  const [search, setSearch] = useState('');
  const [resetKey, setResetKey] = useState();
  const [searchIndex, setSearchIndex] = useState([]);
  const [filteredTableData, setFilteredTableData] = useState([]);

  const contextSubType = useSelector(selectContextSubType);
  const clientUploadedFiles = useSelector(selectDmsClientSideUploadFiles);
  const documentList = clientUploadedFiles?.documentTableList;

  const launchDmsUpload = () => (files) => {
    dispatch(addLoader('DmsUploadFiles'));
    const refinedReferenceId = getRefIdForContext();

    dispatch(
      showModal({
        component: 'DMS_UPLOAD_FILES',
        props: {
          fullWidth: true,
          title: utils.string.t('dms.upload.modalItems.uploadDocuments'),
          hideCompOnBlur: false,
          maxWidth: 'lg',
          componentProps: {
            files,
            context: constants.DMS_CONTEXT_TASK,
            referenceId: refinedReferenceId,
            sourceId,
            documentTypeKey,
            confirmLabel: utils.string.t('app.ok'),
            cancelLabel: utils.string.t('app.goBack'),
            confirmMessage: utils.string.t('processingInstructions.documentsWillNotBeSaved'),
            buttonColors: { confirm: 'secondary', cancel: 'primary' },
            isClientSideUpload: true,
          },
        },
      })
    );
  };

  const getRefIdForContext = () => {
    const { type, caseIncidentNotesID, refId } = contextSubType;
    if (type === constants.DMS_TASK_CONTEXT_TYPE_RFI_RESPONSE) {
      return caseIncidentNotesID ? `${refId}-${caseIncidentNotesID}` : refId;
    } else if (type === constants.DMS_TASK_CONTEXT_TYPE_RFI || type === constants.DMS_TASK_CONTEXT_TYPE_ADHOC) {
      return refId;
    } else {
      return referenceId;
    }
  };

  const resetSearch = () => {
    setResetKey(new Date().getTime());
    setSearch('');
  };

  const submitSearch = (query) => {
    setSearch(query);
  };

  useEffect(() => {
    const getTableValues = (document) => {
      return Object.values(document);
    };

    const searchInd = documentList?.map((document) => {
      const allValues = getTableValues(document);
      return { allValues: allValues.toString() };
    });
    setSearchIndex(searchInd);
  }, [documentList]);

  useEffect(() => {
    if (search) {
      applySearch(searchIndex);
    } else {
      setFilteredTableData(documentList);
    }
  }, [search, documentList]); // eslint-disable-line react-hooks/exhaustive-deps

  const applySearch = (searchInd) => {
    const newFilteredData = searchInd?.map((data, index) => {
      if (data?.allValues?.toLowerCase().indexOf(search?.toLowerCase()) >= 0) {
        return documentList[index];
      }
      return null;
    });
    const filteredList = newFilteredData?.filter((data) => {
      return data ? true : false;
    });
    setFilteredTableData(filteredList);
  };

  return (
    <DmsAttachDocumentsView
      search={search}
      resetKey={resetKey}
      documentList={filteredTableData}
      handlers={{
        uploadModal: launchDmsUpload,
        resetSearch: resetSearch,
        submitSearch: submitSearch,
      }}
    />
  );
}
