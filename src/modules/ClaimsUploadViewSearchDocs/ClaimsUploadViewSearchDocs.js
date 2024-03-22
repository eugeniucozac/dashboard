import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import merge from 'lodash/merge';

// app
import ClaimsUploadViewSearchDocsView from './ClaimsUploadViewSearchDocs.view';
import * as constants from 'consts';
import * as utils from 'utils';
import { getViewTableDocuments, selectorDmsViewFiles, selectContextSubType, showModal, getMultipleContextDocuments } from 'stores';

ClaimsUploadViewSearchDocs.propTypes = {
  viewOptions: PropTypes.shape({
    disabled: PropTypes.bool,
    canUpload: PropTypes.bool,
    canSearch: PropTypes.bool,
    canUnlink: PropTypes.bool,
    canDelete: PropTypes.bool,
    canEditMetaData: PropTypes.bool,
    canMultiSelect: PropTypes.bool,
    link: PropTypes.bool,
    linkToParentContext: PropTypes.bool,
  }).isRequired,
  searchOptions: PropTypes.shape({
    disabled: PropTypes.bool,
  }).isRequired,
  defaultTab: PropTypes.string,
  isTabView: PropTypes.bool,
  fnolViewOptions: PropTypes.shape({
    isClaimsFNOL: PropTypes.bool,
    isClaimsUploadDisabled: PropTypes.bool,
    isDmsDocumentMenuDisabled: PropTypes.bool,
    claimsUploadWarningMsg: PropTypes.string,
    claimsSearchDocumentsTxt: PropTypes.string,
    uploadDocumentsTitle: PropTypes.string,
  }),
  refData: PropTypes.object.isRequired,
  refIdName: PropTypes.string.isRequired,
  dmsContext: PropTypes.string.isRequired,
  documentTypeKey: PropTypes.oneOf(Object.values(constants.DMS_DOCUMENT_TYPE_SECTION_KEYS)),
  sourceId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  parentLossRef: PropTypes.string,
  docList: PropTypes.array,
  dmsDocListParams: PropTypes.array,
  parentContext: PropTypes.string,
  parentContextId: PropTypes.string,
  handlers: PropTypes.shape({
    onClosingUploadModal: PropTypes.func,
  }),
};

ClaimsUploadViewSearchDocs.defaultProps = {
  viewOptions: {},
  searchOptions: {},
  isTabView: true,
  defaultTab: constants.DMS_VIEW_TAB_VIEW,
  fnolViewOptions: {
    isClaimsFNOL: false,
    isClaimsUploadDisabled: false,
    isDmsDocumentMenuDisabled: false,
    claimsSearchDocumentsTxt: utils.string.t('dms.view.searchDocuments'),
  },
  docList: [],
  dmsDocListParams: [],
  handlers: {
    onClosingUploadModal: () => {},
  },
};

export default function ClaimsUploadViewSearchDocs({
  viewOptions,
  searchOptions,
  isTabView,
  defaultTab,
  fnolViewOptions,
  refData,
  refIdName,
  dmsContext,
  documentTypeKey,
  sourceId,
  parentLossRef,
  docList,
  dmsDocListParams,
  handlers,
  parentContext,
  parentContextId,
  parentRefs,
}) {
  const dispatch = useDispatch();

  const viewOptionsMerged = merge(
    {
      disabled: false,
      upload: true,
      search: true,
      unlink: true,
      delete: true,
      editMetaData: true,
      multiSelect: true,
    },
    viewOptions
  );

  const searchOptionsMerged = merge(
    {
      disabled: false,
    },
    searchOptions
  );

  const [selectedTab, setSelectedTab] = useState(defaultTab);

  const viewDocumentList = useSelector(selectorDmsViewFiles);
  const contextSubType = useSelector(selectContextSubType);

  // pp details
  const policyRef = refData?.policyRef;
  const instructionId = refData?.instructionId;

  const referenceId = refData?.[refIdName];
  const sectionType = dmsContext;
  const isAutoSearchScreen = defaultTab === constants.DMS_VIEW_TAB_SEARCH;
  const hasPreFetchDocs = utils.generic.isValidArray(docList, true);
  const hasPreFetchDocsParams = utils.generic.isValidArray(dmsDocListParams, true);

  useEffect(() => {
    // Cleanup
    return () => {
      utils.dms.resetDmsFiles(dispatch);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (checkisSubContext()) {
      getViewTableDocsForSubContext();
    } else if (referenceId && sectionType && !hasPreFetchDocs && !hasPreFetchDocsParams) {
      dispatch(
        getViewTableDocuments({
          referenceId,
          sectionType,
          documentTypeKey,
          parentLossRef,
          ...(policyRef && instructionId && { policyRef, instructionId }),
        })
      );
    }
  }, [referenceId, sectionType, contextSubType?.caseIncidentNotesID]); // eslint-disable-line react-hooks/exhaustive-deps

  const onUnlinkorDeleteSuccess = () => {
    if (!hasPreFetchDocs) {
      dispatch(
        getViewTableDocuments({
          referenceId,
          sectionType,
          documentTypeKey,
          parentLossRef,
          ...(policyRef && instructionId && { policyRef, instructionId }),
        })
      );
    } else if (hasPreFetchDocsParams) {
      dispatch(getMultipleContextDocuments(dmsDocListParams));
    }
  };

  const tabs = [
    {
      value: constants.DMS_VIEW_TAB_VIEW,
      label: utils.string.t('dms.wrapper.tabs.viewDocuments'),
      disabled: viewOptionsMerged.disabled,
    },
    {
      value: constants.DMS_VIEW_TAB_SEARCH,
      label: utils.string.t('dms.wrapper.tabs.search'),
      disabled: searchOptionsMerged.disabled,
    },
  ];

  const selectTab = (tabName) => {
    setSelectedTab(tabName);

    if (tabName === constants.DMS_VIEW_TAB_VIEW) {
      if (referenceId && sectionType && !hasPreFetchDocs) {
        dispatch(
          getViewTableDocuments({
            referenceId,
            sectionType,
            documentTypeKey,
            ...(policyRef && instructionId && { policyRef, instructionId }),
          })
        );
      } else if (hasPreFetchDocs && hasPreFetchDocsParams) {
        dispatch(getMultipleContextDocuments(dmsDocListParams));
      }
    }
  };

  const checkisSubContext = () => {
    const { type } = contextSubType;
    return type && constants.DMS_TASK_CONTEXT_ALL_TYPES.includes(type);
  };

  const getViewTableDocsForSubContext = () => {
    const { caseIncidentNotesID, refId } = contextSubType;
    if (caseIncidentNotesID && !hasPreFetchDocsParams) {
      const refIdForSubContext = refId + '-' + caseIncidentNotesID;
      dispatch(
        getViewTableDocuments({
          referenceId: refIdForSubContext,
          sectionType,
          documentTypeKey,
          ...(policyRef && instructionId && { policyRef, instructionId }),
        })
      );
    } else if (!hasPreFetchDocs && !hasPreFetchDocsParams) {
      dispatch(
        getViewTableDocuments({
          referenceId: refId,
          sectionType,
          documentTypeKey,
          ...(policyRef && instructionId && { policyRef, instructionId }),
        })
      );
    }
  };
  const onLink = (docData = [], resetToDefaultValues = () => {}) => {
    dispatch(
      showModal({
        component: 'DMS_LINK_TO_LOSS_AND_CLAIM',
        props: {
          fullWidth: true,
          title: utils.string.t('dms.view.linkToLossAndClaim.title'),
          maxWidth: 'xs',
          componentProps: {
            docData,
            resetToDefaultValues,
            canLinkToTask: viewOptions?.linkToTask,
            parentRefs
          },
        },
      })
    );
  };
  return (
    <ClaimsUploadViewSearchDocsView
      isTabView={isTabView}
      tabs={tabs}
      selectedTab={selectedTab}
      isAutoSearchScreen={isAutoSearchScreen}
      viewOptions={viewOptionsMerged}
      fnolViewOptions={fnolViewOptions}
      context={dmsContext}
      documentTypeKey={documentTypeKey}
      referenceId={referenceId}
      sourceId={sourceId}
      parentLossRef={parentLossRef}
      viewDocumentList={hasPreFetchDocs ? docList : viewDocumentList}
      parentContext={parentContext}
      parentContextId={parentContextId}
      handlers={{ selectTab, onUnlinkorDeleteSuccess, onClosingUploadModal: handlers.onClosingUploadModal, onLink }}
    />
  );
}
