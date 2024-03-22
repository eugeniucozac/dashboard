import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

// app
import * as constants from 'consts';
import * as utils from 'utils';
import { DmsUploadFilesClientView } from './DmsUploadFilesClient.view';
import { hideModal, selectDmsClientSideUploadFiles, setDmsClientSideUploadedDocumentsName } from 'stores';

DmsUploadFilesClient.propTypes = {
  referenceId: PropTypes.string,
  sourceId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  documentTypeKey: PropTypes.string,
};

export default function DmsUploadFilesClient({ referenceId, sourceId, documentTypeKey }) {
  const dispatch = useDispatch();
  const clientUploadedFiles = useSelector(selectDmsClientSideUploadFiles);
  const linkedDocList = clientUploadedFiles?.linkedDocumentList;

  const [selectedTab, setSelectedTab] = useState(constants.DMS_ATTACH_DOCS_TAB_DOCUMENT);

  const tabs = [
    {
      value: constants.DMS_ATTACH_DOCS_TAB_DOCUMENT,
      label: utils.string.t('dms.attachDocuments.tabs.attachDocuments'),
    },
    {
      value: constants.DMS_ATTACH_DOCS_TAB_SEARCH,
      label: utils.string.t('dms.attachDocuments.tabs.search'),
    },
  ];

  const selectTab = (tabName) => {
    setSelectedTab(tabName);
  };

  const handleSave = () => {
    let documentList = [...clientUploadedFiles?.documentTableList];
    let documentNameList = [];
    if (!utils.generic.isInvalidOrEmptyArray(documentList)) {
      documentNameList = documentList.map((doc) => doc?.documentName);
    }
    dispatch(setDmsClientSideUploadedDocumentsName({ documentNameList: documentNameList }));
    dispatch(hideModal('DMS_UPLOAD_FILES_CLIENT_SIDE'));
  };

  useEffect(() => {
    setSelectedTab(constants.DMS_ATTACH_DOCS_TAB_DOCUMENT);
  }, [linkedDocList]);

  return (
    <DmsUploadFilesClientView
      tabs={tabs}
      selectedTab={selectedTab}
      referenceId={referenceId}
      sourceId={sourceId}
      documentTypeKey={documentTypeKey}
      handlers={{ selectTab, handleSave }}
    />
  );
}
