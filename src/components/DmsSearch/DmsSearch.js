import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { get } from 'lodash';

// app
import { DmsSearchView } from './DmsSearch.view';
import {
  searchDmsDocuments,
  selectRefDataNewDocumentTypesByContextSource,
  selectRefDataNewDocumentTypeLookUpByContextSource,
  resetDmsDocumentsSearch,
  viewDocumentsDownload,
  viewDocumentsMultiDownload,
  linkMultipleDmsDocuments,
  showModal,
  selectClaimsListFilterLoading,
  selectLossInformation,
  selectClaimsInformation,
  getDepartments,
  selectPiDepartmentList,
  selectDmsSearchDataLoader,
  selectDmsAdvSearchValues,
  setDmsAdvSearchData,
  resetDmsAdvSearchValues,
  selectDmsClientSideUploadFiles,
  linkClientSideDmsDocuments,
} from 'stores';
import { useFormActions, useFlexiColumns } from 'hooks';
import * as constants from 'consts';
import * as utils from 'utils';
import config from 'config';
import { MultiSelect } from 'components';

DmsSearch.propTypes = {
  context: PropTypes.oneOf([
    constants.DMS_CONTEXT_CASE,
    constants.DMS_CONTEXT_CLAIM,
    constants.DMS_CONTEXT_LOSS,
    constants.DMS_CONTEXT_POLICY,
    constants.DMS_CONTEXT_TASK,
    constants.DMS_CONTEXT_PROCESSING_INSTRUCTION,
    constants.DMS_CONTEXT_INSTRUCTION,
    constants.DMS_CONTEXT_RFI,
  ]).isRequired,
  sourceId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  referenceId: PropTypes.string.isRequired,
  isAutoSearchScreen: PropTypes.bool,
  isFnolDmsSearch: PropTypes.bool,
  updateClaimFileListAfterLinking: PropTypes.func,
  documentTypeKey: PropTypes.oneOf(Object.values(constants.DMS_DOCUMENT_TYPE_SECTION_KEYS)),
  handleFormStatus: PropTypes.func.isRequired,
  isClientSideLinkDocument: PropTypes.bool,
};

DmsSearch.defaultProps = {
  documentTypeKey: constants.DMS_DOCUMENT_TYPE_SECTION_KEYS.policy,
  isFnolDmsSearch: false,
  updateClaimFileListAfterLinking: () => {},
  handleFormStatus: () => {},
};

export default function DmsSearch({
  context,
  sourceId,
  referenceId,
  isAutoSearchScreen,
  documentTypeKey,
  isFnolDmsSearch,
  updateClaimFileListAfterLinking,
  handleFormStatus,
  isClientSideLinkDocument,
}) {
  const dispatch = useDispatch();

  const isDmsFromPi = utils.dmsFormatter.isDmsFromPi(documentTypeKey);

  const {
    dmsSectionKey,
    dmsSourceId,
    dmsDocTypeSource: documentTypeSource,
  } = utils.dmsFormatter.getDocumentTypeFilterKeys(context, sourceId, documentTypeKey);

  const searchTypeCall = constants.REQ_TYPES.search;
  const filterTypeCall = constants.REQ_TYPES.filter;

  // redux
  const documentTypesBeforeFilter = useSelector(
    dmsSectionKey === constants.DMS_DOCUMENT_TYPE_SECTION_KEYS.policy
      ? selectRefDataNewDocumentTypeLookUpByContextSource(dmsSectionKey, dmsSourceId)
      : selectRefDataNewDocumentTypesByContextSource(dmsSectionKey, dmsSourceId, documentTypeSource)
  );
  const documentsList = useSelector((state) => get(state, 'dms.search')) || {};
  const isFetchingFilters = useSelector(selectClaimsListFilterLoading);
  const departmentList = useSelector(selectPiDepartmentList);
  const lossRefID = useSelector(selectLossInformation)?.lossRef;
  const claimRefID = useSelector(selectClaimsInformation)?.claimReference;
  const dmsSearchDataLoader = useSelector(selectDmsSearchDataLoader);
  const dmsAdvSearchValues = useSelector(selectDmsAdvSearchValues);
  const clientUploadedFiles = useSelector(selectDmsClientSideUploadFiles);

  // state
  const [resetKey, setResetKey] = useState();
  const [searchExpanded, setSearchExpanded] = useState({ isOpen: false, timeStamp: new Date() });
  const [isMultiSelect, setIsMultiSelect] = useState(false);
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [searchFields, setSearchFields] = useState({});
  const [selectedDivisionOptions, setSelectDivisionOption] = useState([]);
  const [searchRowsTotalPreference, setSearchRowsTotalPreference] = useState(constants.DMS_SEARCH_TABLE_FNOL_DEFAULT_ROWS);
  const [filtersPreference, setFiltersPreference] = useState([]);
  const [isDmsSearchDataLoading, setIsDmsSearchDataLoading] = useState(dmsSearchDataLoader);
  const contextReferenceObject = { id: referenceId };
  const divOptions = departmentList.map((list) => {
    return { id: list.id, value: list.deptID, label: list.name };
  });

  const { documentTypeDescription, sectionKey, dmsSourceID } =
    isDmsFromPi && utils.dmsFormatter.getDocumentTypeInfo(documentTypeKey, sourceId);

  const documentTypesAfterFilter =
    (context === constants.DMS_CONTEXT_POLICY || context === constants.DMS_CONTEXT_PROCESSING_INSTRUCTION) && isDmsFromPi
      ? documentTypesBeforeFilter?.filter(
          (type) =>
            type.documentTypeDescription === documentTypeDescription && type.sectionKey === sectionKey && type.sourceID === dmsSourceID
        )
      : documentTypesBeforeFilter;
  const documentTypes = documentTypesAfterFilter;

  useEffect(() => {
    if (!utils.generic.isValidArray(departmentList, true)) dispatch(getDepartments());
    dispatch(setDmsAdvSearchData({ policyId: isAutoSearchScreen ? referenceId : '' }));
    return () => {
      dispatch(resetDmsAdvSearchValues());
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isAutoSearchScreen) {
      const defaultSearchCriteria =
        context === constants.DMS_CONTEXT_POLICY
          ? { policyId: referenceId, pageSize: searchRowsTotalPreference, requestType: searchTypeCall }
          : {};
      const defaultFilterCriteria =
        context === constants.DMS_CONTEXT_POLICY
          ? { policyId: referenceId, pageSize: searchRowsTotalPreference, requestType: filterTypeCall }
          : {};
      if (utils.generic.isValidArray(Object.values(defaultSearchCriteria), true)) {
        setSearchFields(defaultSearchCriteria);
        dispatch(searchDmsDocuments(context, contextReferenceObject, defaultFilterCriteria));
        dispatch(searchDmsDocuments(context, contextReferenceObject, defaultSearchCriteria));
      }
    }
    dispatch(selectRefDataNewDocumentTypesByContextSource(context, dmsSourceId));
    return () => {
      dispatch(resetDmsDocumentsSearch());
    };
  }, [referenceId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (dmsSearchDataLoader !== isDmsSearchDataLoading) setIsDmsSearchDataLoading(dmsSearchDataLoader);
  }, [dmsSearchDataLoader]); // eslint-disable-line react-hooks/exhaustive-deps

  const cols = [
    {
      id: 'multiSelect',
      visible: true,
    },
    {
      id: 'fileName',
      label: utils.string.t('dms.search.cols.fileName'),
      sort: { type: 'numeric', direction: 'desc' },
      nowrap: true,
      visible: true,
    },
    {
      id: 'hDriveFolders',
      label: utils.string.t('dms.search.cols.hDriveFolders'),
      sort: { type: 'lexical', direction: 'asc' },
      nowrap: true,
      visible: !isFnolDmsSearch,
    },
    {
      id: 'reference',
      label: utils.string.t('dms.search.cols.reference'),
      sort: { type: 'lexical', direction: 'asc' },
      nowrap: true,
      visible: !isFnolDmsSearch,
    },
    {
      id: 'documentTypeDescription',
      label: utils.string.t('dms.search.cols.documentType'),
      sort: { type: 'lexical', direction: 'asc' },
      nowrap: true,
      visible: true,
    },
    {
      id: 'version',
      label: utils.string.t('dms.search.cols.version'),
      sort: { type: 'numeric', direction: 'asc' },
      nowrap: true,
      visible: !isFnolDmsSearch,
    },
    {
      id: 'uploadedBy',
      label: utils.string.t('dms.search.cols.uploadedBy'),
      sort: { type: 'date', direction: 'asc' },
      nowrap: true,
      visible: true,
    },
    ...[
      isFnolDmsSearch
        ? {
            id: 'uploadedDate',
            label: utils.string.t('dms.search.cols.uploadedDate'),
            sort: { type: 'date', direction: 'asc' },
            nowrap: true,
            visible: true,
          }
        : {},
    ],
    { id: 'actionButtons', menu: true, nowrap: true },
  ];

  const { columns: colsArray } = useFlexiColumns(cols);

  const fields = [
    {
      name: 'policyId',
      type: 'text',
      label: utils.string.t('dms.search.fields.policyReference.label'),
      defaultValue: dmsAdvSearchValues?.policyId,
    },
    {
      name: 'claimId',
      type: 'text',
      label: utils.string.t('dms.search.fields.claimReference.label'),
      defaultValue: dmsAdvSearchValues?.claimId,
    },
    {
      name: 'lossId',
      type: 'text',
      label: utils.string.t('dms.search.fields.lossReference.label'),
      defaultValue: dmsAdvSearchValues?.lossId,
    },
    {
      name: 'insuredName',
      type: 'text',
      label: utils.string.t('dms.search.fields.insuredName.label'),
      defaultValue: dmsAdvSearchValues?.insuredName,
    },
    {
      name: 'documentType',
      type: 'autocompletemui',
      label: utils.string.t('dms.search.fields.documentType.label'),
      placeholder: utils.string.t('dms.search.fields.documentType.placeholder'),
      defaultValue: dmsAdvSearchValues?.documentType,
      options: documentTypes,
      optionKey: 'documentTypeID',
      optionLabel: 'documentTypeDescription',
    },
    {
      name: 'documentName',
      type: 'text',
      label: utils.string.t('dms.search.fields.documentName.label'),
      defaultValue: dmsAdvSearchValues?.documentName,
    },
    {
      name: 'year',
      type: 'datepicker',
      label: utils.string.t('dms.search.fields.inceptionYear.label'),
      placeholder: utils.string.t('dms.search.fields.inceptionYear.placeholder'),
      defaultValue: dmsAdvSearchValues?.year,
      muiComponentProps: {
        fullWidth: true,
        helperText: utils.string.t('dms.search.fields.inceptionYear.helperText'),
      },
      muiPickerProps: {
        views: ['year'],
        format: 'YYYY',
        clearable: true,
      },
    },
    {
      name: 'division',
      type: 'multiSelect',
      label: utils.string.t('dms.search.fields.division.label'),
      options: divOptions,
      tagType: 'quantity',
      placeholder: 'Choose Division',
      setSelectOption: setSelectDivisionOption,
      selectedOptions: selectedDivisionOptions,
      defaultValue: dmsAdvSearchValues?.division,
    },
    {
      name: `${constants.DMS_DOCUMENT_TYPE_PAYMENT}_paymentDate`,
      type: 'datepicker',
      group: constants.DMS_DOCUMENT_TYPE_PAYMENT,
      label: utils.string.t('dms.search.fields.paymentDate.label'),
      placeholder: utils.string.t('dms.search.fields.paymentDate.placeholder'),
      defaultValue: dmsAdvSearchValues[`${constants.DMS_DOCUMENT_TYPE_PAYMENT}_paymentDate`],
      muiComponentProps: {
        fullWidth: true,
        helperText: utils.string.t('dms.search.fields.paymentDate.helperText'),
      },
      muiPickerProps: {
        format: config.ui.format.date.slashNumeric,
        clearable: true,
      },
    },
    {
      name: `${constants.DMS_DOCUMENT_TYPE_PAYMENT}_paymentReference`,
      type: 'text',
      group: constants.DMS_DOCUMENT_TYPE_PAYMENT,
      label: utils.string.t('dms.search.fields.paymentReference.label'),
      defaultValue: dmsAdvSearchValues[`${constants.DMS_DOCUMENT_TYPE_PAYMENT}_paymentReference`],
    },
    {
      name: `${constants.DMS_DOCUMENT_TYPE_PAYMENT}_lossPayee`,
      type: 'text',
      group: constants.DMS_DOCUMENT_TYPE_PAYMENT,
      label: utils.string.t('dms.search.fields.lossPayee.label'),
      defaultValue: dmsAdvSearchValues[`${constants.DMS_DOCUMENT_TYPE_PAYMENT}_lossPayee`],
    },
    {
      name: `${constants.DMS_DOCUMENT_TYPE_PAYMENT}_amount`,
      type: 'number',
      group: constants.DMS_DOCUMENT_TYPE_PAYMENT,
      label: utils.string.t('dms.search.fields.amount.label'),
      defaultValue: dmsAdvSearchValues[`${constants.DMS_DOCUMENT_TYPE_PAYMENT}_amount`],
    },
  ];

  const actions = [
    {
      name: 'cancel',
      label: utils.string.t('app.cancel'),
      handler: () => {
        setResetKey(new Date().getTime());
        setSearchExpanded({ isOpen: false, timeStamp: new Date() });
      },
    },
    {
      name: 'submit',
      label: utils.string.t('dms.search.btn'),
      handler: (data) => {
        setSearchFields(data);
        setSearchExpanded({ isOpen: false, timeStamp: new Date() });
        let divIDs = selectedDivisionOptions.map((div) => div.value);
        dispatch(setDmsAdvSearchData(data));
        dispatch(
          searchDmsDocuments(context, contextReferenceObject, {
            ...data,
            divisionIds: divIDs,
            pageSize: searchRowsTotalPreference,
            requestType: filterTypeCall,
            filterRequest: filtersPreference,
          })
        );
        dispatch(
          searchDmsDocuments(context, contextReferenceObject, {
            ...data,
            divisionIds: divIDs,
            pageSize: searchRowsTotalPreference,
            requestType: searchTypeCall,
            filterRequest: filtersPreference,
          })
        );
      },
    },
  ];

  const defaultValues = utils.form.getInitialValues(fields);
  const validationSchema = utils.form.getValidationSchema(fields);

  const formProps = useForm({
    defaultValues,
    ...(validationSchema && { resolver: yupResolver(validationSchema) }),
  });

  const { cancel, submit } = useFormActions(actions, formProps.reset);

  const handleDownloadFile = (e, file) => {
    e.stopPropagation();
    dispatch(viewDocumentsDownload(file));
  };

  const handleLinkFile = (e, file) => {
    e.stopPropagation();
    if (file.isLinked) {
      return;
    }
    confirmDocumentlink([file]);
  };

  const handleFnolLinkFile = (file, sectionType) => {
    if (file.isLinked) {
      return;
    }
    confirmDocumentlink([file], sectionType);
  };

  const handleMultipleDownload = () => {
    const selectedDocIds = selectedDocs?.map((docId) => docId.documentId);
    if (selectedDocs?.length !== 1) {
      dispatch(viewDocumentsMultiDownload(selectedDocIds));
      return;
    }
    dispatch(viewDocumentsDownload(selectedDocs?.[0]));
  };

  const handleMutiplelinking = (sectionType = '') => {
    confirmDocumentlink(selectedDocs, sectionType);
  };

  const resetToDefaultValues = () => {
    setSelectedDocs([]);
    setIsMultiSelect(false);
  };

  const confirmDocumentlink = (docs, fnolSecType = '') => {
    const requestParams = docs?.map((d) => {
      return {
        documentId: d.documentId,
        referenceId: isFnolDmsSearch ? (fnolSecType === constants.DMS_CONTEXT_LOSS ? lossRefID : claimRefID) : referenceId,
        sectionType: isFnolDmsSearch ? fnolSecType : context,
      };
    });
    if (fnolSecType === constants.DMS_CONTEXT_LOSS) {
      const claimParams = docs?.map((d) => {
        return {
          documentId: d.documentId,
          referenceId: claimRefID,
          sectionType: constants.DMS_CONTEXT_CLAIM,
        };
      });
      requestParams.push(...claimParams);
    }
    const requestParamsLength = requestParams?.length;

    dispatch(
      showModal({
        component: 'CONFIRM',
        props: {
          fullWidth: true,
          title: utils.string.t('dms.search.linkDocument.title'),
          maxWidth: 'xs',
          componentProps: {
            confirmLabel: utils.string.t('dms.search.linkDocument.confirmLabel'),
            confirmMessage:
              requestParamsLength === 1 || (fnolSecType === constants.DMS_CONTEXT_LOSS && !isMultiSelect)
                ? utils.string.t('dms.search.linkDocument.confirmMessage')
                : utils.string.t('dms.search.linkDocument.confirmMessageForMulti', {
                    count: isFnolDmsSearch && fnolSecType === constants.DMS_CONTEXT_LOSS ? requestParamsLength / 2 : requestParamsLength,
                  }),
            submitHandler: () => {
              if (isClientSideLinkDocument) {
                const linkedDocList = clientUploadedFiles?.linkedDocumentList;
                const documentList = clientUploadedFiles?.documentTableList;
                const notesLinkedDocList = docs?.map((d) => {
                  return {
                    documentId: d?.documentId,
                    referenceId: referenceId,
                    sectionType: constants.DMS_CONTEXT_TASK,
                    documentName: d?.documentName,
                    srcApplication: d?.documentSource,
                    docClassification: d?.docClassification,
                    documentTypeDescription: d?.documentTypeDescription,
                    updatedDate: d?.uploadedDate,
                    createdByName: d?.uploadedBy,
                    isLink: true,
                  };
                });
                dispatch(
                  linkClientSideDmsDocuments({
                    linkedDocList: [...notesLinkedDocList, ...linkedDocList],
                    documentList: [...notesLinkedDocList, ...documentList],
                  })
                );
              } else {
                dispatch(linkMultipleDmsDocuments(requestParams)).then((response) => {
                  if (response?.status === constants.API_RESPONSE_OK) {
                    resetToDefaultValues();
                    updateClaimFileListAfterLinking();
                    handleFormStatus();
                  }
                });
              }
            },
          },
        },
      })
    );
  };

  const handleCheckboxClick = (e, doc) => {
    e.stopPropagation();
    let newlySelectedDocs = [...selectedDocs, doc];
    if (selectedDocs?.includes(doc)) {
      newlySelectedDocs = newlySelectedDocs.filter((selectedDoc) => selectedDoc !== doc);
    }
    setSelectedDocs(newlySelectedDocs);
    handleFormStatus();
  };

  const showCheckboxesClick = (event) => {
    setIsMultiSelect(event?.target?.checked);
    handleFormStatus();
  };

  const handleSort = (by, dir) => {
    dispatch(
      searchDmsDocuments(context, contextReferenceObject, {
        ...searchFields,
        by,
        dir,
        pageSize: searchRowsTotalPreference,
        requestType: filterTypeCall,
        filterRequest: filtersPreference,
      })
    );
    dispatch(
      searchDmsDocuments(context, contextReferenceObject, {
        ...searchFields,
        by,
        dir,
        pageSize: searchRowsTotalPreference,
        requestType: searchTypeCall,
        filterRequest: filtersPreference,
      })
    ).then(() => {
      setSearchExpanded({ isOpen: false, timeStamp: new Date() });
    });
  };

  const { columnProps } = useFlexiColumns(cols);

  const handleChangeRowsPerPage = (rowsPerPage) => {
    setSearchRowsTotalPreference(rowsPerPage);
    dispatch(
      searchDmsDocuments(context, contextReferenceObject, {
        ...searchFields,
        requestType: searchTypeCall,
        pageSize: rowsPerPage,
        filterRequest: filtersPreference,
      })
    ).then(() => {
      setSearchExpanded({ isOpen: false, timeStamp: new Date() });
    });
  };

  const handleChangePage = (newPage) => {
    dispatch(
      searchDmsDocuments(context, contextReferenceObject, {
        ...searchFields,
        page: newPage,
        pageSize: searchRowsTotalPreference,
        filterRequest: filtersPreference,
        requestType: searchTypeCall,
      })
    ).then(() => {
      setSearchExpanded({ isOpen: false, timeStamp: new Date() });
    });
  };

  const { setValue } = useForm({
    defaultValues,
    ...(validationSchema && { resolver: yupResolver(validationSchema) }),
  });

  const managedTableFilterFields = [
    !isFnolDmsSearch && {
      id: 'hdriveFolder',
      type: 'multiSelect',
      label: utils.string.t('claims.list.tasksGridColumns.hDriveFolders'),
      value: [],
      options: documentsList?.filters?.hdriveFolder || [],
      content: <MultiSelect id="hdriveFolder" search options={documentsList?.filters?.hdriveFolder || []} />,
    },
    {
      id: 'documentTypeDescription',
      type: 'multiSelect',
      label: utils.string.t('claims.list.tasksGridColumns.docType'),
      value: [],
      options: documentsList?.filters?.documentTypeDescription || [],
      content: <MultiSelect id="documentTypeDescription" search options={documentsList?.filters?.documentTypeDescription || []} />,
    },
    {
      id: 'createdBy',
      type: 'multiSelect',
      label: utils.string.t('claims.list.tasksGridColumns.createdBy'),
      value: [],
      options: documentsList?.filters?.createdBy || [],
      content: <MultiSelect id="createdBy" search options={documentsList?.filters?.createdBy || []} />,
    },
  ];

  const resetFilter = () => {
    setValue('hdriveFolder', null);
    setValue('documentTypeDescription', null);
    setValue('createdBy', null);
    setFiltersPreference([]);
    if (!Object.keys(searchFields).length) return;
    dispatch(searchDmsDocuments(context, contextReferenceObject, { ...searchFields, requestType: filterTypeCall }));
    dispatch(searchDmsDocuments(context, contextReferenceObject, { ...searchFields, requestType: searchTypeCall }));
  };

  const handleSearchFilter = ({ search, filters }) => {
    setFiltersPreference(filters);

    dispatch(
      searchDmsDocuments(context, contextReferenceObject, {
        ...searchFields,
        pageSize: searchRowsTotalPreference,
        requestType: filterTypeCall,
        filterRequest: filters,
      })
    );
    dispatch(
      searchDmsDocuments(context, contextReferenceObject, {
        ...searchFields,
        pageSize: searchRowsTotalPreference,
        requestType: searchTypeCall,
        filterRequest: filters,
      })
    );
  };

  // TODO
  const resetNotificationFilters = () => {};

  const viewDocLauncher = (e, doc) => {
    e.preventDefault();
    const { documentId, documentName } = doc;
    utils.dms.dmsDocumentViewLauncher(documentId, documentName);
  };

  return (
    <DmsSearchView
      cols={colsArray}
      columnPropsFunc={columnProps}
      rows={documentsList?.files?.data?.searchValue || []}
      fields={fields}
      buttons={{ cancel, submit }}
      isFnolDmsSearch={isFnolDmsSearch}
      formProps={formProps}
      searchExpanded={searchExpanded}
      handlers={{
        download: handleDownloadFile,
        link: handleLinkFile,
        fnolLink: handleFnolLinkFile,
        sort: handleSort,
        handleCheckboxClick: handleCheckboxClick,
        showCheckboxesClick: showCheckboxesClick,
        handleMultipleDownload: handleMultipleDownload,
        handleMutiplelinking: handleMutiplelinking,
        resetFilter,
        handleSearchFilter,
        resetNotificationFilters,
        viewDocLauncher,
      }}
      resetKey={resetKey}
      isMultiSelect={isMultiSelect}
      selectedDocs={selectedDocs}
      pagination={{
        page: documentsList?.files?.pagination?.page || 0,
        rowsTotal: documentsList?.files?.pagination?.totalElements || 0,
        rowsPerPage: documentsList?.files?.pagination?.size || searchRowsTotalPreference,
        handlers: {
          handleChangePage: handleChangePage,
          handleChangeRowsPerPage: handleChangeRowsPerPage,
        },
      }}
      tableFilterFields={managedTableFilterFields}
      isFetchingFilters={isFetchingFilters}
      isDmsSearchDataLoading={isDmsSearchDataLoading}
    />
  );
}
