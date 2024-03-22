import React, { useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import isEmpty from 'lodash/isEmpty';

// app
import { PolicyDocumentsView } from './PolicyDocuments.view';
import { selectFileUploadData, selectFileUploadLoading, selectFileUploadLoaded, getFileUploadGuiData } from 'stores';
import * as utils from 'utils';

PolicyDocuments.propTypes = {
  files: PropTypes.array.isRequired,
  rejectedFiles: PropTypes.array,
};

export default function PolicyDocuments({ files, rejectedFiles }) {
  const dispatch = useDispatch();
  const [selectedTab, setSelectedTab] = useState('upload');
  const fileUploadData = useSelector(selectFileUploadData);
  const fileUploadDataLoading = useSelector(selectFileUploadLoading);
  const fileUploadDataLoaded = useSelector(selectFileUploadLoaded);

  const tabs = [
    { value: 'upload', label: utils.string.t('fileUpload.tabs.upload') },
    { value: 'search', label: utils.string.t('fileUpload.tabs.search') },
  ];

  const fetchGuiData = useCallback(() => {
    if (isEmpty(fileUploadData) && !fileUploadDataLoading) {
      dispatch(getFileUploadGuiData(['DocumentType', 'XBInstance', 'Department']));
    }
  }, [dispatch]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchGuiData();
  }, [fetchGuiData]);

  return (
    <PolicyDocumentsView
      files={files}
      rejectedFiles={rejectedFiles}
      data={fileUploadData}
      dataLoading={fileUploadDataLoading}
      dataLoaded={fileUploadDataLoaded}
      tabs={tabs}
      selectedTab={selectedTab}
      handleSelectTab={setSelectedTab}
    />
  );
}
