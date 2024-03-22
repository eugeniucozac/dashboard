import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { Helmet } from 'react-helmet';

// app
import { DmsDocViewerView } from './DmsDocViewer.view';
import { viewDocumentsDownload, setDmsDocViewerState, viewDmsFileCheckDownload, enqueueNotification } from 'stores';
import * as utils from 'utils';

export default function DmsDocViewer() {
  const dispatch = useDispatch();
  const docViewParams = useParams();

  const brand = useSelector((state) => state.ui.brand);

  const dmsDocViewerData = { documentId: docViewParams?.id, documentName: docViewParams?.name };

  const [fileProps, setFileProps] = useState({ url: '', ext: '' });

  useEffect(() => {
    if (dmsDocViewerData?.documentId) {
      dispatch(setDmsDocViewerState(true));
      fetchDmsDocViewContent(dmsDocViewerData);
    }

    // cleanup
    return () => {
      dispatch(setDmsDocViewerState(false));
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const analyzeFormat = (documentName) => {
    const currentFileExt = utils.file.getFileExtensionFromFilename(documentName);
    return {
      isUnSupported: utils.dms.checkDmsDocumentViewForbidden(currentFileExt),
      isMsOfficeType: utils.dms.checkIsMsOfficeType(currentFileExt),
    };
  };

  const fetchDmsDocViewContent = (dmsDocViewerData) => {
    const { documentId, documentName } = dmsDocViewerData;
    const { isUnSupported } = analyzeFormat(documentName);
    getDocToRender(documentId, documentName, isUnSupported);
  };

  const getDocToRender = async (documentId, documentName, isUnSupported) => {
    const downloadable = await dispatch(viewDmsFileCheckDownload({ documentId, documentName }));
    if (downloadable) {
      if (!isUnSupported) {
        dispatch(viewDocumentsDownload({ documentId, documentName }, true)).then(({ url, ext, mimeType }) => {
          setFileProps({ url, ext, mimeType, isUnSupported, isFetchable: true });
        });
      } else {
        dispatch(viewDocumentsDownload({ documentId, documentName })).then(() => {
          setFileProps({ isUnSupported, isFetchable: true });
        });
      }
    } else {
      dispatch(enqueueNotification(utils.string.t('dms.fileDownload.fileNotFound'), 'error'));
      setFileProps({ isUnSupported: true, isFetchable: false });
    }
  };

  return (
    <>
      <Helmet>
        <title>{`${utils.string.t('dms.docViewer.title')} - ${utils.app.getAppName(brand)}`}</title>
      </Helmet>
      <DmsDocViewerView fileProps={fileProps} />
    </>
  );
}
