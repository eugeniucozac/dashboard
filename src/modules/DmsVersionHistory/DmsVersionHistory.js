import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

// app
import { DmsVersionHistoryView } from './DmsVersionHistory.view';
import * as utils from 'utils';
import { useDispatch, useSelector } from 'react-redux';
import { getdmsVersionHistory, getDmsVersionHistorySelector, viewDocumentsDownload } from 'stores';
import orderBy from 'lodash/orderBy';

DmsVersionHistory.propTypes = {
  docData: PropTypes.object.isRequired,
};

export default function DmsVersionHistory({ docData }) {
  const dispatch = useDispatch();

  const versionHistory = useSelector(getDmsVersionHistorySelector);

  const orderedVersions = orderBy(versionHistory, ['documentVersion'], ['desc']);
  const documentId = docData?.documentId;

  useEffect(() => {
    dispatch(getdmsVersionHistory(documentId));
  }, [dispatch, documentId]);

  const documentsDownload = () => {
    dispatch(viewDocumentsDownload(docData));
  };

  const columns = [
    {
      id: 'version',
      label: utils.string.t('dms.view.versionHistory.versionHeader'),
      nowrap: true,
    },
    {
      id: 'uploadedBy',
      label: utils.string.t('dms.view.versionHistory.uploadedBy'),
      nowrap: true,
    },
  ];

  // abort
  if (!docData?.documentId || !docData?.documentName) return null;

  return (
    <DmsVersionHistoryView columns={columns} filename={docData.documentName} versions={orderedVersions} handlers={{ documentsDownload }} />
  );
}
