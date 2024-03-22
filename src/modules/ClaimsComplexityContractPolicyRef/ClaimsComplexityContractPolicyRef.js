import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';

// app
import { ClaimsComplexityContractPolicyRefView } from './ClaimsComplexityContractPolicyRef.view';
import {
  selectComplexityPoliciesFlagged,
  hideModal,
  getComplexityPoliciesFlagged,
  selectComplexityPoliciesAdded,
  removeComplexityPolicy,
  showModal,
} from 'stores';
import * as utils from 'utils';

ClaimsComplexityContractPolicyRef.propTypes = {
  setIsSelectedTabDirty: PropTypes.func.isRequired,
};

export default function ClaimsComplexityContractPolicyRef({ setIsSelectedTabDirty }) {
  const dispatch = useDispatch();
  const complexityPoliciesFlagged = useSelector(selectComplexityPoliciesFlagged);
  const complexityPoliciesAdded = useSelector(selectComplexityPoliciesAdded);
  const [searchTerm, setSearchTerm] = useState('');
  const [resetKey, setResetKey] = useState();

  const addPolicy = () => {
    dispatch(
      showModal({
        component: 'COMPLEXITY_MANAGEMENT_ADD_POLICY',
        props: {
          title: utils.string.t('claims.complexityRulesManagementDetails.selectPolicy'),
          fullWidth: true,
          hideCompOnBlur: false,
          maxWidth: 'xl',
          disableAutoFocus: true,
          disable: false,
          componentProps: {
            clickOutSideHandler: () => clickOutSideHandler(),
          },
        },
      })
    );
  };

  const clickOutSideHandler = () => {
    dispatch(
      showModal({
        component: 'CONFIRM',
        props: {
          title: utils.string.t('status.alert'),
          hint: utils.string.t('navigation.title'),
          fullWidth: true,
          maxWidth: 'xs',
          componentProps: {
            cancelLabel: utils.string.t('app.no'),
            confirmLabel: utils.string.t('app.yes'),
            submitHandler: () => {
              dispatch(hideModal());
            },
          },
        },
      })
    );
  };

  const removingPolicy = (selectedPolicies) => {
    dispatch(
      showModal({
        component: 'CONFIRM',
        props: {
          title: utils.string.t('status.alert'),
          subtitle: utils.string.t('claims.modals.confirmInsured.title'),
          fullWidth: true,
          maxWidth: 'sm',
          componentProps: {
            cancelLabel: utils.string.t('app.no'),
            confirmLabel: utils.string.t('app.yes'),
            submitHandler: async () => {
              await dispatch(removeComplexityPolicy(selectedPolicies));
              await dispatch(getComplexityPoliciesFlagged({ term: null, sortBy: '', direction: '' }));
            },
            cancelHandler: () => {
              dispatch(hideModal());
            },
          },
        },
      })
    );
  };

  const columns = [
    { id: 'actions', empty: true },
    {
      id: 'policyNumber',
      label: utils.string.t('claims.complexityContractPolicy.tableColumns.contractOrPolicyRef'),
      sort: { type: 'lexical', direction: 'asc' },
    },
    {
      id: 'policyType',
      label: utils.string.t('claims.complexityContractPolicy.tableColumns.policyType'),
      sort: { type: 'lexical', direction: 'asc' },
    },
    {
      id: 'insured',
      label: utils.string.t('claims.complexityContractPolicy.tableColumns.insured'),
      sort: { type: 'lexical', direction: 'asc' },
    },
    {
      id: 'claimant',
      label: utils.string.t('claims.complexityContractPolicy.tableColumns.claimant'),
      sort: { type: 'lexical', direction: 'asc' },
    },
    {
      id: 'riskDetails',
      label: utils.string.t('claims.complexityContractPolicy.tableColumns.riskDetails'),
      sort: { type: 'lexical', direction: 'asc' },
    },
    {
      id: 'inceptionDate',
      label: utils.string.t('claims.complexityContractPolicy.tableColumns.inceptionDate'),
      sort: { type: 'date', direction: 'asc' },
    },
    {
      id: 'expiryDate',
      label: utils.string.t('claims.complexityContractPolicy.tableColumns.expiryDate'),
      sort: { type: 'date', direction: 'asc' },
    },
    {
      id: 'company',
      label: utils.string.t('claims.complexityContractPolicy.tableColumns.company'),
      sort: { type: 'lexical', direction: 'asc' },
    },
    {
      id: 'division',
      label: utils.string.t('claims.complexityContractPolicy.tableColumns.division'),
      sort: { type: 'lexical', direction: 'asc' },
    },
  ];

  const handleReset = () => {
    setSearchTerm('');
    setResetKey(moment().format());
    dispatch(getComplexityPoliciesFlagged({ term: null, sortBy: '', direction: '' }));
  };

  const handleSearch = (query) => {
    setSearchTerm(query);
    return dispatch(getComplexityPoliciesFlagged({ term: query }));
  };

  const handleChangePage = (newPage) => {
    dispatch(getComplexityPoliciesFlagged({ page: newPage, term: searchTerm, sortBy: '', direction: '' }));
  };

  const handleChangeRowsPerPage = (rowsPerPage) => {
    dispatch(getComplexityPoliciesFlagged({ size: rowsPerPage, term: searchTerm, sortBy: '', direction: '' }));
  };

  const handleSort = (by, dir) => {
    dispatch(getComplexityPoliciesFlagged({ sortBy: by, direction: dir.toUpperCase(), term: searchTerm }));
  };

  useEffect(
    () => {
      dispatch(getComplexityPoliciesFlagged({ term: null, sortBy: '', direction: '' }));
    },
    [complexityPoliciesAdded] // eslint-disable-line react-hooks/exhaustive-deps
  );

  return (
    <ClaimsComplexityContractPolicyRefView
      cols={columns}
      rows={complexityPoliciesFlagged?.items}
      sort={{
        ...complexityPoliciesFlagged.sort,
        type: '',
      }}
      pagination={{
        page: complexityPoliciesFlagged.page,
        rowsTotal: complexityPoliciesFlagged.itemsTotal,
        rowsPerPage: complexityPoliciesFlagged.pageSize,
      }}
      setIsSelectedTabDirty={setIsSelectedTabDirty}
      handlers={{
        handleSort,
        handleSearch,
        handleReset,
        handleChangePage,
        handleChangeRowsPerPage,
        addPolicy,
        removingPolicy,
      }}
      resetKey={resetKey}
    />
  );
}
