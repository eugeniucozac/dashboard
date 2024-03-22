import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';

// app
import AdvanceSearchTabView from './AdvanceSearchTab.view';
import { MultiSelect, FormDate } from 'components';
import { useFlexiColumns } from 'hooks';
import * as utils from 'utils';
import {
  getAdvanceSearchDetails,
  selectAdvanceSearchData,
  selectAdvanceSearchTblData,
  selectAdvanceSearchFilterData,
  setAdvanceSearchTabSearchDetails,
  setAdvanceSearchTblFilterValues,
  resetSelectedLossItem,
  resetAdvanceSearchTabDetails,
  setPullClosedRecords,
  getStatuses,
  selectClaimsStatuses,
} from 'stores';
import * as constants from 'consts';

export default function AdvanceSearchTab() {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [resetKey, setResetKey] = useState();

  const claimStatuses = useSelector(selectClaimsStatuses);
  const advanceSearchData = useSelector(selectAdvanceSearchData);
  const advanceSearchTblData = useSelector(selectAdvanceSearchTblData);
  const advanceSearchFilterData = useSelector(selectAdvanceSearchFilterData);

  const isTblLoader = advanceSearchData?.isloadingTable || false;
  const isFetchingFilters = advanceSearchData?.isloadingFilters || false;
  const emptyData = utils.generic.isInvalidOrEmptyArray(advanceSearchData?.items);

  const [isClosedClaimsEnabled, setIsClosedClaimsEnabled] = useState(false);

  const defaultFormFields = [
    {
      name: 'lossFromDate',
      type: 'datepicker',
      value: null,
    },
    {
      name: 'lossToDate',
      type: 'datepicker',
      value: null,
    },
    {
      name: 'claimReceivedDateTime',
      type: 'datepicker',
      value: null,
    },
    {
      name: 'claimLossFromDate',
      type: 'datepicker',
      value: null,
    },
    {
      name: 'claimLossToDate',
      type: 'datepicker',
      value: null,
    },
  ];

  const defaultValues = utils.form.getInitialValues(defaultFormFields);
  const { control, reset, watch, setValue } = useForm({ defaultValues });
  const lossDateFrom = watch('lossFromDate');
  const claimLossFromDate = watch('claimLossFromDate');

  const tableFilterFields = [
    {
      id: 'lossQualifier',
      type: 'multiSelect',
      label: utils.string.t('claims.columns.claimsList.lossQualifier'),
      placeholder: utils.string.t('claims.filterPlaceHolderText'),
      value: [],
      options: advanceSearchFilterData?.lossQualifier || [],
      content: <MultiSelect id="lossQualifier" search options={advanceSearchFilterData?.lossQualifier || []} />,
    },
    {
      id: 'lossFromDate',
      type: 'datepicker',
      label: utils.string.t('claims.columns.claimsList.lossFromDate'),
      value: '',
      content: (
        <FormDate
          control={control}
          {...utils.form.getFieldProps(defaultFormFields, 'lossFromDate')}
          id="datepicker"
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
      id: 'lossToDate',
      type: 'datepicker',
      label: utils.string.t('claims.columns.claimsList.lossToDate'),
      placeholder: utils.string.t('claims.filterPlaceHolderText'),
      value: '',
      content: (
        <FormDate
          control={control}
          {...utils.form.getFieldProps(defaultFormFields, 'lossToDate')}
          id="datepicker"
          label={''}
          plainText
          plainTextIcon
          placeholder={utils.string.t('app.selectDate')}
          muiComponentProps={{
            fullWidth: false,
            margin: 'dense',
          }}
          muiPickerProps={{
            minDate: lossDateFrom ?? undefined,
            clearable: false,
            variant: 'inline',
            format: 'DD-MM-YYYY',
          }}
        />
      ),
    },
    {
      id: 'claimLossFromDate',
      type: 'datepicker',
      label: utils.string.t('claims.columns.claimsList.claimLossFrom'),
      value: '',
      content: (
        <FormDate
          control={control}
          {...utils.form.getFieldProps(defaultFormFields, 'claimLossFromDate')}
          id="datepicker"
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
      id: 'claimLossToDate',
      type: 'datepicker',
      label: utils.string.t('claims.columns.claimsList.claimLossTo'),
      placeholder: utils.string.t('claims.filterPlaceHolderText'),
      value: '',
      content: (
        <FormDate
          control={control}
          {...utils.form.getFieldProps(defaultFormFields, 'claimLossToDate')}
          id="datepicker"
          label={''}
          plainText
          plainTextIcon
          placeholder={utils.string.t('app.selectDate')}
          muiComponentProps={{
            fullWidth: false,
            margin: 'dense',
          }}
          muiPickerProps={{
            minDate: claimLossFromDate ?? undefined,
            clearable: false,
            variant: 'inline',
            format: 'DD-MM-YYYY',
          }}
        />
      ),
    },
    {
      id: 'claimReceivedDateTime',
      type: 'datepicker',
      label: utils.string.t('claims.columns.claimsList.claimReceivedDateTime'),
      value: '',
      content: (
        <FormDate
          control={control}
          {...utils.form.getFieldProps(defaultFormFields, 'claimReceivedDateTime')}
          id="datepicker"
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
      id: 'catCodeDescription',
      type: 'multiSelect',
      label: utils.string.t('claims.columns.claimsList.catCodesID'),
      placeholder: utils.string.t('claims.filterPlaceHolderText'),
      value: [],
      options: advanceSearchFilterData?.catCode || [],
      content: <MultiSelect id="catCode" search options={advanceSearchFilterData?.catCode || []} />,
    },
    {
      id: 'claimStatusName',
      type: 'multiSelect',
      label: utils.string.t('claims.columns.claimsList.claimStatusName'),
      placeholder: utils.string.t('claims.filterPlaceHolderText'),
      value: advanceSearchFilterData?.claimStatus || [],
      options: [],
      content: <MultiSelect id="claimStatus" search options={advanceSearchFilterData?.claimStatus || []} />,
    },
    {
      id: 'beAdjuster',
      type: 'multiSelect',
      label: utils.string.t('claims.claimInformation.beAdjuster'),
      placeholder: utils.string.t('claims.filterPlaceHolderText'),
      value: [],
      options: advanceSearchFilterData?.beAdjuster || [],
      content: <MultiSelect id="beAdjuster" search options={advanceSearchFilterData?.beAdjuster || []} />,
    },
    {
      id: 'company',
      type: 'multiSelect',
      label: utils.string.t('claims.columns.claimsList.company'),
      placeholder: utils.string.t('claims.filterPlaceHolderText'),
      value: [],
      options: advanceSearchFilterData?.company || [],
      content: <MultiSelect id="company" search options={advanceSearchFilterData?.company || []} />,
    },
    {
      id: 'division',
      type: 'multiSelect',
      label: utils.string.t('claims.columns.claimsList.division'),
      placeholder: utils.string.t('claims.filterPlaceHolderText'),
      value: [],
      options: advanceSearchFilterData?.division || [],
      content: <MultiSelect id="division" search options={advanceSearchFilterData?.division || []} />,
    },
    {
      id: 'createdBy',
      type: 'multiSelect',
      label: utils.string.t('claims.columns.claimsManagement.createdBy'),
      placeholder: utils.string.t('claims.filterPlaceHolderText'),
      value: [],
      options: advanceSearchFilterData?.createdBy || [],
      content: <MultiSelect id="createdBy" search options={advanceSearchFilterData?.createdBy || []} />,
    },
  ];

  const searchOptions = [
    { id: 'lossRef', name: utils.string.t('claims.columns.claimsList.lossRef') },
    { id: 'pasEventID', name: utils.string.t('claims.columns.claimsList.pasEventID') },
    { id: 'lossName', name: utils.string.t('claims.columns.claimsList.lossName') },
    { id: 'claimRef', name: utils.string.t('claims.columns.claimsList.claimReference') },
    { id: 'catCodeDescription', name: utils.string.t('claims.columns.claimsList.catCodesID') },
    { id: 'ucr', name: utils.string.t('claims.columns.claimsList.ucr') },
    { id: 'claimantName', name: utils.string.t('claims.columns.claimsList.claimantName') },
    { id: 'beAdjuster', name: utils.string.t('claims.claimInformation.beAdjuster') },
    { id: 'policyRef', name: utils.string.t('claims.columns.claimsList.policyRef') },
    { id: 'umr', name: utils.string.t('claims.columns.claimsList.umr') },
    { id: 'insured', name: utils.string.t('claims.columns.claimsList.insured') },
    { id: 'reInsured', name: utils.string.t('claims.columns.claimsList.reinsured') },
    { id: 'client', name: utils.string.t('claims.columns.claimsList.client') },
    { id: 'coverHolder', name: utils.string.t('claims.columns.claimsList.coverholder') },
  ];

  const columns = [
    {
      id: 'lossRef',
      label: utils.string.t('claims.columns.claimsList.lossRef'),
      nowrap: true,
      sort: { type: 'numeric', direction: 'desc' },
      visible: true,
      mandatory: true,
    },
    {
      id: 'pasEventID',
      label: utils.string.t('claims.columns.claimsList.pasEventID'),
      sort: { type: 'string', direction: 'asc' },
      nowrap: true,
    },
    {
      id: 'lossName',
      label: utils.string.t('claims.columns.claimsList.lossName'),
      nowrap: true,
      sort: { type: 'string', direction: 'asc' },
      visible: true,
      mandatory: true,
    },
    {
      id: 'lossDetail',
      label: utils.string.t('claims.columns.claimsList.lossDetails'),
      sort: { type: 'string', direction: 'asc' },
      nowrap: true,
      ellipsis: true,
    },
    {
      id: 'lossQualifier',
      label: utils.string.t('claims.columns.claimsList.lossQualifier'),
      sort: { type: 'string', direction: 'asc' },
      nowrap: true,
      ellipsis: true,
    },
    {
      id: 'lossFromDate',
      label: utils.string.t('claims.columns.claimsList.lossFromDate'),
      sort: { type: 'date', direction: 'asc' },
      nowrap: true,
      ellipsis: true,
      visible: true,
    },
    {
      id: 'lossToDate',
      label: utils.string.t('claims.columns.claimsList.lossToDate'),
      sort: { type: 'date', direction: 'asc' },
      nowrap: true,
      ellipsis: true,
      visible: true,
    },
    {
      id: 'claimRef',
      label: utils.string.t('claims.columns.claimsList.claimID'),
      sort: { type: 'string', direction: 'asc' },
      ellipsis: true,
      visible: true,
      mandatory: true,
      nowrap: true,
    },
    {
      id: 'claimLossFromDate',
      label: utils.string.t('claims.columns.claimsList.claimLossFrom'),
      sort: { type: 'date', direction: 'asc' },
      nowrap: true,
    },
    {
      id: 'claimLossToDate',
      label: utils.string.t('claims.columns.claimsList.claimLossTo'),
      sort: { type: 'date', direction: 'asc' },
      nowrap: true,
    },
    {
      id: 'claimReceivedDate',
      label: utils.string.t('claims.columns.claimsList.claimReceivedDateTime'),
      sort: { type: 'date', direction: 'asc' },
      nowrap: true,
    },
    {
      id: 'claimStatusName',
      label: utils.string.t('claims.columns.claimsList.claimStatusName'),
      sort: { type: 'string', direction: 'asc' },
      ellipsis: true,
      visible: true,
      nowrap: true,
    },
    {
      id: 'catCodeDescription',
      label: utils.string.t('claims.columns.claimsList.catCodesID'),
      nowrap: true,
      sort: { type: 'string', direction: 'asc' },
    },
    { id: 'ucr', label: utils.string.t('claims.columns.claimsList.ucr'), sort: { type: 'string', direction: 'asc' } },
    {
      id: 'claimantName',
      label: utils.string.t('claims.columns.claimsList.claimantName'),
      nowrap: true,
      sort: { type: 'string', direction: 'asc' },
    },
    {
      id: 'beAdjuster',
      label: utils.string.t('claims.claimInformation.beAdjuster'),
      sort: { type: 'string', direction: 'asc' },
      nowrap: true,
    },
    {
      id: 'policyRef',
      label: utils.string.t('claims.columns.claimsList.policyRef'),
      sort: { type: 'string', direction: 'asc' },
      ellipsis: true,
      visible: true,
      mandatory: true,
      nowrap: true,
    },
    {
      id: 'umr',
      label: utils.string.t('claims.columns.claimsList.umr'),
      sort: { type: 'string', direction: 'asc' },
      nowrap: true,
    },
    {
      id: 'policyType',
      label: utils.string.t('claims.columns.claimsList.policyType'),
      nowrap: true,
      sort: { type: 'string', direction: 'asc' },
    },
    {
      id: 'insured',
      label: utils.string.t('claims.columns.claimsList.insured'),
      sort: { type: 'string', direction: 'asc' },
      ellipsis: true,
      visible: true,
    },
    {
      id: 'reInsured',
      label: utils.string.t('claims.columns.claimsList.reinsured'),
      sort: { type: 'string', direction: 'asc' },
      ellipsis: true,
    },
    {
      id: 'client',
      label: utils.string.t('claims.columns.claimsList.client'),
      sort: { type: 'string', direction: 'asc' },
      ellipsis: true,
    },
    {
      id: 'coverHolder',
      label: utils.string.t('claims.columns.claimsList.coverholder'),
      sort: { type: 'string', direction: 'asc' },
      ellipsis: true,
    },
    {
      id: 'company',
      label: utils.string.t('claims.columns.claimsList.company'),
      sort: { type: 'string', direction: 'asc' },
      visible: true,
    },

    {
      id: 'division',
      label: utils.string.t('claims.columns.claimsList.division'),
      sort: { type: 'string', direction: 'asc' },
      ellipsis: true,
      visible: true,
    },
    {
      id: 'team',
      label: utils.string.t('claims.columns.claimsList.team'),
      sort: { type: 'string', direction: 'asc' },
    },
    {
      id: 'createdBy',
      label: utils.string.t('claims.columns.claimsManagement.createdBy'),
      sort: { type: 'string', direction: 'asc' },
      visible: true,
      nowrap: true,
    },

    { id: 'priority', label: utils.string.t('claims.columns.claimsList.priority'), sort: { type: 'string', direction: 'asc' } },

    { id: 'actions', menu: true },
  ];

  const searchField = [
    {
      name: 'searchBy',
      type: 'select',
      options: searchOptions,
      optionKey: 'id',
      optionLabel: 'name',
      value:
        advanceSearchData?.searchBy !== ''
          ? searchOptions?.find((item) => item?.id === advanceSearchData?.searchBy)?.id
          : searchOptions?.find((item) => item?.name === utils.string.t('claims.columns.claimsList.lossName'))?.id || null,
      handleUpdate: (name, value) => {
        dispatch(setAdvanceSearchTabSearchDetails({ searchBy: value }));
      },
    },
  ];

  const closedClaimField = [
    {
      name: 'includeClosedClaims',
      type: 'switch',
      value: advanceSearchData?.pullClosedRecords || isClosedClaimsEnabled,
    },
  ];

  const handleSearch = (queryObject) => {
    if (queryObject?.search && advanceSearchData?.searchText !== queryObject?.search) {
      constants.ADVANCE_SEARCH_FILTER_DATE_FIELDS.map((val) => setValue(val, null));
      setResetKey(new Date().getTime());
      dispatch(setAdvanceSearchTblFilterValues({ filtersValues: {} }));
      setSearchTerm(queryObject?.search);
      dispatch(resetSelectedLossItem());
      dispatch(setAdvanceSearchTabSearchDetails({ searchText: queryObject?.search, searchBy: advanceSearchData?.searchBy }));
      dispatch(
        getAdvanceSearchDetails({ term: queryObject?.search, filterTerm: '', searchBy: advanceSearchData?.searchBy, requestType: 'filter' })
      );
      dispatch(
        getAdvanceSearchDetails({
          term: queryObject?.search,
          direction: 'desc',
          searchBy: advanceSearchData?.searchBy,
          requestType: 'search',
          size: advanceSearchData?.pageSize,
        })
      );
    }
  };

  const handleSort = (by, dir) => {
    if (searchTerm || advanceSearchData?.searchText) {
      dispatch(resetSelectedLossItem());
      dispatch(
        getAdvanceSearchDetails({
          sortBy: by,
          direction: dir.toUpperCase(),
          term: searchTerm || advanceSearchData?.searchText,
          searchBy: advanceSearchData?.searchBy,
          requestType: 'search',
        })
      );
    }
  };

  const handleChangePage = (newPage) => {
    if (searchTerm || advanceSearchData?.searchText) {
      dispatch(resetSelectedLossItem());
      dispatch(
        getAdvanceSearchDetails({
          page: newPage,
          term: searchTerm || advanceSearchData?.searchText,
          searchBy: advanceSearchData?.searchBy,
          requestType: 'search',
        })
      );
    }
  };

  const handleChangeRowsPerPage = (rowsPerPage) => {
    if (searchTerm || advanceSearchData?.searchText) {
      dispatch(resetSelectedLossItem());
      dispatch(
        getAdvanceSearchDetails({
          size: rowsPerPage,
          term: searchTerm || advanceSearchData?.searchText,
          searchBy: advanceSearchData?.searchBy,
          requestType: 'search',
        })
      );
    }
  };

  const handleSearchFilter = (data) => {
    const { filters } = data;
    if (searchTerm || advanceSearchData?.searchText) {
      dispatch(resetSelectedLossItem());
      dispatch(setAdvanceSearchTblFilterValues({ filters }));
      dispatch(
        getAdvanceSearchDetails({
          term: searchTerm || advanceSearchData?.searchText,
          filterTerm: filters,
          searchBy: advanceSearchData?.searchBy,
          requestType: 'filter',
        })
      );
      dispatch(
        getAdvanceSearchDetails({
          term: searchTerm || advanceSearchData?.searchText,
          searchBy: advanceSearchData?.searchBy,
          filterTerm: filters,
          requestType: 'search',
        })
      );
    }
  };

  const onResetFilter = () => {
    if (searchTerm || advanceSearchData?.searchText) {
      reset();
      dispatch(resetSelectedLossItem());
      dispatch(setAdvanceSearchTblFilterValues({ filtersValues: {} }));
      dispatch(
        getAdvanceSearchDetails({
          term: searchTerm || advanceSearchData?.searchText,
          filterTerm: '',
          searchBy: advanceSearchData?.searchBy,
          requestType: 'filter',
        })
      );
      dispatch(
        getAdvanceSearchDetails({
          term: searchTerm || advanceSearchData?.searchText,
          filterTerm: '',
          searchBy: advanceSearchData?.searchBy,
          requestType: 'search',
        })
      );
    }
  };

  const onResetSearch = () => {
    setResetKey(new Date().getTime());
    constants.ADVANCE_SEARCH_FILTER_DATE_FIELDS.map((val) => setValue(val, null));
    dispatch(resetSelectedLossItem());
    dispatch(resetAdvanceSearchTabDetails());
    setSearchTerm('');
    dispatch(setAdvanceSearchTabSearchDetails({ searchText: '', searchBy: advanceSearchData?.searchBy }));
  };

  const handleClosedClaims = (name, claimStatus) => {
    setIsClosedClaimsEnabled(claimStatus);
    dispatch(setPullClosedRecords(claimStatus));
    if (searchTerm || advanceSearchData?.searchText) {
      dispatch(
        setAdvanceSearchTabSearchDetails({ searchText: searchTerm || advanceSearchData?.searchText, searchBy: advanceSearchData?.searchBy })
      );
      dispatch(
        getAdvanceSearchDetails({
          term: searchTerm || advanceSearchData?.searchText,
          filterTerm: '',
          searchBy: advanceSearchData?.searchBy,
          requestType: 'filter',
          pullClosedRecords: claimStatus,
        })
      );
      dispatch(
        getAdvanceSearchDetails({
          term: searchTerm || advanceSearchData?.searchText,
          direction: 'desc',
          searchBy: advanceSearchData?.searchBy,
          requestType: 'search',
          size: advanceSearchData?.pageSize,
          pullClosedRecords: claimStatus,
        })
      );
    }
  };

  useEffect(() => {
    if (utils.generic.isInvalidOrEmptyArray(claimStatuses)) dispatch(getStatuses());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const { columns: columnsArray, isTableHidden, columnProps, toggleColumn } = useFlexiColumns(columns);

  return (
    <AdvanceSearchTabView
      advanceSearchData={advanceSearchData}
      tableData={advanceSearchTblData}
      searchTerm={advanceSearchData?.searchText}
      searchField={searchField}
      closedClaimField={closedClaimField}
      isSearchByNull={!Boolean(searchField[0].value)}
      sort={{
        ...advanceSearchData.sort,
        type: 'numeric',
      }}
      columnsArray={columnsArray}
      columnProps={columnProps}
      isTableHidden={isTableHidden}
      handleSearch={handleSearch}
      handleSort={handleSort}
      handleChangePage={handleChangePage}
      handleChangeRowsPerPage={handleChangeRowsPerPage}
      handleSearchFilter={handleSearchFilter}
      handleClosedClaims={handleClosedClaims}
      tableFilterFields={tableFilterFields}
      onResetFilter={onResetFilter}
      onResetSearch={onResetSearch}
      toggleColumn={toggleColumn}
      anchorEl={anchorEl}
      setAnchorEl={setAnchorEl}
      isTblLoader={isTblLoader}
      isFetchingFilters={isFetchingFilters}
      emptyData={emptyData}
      resetKey={resetKey}
    />
  );
}
