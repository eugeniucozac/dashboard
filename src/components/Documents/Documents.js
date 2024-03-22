import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

// app
import { DocumentsView } from './Documents.view';
import { showModal, downloadDocument, deleteDocument } from 'stores';
import * as utils from 'utils';

Documents.propTypes = {
  documents: PropTypes.array,
  folders: PropTypes.array,
  inlineComponent: PropTypes.bool,
  showDelete: PropTypes.bool,
  isReportingDoc: PropTypes.bool,
  showPagination: PropTypes.bool,
};

Documents.defaultProps = {
  documents: [],
  folders: [],
  showDelete: true,
  isReportingDoc: false,
  showPagination: false,
};

export function Documents({ documents, folders, inlineComponent, showDelete, isReportingDoc, showPagination }) {
  const dispatch = useDispatch();
  const cols = [
    { id: 'folder', label: utils.string.t('app.folder') },
    { id: 'filename', label: utils.string.t('app.filename') },
    { id: 'uploadedBy', label: utils.string.t('app.uploadedBy'), style: { display: !isReportingDoc && 'none' } },
    { id: 'uploadedDate', label: utils.string.t('app.uploadedDate'), style: { display: !isReportingDoc && 'none' } },
    { id: 'actions', empty: true },
  ];
  let documentGroupsReporting = null;

  let folderNames = folders.reduce((map, f) => {
    map[f.id] = f.label;
    return map;
  }, {});

  /**
   * Creates a grouping of documents by folder
   *
   * @example
   * // returns {"FOLDER_NAME": { "documents": [{}], "label": "FOLDER_NAME" }}
   *
   */

  if (isReportingDoc) {
    documents.sort((a, b) => {
      return new Date(b.reportGroupFolder?.createdAt).getTime() - new Date(a.reportGroupFolder?.createdAt).getTime();
    });
  }
  let documentGroups = documents.reduce((map, d) => {
    if (!map[d.folder]) map[d.folder] = { documents: [], label: folderNames[d.folder] };
    map[d.folder].documents.push(d);
    return map;
  }, {});

  if (isReportingDoc) {
    documentGroupsReporting = documents.reduce((map, d) => {
      if (!map[d?.reportGroupFolder?.folderName])
        map[d?.reportGroupFolder.folderName] = { documents: [], label: d?.reportGroupFolder?.folderName };
      map[d.reportGroupFolder?.folderName].documents.push(d);
      for (let x in map) {
        if (map[x].documents?.length > 1) {
          map[x].documents.sort((a, b) => {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          });
        }
      }
      return map;
    }, {});
  }

  const handleDownloadDocument = (data) => {
    dispatch(downloadDocument(data));
  };

  const handleDeleteClick = (data) => {
    dispatch(
      showModal({
        component: 'CONFIRM_DELETE',
        props: {
          title: 'placement.document.delete',
          subtitle: data.fileName,
          fullWidth: true,
          maxWidth: 'xs',
          disableAutoFocus: true,
          componentProps: {
            submitHandler: () => {
              dispatch(deleteDocument(data.id));
            },
          },
        },
      })
    );
  };

  return (
    <DocumentsView
      inlineComponent={inlineComponent}
      folders={folders}
      handleDeleteClick={handleDeleteClick}
      cols={cols}
      documentGroups={isReportingDoc ? documentGroupsReporting : documentGroups}
      handleDownloadDocument={handleDownloadDocument}
      showDelete={showDelete}
      isReportingDoc={isReportingDoc}
      showPagination={showPagination}
    />
  );
}

export default Documents;
