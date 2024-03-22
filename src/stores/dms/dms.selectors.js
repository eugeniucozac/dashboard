import get from 'lodash/get';

export const getUploadedFiles = ({ ui }) => ui?.files;

export const selectorDmsViewFiles = ({ dms }) => dms?.view?.files || [];
export const selectorDmsSearchFiles = ({ dms }) => {
  return dms?.search?.files || [];
};

export const getDmsContext = ({ ui }) => ui?.dmsContext;
export const getDmsVersionHistorySelector = ({ dms }) => dms?.view?.versionHistory?.items || [];
export const getDmsEditMetadataSelector = ({ dms }) => dms?.view?.fileMetaData || {};

export const getDmsFilesUploaded = ({ dms }) => dms?.upload?.documentsUploaded?.documentDto || [];

export const selectContextSubType = ({ dms }) => dms?.contextSubType || {};

export const selectDmsMetaData = ({ dms }) => get(dms, 'upload.metaData.data') || {};
export const selectWidgetMetaData = ({ dms }) => get(dms, 'claimDocsMetaData.data') || {};

export const selectDmsFileViewGridDataLoader = ({ dms }) => dms?.view?.isDmsFileViewGridDataLoading || false;
export const selectDmsMetaDataLoader = ({ dms }) => dms?.upload?.metaData?.isLoading || false;
export const selectDmsSearchDataLoader = ({ dms }) => dms?.search.isDmsSearchDataLoading || false;
export const selectDmsWidgetDocsLoader = ({ dms }) => dms?.view?.isDmsWidgetDocsLoading || false;

export const selectDmsWidgetClaimDocs = ({ dms }) => dms?.widgetDocDetails || {};

export const selectDmsWidgetExpanded = ({ dms }) => dms?.dmsWidgetExpanded || false;

export const selectDmsDocViewerState = ({ dms }) => dms?.docViewer?.isOpen || false;

export const selectDmsAdvSearchValues = ({ dms }) => get(dms, 'advanceSearchValues') || {};

export const selectDmsClientSideUploadFiles = ({ dms }) => dms?.clientSideUploadFiles || {};

export const selectorMultipleContextDocs = ({ dms }) => dms?.multipleContextDocs?.files || [];
