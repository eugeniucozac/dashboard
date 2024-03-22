import React, { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// app
import styles from './ClaimsManagement.styles';
import { ClaimsManagementView } from './ClaimsManagement.view';
import {
  getClaimsProcessing,
  hideModal,
  resetClaimProcessingFilters,
  resetClaimsProcessingFilters,
  resetClaimsProcessingItems,
  resetClaimsProcessingSearch,
  selectUser,
  selectClaimsProcessing,
  selectClaimsProcessingItems,
  selectClaimProcessingFilterValues,
  selectClaimsProcessingFilterLoading,
  selectClaimsProcessingSelected,
  showModal,
  updateClaimProcessingFilters,
  selectClaimViewNavigation,
  processingClaimViewNavigation,
} from 'stores';
import { MultiSelect, FormDate } from 'components';
import { useFlexiColumns } from 'hooks';
import * as constants from 'consts';
import * as utils from 'utils';

// mui
import { makeStyles } from '@material-ui/core';

export default function ClaimsManagement() {
  const classes = makeStyles(styles, { name: 'ClaimsManagement' })();
  const dispatch = useDispatch();

  const user = useSelector(selectUser);
  const userHasMyClaimsPermission = utils.app.access.feature('claimsFNOL.myClaims', ['read', 'create', 'update'], user);
  const userHasMyTeamClaimsPermission = utils.app.access.feature('claimsFNOL.myTeamClaims', ['read', 'create', 'update'], user);
  const userHasAllClaimsPermission = utils.app.access.feature('claimsFNOL.allClaims', ['read', 'create', 'update'], user);

  const [searchTerm, setSearchTerm] = useState('');
  const selectedView = useSelector(selectClaimViewNavigation);
  const [claimsType, setClaimsType] = useState(selectedView || constants.CLAIM_TEAM_TYPE.myClaims);
  const [searchBy, setSearchBy] = useState(constants.CLAIMS_SEARCH_OPTION_CLAIM_REF);
  const [searchByText, setSearchByText] = useState(utils.string.t('claims.searchByClaims.options.ClaimRef'));
  const isDirtyRef = useRef(false);
  const [isClosedClaimsEnabled, setIsClosedClaimsEnabled] = useState(false);
  const [myClaimsFirstTimeLoad, setMyClaimsFirstTimeLoad] = useState(true);
  const [myTeamClaimsFirstTimeLoad, setMyTeamClaimsFirstTimeLoad] = useState(true);
  const [allClaimsFirstTimeLoad, setAllClaimsFirstTimeLoad] = useState(true);
  const firstTimeSortColumns = 'createdDate, priority';

  const claimsProcessing = useSelector(selectClaimsProcessing);
  const claimsProcessingItems = useSelector(selectClaimsProcessingItems);
  const claimProcessingFilterDropDown = useSelector(selectClaimProcessingFilterValues);
  const claimsProcessingSelected = useSelector(selectClaimsProcessingSelected);
  const isFetchingFilters = useSelector(selectClaimsProcessingFilterLoading);

  const searchTypeCall = constants.CLAIM_PROCESSING_REQ_TYPES.search;
  const filterTypeCall = constants.CLAIM_PROCESSING_REQ_TYPES.filter;

  const [resetKey, setResetKey] = useState();

  const selectOptions = [
    { label: utils.string.t('claims.searchByClaims.options.ClaimRef'), value: constants.CLAIMS_SEARCH_OPTION_CLAIM_REF },
    { label: utils.string.t('claims.searchByClaims.options.PolicyRef'), value: constants.CLAIMS_SEARCH_OPTION_POLICY_REF },
    { label: utils.string.t('claims.searchByClaims.options.Insured'), value: constants.CLAIMS_SEARCH_OPTION_INSURED },
    { label: utils.string.t('claims.searchByClaims.options.AssignedTo'), value: constants.CLAIMS_SEARCH_OPTION_ASSIGNED_TO },
    { label: utils.string.t('claims.searchByClaims.options.LossRef'), value: constants.CLAIMS_SEARCH_OPTION_LOSS_REF },
  ];

  const viewFields = [
    {
      name: 'views',
      type: 'radio',
      value: claimsType,
      defaultValue: claimsType,
      muiFormGroupProps: {
        row: true,
        nestedClasses: { root: classes.adjusterRadioGroup },
        classes: {
          root: classes.radioLabel,
        },
        onChange: (value) => {
          setClaimsType(value);
          dispatch(processingClaimViewNavigation(value));
          setValue('includeClosedClaims', false);
          setIsClosedClaimsEnabled(false);
        },
      },
      options: [
        ...(userHasMyClaimsPermission
          ? [
              {
                value: constants.CLAIM_TEAM_TYPE.myClaims,
                label: utils.string.t('claims.processing.myClaims'),
              },
            ]
          : []),
        ...(userHasMyTeamClaimsPermission
          ? [
              {
                value: constants.CLAIM_TEAM_TYPE.myTeamClaims,
                label: utils.string.t('claims.processing.myTeamClaims'),
              },
            ]
          : []),
        ...(userHasAllClaimsPermission
          ? [
              {
                value: constants.CLAIM_TEAM_TYPE.allClaims,
                label: utils.string.t('claims.processing.allClaims'),
              },
            ]
          : []),
      ],
    },
    {
      name: 'searchBy',
      type: 'autocompletemui',
      options: selectOptions,
      value: selectOptions?.find((item) => item?.value === constants.CLAIMS_SEARCH_OPTION_CLAIM_REF) || null,
      validation: Yup.object().nullable().required(utils.string.t('validation.required')),
      muiComponentProps: {
        inputProps: {
          title: searchByText || '',
        },
      },
    },
    { name: 'createdDate', type: 'datepicker', value: null },
    {
      name: 'includeClosedClaims',
      type: 'switch',
      value: false,
      muiComponentProps: {
        onChange: (name, checked) => {
          setIsClosedClaimsEnabled(checked);
        },
      },
    },
  ];

  const defaultValues = utils.form.getInitialValues(viewFields);
  const validationSchema = utils.form.getValidationSchema(viewFields);

  const { control, setValue } = useForm({
    defaultValues,
    ...(validationSchema && { resolver: yupResolver(validationSchema) }),
  });

  const tableFilterFields = [
    {
      id: 'createdDate',
      type: 'datepicker',
      label: utils.string.t('claims.columns.claimsList.dateAndTimeCreated'),
      value: '',
      content: (
        <FormDate
          control={control}
          {...utils.form.getFieldProps(defaultValues, 'createdDate')}
          id="creationdatepicker"
          name="createdDate"
          type="datepicker"
          value={''}
          label={''}
          plainText
          plainTextIcon
          placeholder={utils.string.t('app.selectDate')}
          muiComponentProps={{
            fullWidth: false,
            margin: 'dense',
          }}
          muiPickerProps={{
            clearable: false,
            variant: 'inline',
            format: 'DD-MM-YYYY',
          }}
        />
      ),
    },
    {
      id: 'team',
      type: 'multiSelect',
      label: utils.string.t('claims.columns.claimsList.team'),
      placeholder: utils.string.t('claims.filterPlaceHolderText'),
      value: [],
      options: claimProcessingFilterDropDown?.team,
      content: <MultiSelect id="team" search options={claimProcessingFilterDropDown?.team} />,
    },
    {
      id: 'assignedTo',
      type: 'multiSelect',
      label: utils.string.t('claims.columns.claimsList.assignedTo'),
      value: [],
      options: claimProcessingFilterDropDown?.assignedTo,
      nestedClasses: { root: classes.fieldWidth },
      content: <MultiSelect id="assignedTo" search options={claimProcessingFilterDropDown?.assignedTo} />,
    },
    {
      id: 'priority',
      type: 'multiSelect',
      label: utils.string.t('claims.claimInformation.priority'),
      placeholder: utils.string.t('claims.filterPlaceHolderText'),
      value: [],
      options: claimProcessingFilterDropDown?.priority,
      content: <MultiSelect id="priority" search options={claimProcessingFilterDropDown?.priority} />,
    },
    {
      id: 'processState',
      type: 'multiSelect',
      label: utils.string.t('claims.columns.claimsManagement.status'),
      placeholder: utils.string.t('claims.filterPlaceHolderText'),
      value: [],
      options: claimProcessingFilterDropDown?.processState,
      content: <MultiSelect id="processState" search options={claimProcessingFilterDropDown?.processState} />,
    },
    {
      id: 'complexity',
      type: 'multiSelect',
      label: utils.string.t('claims.columns.claimsManagement.complexity'),
      placeholder: utils.string.t('claims.filterPlaceHolderText'),
      value: [],
      options: claimProcessingFilterDropDown?.complexity,
      content: <MultiSelect id="complexity" search options={claimProcessingFilterDropDown?.complexity} />,
    },
  ];

  useEffect(() => {
    if (claimsType) {
      setValue('createdDate', null);

      if (claimsType === constants.CLAIM_TEAM_TYPE.allClaims) {
        setIsClosedClaimsEnabled(false);
      }

      // defect - 14469 - Default sorting is not applying on Date &Time created and Priority columns
      // First Time Table Grid load for MyClaims, MyTeamClaims, All Claims passing createdDate and Priority columns from UI.
      if (
        (myClaimsFirstTimeLoad && claimsType === constants.CLAIM_TEAM_TYPE.myClaims) ||
        (myTeamClaimsFirstTimeLoad && claimsType === constants.CLAIM_TEAM_TYPE.myTeamClaims) ||
        (allClaimsFirstTimeLoad && claimsType === constants.CLAIM_TEAM_TYPE.allClaims)
      ) {
        if (claimsType === constants.CLAIM_TEAM_TYPE.myClaims) setMyClaimsFirstTimeLoad(!myClaimsFirstTimeLoad);
        if (claimsType === constants.CLAIM_TEAM_TYPE.myTeamClaims) setMyTeamClaimsFirstTimeLoad(!myTeamClaimsFirstTimeLoad);
        if (claimsType === constants.CLAIM_TEAM_TYPE.allClaims) setAllClaimsFirstTimeLoad(!allClaimsFirstTimeLoad);

        dispatch(
          getClaimsProcessing({
            requestType: searchTypeCall,
            claimsType,
            filterTerm: [],
            searchBy,
            pullClosedRecords: isClosedClaimsEnabled,
            firstTimeSort: firstTimeSortColumns,
          })
        );
        dispatch(
          getClaimsProcessing({
            requestType: filterTypeCall,
            claimsType,
            filterTerm: [],
            searchBy,
            pullClosedRecords: isClosedClaimsEnabled,
            firstTimeSort: firstTimeSortColumns,
          })
        );
      } else {
        // From second time onwards, table grid load from else part for single column sorting.
        dispatch(
          getClaimsProcessing({
            requestType: searchTypeCall,
            claimsType,
            filterTerm: [],
            searchBy,
            pullClosedRecords: isClosedClaimsEnabled,
          })
        );
        dispatch(
          getClaimsProcessing({
            requestType: filterTypeCall,
            claimsType,
            filterTerm: [],
            searchBy,
            pullClosedRecords: isClosedClaimsEnabled,
          })
        );
      }
    }

    // cleanup
    return () => {
      setSearchTerm('');
      dispatch(resetClaimsProcessingSearch());
      dispatch(resetClaimsProcessingFilters());
      dispatch(resetClaimsProcessingItems());
    };
  }, [claimsType, isClosedClaimsEnabled]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = (queryObject) => {
    setResetKey(new Date().getTime());
    dispatch(resetClaimProcessingFilters());
    setValue('createdDate', null);
    if (queryObject.search) {
      setSearchTerm(queryObject.search);
      dispatch(
        getClaimsProcessing({
          requestType: searchTypeCall,
          claimsType,
          term: queryObject.search,
          direction: 'desc',
          searchBy,
          pullClosedRecords: isClosedClaimsEnabled,
        })
      );
      dispatch(
        getClaimsProcessing({
          requestType: filterTypeCall,
          claimsType,
          term: queryObject.search,
          direction: 'desc',
          searchBy,
          filterTerm: queryObject.filters,
          pullClosedRecords: isClosedClaimsEnabled,
        })
      );
    }
  };

  const handleChangePage = (newPage) => {
    dispatch(
      getClaimsProcessing({
        requestType: searchTypeCall,
        claimsType,
        page: newPage,
        term: searchTerm,
        searchBy,
        pullClosedRecords: isClosedClaimsEnabled,
      })
    );
  };

  const handleResetFilter = () => {
    setValue('createdDate', null);
    dispatch(resetClaimProcessingFilters());
    dispatch(
      getClaimsProcessing({
        requestType: searchTypeCall,
        claimsType,
        term: searchTerm,
        filterTerm: '',
        direction: 'desc',
        searchBy,
        pullClosedRecords: isClosedClaimsEnabled,
      })
    );
    dispatch(
      getClaimsProcessing({
        requestType: filterTypeCall,
        claimsType,
        term: searchTerm,
        filterTerm: '',
        direction: 'desc',
        searchBy,
        pullClosedRecords: isClosedClaimsEnabled,
      })
    );
  };

  const handleSearchFilter = (data) => {
    dispatch(
      updateClaimProcessingFilters({ claimsType, search: data?.search, filters: data.filters, pullClosedRecords: isClosedClaimsEnabled })
    );
    return dispatch(
      getClaimsProcessing({
        requestType: searchTypeCall,
        claimsType,
        term: data.search,
        filterTerm: data.filters,
        searchBy,
        pullClosedRecords: isClosedClaimsEnabled,
      })
    );
  };

  const handleChangeRowsPerPage = (rowsPerPage) => {
    dispatch(
      getClaimsProcessing({
        requestType: searchTypeCall,
        claimsType,
        size: rowsPerPage,
        term: searchTerm,
        searchBy,
        pullClosedRecords: isClosedClaimsEnabled,
      })
    );
  };

  const handleSort = (by, dir) => {
    dispatch(
      getClaimsProcessing({
        requestType: searchTypeCall,
        claimsType,
        sortBy: by,
        direction: dir.toUpperCase(),
        term: searchTerm,
        searchBy,
        pullClosedRecords: isClosedClaimsEnabled,
      })
    );
  };

  const handleResetSearch = () => {
    setResetKey(new Date().getTime());
    dispatch(resetClaimsProcessingSearch());
    dispatch(resetClaimProcessingFilters());
    setValue('createdDate', null);
    dispatch(
      getClaimsProcessing({ requestType: searchTypeCall, claimsType, filterTerm: [], searchBy, pullClosedRecords: isClosedClaimsEnabled })
    );
    dispatch(
      getClaimsProcessing({
        requestType: filterTypeCall,
        claimsType,
        filterTerm: [],
        searchBy,
        pullClosedRecords: isClosedClaimsEnabled,
      })
    );
  };

  const onSelectSearchBy = (searchByValue, searchByLabel) => {
    setSearchByText(searchByLabel);
    setSearchBy(searchByValue);
    dispatch(
      getClaimsProcessing({
        requestType: searchTypeCall,
        claimsType,
        searchBy: searchByValue,
        term: searchTerm,
        pullClosedRecords: isClosedClaimsEnabled,
      })
    );
    dispatch(
      getClaimsProcessing({
        requestType: filterTypeCall,
        claimsType,
        searchBy: searchByValue,
        term: searchTerm,
        pullClosedRecords: isClosedClaimsEnabled,
      })
    );
  };

  const handleCloseModal = () => {
    dispatch(hideModal('BULK_ASSIGN_CLAIMS'));
  };

  const setIsReassignFormDirty = (isDirty) => {
    isDirtyRef.current = isDirty;
  };

  const bulkAssignConfirm = () => {
    if (isDirtyRef.current) {
      dispatch(
        showModal({
          component: 'CONFIRM',
          props: {
            title: utils.string.t('navigation.form.subtitle'),
            hint: utils.string.t('navigation.form.title'),
            fullWidth: true,
            maxWidth: 'xs',
            componentProps: {
              cancelLabel: utils.string.t('app.no'),
              confirmLabel: utils.string.t('app.yes'),
              submitHandler: () => {
                handleCloseModal();
              },
            },
          },
        })
      );
    } else {
      handleCloseModal();
    }
  };

  const bulkAssignClaims = () => {
    if (utils.generic.isValidArray(claimsProcessingSelected, true)) {
      dispatch(
        showModal({
          component: 'BULK_ASSIGN_CLAIMS',
          props: {
            title: 'claims.processing.bulkAssign.title',
            fullWidth: true,
            maxWidth: 'sm',
            hideCompOnBlur: false,
            componentProps: {
              claimsProcessingSelected,
              claimsType,
              setIsDirty: setIsReassignFormDirty,
              clickXHandler: () => {
                bulkAssignConfirm();
              },
              clickOutSideHandler: () => {
                bulkAssignConfirm();
              },
              cancelHandler: () => {
                bulkAssignConfirm();
              },
            },
          },
        })
      );
    }
  };

  const columns = [
    {
      id: 'claimRef',
      label: utils.string.t('claims.columns.claimsManagement.ref'),
      sort: { type: 'lexical', direction: 'asc' },
      narrow: true,
      nowrap: true,
      visible: true,
      mandatory: true,
    },
    {
      id: 'lossRef',
      label: utils.string.t('claims.columns.claimsManagement.lossRef'),
      sort: { type: 'lexical', direction: 'asc' },
      narrow: true,
      nowrap: true,
      visible: true,
      mandatory: true,
    },
    {
      id: 'catCodesID',
      label: utils.string.t('claims.columns.claimsManagement.catCode'),
      sort: { type: 'lexical', direction: 'asc' },
      ellipsis: true,
      visible: true,
    },

    {
      id: 'claimReceivedDateTime',
      label: utils.string.t('claims.columns.claimsManagement.claimReceivedDateTime'),
      sort: { type: 'lexical', direction: 'asc' },
      narrow: true,
      nowrap: true,
    },
    {
      id: 'createdDate',
      label: utils.string.t('claims.columns.claimsManagement.createdDate'),
      sort: { type: 'date', direction: 'asc' },
      nowrap: true,
      visible: true,
    },
    {
      id: 'processState',
      label: utils.string.t('claims.columns.claimsManagement.status'),
      sort: { type: 'lexical', direction: 'asc' },
      nowrap: true,
      visible: true,
    },
    {
      id: 'closedDate',
      label: utils.string.t('claims.columns.claimsManagement.closedDate'),
      sort: { type: 'date', direction: 'asc' },
      nowrap: true,
    },
    {
      id: 'complexity',
      label: utils.string.t('claims.columns.claimsManagement.complexity'),
      sort: { type: 'lexical', direction: 'asc' },
      visible: true,
    },
    {
      id: 'team',
      label: utils.string.t('claims.columns.claimsManagement.team'),
      sort: { type: 'lexical', direction: 'asc' },
      visible: true,
      mandatory: true,
    },
    {
      id: 'assignedTo',
      label: utils.string.t('claims.columns.claimsManagement.assignedTo'),
      sort: { type: 'lexical', direction: 'asc' },
      visible: true,
      mandatory: true,
      nowrap: true,
    },
    {
      id: 'priority',
      label: utils.string.t('claims.columns.claimsManagement.priority'),
      sort: { type: 'lexical', direction: 'asc' },
      nowrap: true,
      visible: true,
    },
    {
      id: 'ucr',
      label: utils.string.t('claims.columns.claimsManagement.ucr'),
      sort: { type: 'lexical', direction: 'asc' },
      nowrap: true,
      visible: true,
    },
    {
      id: 'policyRef',
      label: utils.string.t('claims.columns.claimsManagement.policyRef'),
      sort: { type: 'lexical', direction: 'asc' },
      nowrap: true,
      visible: true,
    },
    {
      id: 'policyType',
      label: utils.string.t('claims.columns.claimsManagement.policyType'),
      sort: { type: 'lexical', direction: 'asc' },
      nowrap: true,
    },
    {
      id: 'claimantName',
      label: utils.string.t('claims.columns.claimsManagement.claimant'),
      sort: { type: 'lexical', direction: 'asc' },
      visible: true,
      ellipsis: true,
    },
    {
      id: 'assured',
      label: utils.string.t('claims.columns.claimsManagement.insured'),
      sort: { type: 'lexical', direction: 'asc' },
      ellipsis: true,
      visible: true,
    },
    {
      id: 'reinsured',
      label: utils.string.t('claims.columns.claimsManagement.reinsured'),
      sort: { type: 'lexical', direction: 'asc' },
      nowrap: true,
    },
    {
      id: 'client',
      label: utils.string.t('claims.columns.claimsManagement.client'),
      sort: { type: 'lexical', direction: 'asc' },
    },
    {
      id: 'interest',
      label: utils.string.t('claims.columns.claimsManagement.interest'),
      sort: { type: 'lexical', direction: 'asc' },
      nowrap: true,
    },
    {
      id: 'createdBy',
      label: utils.string.t('claims.columns.claimsManagement.createdBy'),
      sort: { type: 'numeric', direction: 'asc' },
      nowrap: true,
    },
    {
      id: 'company',
      label: utils.string.t('claims.columns.claimsManagement.company'),
      sort: { type: 'lexical', direction: 'asc' },
    },
    {
      id: 'division',
      label: utils.string.t('claims.columns.claimsManagement.division'),
      sort: { type: 'lexical', direction: 'asc' },
      nowrap: true,
    },
    {
      id: 'coverholder',
      label: utils.string.t('claims.columns.claimsManagement.coverholder'),
      sort: { type: 'lexical', direction: 'asc' },
      nowrap: true,
    },

    {
      id: 'lossFromDate',
      label: utils.string.t('claims.columns.claimsManagement.lossDateFrom'),
      sort: { type: 'date', direction: 'asc' },
      nowrap: true,
    },
    {
      id: 'lossToDate',
      label: utils.string.t('claims.columns.claimsManagement.lossDateTo'),
      sort: { type: 'date', direction: 'asc' },
      nowrap: true,
    },
    {
      id: 'lossDateQualifier',
      label: utils.string.t('claims.columns.claimsManagement.lossDateQualifier'),
      sort: { type: 'lexical', direction: 'asc' },
      nowrap: true,
    },
    {
      id: 'lossDetails',
      label: utils.string.t('claims.columns.claimsManagement.lossDetails'),
      sort: { type: 'lexical', direction: 'asc' },
      nowrap: true,
      ellipsis: true,
    },
    {
      id: 'pasClaimRef',
      label: utils.string.t('claims.columns.claimsManagement.pasClaimRef'),
      sort: { type: 'numeric', direction: 'asc' },
      nowrap: true,
    },

    {
      id: 'pasStatus',
      label: utils.string.t('claims.columns.claimsManagement.pasStatus'),
      sort: { type: 'lexical', direction: 'asc' },
      nowrap: true,
    },

    { id: 'actions', menu: true, visible: true, mandatory: true },
  ];

  const { columns: columnsArray, columnProps, toggleColumn } = useFlexiColumns(columns);

  return (
    <ClaimsManagementView
      claims={claimsProcessingItems}
      claimsProcessing={claimsProcessing}
      sort={{
        ...claimsProcessing.sort,
      }}
      columnsArray={columnsArray}
      columnProps={columnProps}
      viewFields={viewFields}
      claimsType={claimsType}
      tableFilterFields={tableFilterFields}
      isFetchingFilters={isFetchingFilters}
      isBulkEnabled={
        [constants.CLAIM_TEAM_TYPE.myClaims, constants.CLAIM_TEAM_TYPE.myTeamClaims].includes(claimsType) &&
        claimsProcessingSelected?.length >= 2 &&
        claimsProcessingSelected?.length <= 10
      }
      control={control}
      searchTerm={searchTerm}
      resetKey={resetKey}
      handlers={{
        search: handleSearch,
        searchFilter: handleSearchFilter,
        resetFilter: handleResetFilter,
        sort: handleSort,
        changePage: handleChangePage,
        changeRowsPerPage: handleChangeRowsPerPage,
        toggleColumn,
        resetSearch: handleResetSearch,
        bulkAssignClaims,
        setClaimsType,
        onSelectSearchBy,
      }}
    />
  );
}
