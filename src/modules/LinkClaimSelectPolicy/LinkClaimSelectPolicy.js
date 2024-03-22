import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

//app
import { LinkClaimSelectPolicyView } from './LinkClaimSelectPolicy.view';
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
  selectClaimsInformation,
  resetLinkPolicyDocDetails,
  getLinkPoliciesData,
  selectLinkPoliciesData,
  selectorDmsViewFiles,
  selectDmsDocDetails,
  getViewTableDocuments,
  getPolicyInformation,
  getLossInformation,
  getClaimsPreviewInformation,
  setClaimData,
} from 'stores';
import * as constants from 'consts';
import { MultiSelect, FormDate } from 'components';

LinkClaimSelectPolicy.propTypes = {
  setConfirm: PropTypes.func.isRequired,
};

export default function LinkClaimSelectPolicy({
  confirm,
  validation,
  setValidation,
  setConfirm,
  hasPolicyRef,
  formEditedStatus,
  setActiveStep,
  index,
  isFormsEdited,
  setFormEditedStatus,
  saveStatus,
  sectionEnabledValidationFlag,
  policyInformation,
  handleFormStatus,
  claimProperties,
}) {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPolicy, setSelectedPolicy] = useState(false);
  const [selectedPolicyRender, setSelectedPolicyRender] = useState('');
  const policyData = useSelector(selectClaimsPolicyData);
  const policies = useSelector(selectPolicies);
  const claimInfo = useSelector(selectClaimsInformation);
  const linkPoliciesData = useSelector(selectLinkPoliciesData);
  const isTableLoading = policies?.isloadingTable;
  const [selectNextPolicy, setSelectNextPolicy] = useState(false);
  const [selectedPolicyData, setSelectedPolicyData] = useState({});

  const viewDocumentList = useSelector(selectorDmsViewFiles);
  const savedDmsDocList = useSelector(selectDmsDocDetails);
  const docList = viewDocumentList?.length > 0 ? viewDocumentList : savedDmsDocList?.linkPolicyDocDetails;
  const claimObjFromUrl = claimProperties?.claimObj || {};

  useEffect(() => {
    if (claimObjFromUrl?.claimReference) {
      dispatch(getLinkPoliciesData({ searchBy: constants.CLAIMS_POLICY_SEARCH_OPTION.policyRef, searchTerm: claimObjFromUrl?.policyRef }));
      dispatch(
        getPolicies({
          requestType: searchTypeCall,
          term: claimObjFromUrl?.policyRef,
          direction: 'desc',
          searchBy: constants.CLAIMS_POLICY_SEARCH_OPTION.policyRef,
          viewLoader: false,
        })
      ).then((res) => {
        if (res?.status === 'OK') {
          const policyData = res?.data?.searchValue || {};
          dispatch(getLinkPoliciesData({ fieldLoader: true }));
          dispatch(
            claimsPolicyData({
              ...policyData[0],
              xbPolicyID: policyData[0]?.xbPolicyID,
              term: claimObjFromUrl?.policyRef,
            })
          );
          dispatch(
            setClaimData({
              claimId: claimObjFromUrl?.claimId,
              policyRef: claimObjFromUrl?.policyRef,
              policyNumber: policyData?.policyRef,
              xbInstanceID: policyData?.xbInstanceID,
              xbPolicyID: policyData?.xbPolicyID,
              divisionID: claimObjFromUrl?.divisionId,
              sourceID: claimObjFromUrl?.sourceId,
              claimReference: claimObjFromUrl?.claimReference,
            })
          );
          setSelectedPolicyRender(new Date().getTime());
          dispatch(getPolicyInformation());
          utils.dms.resetDmsFiles(dispatch);
          dispatch(resetLinkPolicyDocDetails());
          setSelectedPolicyData(policyData[0]);
          setConfirm(true);
        }
      });
      dispatch(
        getClaimsPreviewInformation({
          claimId: claimObjFromUrl?.claimId,
          claimRefParams: claimObjFromUrl?.claimReference,
          sourceIdParams: claimObjFromUrl?.sourceId,
          divisionIDParams: claimObjFromUrl?.divisionId,
          viewLoader: false,
        })
      ).then((res) => {
        if (utils.generic.isValidObject(res)) {
          dispatch(getLossInformation({ lossDetailsId: res?.lossDetailID, viewLoader: false }));
        }
      });
    }
  }, [claimObjFromUrl?.claimReference]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (policies?.items?.length > 0 && policyData?.xbPolicyID && linkPoliciesData?.searchBy === '' && linkPoliciesData?.searchTerm === '') {
      const isPolicyExist = policies.items.some((policy) => policy.xbPolicyID === Number(policyData.xbPolicyID));
      setConfirm(isPolicyExist);
    }
  }, [policies]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (linkPoliciesData?.searchBy === '' && linkPoliciesData?.searchTerm === '') {
      dispatch(resetUnderwritingGroups());
      dispatch(sortingUnderwritingGroups([]));
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }
  }, [dispatch, linkPoliciesData?.searchBy, linkPoliciesData?.searchTerm]);

  useEffect(() => {
    const policyRef = selectedPolicyData?.policyNumber;
    if (policyRef && utils.generic.isInvalidOrEmptyArray(docList)) {
      getViewTableDocuments({
        referenceId: policyRef,
        sectionType: constants.DMS_CONTEXT_POLICY,
        documentTypeKey: constants.DMS_DOCUMENT_TYPE_SECTION_KEYS.claim,
      });
    }
  }, [selectedPolicyData]); // eslint-disable-line react-hooks/exhaustive-deps

  const isFetchingFilters = useSelector(selectPoliciesFilterLoading);
  const [searchBy, setSearchBy] = useState(linkPoliciesData?.searchBy || constants.CLAIMS_POLICY_SEARCH_OPTION.clientName);
  const [searchByText, setSearchByText] = useState(utils.string.t('claims.searchPolicy.searchByOptions.ClientName'));
  const searchTypeCall = constants.CLAIM_POLICY_SEARCH_REQ_TYPES.search;
  const filterTypeCall = constants.CLAIM_POLICY_SEARCH_REQ_TYPES.filter;
  const selectOptions = [
    { label: utils.string.t('claims.searchPolicy.searchByOptions.ClientName'), value: constants.CLAIMS_POLICY_SEARCH_OPTION.clientName },
    { label: utils.string.t('claims.searchPolicy.searchByOptions.PolicyRef'), value: constants.CLAIMS_POLICY_SEARCH_OPTION.policyRef },
    { label: utils.string.t('claims.searchPolicy.searchByOptions.Insured'), value: constants.CLAIMS_POLICY_SEARCH_OPTION.insured },
    { label: utils.string.t('claims.searchPolicy.searchByOptions.RiskDetails'), value: constants.CLAIMS_POLICY_SEARCH_OPTION.riskDetails },
    { label: utils.string.t('claims.searchPolicy.searchByOptions.Umr'), value: constants.CLAIMS_POLICY_SEARCH_OPTION.umr },
    { label: utils.string.t('claims.searchPolicy.searchByOptions.Reinsured'), value: constants.CLAIMS_POLICY_SEARCH_OPTION.reinsured },
    { label: utils.string.t('claims.searchPolicy.searchByOptions.Coverholder'), value: constants.CLAIMS_POLICY_SEARCH_OPTION.coverholder },
  ];

  const defaultFormFields = [
    { name: 'inceptionDate', type: 'datepicker', value: null },
    { name: 'expiryDate', type: 'datepicker', value: null },
  ];
  const defaultValues = utils.form.getInitialValues(defaultFormFields);
  const { control, reset } = useForm({ defaultValues });
  const viewFields = [
    {
      name: 'searchBy',
      label: utils.string.t('claims.searchByClaims.label'),
      type: 'select',
      options: selectOptions,
      value: constants.CLAIMS_POLICY_SEARCH_OPTION.clientName || linkPoliciesData?.searchBy,
      defaultValue: constants.CLAIMS_POLICY_SEARCH_OPTION.clientName || linkPoliciesData?.searchBy,
      validation: Yup.string().required(utils.string.t('validation.required')),
      muiComponentProps: {
        inputProps: {
          title: searchByText || '',
        },
      },
    },
  ];
  const viewDefaultValues = utils.form.getInitialValues(viewFields);
  const viewValidationSchema = utils.form.getValidationSchema(viewFields);
  const { control: viewControl, watch } = useForm({
    viewDefaultValues,
    ...(viewValidationSchema && { resolver: yupResolver(viewValidationSchema) }),
  });
  const searchByWatcher = watch('searchBy');
  const tableFilterFields = [
    {
      id: 'policyStatus',
      type: 'multiSelect',
      label: utils.string.t('claims.searchPolicy.columns.policyStatus'),
      placeholder: utils.string.t('claims.filterPlaceHolderText'),
      value: [],
      options: policies.filters?.policyStatus || [],
      content: <MultiSelect id="policyStatus" search options={policies.filters?.policyStatus || []} />,
    },
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
      id: 'coverHolder',
      type: 'multiSelect',
      label: utils.string.t('claims.searchPolicy.columns.coverHolder'),
      placeholder: utils.string.t('claims.filterPlaceHolderText'),
      value: [],
      options: policies.filters?.coverHolder || [],
      content: <MultiSelect id="coverHolder" search options={policies.filters?.coverHolder || []} />,
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
      id: 'company',
      type: 'multiSelect',
      label: utils.string.t('claims.searchPolicy.columns.company'),
      placeholder: utils.string.t('claims.filterPlaceHolderText'),
      value: [],
      options: policies.filters?.company || [],
      content: <MultiSelect id="company" search options={policies.filters?.company || []} />,
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
      id: 'businessTypeCode',
      type: 'multiSelect',
      label: utils.string.t('claims.searchPolicy.columns.businessTypeCode'),
      placeholder: utils.string.t('claims.filterPlaceHolderText'),
      value: [],
      options: policies.filters?.businessTypeCode || [],
      content: <MultiSelect id="businessTypeCode" search options={policies.filters?.businessTypeCode || []} />,
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
      id: 'umr',
      label: utils.string.t('claims.searchPolicy.columns.umr'),
      sort: { type: '', direction: 'asc' },
      nowrap: true,
      visible: false,
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
      id: 'coverHolder',
      label: utils.string.t('claims.searchPolicy.columns.coverHolder'),
      sort: { type: '', direction: 'asc' },
      nowrap: true,
      visible: false,
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
      visible: false,
      mandatory: false,
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
    {
      id: 'businessTypeCode',
      label: utils.string.t('claims.searchPolicy.columns.businessTypeCode'),
      sort: { type: '', direction: 'asc' },
      nowrap: true,
      visible: false,
      mandatory: false,
    },
  ];

  const { columns: columnsArray, columnProps, toggleColumn } = useFlexiColumns(columns);

  const onSelectSearchBy = (searchByValue) => {
    setSearchByText(selectOptions?.find((item) => item?.value === searchByValue)?.label);
    setSearchBy(searchByValue);
    dispatch(getLinkPoliciesData({ searchBy: searchByValue }));
  };

  const handlePolicyData = (event) => {
    const policyData = policies.items.find((policy) => policy.xbPolicyID === Number(event.target.value));
    utils.dms.resetDmsFiles(dispatch);
    setSelectedPolicyData(policyData);
    dispatch(getLinkPoliciesData({ fieldLoader: true }));
    dispatch(
      claimsPolicyData({
        ...policyData,
        xbPolicyID: event.target.value,
        searchTerm,
      })
    );
    dispatch(getPolicyInformation());
    dispatch(resetLinkPolicyDocDetails());
    setConfirm(true);
    setSelectedPolicy(true);
    setSelectedPolicyRender(new Date().getTime());
  };

  const handleSearch = ({ search, filters }) => {
    if (search) {
      setSearchTerm(search);
      if (search !== linkPoliciesData?.searchTerm) {
        dispatch(getLinkPoliciesData({ searchTerm: search }));
        dispatch(
          getPolicies({
            requestType: searchTypeCall,
            term: search,
            direction: 'desc',
            searchBy,
            viewLoader: false,
          })
        );
        dispatch(
          getPolicies({
            requestType: filterTypeCall,
            term: search,
            direction: 'desc',
            searchBy,
            filterTerm: filters,
            viewLoader: false,
          })
        );
      }
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
        viewLoader: false,
      })
    );
    dispatch(
      getPolicies({
        requestType: filterTypeCall,
        term: search,
        direction: 'desc',
        searchBy,
        filterTerm: filters,
        viewLoader: false,
      })
    );
  };

  const onResetFilter = () => {
    reset();
    dispatch(
      getPolicies({
        requestType: searchTypeCall,
        term: searchTerm,
        filterTerm: [],
        searchBy,
        viewLoader: false,
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
        viewLoader: false,
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
        viewLoader: false,
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
      viewLoader: false,
    });
  };

  return (
    <LinkClaimSelectPolicyView
      columnsArray={columnsArray}
      rows={policies?.items || []}
      policyData={policyData}
      selectedPolicy={selectedPolicy}
      selectedPolicyRender={selectedPolicyRender}
      setSelectedPolicyRender={setSelectedPolicyRender}
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
      searchByTerm={searchByWatcher?.value}
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
      formEditedStatus={formEditedStatus}
      hasPolicyRef={hasPolicyRef}
      confirm={confirm}
      validation={validation}
      setValidation={setValidation}
      setActiveStep={setActiveStep}
      index={index}
      isFormsEdited={isFormsEdited}
      setFormEditedStatus={setFormEditedStatus}
      saveStatus={saveStatus}
      sectionEnabledValidationFlag={sectionEnabledValidationFlag}
      policyInformation={policyInformation}
      claimInfo={claimInfo}
      handleFormStatus={handleFormStatus}
      isTableLoading={isTableLoading}
      selectNextPolicy={selectNextPolicy}
      setSelectNextPolicy={setSelectNextPolicy}
    />
  );
}
