import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import sortBy from 'lodash/sortBy';

// app
import * as constants from 'consts';
import { DocumentAutoUploadView } from './DocumentAutoUpload.view';
import { getFolderList, uploadDocument } from 'stores';

DocumentAutoUpload.propTypes = {
  placement: PropTypes.object,
  link: PropTypes.string,
  divider: PropTypes.bool,
};

export function DocumentAutoUpload({ placement, link, divider }) {
  const dispatch = useDispatch();
  const [folderValue, setFolderValue] = useState();
  const [folders, setFolders] = useState([]);

  const handleSubmit = (data) => {
    dispatch(uploadDocument({ data, placement }));
  };

  useEffect(
    () => {
      let mounted = true;
      const fetchFolders = async () => {
        const folders = await dispatch(getFolderList());
        if (folders && mounted) {
          setFolders(sortBy(folders, 'label'));
        }
      };
      fetchFolders();
      return () => (mounted = false);
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleUpdateFolderValue = (value) => {
    setFolderValue(value);
  };

  useEffect(
    () => {
      if (!folders.length) return;
      const value = folders.map((folder) => folder.id).includes(constants.FOLDER_CORRESPONDENCE)
        ? constants.FOLDER_CORRESPONDENCE
        : folders[0] && folders[0].id;
      setFolderValue(value);
    },
    [folders] // eslint-disable-line react-hooks/exhaustive-deps
  );

  return folderValue ? (
    <DocumentAutoUploadView
      onUpdateFolderValue={handleUpdateFolderValue}
      folderValue={folderValue}
      link={link}
      divider={divider}
      onSubmit={handleSubmit}
      folders={folders}
    />
  ) : null;
}

export default DocumentAutoUpload;
