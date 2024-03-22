import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import moment from 'moment';

//app
import { Translate } from 'components';
import { ComplexityManagementAddPolicyView } from './ComplexityManagementAddPolicy.view';

import {
  getComplexityPolicies,
  selectComplexityPolicies,
  checkedPolicyDetails,
  selectedCheckedComplexPolicies,
  postSaveComplexityAddPolicy,
  resetComplexityPolicies,
  hideModal,
} from 'stores';

export default function ComplexityManagementAddPolicy() {
  const dispatch = useDispatch();
  const { control, register, watch } = useForm();
  const complexityPolicies = useSelector(selectComplexityPolicies);
  const selectedPoliciesData = useSelector(selectedCheckedComplexPolicies);
  const [searchTerm, setSearchTerm] = useState('');
  const [resetKey, setResetKey] = useState();

  const selectedPolicyItemsHandler = (id, checkedType, policy) => {
    dispatch(checkedPolicyDetails({ id, checkedType, policy }));
  };

  const enableDisableFlag = (field) => selectedPoliciesData?.some((item) => item.id === field && item.checkedType);

  const postSaveComplexPolicyHandler = () => {
    dispatch(postSaveComplexityAddPolicy());
    dispatch(hideModal());
  };

  const columns = [
    { id: 'actions', empty: true, narrow: true },
    { id: 'policyRef', label: <Translate label="Contract/Policy Ref" />, nowrap: true, sort: { type: '', direction: 'asc' } },
    { id: 'policyType', label: <Translate label="Policy Type" />, nowrap: true, sort: { type: '', direction: 'asc' } },
    { id: 'insured', label: <Translate label="Insured" />, nowrap: true, sort: { type: '', direction: 'asc' } },
    { id: 'claimant', label: <Translate label="Claimant" />, nowrap: true, sort: { type: '', direction: 'asc' } },
    { id: 'riskDetails', label: <Translate label="Risk Details" />, nowrap: true, sort: { type: '', direction: 'asc' } },
    { id: 'inceptionDate', label: <Translate label="Inception Date" />, nowrap: true, sort: { type: '', direction: 'asc' } },
    { id: 'expiryDate', label: <Translate label="Expiry Date" />, nowrap: true, sort: { type: '', direction: 'asc' } },
    { id: 'company', label: <Translate label="Company" />, nowrap: true, sort: { type: '', direction: 'asc' } },
    { id: 'division', label: <Translate label="Division" />, nowrap: true, sort: { type: '', direction: 'asc' } },
  ];

  const handleReset = () => {
    setSearchTerm('');
    setResetKey(moment().format());
  };

  const handleSearch = (query) => {
    setSearchTerm(query);
    dispatch(getComplexityPolicies({ term: query }));
  };

  const handleChangePage = (newPage) => {
    dispatch(getComplexityPolicies({ page: newPage, term: searchTerm }));
  };

  const handleChangeRowsPerPage = (rowsPerPage) => {
    dispatch(getComplexityPolicies({ size: rowsPerPage, term: searchTerm }));
  };

  const handleSort = (by, dir) => {
    dispatch(getComplexityPolicies({ sortBy: by, direction: dir.toUpperCase(), term: searchTerm }));
  };
  useEffect(
    () => {
      // cleanup
      return () => {
        dispatch(resetComplexityPolicies());
      };
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );
  return (
    <ComplexityManagementAddPolicyView
      cols={columns}
      rows={complexityPolicies}
      pagination={{
        page: complexityPolicies.page,
        rowsTotal: complexityPolicies.itemsTotal,
        rowsPerPage: complexityPolicies.pageSize,
      }}
      handleSort={handleSort}
      handleSearch={handleSearch}
      handleReset={handleReset}
      handleChangePage={handleChangePage}
      handleChangeRowsPerPage={handleChangeRowsPerPage}
      control={control}
      register={register}
      watch={watch}
      complexityFlag={true}
      selectedPolicyItemsHandler={selectedPolicyItemsHandler}
      postSaveComplexPolicyHandler={postSaveComplexPolicyHandler}
      enableDisableFlag={enableDisableFlag}
      selectedPoliciesData={selectedPoliciesData}
      resetKey={resetKey}
    />
  );
}
