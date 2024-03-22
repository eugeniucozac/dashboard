import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';

// app
import { ClaimsComplexityInsuredView } from './ClaimsComplexityInsured.view';
import { Translate } from 'components';
import {
  selectComplexityInsured,
  showModal,
  hideModal,
  getComplexityInsured,
  selectComplexityInsuredAdded,
  removeComplexityInsured,
} from 'stores';
import * as utils from 'utils';

ClaimsComplexityInsured.propTypes = {
  setIsSelectedTabDirty: PropTypes.func.isRequired,
};

export default function ClaimsComplexityInsured({ setIsSelectedTabDirty }) {
  const dispatch = useDispatch();
  const complexityInsured = useSelector(selectComplexityInsured);
  const complexityInsuredAdded = useSelector(selectComplexityInsuredAdded);
  const [searchTerm, setSearchTerm] = useState('');
  const [resetKey, setResetKey] = useState();

  const addInsured = () => {
    dispatch(
      showModal({
        component: 'COMPLEXITY_MANAGEMENT_INSURED',
        props: {
          title: utils.string.t('claims.complexityRulesManagementDetails.complexityInsured'),
          fullWidth: true,
          maxWidth: 'sm',
          disableAutoFocus: true,
          disable: false,
          hideCompOnBlur: false,

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

  const removeInsured = (insured) => {
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
              await dispatch(removeComplexityInsured(insured));
              await dispatch(getComplexityInsured({ size: 5, page: 0, term: '', sortBy: '', direction: '' }));
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
    { id: 'insured', label: <Translate label="Insured" />, sort: { type: '', direction: 'asc' } },
  ];

  const handleReset = () => {
    setSearchTerm('');
    setResetKey(moment().format());
    dispatch(getComplexityInsured({ size: 5, page: 0, term: '', sortBy: '', direction: '' }));
  };

  const handleSearch = (query) => {
    setSearchTerm(query);
    return dispatch(getComplexityInsured({ term: query }));
  };

  const handleChangePage = (newPage) => {
    dispatch(getComplexityInsured({ page: newPage, term: searchTerm, sortBy: '', direction: '' }));
  };

  const handleChangeRowsPerPage = (rowsPerPage) => {
    dispatch(getComplexityInsured({ size: rowsPerPage, term: searchTerm, sortBy: '', direction: '' }));
  };

  const handleSort = (by, dir) => {
    dispatch(getComplexityInsured({ sortBy: by, direction: dir.toUpperCase(), term: searchTerm }));
  };

  useEffect(
    () => {
      dispatch(getComplexityInsured({ size: 5, page: 0, term: '', sortBy: '', direction: '' }));
    },
    [complexityInsuredAdded] // eslint-disable-line react-hooks/exhaustive-deps
  );

  return (
    <ClaimsComplexityInsuredView
      cols={columns}
      rows={complexityInsured?.items}
      sort={{
        ...complexityInsured.sort,
        type: 'insured',
      }}
      pagination={{
        page: complexityInsured.page,
        rowsTotal: complexityInsured.itemsTotal,
        rowsPerPage: complexityInsured.pageSize,
      }}
      handleSort={handleSort}
      handleSearch={handleSearch}
      handleReset={handleReset}
      handleChangePage={handleChangePage}
      handleChangeRowsPerPage={handleChangeRowsPerPage}
      addInsured={addInsured}
      removeInsured={removeInsured}
      setIsSelectedTabDirty={setIsSelectedTabDirty}
      resetKey={resetKey}
    />
  );
}
