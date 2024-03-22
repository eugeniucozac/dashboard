import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import moment from 'moment';

//app
import * as utils from 'utils';

import {
  postSearchInsured,
  selectComplexitySearchClaimsInsured,
  resetPopupClaimsInsured,
  checkedInsuredDetails,
  selectedCheckedComplexInsured,
  postSaveComplexityAddInsured,
  hideModal,
} from 'stores';

import { ComplexManagementInsuredView } from './ComplexManagementInsured.view';

export default function ComplexManagementInsured() {
  const dispatch = useDispatch();
  const claimsPopupInsured = useSelector(selectComplexitySearchClaimsInsured);
  const claimsSelectedInsured = useSelector(selectedCheckedComplexInsured);
  const [searchTerm, setSearchTerm] = useState('');
  const { control, register, watch } = useForm();
  const [resetKey, setResetKey] = useState();

  const handleReset = () => {
    setSearchTerm('');
    setResetKey(moment().format());
  };

  const handleSearch = (query) => {
    setSearchTerm(query);
    return dispatch(postSearchInsured({ term: query }));
  };

  const handleChangePage = (newPage) => {
    dispatch(postSearchInsured({ page: newPage, term: searchTerm }));
  };

  const handleChangeRowsPerPage = (rowsPerPage) => {
    dispatch(postSearchInsured({ size: rowsPerPage, term: searchTerm }));
  };

  const handleSort = (by, dir) => {
    dispatch(postSearchInsured({ sortBy: by, direction: dir.toUpperCase(), term: searchTerm }));
  };

  const selectedInsuredItemsHandler = (id, checkedType, insured) => {
    dispatch(checkedInsuredDetails({ id: id, checkedType: checkedType, insured: insured }));
  };

  const enableDisableFlag = (field) => {
    return claimsSelectedInsured?.some((item) => item.id === field && item.checkedType);
  };

  const postSaveComplexInsuredHandler = () => {
    dispatch(postSaveComplexityAddInsured());
    dispatch(hideModal());
  };

  const columns = [
    { id: 'id', empty: true },
    { id: 'insured', label: utils.string.t('claims.columns.complexInsuredList.insured'), sort: { type: '', direction: 'asc' } },
  ];

  useEffect(
    () => {
      // cleanup
      return () => {
        dispatch(resetPopupClaimsInsured());
      };
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  return (
    <ComplexManagementInsuredView
      columns={columns}
      rows={claimsPopupInsured}
      control={control}
      register={register}
      watch={watch}
      selectedInsuredItemsHandler={selectedInsuredItemsHandler}
      handleReset={handleReset}
      handleSearch={handleSearch}
      handleChangePage={handleChangePage}
      handleChangeRowsPerPage={handleChangeRowsPerPage}
      handleSort={handleSort}
      enableDisableFlag={enableDisableFlag}
      claimsSelectedInsured={claimsSelectedInsured}
      postSaveComplexInsuredHandler={postSaveComplexInsuredHandler}
      resetKey={resetKey}
    />
  );
}
