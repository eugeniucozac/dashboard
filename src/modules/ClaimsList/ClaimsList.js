import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';

//app
import { ClaimsListView } from './ClaimsList.view';
import { useFlexiColumns } from 'hooks';
import {
  getClaims,
  resetClaims,
  selectClaims,
  selectClaimsStatuses,
  updateClaimLossFilters,
  postClaimsLossFilters,
  resetClaimLossFilters,
  getStatuses,
} from 'stores';
import { MultiSelect, FormDate } from 'components';
import * as utils from 'utils';
import SearchIcon from '@material-ui/icons/Search';

ClaimsList.prototypes = {
  handleCreateClaim: PropTypes.func.isRequired,
};

export default function ClaimsList({ handleCreateClaim }) {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);

  const claims = useSelector(selectClaims);
  const claimsStatuses = useSelector(selectClaimsStatuses);
  const defaultFormFields = [
    {
      name: 'lossDateFrom',
      type: 'datepicker',
      value: null,
    },
    {
      name: 'lossDateTo',
      type: 'datepicker',
      value: null,
    },
  ];

  const defaultValues = utils.form.getInitialValues(defaultFormFields);
  const { control, reset, watch } = useForm({ defaultValues });
  const lossDateFrom = watch('lossDateFrom');

  const tableFilterFields = [
    {
      id: 'lossName',
      type: 'multiSelect',
      label: utils.string.t('claims.lossInformation.name'),
      placeholder: utils.string.t('claims.filterPlaceHolderText'),
      value: [],
      options: claims?.filters?.lossName,
      content: <MultiSelect id="lossName" search options={claims?.filters?.lossName} />,
      maxHeight: 200,
    },
    {
      id: 'lossDateFrom',
      type: 'datepicker',
      label: utils.string.t('claims.lossInformation.fromDate'),
      value: '',
      content: (
        <FormDate
          control={control}
          {...utils.form.getFieldProps(defaultFormFields, 'lossDateFrom')}
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
      id: 'lossDateTo',
      type: 'datepicker',
      label: utils.string.t('claims.lossInformation.toDate'),
      placeholder: utils.string.t('claims.filterPlaceHolderText'),
      value: '',
      content: (
        <FormDate
          control={control}
          {...utils.form.getFieldProps(defaultFormFields, 'lossDateTo')}
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
      id: 'insured',
      type: 'multiSelect',
      label: utils.string.t('claims.insured'),
      placeholder: utils.string.t('claims.filterPlaceHolderText'),
      value: [],
      options: claims?.filters?.insured,
      content: <MultiSelect id="insured" search options={claims?.filters?.insured} />,
    },
    {
      id: 'claimant',
      type: 'multiSelect',
      label: utils.string.t('claims.claimInformation.claimant'),
      placeholder: utils.string.t('claims.filterPlaceHolderText'),
      value: [],
      options: claims?.filters.claimant,
      content: <MultiSelect id="claimant" search options={claims?.filters?.claimant} />,
    },
    {
      id: 'claimStatus',
      type: 'multiSelect',
      label: utils.string.t('claims.claimInformation.status'),
      placeholder: utils.string.t('claims.filterPlaceHolderText'),
      value: [],
      options: claims?.filters?.claimStatus,
      content: <MultiSelect id="claimStatus" search options={claims?.filters?.claimStatus} />,
    },
  ];

  const searchOptions = [
    { id: 'lossRef', name: utils.string.t('claims.columns.claimsList.lossRef') },
    { id: 'lossName', name: utils.string.t('claims.columns.claimsList.lossName') },
    { id: 'policyRef', name: utils.string.t('claims.columns.claimsList.policyRef') },
    { id: 'claimReference', name: utils.string.t('claims.columns.claimsList.claimReference') },
    { id: 'claimantName', name: utils.string.t('claims.columns.claimsList.claimantName') },
    { id: 'assured', name: utils.string.t('claims.columns.claimsList.assured') },
    { id: 'client', name: utils.string.t('claims.columns.claimsList.client') },
    { id: 'ucr', name: utils.string.t('claims.columns.claimsList.ucr') },
  ];

  useEffect(
    () => {
      if (utils.generic.isInvalidOrEmptyArray(claimsStatuses)) {
        dispatch(getStatuses());
      }

      // cleanup
      return () => {
        dispatch(resetClaims());
      };
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleSearch = (queryObject) => {
    if (queryObject.search) {
      setSearchTerm(queryObject.search);
      dispatch(postClaimsLossFilters({ term: queryObject.search, searchBy: queryObject.searchBy }));
      dispatch(getClaims({ term: queryObject.search, direction: 'desc', searchBy: queryObject.searchBy }));
    }
  };

  const handleChangePage = (newPage) => {
    dispatch(getClaims({ page: newPage, term: searchTerm }));
  };

  const onResetFilter = () => {
    reset();
    dispatch(resetClaimLossFilters());
    dispatch(getClaims({ term: searchTerm, filterTerm: '' }));
  };

  const handleSearchFilter = (data) => {
    const { filters } = data;
    dispatch(updateClaimLossFilters({ search: searchTerm, filters }));
    return dispatch(getClaims({ term: searchTerm, filterTerm: filters }));
  };

  const handleChangeRowsPerPage = (rowsPerPage) => {
    dispatch(getClaims({ size: rowsPerPage, term: searchTerm }));
  };

  const handleSort = (by, dir) => {
    dispatch(getClaims({ sortBy: by, direction: dir.toUpperCase(), term: searchTerm }));
  };

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
      id: 'claimID',
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
      id: 'claimReceivedDateTime',
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
    { id: 'client', label: utils.string.t('claims.columns.claimsList.client'), sort: { type: 'string', direction: 'asc' }, ellipsis: true },

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
      visible: true,
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
      defaultValue: 'lossName',
      options: searchOptions,
      optionKey: 'id',
      optionLabel: 'name',
    },
    {
      name: 'search',
      defaultValue: '',
      type: 'text',
      placeholder: 'Search',
      icon: SearchIcon,
      value: '',
    },
  ];

  const { columns: columnsArray, isTableHidden, columnProps, toggleColumn } = useFlexiColumns(columns);

  return (
    <ClaimsListView
      claims={claims}
      searchField={searchField}
      sort={{
        ...claims.sort,
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
      handleCreateClaim={handleCreateClaim}
      tableFilterFields={tableFilterFields}
      onResetFilter={onResetFilter}
      toggleColumn={toggleColumn}
      anchorEl={anchorEl}
      setAnchorEl={setAnchorEl}
    />
  );
}
