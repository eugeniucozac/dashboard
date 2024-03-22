import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

//app
import { ClaimsSelectPolicyView } from './ClaimsSelectPolicy.view';
import { useFlexiColumns } from 'hooks';
import * as utils from 'utils';
import {
  getPolicies,
  selectPolicies,
  selectClaimsPolicyData,
  claimsPolicyData,
  selectPoliciesFilterLoading,
  resetUnderwritingGroups,
  sortingUnderwritingGroups,
} from 'stores';
import * as constants from 'consts';
import { MultiSelect, FormDate } from 'components';

ClaimsSelectPolicy.propTypes = {
  setConfirm: PropTypes.func.isRequired,
};

export default function ClaimsSelectPolicy({ setConfirm }) {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const policyData = useSelector(selectClaimsPolicyData);
  const policies = useSelector(selectPolicies);

  useEffect(() => {
    if (policies?.items?.length > 0 && policyData?.xbPolicyID) {
      const isPolicyExist = policies.items.some((policy) => policy.xbPolicyID === Number(policyData.xbPolicyID));
      setConfirm(isPolicyExist);
    }
  }, [policies]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    dispatch(resetUnderwritingGroups());
    dispatch(sortingUnderwritingGroups([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isFetchingFilters = useSelector(selectPoliciesFilterLoading);
  const [searchBy, setSearchBy] = useState(constants.CLAIMS_POLICY_SEARCH_OPTION.policyRef);
  const [searchByText, setSearchByText] = useState(utils.string.t('claims.searchPolicy.searchByOptions.PolicyRef'));
  const searchTypeCall = constants.CLAIM_POLICY_SEARCH_REQ_TYPES.search;
  const filterTypeCall = constants.CLAIM_POLICY_SEARCH_REQ_TYPES.filter;
  const selectOptions = [
    { label: utils.string.t('claims.searchPolicy.searchByOptions.PolicyRef'), value: constants.CLAIMS_POLICY_SEARCH_OPTION.policyRef },
    { label: utils.string.t('claims.searchPolicy.searchByOptions.Insured'), value: constants.CLAIMS_POLICY_SEARCH_OPTION.insured },
    { label: utils.string.t('claims.searchPolicy.searchByOptions.Claimant'), value: constants.CLAIMS_POLICY_SEARCH_OPTION.claimant },
    { label: utils.string.t('claims.searchPolicy.searchByOptions.ClientName'), value: constants.CLAIMS_POLICY_SEARCH_OPTION.clientName },
    { label: utils.string.t('claims.searchPolicy.searchByOptions.RiskDetails'), value: constants.CLAIMS_POLICY_SEARCH_OPTION.riskDetails },
  ];
  const defaultFormFields = [
    {
      name: 'inceptionDate',
      type: 'datepicker',
      value: null,
    },
    {
      name: 'expiryDate',
      type: 'datepicker',
      value: null,
    },
  ];

  const defaultValues = utils.form.getInitialValues(defaultFormFields);
  const { control, reset } = useForm({ defaultValues });
  const viewFields = [
    {
      name: 'searchBy',
      type: 'autocompletemui',
      options: selectOptions,
      value: selectOptions?.find((item) => item?.value === constants.CLAIMS_POLICY_SEARCH_OPTION.policyRef) || null,
      validation: Yup.object().nullable().required(utils.string.t('validation.required')),
      muiComponentProps: {
        inputProps: {
          title: searchByText || '',
        },
      },
    },
  ];

  const viewDefaultValues = utils.form.getInitialValues(viewFields);
  const viewValidationSchema = utils.form.getValidationSchema(viewFields);

  const { control: viewControl } = useForm({
    viewDefaultValues,
    ...(viewValidationSchema && { resolver: yupResolver(viewValidationSchema) }),
  });

  const tableFilterFields = [
    {
      id: 'policyType',
      type: 'multiSelect',
      label: utils.string.t('claims.searchPolicy.columns.policyType'),
      placeholder: utils.string.t('claims.filterPlaceHolderText'),
      value: [],
      options: policies.filters?.policyType || [],
      content: <MultiSelect id="policyType" search options={policies.filters?.policyType || []} />,
    },
    {
      id: 'insured',
      type: 'multiSelect',
      label: utils.string.t('claims.searchPolicy.columns.insured'),
      placeholder: utils.string.t('claims.filterPlaceHolderText'),
      value: [],
      options: policies.filters?.insured || [],
      content: <MultiSelect id="insured" search options={policies.filters?.insured || []} />,
    },
    {
      id: 'reinsured',
      type: 'multiSelect',
      label: utils.string.t('claims.searchPolicy.columns.reinsured'),
      placeholder: utils.string.t('claims.filterPlaceHolderText'),
      value: [],
      options: policies.filters?.reinsured || [],
      content: <MultiSelect id="reinsured" search options={policies.filters?.reinsured || []} />,
    },
    {
      id: 'clientName',
      type: 'multiSelect',
      label: utils.string.t('claims.searchPolicy.columns.client'),
      placeholder: utils.string.t('claims.filterPlaceHolderText'),
      value: [],
      options: policies.filters?.clientName || [],
      content: <MultiSelect id="clientName" search options={policies.filters?.clientName || []} />,
    },
    {
      id: 'riskDetails',
      type: 'multiSelect',
      label: utils.string.t('claims.searchPolicy.columns.riskDetails'),
      placeholder: utils.string.t('claims.filterPlaceHolderText'),
      value: [],
      options: policies.filters?.riskDetails || [],
      content: <MultiSelect id="riskDetails" search options={policies.filters?.riskDetails || []} />,
    },
    {
      id: 'inceptionDate',
      type: 'datepicker',
      label: utils.string.t('claims.searchPolicy.columns.inceptionDate'),
      value: '',
      content: (
        <FormDate
          control={control}
          {...utils.form.getFieldProps(defaultFormFields, 'inceptionDate')}
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
      id: 'expiryDate',
      type: 'datepicker',
      label: utils.string.t('claims.searchPolicy.columns.expiryDate'),
      placeholder: utils.string.t('claims.filterPlaceHolderText'),
      value: '',
      content: (
        <FormDate
          control={control}
          {...utils.form.getFieldProps(defaultFormFields, 'expiryDate')}
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
      id: 'division',
      type: 'multiSelect',
      label: utils.string.t('claims.searchPolicy.columns.division'),
      placeholder: utils.string.t('claims.filterPlaceHolderText'),
      value: [],
      options: policies.filters?.division || [],
      content: <MultiSelect id="division" search options={policies.filters?.division || []} />,
    },
    {
      id: 'policyStatus',
      type: 'multiSelect',
      label: utils.string.t('claims.searchPolicy.columns.policyStatus'),
      placeholder: utils.string.t('claims.filterPlaceHolderText'),
      value: [],
      options: policies.filters?.policyStatus || [],
      content: <MultiSelect id="policyStatus" search options={policies.filters?.policyStatus || []} />,
    },
  ];

  const columns = [
    {
      id: 'policyRef',
      label: utils.string.t('claims.searchPolicy.columns.contractPolicyRef'),
      sort: { type: '', direction: 'asc' },
      nowrap: true,
      visible: true,
      mandatory: true,
    },
    {
      id: 'coverHolder',
      label: utils.string.t('claims.searchPolicy.columns.coverHolder'),
      sort: { type: '', direction: 'asc' },
      nowrap: true,
      visible: true,
      mandatory: false,
    },
    {
      id: 'statusCode',
      label: utils.string.t('claims.searchPolicy.columns.policyStatus'),
      sort: { type: '', direction: 'asc' },
      nowrap: true,
      visible: true,
      mandatory: false,
    },
    {
      id: 'policyType',
      label: utils.string.t('claims.searchPolicy.columns.policyType'),
      sort: { type: '', direction: 'asc' },
      nowrap: true,
      visible: true,
      mandatory: false,
    },
    {
      id: 'insured',
      label: utils.string.t('claims.searchPolicy.columns.insured'),
      sort: { type: '', direction: 'asc' },
      nowrap: true,
      visible: true,
      mandatory: false,
    },
    {
      id: 'reInsured',
      label: utils.string.t('claims.searchPolicy.columns.reinsured'),
      sort: { type: '', direction: 'asc' },
      nowrap: true,
      visible: true,
      mandatory: false,
    },
    {
      id: 'clientName',
      label: utils.string.t('claims.searchPolicy.columns.client'),
      sort: { type: '', direction: 'asc' },
      nowrap: true,
      visible: true,
      mandatory: false,
    },
    {
      id: 'riskDetails',
      label: utils.string.t('claims.searchPolicy.columns.riskDetails'),
      sort: { type: '', direction: 'asc' },
      nowrap: true,
      visible: true,
      mandatory: false,
    },
    {
      id: 'inceptionDate',
      label: utils.string.t('claims.searchPolicy.columns.inceptionDate'),
      sort: { type: 'date', direction: 'asc' },
      nowrap: true,
      visible: true,
      mandatory: true,
    },
    {
      id: 'expiryDate',
      label: utils.string.t('claims.searchPolicy.columns.expiryDate'),
      sort: { type: 'date', direction: 'asc' },
      nowrap: true,
      visible: true,
      mandatory: true,
    },
    {
      id: 'company',
      label: utils.string.t('claims.searchPolicy.columns.company'),
      sort: { type: '', direction: 'asc' },
      nowrap: true,
      visible: true,
      mandatory: false,
    },
    {
      id: 'division',
      label: utils.string.t('claims.searchPolicy.columns.division'),
      sort: { type: '', direction: 'asc' },
      nowrap: true,
      visible: true,
      mandatory: false,
    },
  ];

  const { columns: columnsArray, columnProps, toggleColumn } = useFlexiColumns(columns);

  const onSelectSearchBy = (searchByValue, searchByLabel) => {
    setSearchByText(searchByLabel);
    setSearchBy(searchByValue);
    dispatch(
      getPolicies({
        requestType: searchTypeCall,
        term: searchByValue,
        direction: 'desc',
        searchBy,
      })
    );
    dispatch(
      getPolicies({
        requestType: filterTypeCall,
        term: searchByValue,
        direction: 'desc',
        searchBy,
      })
    );
  };

  const handlePolicyData = (event) => {
    const policyData = policies.items.find((policy) => policy.xbPolicyID === Number(event.target.value));
    dispatch(
      claimsPolicyData({
        ...policyData,
        xbPolicyID: event.target.value,
        searchTerm,
      })
    );
    setConfirm(true);
  };

  const handleSearch = ({ search, filters }) => {
    if (search) {
      setSearchTerm(search);
      dispatch(
        getPolicies({
          requestType: searchTypeCall,
          term: search,
          direction: 'desc',
          searchBy,
        })
      );
      dispatch(
        getPolicies({
          requestType: filterTypeCall,
          term: search,
          direction: 'desc',
          searchBy,
          filterTerm: filters,
        })
      );
    }
  };

  const handleSearchFilter = ({ search, filters }) => {
    dispatch(
      getPolicies({
        requestType: searchTypeCall,
        term: search,
        direction: 'desc',
        searchBy,
        filterTerm: filters,
      })
    );
    dispatch(
      getPolicies({
        requestType: filterTypeCall,
        term: search,
        direction: 'desc',
        searchBy,
        filterTerm: filters,
      })
    );
  };

  const onResetFilter = () => {
    reset();
    dispatch(
      getPolicies({
        requestType: searchTypeCall,
        filterTerm: [],
        searchBy,
      })
    );
  };

  const onResetSearch = () => {
    setSearchTerm('');
  };

  const handleChangePage = (newPage) => {
    dispatch(
      getPolicies({
        requestType: searchTypeCall,
        term: searchTerm,
        page: newPage,
        direction: 'desc',
        searchBy,
      })
    );
  };

  const handleChangeRowsPerPage = (rowsPerPage) => {
   dispatch(
      getPolicies({
        requestType: searchTypeCall,
        term: searchTerm,
        size: rowsPerPage,
        direction: 'desc',
        searchBy,
      })
    );
  };

  const handleSort = (by, dir) => {
    getPolicies({
      requestType: searchTypeCall,
      term: searchTerm,
      sortBy: by,
      direction: dir,
      searchBy,
    });
  };

  return (
    <ClaimsSelectPolicyView
      columnsArray={columnsArray}
      rows={policies?.items || []}
      policyData={policyData}
      sort={{
        ...policies.sort,
        type: 'id',
      }}
      pagination={{
        page: policies.page,
        rowsTotal: policies.itemsTotal,
        rowsPerPage: policies.pageSize,
      }}
      tableFilterFields={tableFilterFields}
      isFetchingFilters={isFetchingFilters}
      viewFields={viewFields}
      viewControl={viewControl}
      handlers={{
        handleSort,
        handleSearch,
        handleSearchFilter,
        onResetFilter,
        onResetSearch,
        handlePolicyData,
        handleChangePage,
        handleChangeRowsPerPage,
        columnProps,
        toggleColumn,
        onSelectSearchBy,
      }}
    />
  );
}
