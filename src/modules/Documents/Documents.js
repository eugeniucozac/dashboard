import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import get from 'lodash/get';

// app
import { DocumentsView } from './Documents.view';
import { getDocuments, deselectDocument, showModal } from 'stores';

export function Documents() {
  const dispatch = useDispatch();
  const placement = useSelector((state) => get(state, 'placement.selected', {}));
  const documents = useSelector((state) => state.document.documents);
  const folders = useSelector((state) => state.document.folders);

  useEffect(
    () => {
      if (!placement) return;
      dispatch(getDocuments({ placement }));
      return () => dispatch(deselectDocument());
    },
    [placement] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const uploadNew = () => {
    dispatch(
      showModal({
        component: 'DOCUMENT_UPLOAD',
        props: {
          title: 'documents.upload.modal.title',
          fullWidth: true,
          maxWidth: 'sm',
          disableAutoFocus: true,
          componentProps: {
            placement,
          },
        },
      })
    );
  };

  return <DocumentsView folders={folders} documents={documents} uploadNew={uploadNew} />;
}

export default Documents;
