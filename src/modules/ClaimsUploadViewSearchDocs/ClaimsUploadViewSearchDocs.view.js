import React from 'react';
import PropTypes from 'prop-types';

// app
import { Tabs, DmsTable, DmsSearch, FormLegend } from 'components';
import * as constants from 'consts';

ClaimsUploadViewSearchDocsView.propTypes = {
  isTabView: PropTypes.bool,
  tabs: PropTypes.array.isRequired,
  selectedTab: PropTypes.string.isRequired,
  isAutoSearchScreen: PropTypes.bool.isRequired,
  viewOptions: PropTypes.object.isRequired,
  fnolViewOptions: PropTypes.shape({
    isClaimsFNOL: PropTypes.bool,
    isClaimsUploadDisabled: PropTypes.bool,
    isDmsDocumentMenuDisabled: PropTypes.bool,
    claimsUploadWarningMsg: PropTypes.string,
    claimsSearchDocumentsTxt: PropTypes.string,
    uploadDocumentsTitle: PropTypes.string,
  }),
  context: PropTypes.string.isRequired,
  documentTypeKey: PropTypes.oneOf(Object.values(constants.DMS_DOCUMENT_TYPE_SECTION_KEYS)),
  referenceId: PropTypes.string.isRequired,
  sourceId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  parentLossRef: PropTypes.string,
  viewDocumentList: PropTypes.array.isRequired,
  parentContext: PropTypes.string,
  parentContextId: PropTypes.string,
  handlers: PropTypes.shape({
    selectTab: PropTypes.func.isRequired,
    onUnlinkorDeleteSuccess: PropTypes.func.isRequired,
  }).isRequired,
};

export default function ClaimsUploadViewSearchDocsView({
  isTabView,
  tabs,
  selectedTab,
  isAutoSearchScreen,
  viewOptions,
  fnolViewOptions,
  context,
  documentTypeKey,
  referenceId,
  sourceId,
  parentLossRef,
  viewDocumentList,
  handlers,
  parentContext,
  parentContextId,
}) {
  return (
    <>
      {isTabView && (
        <>
          <Tabs tabs={tabs} value={selectedTab} onChange={(tabName) => handlers.selectTab(tabName)} />

          {selectedTab === constants.DMS_VIEW_TAB_VIEW && (
            <DmsTable
              columnsData={viewDocumentList}
              canUpload={viewOptions.upload}
              canSearch={viewOptions.search}
              canUnlink={viewOptions.unlink}
              canDelete={viewOptions.delete}
              canEditMetaData={viewOptions.editMetaData}
              canLink={viewOptions.link}
              canLinkToParentContext={viewOptions.linkToParentContext}
              context={context}
              documentTypeKey={documentTypeKey}
              referenceId={referenceId}
              sourceId={sourceId}
              fnolViewOptions={fnolViewOptions}
              handlers={handlers}
              parentContext={parentContext}
              parentContextId={parentContextId}
            />
          )}
          {selectedTab === constants.DMS_VIEW_TAB_SEARCH && (
            <DmsSearch context={context} referenceId={referenceId} sourceId={sourceId} isAutoSearchScreen={isAutoSearchScreen} />
          )}
        </>
      )}
      {!isTabView && (
        <>
          <FormLegend text={fnolViewOptions?.uploadDocumentsTitle} />
          <DmsTable
            columnsData={viewDocumentList}
            canUpload={viewOptions.upload}
            canSearch={viewOptions.search}
            canUnlink={viewOptions.unlink}
            canDelete={viewOptions.delete}
            canEditMetaData={viewOptions.editMetaData}
            canMultiSelect={viewOptions.multiSelect}
            fnolViewOptions={fnolViewOptions}
            context={context}
            documentTypeKey={documentTypeKey}
            referenceId={referenceId}
            sourceId={sourceId}
            parentLossRef={parentLossRef}
            handlers={handlers}
          />
        </>
      )}
    </>
  );
}
