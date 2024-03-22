import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';

// app
import { LossesTabView } from './LossesTab.view';
import { MultiSelect, FormDate } from 'components';
import {
  getSearchLosses,
  selectClaimsStatuses,
  resetClaimLossFilters,
  getStatuses,
  selectLossesData,
  getLossesTabData,
  selectLossesTblData,
  selectLossesFilterData,
  getLossesTableFilterValues,
  resetSelectedLossItem,
  selectIsLossSubmittedStatus,
  resetLossSubmission,
} from 'stores';
import { useFlexiColumns } from 'hooks';
import * as utils from 'utils';

export default function LossesTab() {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [initialLoad, setInitialLoad] = useState(false);
  const [isTblLoader, setIsTblLoader] = useState(false);
  const [emptyData, setEmptyData] = useState(false);
  const [resetKey, setResetKey] = useState();

  const claimsStatuses = useSelector(selectClaimsStatuses);
  const lossesData = useSelector(selectLossesData);
  const lossesTblData = useSelector(selectLossesTblData);
  const lossesFilterData = useSelector(selectLossesFilterData);

  //use to reload when loss is submitted
  const isLossSubmitted = useSelector(selectIsLossSubmittedStatus);

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
      name: 'firstContactDate',
      type: 'datepicker',
      value: null,
    },
  ];

  const defaultValues = utils.form.getInitialValues(defaultFormFields);
  const { control, reset, watch, setValue } = useForm({ defaultValues });
  const lossDateFrom = watch('lossFromDate');

  const tableFilterFields = [
    {
      id: 'lossFromDate',
      type: 'datepicker',
      label: utils.string.t('claims.columns.claimsList.dateFrom'),
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
      label: utils.string.t('claims.columns.claimsList.dateTo'),
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
      id: 'firstContactDate',
      type: 'datepicker',
      label: utils.string.t('claims.columns.claimsList.firstContactDate'),
      value: '',
      content: (
        <FormDate
          control={control}
          {...utils.form.getFieldProps(defaultFormFields, 'firstContactDate')}
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
      options: lossesFilterData?.catCode || [],
      content: <MultiSelect id="catCodeDescription" search options={lossesFilterData?.catCode || []} />,
    },
    {
      id: 'lossStatus',
      type: 'multiSelect',
      label: utils.string.t('claims.columns.claimsList.lossStatus'),
      placeholder: utils.string.t('claims.filterPlaceHolderText'),
      value: [],
      options: lossesFilterData?.lossStatus || [],
      content: <MultiSelect id="lossStatus" search options={lossesFilterData?.lossStatus || []} />,
    },
  ];

  const searchOptions = [
    { id: 'lossRef', name: utils.string.t('claims.columns.claimsList.lossRef') },
    { id: 'lossName', name: utils.string.t('claims.columns.claimsList.lossName') },
    { id: 'lossDescription', name: utils.string.t('claims.columns.claimsList.lossDetails') },
    { id: 'catCodeDescription', name: utils.string.t('claims.columns.claimsList.catCodesID') },
  ];

  const handleSearch = (queryObject) => {
    if (queryObject.search && lossesData?.searchText !== queryObject.search) {
      setIsTblLoader(true);
      setValue('lossFromDate', null);
      setValue('lossToDate', null);
      setValue('firstContactDate', null);
      setResetKey(new Date().getTime());
      dispatch(getLossesTableFilterValues({ filtersValues: {} }));
      setSearchTerm(queryObject.search);
      dispatch(resetSelectedLossItem());
      dispatch(getLossesTabData({ searchText: queryObject.search, searchBy: lossesData?.searchBy }));
      dispatch(getSearchLosses({ term: queryObject.search, filterTerm: '', searchBy: lossesData?.searchBy, requestType: 'filter' }));
      dispatch(
        getSearchLosses({
          term: queryObject.search,
          direction: 'desc',
          searchBy: lossesData?.searchBy,
          requestType: 'search',
          size: lossesData?.pageSize,
        })
      ).then((resp) => {
        if (resp.status === 'OK' || resp?.json?.statusCode === 500) setIsTblLoader(false);
        if (resp.status === 'OK') setEmptyData(false);
        if (resp?.json?.statusCode === 500) setEmptyData(true);
      });
    } else if (!initialLoad) {
      setInitialLoad(true);
    }
  };

  const onResetSearch = () => {
    setIsTblLoader(true);
    setValue('lossFromDate', null);
    setValue('lossToDate', null);
    setValue('firstContactDate', null);
    setResetKey(new Date().getTime());
    dispatch(resetSelectedLossItem());
    dispatch(getLossesTabData({ searchText: '', searchBy: lossesData?.searchBy }));
    dispatch(getSearchLosses({ term: '', filterTerm: '', searchBy: lossesData?.searchBy, requestType: 'filter' }));
    dispatch(getSearchLosses({ term: '', direction: 'desc', searchBy: lossesData?.searchBy, requestType: 'search' })).then((resp) => {
      if (resp.status === 'OK' || resp?.json?.statusCode === 500) setIsTblLoader(false);
      if (resp.status === 'OK') setEmptyData(false);
      if (resp?.json?.statusCode === 500) setEmptyData(true);
    });
  };

  const handleChangePage = (newPage) => {
    setIsTblLoader(true);
    dispatch(resetSelectedLossItem());
    dispatch(
      getSearchLosses({ page: newPage, term: searchTerm || lossesData?.searchText, searchBy: lossesData?.searchBy, requestType: 'search' })
    ).then((resp) => {
      if (resp.status === 'OK' || resp?.json?.statusCode === 500) setIsTblLoader(false);
      if (resp.status === 'OK') setEmptyData(false);
      if (resp?.json?.statusCode === 500) setEmptyData(true);
    });
  };

  const onResetFilter = () => {
    setIsTblLoader(true);
    reset();
    dispatch(resetClaimLossFilters());
    dispatch(resetSelectedLossItem());
    dispatch(getLossesTableFilterValues({ filtersValues: {} }));
    dispatch(
      getSearchLosses({
        term: searchTerm || lossesData?.searchText,
        filterTerm: '',
        searchBy: lossesData?.searchBy,
        requestType: 'filter',
      })
    );
    dispatch(
      getSearchLosses({ term: searchTerm || lossesData?.searchText, filterTerm: '', searchBy: lossesData?.searchBy, requestType: 'search' })
    ).then((resp) => {
      if (resp.status === 'OK' || resp?.json?.statusCode === 500) setIsTblLoader(false);
      if (resp.status === 'OK') setEmptyData(false);
      if (resp?.json?.statusCode === 500) setEmptyData(true);
    });
  };

  const handleSearchFilter = (data) => {
    const { filters } = data;
    setIsTblLoader(true);
    dispatch(getLossesTableFilterValues({ filters }));
    dispatch(resetSelectedLossItem());
    dispatch(
      getSearchLosses({
        term: searchTerm || lossesData?.searchText,
        filterTerm: filters,
        searchBy: lossesData?.searchBy,
        requestType: 'filter',
      })
    );
    dispatch(
      getSearchLosses({
        term: searchTerm || lossesData?.searchText,
        searchBy: lossesData?.searchBy,
        filterTerm: filters,
        requestType: 'search',
      })
    ).then((resp) => {
      if (resp.status === 'OK' || resp?.json?.statusCode === 500) setIsTblLoader(false);
      if (resp.status === 'OK') setEmptyData(false);
      if (resp?.json?.statusCode === 500) setEmptyData(true);
    });
  };

  const handleChangeRowsPerPage = (rowsPerPage) => {
    setIsTblLoader(true);
    dispatch(resetSelectedLossItem());
    dispatch(
      getSearchLosses({
        size: rowsPerPage,
        term: searchTerm || lossesData?.searchText,
        searchBy: lossesData?.searchBy,
        requestType: 'search',
      })
    ).then((resp) => {
      if (resp.status === 'OK' || resp?.json?.statusCode === 500) setIsTblLoader(false);
      if (resp.status === 'OK') setEmptyData(false);
      if (resp?.json?.statusCode === 500) setEmptyData(true);
    });
  };

  const handleSort = (by, dir) => {
    setIsTblLoader(true);
    dispatch(resetSelectedLossItem());
    dispatch(
      getSearchLosses({
        sortBy: by,
        direction: dir.toUpperCase(),
        term: searchTerm || lossesData?.searchText,
        searchBy: lossesData?.searchBy,
        requestType: 'search',
      })
    ).then((resp) => {
      if (resp.status === 'OK' || resp?.json?.statusCode === 500) setIsTblLoader(false);
      if (resp.status === 'OK') setEmptyData(false);
      if (resp?.json?.statusCode === 500) setEmptyData(true);
    });
  };

  useEffect(
    () => {
      if (!initialLoad && (utils.generic.isInvalidOrEmptyArray(claimsStatuses) || lossesData?.items?.length === 0)) {
        dispatch(getStatuses());
        dispatch(getLossesTabData({ searchText: '', searchBy: lossesData?.searchBy }));
        dispatch(getSearchLosses({ term: '', filterTerm: '', searchBy: lossesData?.searchBy, requestType: 'filter' }));
        dispatch(resetSelectedLossItem());
        dispatch(getSearchLosses({ term: '', direction: 'desc', searchBy: lossesData?.searchBy, requestType: 'search' })).then((resp) => {
          if (resp.status === 'OK' || resp?.json?.statusCode === 500) setIsTblLoader(false);
          if (resp.status === 'OK') setEmptyData(false);
          if (resp?.json?.statusCode === 500) setEmptyData(true);
        });
        setInitialLoad(!initialLoad);
      }
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  useEffect(() => {
    if (isLossSubmitted) {
      dispatch(getLossesTabData({ searchText: '', searchBy: lossesData?.searchBy }));
      dispatch(getSearchLosses({ term: '', filterTerm: '', searchBy: lossesData?.searchBy, requestType: 'filter' }));
      dispatch(resetSelectedLossItem());
      dispatch(getSearchLosses({ term: '', direction: 'desc', searchBy: lossesData?.searchBy, requestType: 'search' })).then((resp) => {
        if (resp.status === 'OK' || resp?.json?.statusCode === 500) setIsTblLoader(false);
        if (resp.status === 'OK') setEmptyData(false);
        if (resp?.json?.statusCode === 500) setEmptyData(true);
      });
    }
    dispatch(resetLossSubmission());
  }, [isLossSubmitted]); // eslint-disable-line react-hooks/exhaustive-deps

  const columns = [
    {
      id: 'lossRef',
      label: utils.string.t('claims.columns.claimsList.reference'),
      nowrap: true,
      visible: true,
    },
    {
      id: 'lossName',
      label: utils.string.t('claims.columns.claimsList.lossName'),
      nowrap: true,
      visible: true,
    },
    {
      id: 'lossDetails',
      label: utils.string.t('claims.columns.claimsList.lossDetails'),
      nowrap: true,
      visible: true,
    },
    {
      id: 'dateFrom',
      label: utils.string.t('claims.columns.claimsList.dateFrom'),
      nowrap: true,
      visible: true,
    },
    {
      id: 'dateTo',
      label: utils.string.t('claims.columns.claimsList.dateTo'),
      nowrap: true,
      visible: true,
    },
    {
      id: 'firstContactDateTime',
      label: utils.string.t('claims.columns.claimsList.firstContactDateTime'),
      nowrap: true,
      visible: true,
    },
    {
      id: 'catCodesID',
      label: utils.string.t('claims.columns.claimsList.catCodesID'),
      visible: true,
      nowrap: true,
    },
    {
      id: 'lossStatus',
      label: utils.string.t('claims.columns.claimsList.lossStatus'),
      visible: true,
      nowrap: true,
    },
  ];

  const searchField = [
    {
      name: 'searchBy',
      type: 'select',
      options: searchOptions,
      optionKey: 'id',
      optionLabel: 'name',
      value:
        lossesData?.searchBy !== ''
          ? searchOptions?.find((item) => item?.id === lossesData?.searchBy)?.id
          : searchOptions?.find((item) => item?.name === utils.string.t('claims.columns.claimsList.lossName'))?.id || null,
      handleUpdate: (name, value) => {
        dispatch(getLossesTabData({ searchBy: value }));
      },
    },
  ];

  const { columns: columnsArray, isTableHidden, columnProps, toggleColumn } = useFlexiColumns(columns);

  return (
    <LossesTabView
      lossesData={lossesData}
      tableData={lossesTblData}
      searchTerm={lossesData?.searchText}
      searchField={searchField}
      searchByTerm={searchField[0].value}
      sort={{
        ...lossesData?.sort,
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
      tableFilterFields={tableFilterFields}
      onResetFilter={onResetFilter}
      onResetSearch={onResetSearch}
      toggleColumn={toggleColumn}
      anchorEl={anchorEl}
      setAnchorEl={setAnchorEl}
      isTblLoader={isTblLoader}
      emptyData={emptyData}
      resetKey={resetKey}
    />
  );
}
