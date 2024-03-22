import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

// app
import { DocumentTableView } from './DocumentTable.view';
import { getDocuments, deselectDocument } from 'stores';

DocumentTable.propTypes = {
  documentType: PropTypes.string.isRequired,
  documentTypeId: PropTypes.number.isRequired,
};

export function DocumentTable({ documentTypeId, documentType }) {
  const documents = useSelector((state) => state.document.documents);
  const folders = useSelector((state) => state.document.folders);
  const dispatch = useDispatch();

  useEffect(
    () => {
      if (!documentTypeId) return;
      dispatch(getDocuments({ documentTypeId, documentType }));
      return () => dispatch(deselectDocument());
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );
  return <DocumentTableView documents={documents} folders={folders} />;
}

export default DocumentTable;
