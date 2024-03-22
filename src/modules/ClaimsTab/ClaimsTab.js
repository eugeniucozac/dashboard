import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// app
import styles from './ClaimsTab.styles';
import {
  selectUser,
  selectClaimsTabData,
  getClaimsTabData,
  getClaimsTabDetails,
  resetClaimsTabSearch,
  resetClaimsTabFilters,
} from 'stores';
import * as constants from 'consts';
import * as utils from 'utils';
import { useFlexiColumns } from 'hooks';
import { MultiSelect } from 'components';
import ClaimsTabView from './ClaimsTab.view';

// mui
import { makeStyles } from '@material-ui/core';

export default function ClaimsTab() {
  const classes = makeStyles(styles, { name: 'ClaimsTab' })();
  const dispatch = useDispatch();

  const user = useSelector(selectUser);
  const userHasMyClaimsPermission = utils.app.access.feature('claimsFNOL.myClaims', ['read', 'create', 'update'], user);
  const userHasMyTeamClaimsPermission = utils.app.access.feature('claimsFNOL.myTeamClaims', ['read', 'create', 'update'], user);

  const [searchTerm, setSearchTerm] = useState('');
  const [searchBy, setSearchBy] = useState(constants.CLAIMS_TAB_SEARCH_OPTION_CLAIM_REF);

  const [myClaimsFirstTimeLoad, setMyClaimsFirstTimeLoad] = useState(true);
  const [myTeamClaimsFirstTimeLoad, setMyTeamClaimsFirstTimeLoad] = useState(true);
  const firstTimeSortColumns = 'processRef';

  const searchTypeCall = constants.CLAIMS_TAB_REQ_TYPES.search;
  const filterTypeCall = constants.CLAIMS_TAB_REQ_TYPES.filter;
  const [resetKey, setResetKey] = useState();

  const claimsTabData = useSelector(selectClaimsTabData);
  const claimsTabTableRowDetails = claimsTabData?.tableDetails?.items;
  const claimsTabFilterDropDown = claimsTabData?.tableDetails?.filters;
  const isFetchingFilters = claimsTabData?.tableDetails?.isloadingFilters;

  const [claimsType, setClaimsType] = useState(claimsTabData?.view || constants.CLAIM_TEAM_TYPE.myClaims);

  const selectOptions = [
    { label: utils.string.t('claims.searchByClaims.options.Insured'), value: constants.CLAIMS_TAB_SEARCH_OPTION_INSURED },
    { label: utils.string.t('claims.searchByClaims.options.ClaimRef'), value: constants.CLAIMS_TAB_SEARCH_OPTION_CLAIM_REF },
    { label: utils.string.t('claims.searchByClaims.options.LossRef'), value: constants.CLAIMS_TAB_SEARCH_OPTION_LOSS_REF },
    { label: utils.string.t('claims.searchByClaims.options.PolicyRef'), value: constants.CLAIMS_TAB_SEARCH_OPTION_POLICY_REF },
    { label: utils.string.t('claims.searchByClaims.options.Division'), value: constants.CLAIMS_TAB_SEARCH_OPTION_DIVISION },
  ];

  const selectedFilters = claimsTabData?.tableDetails?.selectedFilters;

  const viewFields = [
    {
      name: 'views',
      type: 'radio',
      value: claimsType,
      defaultValue: claimsType,
      muiFormGroupProps: {
        row: true,
        nestedClasses: {
          root: classes.radioGroup,
        },
        onChange: (value) => {
          setClaimsType(value);
          setValue('includeClosedClaims', false);
        },
      },
      options: [
        ...(userHasMyClaimsPermission
          ? [
              {
                value: constants.CLAIM_TEAM_TYPE.myClaims,
                label: utils.string.t('claims.claimsTab.myClaims'),
              },
            ]
          : []),
        ...(userHasMyTeamClaimsPermission
          ? [
              {
                value: constants.CLAIM_TEAM_TYPE.myTeamClaims,
                label: utils.string.t('claims.claimsTab.myTeamClaims'),
              },
            ]
          : []),
      ],
    },
    {
      name: 'searchBy',
      type: 'select',
      options: selectOptions,
      value:
        claimsTabData?.searchBy === ''
          ? selectOptions?.find((item) => item?.value === constants.CLAIMS_TAB_SEARCH_OPTION_CLAIM_REF)?.value || null
          : selectOptions?.find((item) => item?.value === claimsTabData?.searchBy)?.value,
      validation: Yup.string().required(utils.string.t('validation.required')),
    },
    { name: 'claimLossFromDate', type: 'datepicker', value: null },
    {
      name: 'multiSelect',
      type: 'switch',
      value: false,
    },
  ];

  const defaultValues = utils.form.getInitialValues(viewFields);
  const validationSchema = utils.form.getValidationSchema(viewFields);

  const { control, setValue, watch } = useForm({
    defaultValues,
    ...(validationSchema && { resolver: yupResolver(validationSchema) }),
  });
  const searchByWatcher = watch('searchBy');

  const tableFilterFields = [
    {
      id: 'insured',
      type: 'multiSelect',
      label: utils.string.t('claims.claimsTab.filtercolumns.insured'),
      placeholder: utils.string.t('claims.filterPlaceHolderText'),
      value: utils.generic.isValidArray(selectedFilters?.insured, true) ? selectedFilters?.insured : [],
      options: claimsTabFilterDropDown?.insured,
      content: <MultiSelect id="insured" search options={claimsTabFilterDropDown?.insured} />,
    },

    {
      id: 'division',
      type: 'multiSelect',
      label: utils.string.t('claims.claimsTab.filtercolumns.division'),
      placeholder: utils.string.t('claims.filterPlaceHolderText'),
      value: utils.generic.isValidArray(selectedFilters?.division, true) ? selectedFilters?.division : [],
      options: claimsTabFilterDropDown?.division,
      content: <MultiSelect id="division" search options={claimsTabFilterDropDown?.division} />,
    },
    {
      id: 'status',
      type: 'multiSelect',
      label: utils.string.t('claims.claimsTab.filtercolumns.workflowStatus'),
      placeholder: utils.string.t('claims.filterPlaceHolderText'),
      value: utils.generic.isValidArray(selectedFilters?.workflowStatus, true) ? selectedFilters?.workflowStatus : [],
      options: claimsTabFilterDropDown?.workflowStatus,
      content: <MultiSelect id="status" search options={claimsTabFilterDropDown?.workflowStatus} />,
    },
    {
      id: 'claimStage',
      type: 'multiSelect',
      label: utils.string.t('claims.claimsTab.filtercolumns.claimStage'),
      placeholder: utils.string.t('claims.filterPlaceHolderText'),
      value: utils.generic.isValidArray(selectedFilters?.claimStage, true) ? selectedFilters?.claimStage : [],
      options: claimsTabFilterDropDown?.claimStage,
      content: <MultiSelect id="claimStage" search options={claimsTabFilterDropDown?.claimStage} />,
    },
    ...(claimsType === constants.CLAIM_TEAM_TYPE.myTeamClaims
      ? [
          {
            id: 'assignedTo',
            type: 'multiSelect',
            label: utils.string.t('claims.claimsTab.filtercolumns.assignedTo'),
            placeholder: utils.string.t('claims.filterPlaceHolderText'),
            value: utils.generic.isValidArray(selectedFilters?.assignedTo, true) ? selectedFilters?.assignedTo : [],
            options: claimsTabFilterDropDown?.assignedTo,
            content: <MultiSelect id="assignedTo" search options={claimsTabFilterDropDown?.assignedTo} />,
          },
        ]
      : []),
    {
      id: 'team',
      type: 'multiSelect',
      label: utils.string.t('claims.claimsTab.filtercolumns.team'),
      placeholder: utils.string.t('claims.filterPlaceHolderText'),
      value: utils.generic.isValidArray(selectedFilters?.team, true) ? selectedFilters?.team : [],
      options: claimsTabFilterDropDown?.team,
      content: <MultiSelect id="team" search options={claimsTabFilterDropDown?.team} />,
    },
    {
      id: 'priority',
      type: 'multiSelect',
      label: utils.string.t('claims.claimsTab.filtercolumns.priority'),
      placeholder: utils.string.t('claims.filterPlaceHolderText'),
      value: utils.generic.isValidArray(selectedFilters?.priority, true) ? selectedFilters?.priority : [],
      options: claimsTabFilterDropDown?.priority,
      content: <MultiSelect id="priority" search options={claimsTabFilterDropDown?.priority} />,
    },
  ];

  useEffect(() => {
    if (!claimsTabData?.isClaimsTabLoaded) {
      getClaimsData();
      const claimsData = { ...claimsTabData };
      claimsData.isClaimsTabLoaded = true;
      claimsData.view = claimsType;
      dispatch(getClaimsTabData(claimsData));
    } else if (claimsTabData?.isClaimsTabLoaded && claimsTabData?.view !== claimsType) {
      getClaimsData();
      const claimsData = { ...claimsTabData };
      claimsData.view = claimsType;
      dispatch(getClaimsTabData(claimsData));
    }
    return () => {
      setSearchTerm('');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [claimsType]);

  useEffect(() => {
    setSearchBy(searchByWatcher);
  }, [searchByWatcher]); // eslint-disable-line react-hooks/exhaustive-deps

  const getClaimsData = () => {
    if (claimsType) {
      setValue('processRef', null);

      // defect - 14469 - Default sorting is not applying on Date &Time created and Priority columns
      // First Time Table Grid load for MyClaims, MyTeamClaims, All Claims passing createdDate and Priority columns from UI.
      if (
        (myClaimsFirstTimeLoad && claimsType === constants.CLAIM_TEAM_TYPE.myClaims) ||
        (myTeamClaimsFirstTimeLoad && claimsType === constants.CLAIM_TEAM_TYPE.myTeamClaims)
      ) {
        if (claimsType === constants.CLAIM_TEAM_TYPE.myClaims) setMyClaimsFirstTimeLoad(!myClaimsFirstTimeLoad);
        if (claimsType === constants.CLAIM_TEAM_TYPE.myTeamClaims) setMyTeamClaimsFirstTimeLoad(!myTeamClaimsFirstTimeLoad);

        dispatch(
          getClaimsTabDetails({
            requestType: searchTypeCall,
            claimsType,
            searchBy,
            firstTimeSort: firstTimeSortColumns,
          })
        );
        dispatch(
          getClaimsTabDetails({
            requestType: filterTypeCall,
            claimsType,
            searchBy,
            firstTimeSort: firstTimeSortColumns,
          })
        );
      } else {
        // From second time onwards, table grid load from else part for single column sorting.
        dispatch(
          getClaimsTabDetails({
            requestType: searchTypeCall,
            claimsType,
            searchBy,
          })
        );
        dispatch(
          getClaimsTabDetails({
            requestType: filterTypeCall,
            claimsType,
            searchBy,
          })
        );
      }
    }
  };

  const handleSearch = (queryObject) => {
    setResetKey(new Date().getTime());
    dispatch(resetClaimsTabFilters());
    setValue('processRef', null);
    setSearchTerm(queryObject.search);
    const claimsData = { ...claimsTabData };
    claimsData.searchText = queryObject?.search;
    claimsData.tableDetails.selectedFilters = queryObject?.filters;
    dispatch(getClaimsTabData(claimsData));
    if (queryObject?.search) {
      dispatch(
        getClaimsTabDetails({
          requestType: searchTypeCall,
          claimsType,
          term: queryObject.search,
          direction: 'desc',
          searchBy,
        })
      );
      dispatch(
        getClaimsTabDetails({
          requestType: filterTypeCall,
          claimsType,
          term: queryObject.search,
          direction: 'desc',
          searchBy,
          filterTerm: queryObject.filters,
        })
      );
    }
  };

  const handleResetFilter = () => {
    const claimsData = { ...claimsTabData };
    claimsData.tableDetails.selectedFilters = [];
    dispatch(getClaimsTabData(claimsData));
    setValue('processRef', null);
    dispatch(resetClaimsTabFilters());
    dispatch(
      getClaimsTabDetails({
        requestType: searchTypeCall,
        claimsType,
        term: searchTerm,
        filterTerm: '',
        direction: 'desc',
        searchBy,
      })
    );
    dispatch(
      getClaimsTabDetails({
        requestType: filterTypeCall,
        claimsType,
        term: searchTerm,
        filterTerm: '',
        direction: 'desc',
        searchBy,
      })
    );
  };

  const handleSearchFilter = (data) => {
    const claimsData = { ...claimsTabData };
    claimsData.tableDetails.selectedFilters = data?.filters;
    dispatch(getClaimsTabData(claimsData));
    dispatch(
      getClaimsTabDetails({
        requestType: searchTypeCall,
        claimsType,
        term: data.search,
        filterTerm: data.filters,
        searchBy,
      })
    );
    dispatch(
      getClaimsTabDetails({
        requestType: filterTypeCall,
        claimsType,
        term: data.search,
        filterTerm: data.filters,
        searchBy,
      })
    );
  };

  const handleSort = (by, dir) => {
    dispatch(
      getClaimsTabDetails({
        requestType: searchTypeCall,
        claimsType,
        sortBy: by,
        direction: dir.toUpperCase(),
        term: searchTerm,
        searchBy,
      })
    );
  };

  const handleChangePage = (newPage) => {
    dispatch(
      getClaimsTabDetails({
        requestType: searchTypeCall,
        claimsType,
        page: newPage,
        term: searchTerm,
        searchBy,
      })
    );
  };

  const handleChangeRowsPerPage = (rowsPerPage) => {
    dispatch(
      getClaimsTabDetails({
        requestType: searchTypeCall,
        claimsType,
        size: rowsPerPage,
        term: searchTerm,
        searchBy,
      })
    );
  };

  const handleResetSearch = () => {
    setResetKey(new Date().getTime());
    dispatch(resetClaimsTabSearch());
    dispatch(resetClaimsTabFilters());
    setValue('processRef', null);
    dispatch(getClaimsTabDetails({ requestType: searchTypeCall, claimsType, filterTerm: [], searchBy }));
    dispatch(
      getClaimsTabDetails({
        requestType: filterTypeCall,
        claimsType,
        filterTerm: [],
        searchBy,
      })
    );
  };

  const onSelectSearchBy = (searchByValue) => {
    setSearchBy(searchByValue);
    const claimsData = { ...claimsTabData };
    claimsData.searchBy = searchByValue;
    dispatch(getClaimsTabData(claimsData));
  };

  const columns = [
    {
      id: 'claimRef',
      label: utils.string.t('claims.claimsTab.tablecolumns.claimRef'),
      narrow: true,
      nowrap: true,
      visible: true,
      mandatory: true,
    },
    {
      id: 'lossRef',
      label: utils.string.t('claims.claimsTab.tablecolumns.lossRef'),
      narrow: true,
      nowrap: true,
      visible: true,
      mandatory: true,
    },
    {
      id: 'assured',
      label: utils.string.t('claims.claimsTab.tablecolumns.insured'),
      ellipsis: true,
      visible: true,
    },
    {
      id: 'policyRef',
      label: utils.string.t('claims.claimsTab.tablecolumns.policyRef'),
      nowrap: true,
      visible: true,
    },
    {
      id: 'division',
      label: utils.string.t('claims.claimsTab.tablecolumns.division'),
      nowrap: true,
      visible: true,
    },
    {
      id: 'claimStatus',
      label: utils.string.t('claims.claimsTab.tablecolumns.workflowStatus'),
      nowrap: true,
      visible: true,
    },
    {
      id: 'claimStage',
      label: utils.string.t('claims.claimsTab.tablecolumns.claimStage'),
      nowrap: true,
      visible: true,
    },
    {
      id: 'assignedTo',
      label: utils.string.t('claims.claimsTab.tablecolumns.assignedTo'),
      visible: true,
      mandatory: true,
      nowrap: true,
    },
    {
      id: 'team',
      label: utils.string.t('claims.claimsTab.tablecolumns.team'),
      visible: true,
      mandatory: true,
    },
    {
      id: 'priority',
      label: utils.string.t('claims.claimsTab.tablecolumns.priority'),
      nowrap: true,
      visible: true,
    },
    {
      id: 'catCodesID',
      label: utils.string.t('claims.claimsTab.tablecolumns.catCode'),
      ellipsis: true,
    },
    {
      id: 'claimReceivedDateTime',
      label: utils.string.t('claims.claimsTab.tablecolumns.claimReceivedDateTime'),
      narrow: true,
      nowrap: true,
    },
    {
      id: 'createdDate',
      label: utils.string.t('claims.claimsTab.tablecolumns.createdDate'),
      nowrap: true,
      visible: false,
    },
    {
      id: 'closedDate',
      label: utils.string.t('claims.claimsTab.tablecolumns.closedDate'),
      nowrap: true,
    },
    {
      id: 'complexity',
      label: utils.string.t('claims.claimsTab.tablecolumns.complexity'),
      visible: false,
    },
    {
      id: 'ucr',
      label: utils.string.t('claims.claimsTab.tablecolumns.ucr'),
      nowrap: true,
      visible: false,
    },
    {
      id: 'policyType',
      label: utils.string.t('claims.claimsTab.tablecolumns.policyType'),
      nowrap: true,
      visible: false,
    },
    {
      id: 'claimantName',
      label: utils.string.t('claims.claimsTab.tablecolumns.claimant'),
      visible: false,
      ellipsis: true,
    },
    {
      id: 'reinsured',
      label: utils.string.t('claims.claimsTab.tablecolumns.reinsured'),
      nowrap: true,
      visible: false,
    },
    {
      id: 'client',
      label: utils.string.t('claims.claimsTab.tablecolumns.client'),
    },
    {
      id: 'interest',
      label: utils.string.t('claims.claimsTab.tablecolumns.interest'),
      nowrap: true,
      visible: false,
    },
    {
      id: 'createdBy',
      label: utils.string.t('claims.claimsTab.tablecolumns.createdBy'),
      nowrap: true,
      visible: false,
    },
    {
      id: 'company',
      label: utils.string.t('claims.claimsTab.tablecolumns.company'),
    },
    {
      id: 'coverholder',
      label: utils.string.t('claims.claimsTab.tablecolumns.coverholder'),
      nowrap: true,
      visible: false,
    },
    {
      id: 'lossToDate',
      label: utils.string.t('claims.claimsTab.tablecolumns.lossDateTo'),
      nowrap: true,
    },
    {
      id: 'lossDateQualifier',
      label: utils.string.t('claims.claimsTab.tablecolumns.lossDateQualifier'),
      nowrap: true,
    },
    {
      id: 'lossDetails',
      label: utils.string.t('claims.claimsTab.tablecolumns.lossDetails'),
      nowrap: true,
      ellipsis: true,
    },
    {
      id: 'pasClaimRef',
      label: utils.string.t('claims.claimsTab.tablecolumns.pasClaimRef'),
      nowrap: true,
    },

    {
      id: 'pasStatus',
      label: utils.string.t('claims.claimsTab.tablecolumns.pasStatus'),
      nowrap: true,
    },
  ];

  const { columns: columnsArray, columnProps, toggleColumn } = useFlexiColumns(columns);

  return (
    <ClaimsTabView
      claims={claimsTabTableRowDetails}
      searchTerm={claimsTabData?.searchText || ''}
      searchByTerm={searchBy}
      sort={{
        ...claimsTabData?.tableDetails?.sort,
      }}
      columnsArray={columnsArray}
      columnProps={columnProps}
      viewFields={viewFields}
      tableFilterFields={tableFilterFields}
      isFetchingFilters={isFetchingFilters}
      control={control}
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
        onSelectSearchBy,
      }}
    />
  );
}
