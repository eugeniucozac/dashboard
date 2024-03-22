import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { firstBy } from 'thenby';

// app
import { DmsTableView } from './DmsTable.view';
import * as utils from 'utils';
import {
  showModal,
  hideModal,
  unlinkDmsViewDocuments,
  viewDocumentsDownload,
  viewDocumentsDelete,
  setDmsContext,
  viewDocumentsMultiDownload,
  selectContextSubType,
  getDmsEditMetadata,
  getDmsMetaData,
  addLoader,
  selectDmsFileViewGridDataLoader,
  selectUserRole,
  getViewTableDocuments,
  selectCaseDetails,
  enqueueNotification,
  linkMultipleDmsDocuments,
} from 'stores';
import * as constants from 'consts';
import { usePagination } from 'hooks';


DmsTable.propTypes = {
  columnsData: PropTypes.array.isRequired,
  showHeader: PropTypes.bool,
  canUpload: PropTypes.bool,
  canSearch: PropTypes.bool,
  canUnlink: PropTypes.bool,
  canDelete: PropTypes.bool,
  canMultiSelect: PropTypes.bool,
  canEditMetaData: PropTypes.bool,
  canLink: PropTypes.bool,
  canLinkToParentContext: PropTypes.bool,
  fnolViewOptions: PropTypes.object,
  context: PropTypes.oneOf(['Claim', 'Loss', 'Policy', 'Task', 'Case']).isRequired,
  documentTypeKey: PropTypes.oneOf(Object.values(constants.DMS_DOCUMENT_TYPE_SECTION_KEYS)),
  referenceId: PropTypes.string.isRequired,
  sourceId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  parentLossRef: PropTypes.string,
  searchParamsAfterUpload: PropTypes.shape({
    referenceId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    sectionType: PropTypes.string.isRequired,
  }),
  parentContext: PropTypes.string,
  parentContextId: PropTypes.string,
  refData: PropTypes.object,
  handlers: PropTypes.shape({
    onUnlinkorDeleteSuccess: PropTypes.func,
    onSelectFile: PropTypes.func,
    onClosingUploadModal: PropTypes.func,
    onLink: PropTypes.func,
  }),
};

DmsTable.defaultProps = {
  showHeader: true,
  canUpload: true,
  canSearch: true,
  canUnlink: true,
  canDelete: true,
  canMultiSelect: true,
  canEditMetaData: true,
  canLink: false,
  canLinkToParentContext: false,
  parentContext: '',
  parentContextId: '',
  fnolViewOptions: {
    isClaimsFNOL: false,
    isClaimsUploadDisabled: false,
    isDmsDocumentMenuDisabled: false,
    claimsSearchDocumentsTxt: utils.string.t('dms.view.searchDocuments'),
  },
  documentTypeKey: constants.DMS_DOCUMENT_TYPE_SECTION_KEYS.policy,
};

export default function DmsTable({
  columnsData,
  showHeader,
  canUpload,
  canSearch,
  canUnlink,
  canDelete,
  canMultiSelect,
  canEditMetaData,
  canLink,
  fnolViewOptions,
  context,
  documentTypeKey,
  referenceId,
  sourceId,
  parentLossRef,
  searchParamsAfterUpload,
  handlers,
  canLinkToParentContext,
  parentContext,
  parentContextId,
}) {
  const dispatch = useDispatch();

  const [search, setSearch] = useState('');
  const [resetKey, setResetKey] = useState();
  const [originalTableData, setOriginalTableData] = useState([]);
  const [filteredTableData, setFilteredTableData] = useState([]);
  const [searchIndex, setSearchIndex] = useState([]);
  const [isMultiSelect, setIsMultiSelect] = useState(false);
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [newPage, setNewPage] = useState(constants.DMS_PAGINATION_DEFAULT_PAGE);
  const [rowsPerPage, setRowsPerPage] = useState(constants.DMS_DEFAULT_ROWS_PER_PAGE);
  const DmsFileViewGridDataLoading = useSelector(selectDmsFileViewGridDataLoader);

  const contextSubType = useSelector(selectContextSubType);
  const currentUser = useSelector(selectUserRole);
  const ppCaseDetails = useSelector(selectCaseDetails); // TODO will be later coming as props

  const xbInstanceId = sourceId ? sourceId : constants.DMS_CLAIM_SOURCE_ID;
  const [isDmsFileViewGridDataLoading, setIsDmsFileViewGridDataLoading] = useState(DmsFileViewGridDataLoading);

  useEffect(() => {
    setIsDmsFileViewGridDataLoading(DmsFileViewGridDataLoading);
  }, [DmsFileViewGridDataLoading]);

  const isWorkBasketOrAllCases = ppCaseDetails?.taskView === constants.WORKBASKET || ppCaseDetails?.taskView === constants.ALL_CASES;
  const isSeniorManager =
    utils.generic.isValidArray(currentUser, true) &&
    currentUser.some((item) => [constants.SENIOR_MANAGER.toLowerCase()].includes(item.name.toLowerCase()));

  useEffect(() => {
    const tableDataString = (data, allValues) => {
      if (!allValues) allValues = [];
      for (const key in data) {
        if (typeof data[key] === 'object') tableDataString(data[key], allValues);
        else allValues.push(`${data[key]}' '`);
      }
      return allValues;
    };

    const setInitialTableData = () => {
      setOriginalTableData(columnsData);
      setFilteredTableData(columnsData);
      const searchInd = columnsData?.map((data) => {
        const allValues = tableDataString(data);
        return { allValues: allValues.toString() };
      });
      setSearchIndex(searchInd);
    };

    setInitialTableData();
  }, [columnsData]);

  useEffect(() => {
    if (search) {
      const newFilteredTableData = searchIndex?.map((data, index) => {
        if (data?.allValues?.toLowerCase().indexOf(search.toLowerCase()) >= 0) return originalTableData[index];
        return null;
      });
      setFilteredTableData(
        newFilteredTableData?.filter((data) => {
          if (data) return true;
          return false;
        })
      );
    } else setFilteredTableData(originalTableData);
  }, [search, originalTableData, searchIndex]);

  const isDmsFromPiRiskRef = [
    constants.DMS_DOCUMENT_TYPE_SECTION_KEYS.piEndorsement,
    constants.DMS_DOCUMENT_TYPE_SECTION_KEYS.piFABorder,
    constants.DMS_DOCUMENT_TYPE_SECTION_KEYS.piClosingFdo,
  ].includes(documentTypeKey);

  useEffect(() => {
    setFilteredTableData(originalTableData?.slice(newPage * rowsPerPage, newPage * rowsPerPage + rowsPerPage));
  }, [newPage, rowsPerPage, originalTableData]);

  const isClaims = utils.dms.checkIfClaimsScreenContext(context) || false;

  const cols = [
    {
      id: 'multiSelect',
      visible: true,
    },
    ...(!isDmsFromPiRiskRef
      ? [
        {
          id: 'folderName',
          label: utils.string.t('dms.view.columns.folderName'),
          sort: { type: 'lexical', direction: 'asc' },
        },
      ]
      : []),
    { id: 'documentName', label: utils.string.t('dms.view.columns.documentName'), sort: { type: 'lexical', direction: 'asc' } },
    { id: 'documentSource', label: utils.string.t('dms.view.columns.documentSource'), sort: { type: 'lexical', direction: 'asc' } },
    ...(!isDmsFromPiRiskRef && !fnolViewOptions?.isClaimsFNOL
      ? [
        {
          id: 'hDriveFolders',
          label: utils.string.t('dms.view.columns.hDriveFolders'),
          sort: { type: 'lexical', direction: 'asc' },
        },
      ]
      : []),
    { id: 'documentTypeDescription', label: utils.string.t('dms.view.columns.documentType'), sort: { type: 'lexical', direction: 'asc' } },
    {
      id: 'docClassification',
      label: utils.string.t('dms.view.columns.documentClassification'),
      sort: { type: 'lexical', direction: 'asc' },
    },
    { id: 'updatedDate', label: utils.string.t('dms.view.columns.uploadedDate'), sort: { type: 'date', direction: 'asc' } },
    { id: 'createdByName', label: utils.string.t('dms.view.columns.uploadedBy'), sort: { type: 'lexical', direction: 'asc' } },
    {
      id: 'documentVersion',
      label: utils.string.t('dms.view.columns.documentVersion'),
      sort: { type: 'lexical', direction: 'asc' },
    },
    ...(!(fnolViewOptions?.isClaimsFNOL || isClaims)
      ? [
        {
          id: 'createdDate',
          label: utils.string.t('dms.view.columns.creationDate'),
          sort: { type: 'date', direction: 'asc' },
          visible: true,
        },
      ]
      : []),
    { id: 'actions', menu: true, visible: true },
  ];

  const resetToDefaultValues = () => {
    handlers.onUnlinkorDeleteSuccess();
    setSelectedDocs([]);
    setIsMultiSelect(false);
  };

  const handleChangePage = (newPage) => {
    setNewPage(newPage);
  };

  const handleChangeRowsPerPage = (rowsPerPage) => {
    setNewPage(constants.DMS_PAGINATION_DEFAULT_PAGE);
    setRowsPerPage(rowsPerPage);
  };

  const pagination = usePagination(
    filteredTableData || [],
    {
      page: newPage || constants.DMS_PAGINATION_DEFAULT_PAGE,
      rowsTotal: originalTableData.length || 0,
      rowsPerPage: rowsPerPage,
    },
    handleChangePage,
    handleChangeRowsPerPage
  );

  const confirmDocumentUnlink = (docs) => {
    const requestParams = docs?.map((d) => {
      return {
        documentId: d.documentId,
        referenceId: referenceId,
        sectionType: context,
      };
    });
    const requestParamsLength = requestParams?.length;

    dispatch(
      showModal({
        component: 'CONFIRM',
        props: {
          fullWidth: true,
          title: utils.string.t('dms.view.unlinkDocument.title'),
          maxWidth: 'xs',
          componentProps: {
            confirmLabel: utils.string.t('dms.view.unlinkDocument.confirmLabel'),
            confirmMessage:
              requestParamsLength === 1
                ? utils.string.t('dms.view.unlinkDocument.confirmMessage')
                : utils.string.t('dms.view.unlinkDocument.confirmMessageForMulti', {
                  count: requestParamsLength,
                }),
            submitHandler: () =>
              dispatch(unlinkDmsViewDocuments(requestParams)).then((response) => {
                if (response?.status === constants.API_RESPONSE_OK) {
                  resetToDefaultValues();
                }
              }),
          },
        },
      })
    );
  };

  const confirmDocumentDelete = (docs) => {
    // GXB sharepoint sourced docs cannot be deleted
    const hasGxbDocs = selectedDocs.some((doc) => isGxbDocument(doc));

    const documentIds = hasGxbDocs
      ? docs?.filter((doc) => !isGxbDocument(doc)).map((doc) => doc.documentId)
      : docs?.map((doc) => doc.documentId);
    const documentIdsLength = documentIds?.length;

    dispatch(
      showModal({
        component: 'CONFIRM',
        props: {
          fullWidth: true,
          title: utils.string.t('dms.view.deleteDocument.title'),
          maxWidth: 'xs',
          componentProps: {
            confirmLabel: utils.string.t('dms.view.deleteDocument.confirmLabel'),
            confirmMessage:
              documentIdsLength === 1
                ? utils.string.t('dms.view.deleteDocument.confirmMessage')
                : utils.string.t('dms.view.deleteDocument.confirmMessageForMulti', {
                  count: documentIdsLength,
                }),
            warningMessage: hasGxbDocs ? utils.string.t('dms.view.deleteDocument.gxbDocsDeleteWarning') : '',
            submitHandler: () =>
              dispatch(viewDocumentsDelete(documentIds)).then((response) => {
                if (response?.status === constants.API_RESPONSE_OK) {
                  resetToDefaultValues();
                }
              }),
          },
        },
      })
    );
  };



  const showVersionHistoryModal = (docData) => {
    dispatch(
      showModal({
        component: 'DMS_VERSION_HISTORY',
        props: {
          fullWidth: true,
          title: utils.string.t('dms.view.versionHistory.title'),
          maxWidth: 'xs',
          componentProps: {
            docData: docData,
          },
        },
      })
    );
  };

  const launchEditMetadataModel = async (doc) => {
    const refinedReferenceId = getRefIdForContext();

    dispatch(setDmsContext(context));
    await dispatch(getDmsMetaData(context, xbInstanceId, referenceId));
    await dispatch(getDmsEditMetadata(doc?.documentId, doc?.docClassification)).then((res) => {
      if (res?.status === constants.API_RESPONSE_OK) {
        dispatch(
          showModal({
            component: 'DMS_EDIT_META_DATA',
            props: {
              fullWidth: true,
              title: utils.string.t('dms.view.editMetadata.title'),
              maxWidth: 'xl',
              componentProps: {
                docData: doc,
                context,
                referenceId: refinedReferenceId,
                selectedSourceId: sourceId,
                documentTypeKey: documentTypeKey,
                searchParamsAfterUpload,
                cancelHandler: () => {
                  dispatch(hideModal('DMS_EDIT_META_DATA'));
                },
              },
            },
          })
        );
      }
    });
  };

  const linkDocToParentContext = (docs) => {
    const requestParams = docs?.map((doc) => {
      return {
        documentId: doc.documentId,
        referenceId: parentContextId,
        sectionType: parentContext,
      };
    })

    if (!utils.generic.isInvalidOrEmptyArray(requestParams)) {
      dispatch(linkMultipleDmsDocuments(requestParams)).then((response) => {
        if (response?.status === constants.API_RESPONSE_OK) {
          resetToDefaultValues();
        }
      });
    }
  };

  const popoverActions = [
    {
      id: 'download',
      label: utils.string.t('dms.view.popOverMenuItems.download'),
      callback: ({ doc }) => dispatch(viewDocumentsDownload(doc)),
    },
    ...(canUnlink
      ? [
        {
          id: 'unlink',
          label: utils.string.t('dms.view.popOverMenuItems.unlink'),
          disabled: isWorkBasketOrAllCases,
          callback: ({ doc }) => confirmDocumentUnlink([doc]),
        },
      ]
      : []),
    ...(canDelete
      ? [
        {
          id: 'delete',
          label: utils.string.t('dms.view.popOverMenuItems.delete'),
          disabled: isWorkBasketOrAllCases,
          callback: ({ doc }) => confirmDocumentDelete([doc]),
        },
      ]
      : []),
    {
      id: 'versionHistory',
      label: utils.string.t('dms.view.popOverMenuItems.versionHistory'),
      callback: ({ doc }) => showVersionHistoryModal(doc),
    },
    ...(canEditMetaData
      ? [
        {
          id: 'editMetaData',
          label: utils.string.t('dms.view.popOverMenuItems.editMetadata'),
          disabled: isWorkBasketOrAllCases,
          callback: ({ doc }) => launchEditMetadataModel(doc),
        },
      ]
      : []),
    ...(canLink
      ? [
        {
          id: 'LinkTo',
          label: utils.string.t('dms.view.popOverMenuItems.linkTo'),
          callback: ({ doc }) => handlers.onLink([doc], resetToDefaultValues),
        },
      ]
      : []),
    ...(canLinkToParentContext
      ? [
        {
          id: 'LinkToParentContext',
          label: `${utils.string.t('dms.view.popOverMenuItems.linkTo')} ${parentContext}`,
          callback: ({ doc }) => linkDocToParentContext([doc]),
        },
      ]
      : []),
  ];

  const resetSearch = () => {
    setResetKey(new Date().getTime());
    setSearch('');
  };

  const submitSearch = (query) => {
    setSearch(query);
  };

  const handleSort = (by, dir) => {
    originalTableData?.sort(firstBy(utils.sort.array('lexical', by, dir)));
  };

  const launchDmsUpload = () => (files) => {
    dispatch(addLoader('DmsUploadFiles'));
    const refinedReferenceId = getRefIdForContext();

    dispatch(
      showModal({
        component: 'DMS_UPLOAD_FILES',
        props: {
          fullWidth: true,
          title: utils.string.t('dms.upload.modalItems.uploadDocuments'),
          hideCompOnBlur: false,
          maxWidth: 'lg',
          componentProps: {
            files,
            context,
            referenceId: refinedReferenceId,
            sourceId,
            documentTypeKey,
            searchParamsAfterUpload,
            confirmLabel: utils.string.t('app.ok'),
            cancelLabel: utils.string.t('app.goBack'),
            confirmMessage: utils.string.t('processingInstructions.documentsWillNotBeSaved'),
            buttonColors: { confirm: 'secondary', cancel: 'primary' },
            onClosingUploadModal: () => handleUploadModalClose(),
          },
        },
      })
    );
  };

  const handleUploadModalClose = () => {
    // Premium Processing Case Details
    const policyRef = ppCaseDetails?.policyRef;
    const instructionId = ppCaseDetails?.instructionId;
    if (!utils.dmsFormatter.isDmsFromPiInstruction(documentTypeKey)) {
      // Refresh DmsTable Data once Upload is done
      dispatch(
        getViewTableDocuments({
          ...(searchParamsAfterUpload
            ? searchParamsAfterUpload
            : {
              referenceId,
              sectionType: context,
              documentTypeKey,
              parentLossRef,
              ...(policyRef && instructionId && { policyRef, instructionId }),
            }),
        })
      );
    }
  };

  const handleCheckboxClick = (e, doc) => {
    e.stopPropagation();
    let newlySelectedDocs = [...selectedDocs, doc];
    if (selectedDocs?.find((docs) => docs.documentId === doc.documentId)) {
      newlySelectedDocs = newlySelectedDocs.filter((selectedDoc) => selectedDoc.documentId !== doc.documentId);
    }

    if (utils.generic.isFunction(handlers?.onSelectFile)) {
      handlers.onSelectFile(newlySelectedDocs);
    }

    setSelectedDocs(newlySelectedDocs);
  };

  const checkLinkedToMultipleContexts = (docList) => {
    const linkedDocList = [];
    if (utils.generic.isValidArray(docList, true)) {
      const selectedDocList = [...docList];
      selectedDocList.forEach((doc) => {
        if (doc?.isLinkedToMultipleContexts) {
          linkedDocList.push(doc.documentName);
        }
      });
    }
    return linkedDocList;
  };

  const showCheckboxesClick = (event) => {
    setIsMultiSelect(event?.target?.checked);
  };

  const handleMultipleDownload = () => {
    const selectedDocIds = selectedDocs?.map((docId) => docId.documentId);
    if (selectedDocs?.length !== 1) {
      dispatch(viewDocumentsMultiDownload(selectedDocIds));
      return;
    }
    dispatch(viewDocumentsDownload(selectedDocs?.[0]));
  };

  const handleMutipleUnlinking = () => {
    confirmDocumentUnlink(selectedDocs);
  };

  const handleMutipleDelete = () => {
    const linkedDocList = checkLinkedToMultipleContexts(selectedDocs);
    if (utils.generic.isValidArray(linkedDocList, true)) {
      const errorText = `${utils.string.t('dms.view.deleteDocument.deleteWarning')} \n   -   ${linkedDocList.join('\n   -   ')}`;
      dispatch(enqueueNotification(errorText, 'error'));
    }
    confirmDocumentDelete(selectedDocs);
  };

  const handleMutipleLink = () => {
    handlers.onLink(selectedDocs, resetToDefaultValues);
  };

  const isGxbDocument = (doc) => {
    return doc.srcApplication === constants.DMS_SHAREPATH_SOURCES.gxb;
  };

  const getRefIdForContext = () => {
    const { type, caseIncidentNotesID, refId } = contextSubType;
    if (type === constants.DMS_TASK_CONTEXT_TYPE_RFI_RESPONSE) {
      return caseIncidentNotesID ? refId + '-' + caseIncidentNotesID : refId;
    } else if (type === constants.DMS_TASK_CONTEXT_TYPE_RFI || type === constants.DMS_TASK_CONTEXT_TYPE_ADHOC) {
      return refId;
    } else {
      return referenceId;
    }
  };

  const docClassification = utils?.dmsFormatter?.getDocumentClassificationList();

  const docClassificationList = new Map(
    docClassification?.map((item) => {
      return [item?.id, item?.value];
    })
  );

  const getDocClassification = (value) => {
    return docClassificationList?.get(Number(value));
  };

  // abort
  if (!columnsData) return null;

  return (
    <DmsTableView
      cols={cols}
      documents={filteredTableData}
      pagination={pagination}
      popoverActions={popoverActions}
      search={search}
      resetKey={resetKey}
      isMultiSelect={isMultiSelect}
      showHeader={showHeader}
      canUpload={canUpload}
      canSearch={canSearch}
      canUnlink={canUnlink}
      canDelete={canDelete}
      canMultiSelect={canMultiSelect}
      canLink={canLink}
      fnolViewOptions={fnolViewOptions}
      selectedDocs={selectedDocs}
      isDmsFromPiRiskRef={isDmsFromPiRiskRef}
      isWorkBasketOrAllCases={isWorkBasketOrAllCases}
      isDmsFileViewGridDataLoading={isDmsFileViewGridDataLoading}
      isSeniorManager={isSeniorManager}
      isClaims={isClaims}
      getDocClassification={getDocClassification}
      canLinkToParentContext={canLinkToParentContext}
      parentContext={parentContext}
      handlers={{
        resetSearch: resetSearch,
        submitSearch: submitSearch,
        handleSort: handleSort,
        uploadModal: launchDmsUpload,
        handleCheckboxClick: handleCheckboxClick,
        showCheckboxesClick: showCheckboxesClick,
        handleMultipleDownload: handleMultipleDownload,
        handleMutipleUnlinking: handleMutipleUnlinking,
        handleMutipleDelete: handleMutipleDelete,
        handleMutipleLink: handleMutipleLink,
        linkDocToParentContext
      }}
    />
  );
}
