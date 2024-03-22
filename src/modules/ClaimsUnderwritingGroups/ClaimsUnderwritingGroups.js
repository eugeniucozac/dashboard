import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

//app
import { ClaimsUnderwritingGroupsView } from './ClaimsUnderwritingGroups.view';
import { getUnderwritingGroupsBySection, selectClaimsUnderwritingGroups, selectSectionEnabledUG, sortingUnderwritingGroups } from 'stores';
import * as utils from 'utils';
import { useFlexiColumns, useSort, usePagination } from 'hooks';
import * as constants from 'consts';

ClaimsUnderwritingGroups.prototypes = {
  fields: PropTypes.array.isRequired,
  claimForm: PropTypes.object,
  uwResetKey: PropTypes.number,
  hasClaimRef: PropTypes.bool,
};
export default function ClaimsUnderwritingGroups({ fields, claimForm, uwResetKey, hasClaimRef, selectedPolicyRender }) {
  const dispatch = useDispatch();

  // redux
  const underWritingGroups = useSelector(selectClaimsUnderwritingGroups);
  const isSectionEnabled = useSelector(selectSectionEnabledUG);

  const isUwGroupsLoading = underWritingGroups?.isLoading;
  const facilityKeys = underWritingGroups.items.map((item) => item.id);
  const ugSortData = { ...underWritingGroups.sort, type: 'numeric' };

  // state
  const [tableGridData, setTableGridData] = useState(underWritingGroups?.items || []);
  const [newPage, setNewPage] = useState(constants.DMS_PAGINATION_DEFAULT_PAGE);
  const [rowsPerPage, setRowsPerPage] = useState(constants.DMS_DEFAULT_ROWS_PER_PAGE);

  useEffect(() => {
    if (selectedPolicyRender !== '') {
      if (hasClaimRef) {
        utils.generic.isInvalidOrEmptyArray(underWritingGroups?.items) && dispatch(getUnderwritingGroupsBySection());
      } else {
        dispatch(getUnderwritingGroupsBySection({ viewLoader: false }));
      }
    }
  }, [uwResetKey]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setTableGridData(underWritingGroups?.items?.slice(newPage * rowsPerPage, newPage * rowsPerPage + rowsPerPage));
  }, [newPage, rowsPerPage, underWritingGroups]);

  const handleSort = (by, dir) => {
    dispatch(getUnderwritingGroupsBySection({ sortBy: by, direction: dir.toUpperCase() }));
  };

  const handleChangePage = (newPage) => {
    setNewPage(newPage);
  };

  const handleChangeRowsPerPage = (rowsPerPage) => {
    setNewPage(0);
    setRowsPerPage(rowsPerPage);
  };

  const columns = [
    { id: 'id', empty: true, visible: true },
    {
      id: 'groupRef',
      label: utils.string.t('claims.underWritingGroups.groupRef'),
      sort: { type: 'lexical', direction: 'asc' },
      visible: true,
    },
    { id: 'percentage', label: utils.string.t('claims.underWritingGroups.percentage'), visible: true },
    { id: 'facility', label: utils.string.t('claims.underWritingGroups.facility'), visible: true },
    { id: 'facilityRef', label: utils.string.t('claims.underWritingGroups.facilityRef'), visible: true },
    { id: 'slipLeader', label: utils.string.t('claims.underWritingGroups.slipLeader'), visible: true },
    { id: 'ucr', label: utils.string.t('claims.underWritingGroups.ucr'), visible: true },
    { id: 'narrative', label: utils.string.t('claims.underWritingGroups.narrative'), visible: true },
    {
      id: 'dateValidFrom',
      label: utils.string.t('claims.underWritingGroups.dateValidFrom'),
      sort: { type: 'date', direction: 'asc' },
      visible: true,
    },
    {
      id: 'dateValidTo',
      label: utils.string.t('claims.underWritingGroups.dateValidTo'),
      sort: { type: 'date', direction: 'asc' },
      visible: true,
    },
  ];

  const { columns: columnsArray } = useFlexiColumns(columns);
  const { cols, sort } = useSort(columnsArray, ugSortData, handleSort);
  const pagination = usePagination(
    tableGridData || [],
    {
      page: newPage || constants.DMS_PAGINATION_DEFAULT_PAGE,
      rowsTotal: underWritingGroups?.items?.length || 0,
      rowsPerPage: rowsPerPage,
    },
    handleChangePage,
    handleChangeRowsPerPage
  );

  return (
    <ClaimsUnderwritingGroupsView
      isSectionEnabled={isSectionEnabled}
      claimFields={fields}
      claimForm={claimForm}
      uwResetKey={uwResetKey}
      tableGridData={tableGridData}
      underWritingGroups={underWritingGroups}
      sortingUnderwritingGroups={sortingUnderwritingGroups}
      cols={cols}
      sort={sort}
      pagination={pagination}
      handleSort={handleSort}
      facilityKeys={facilityKeys}
      isUwGroupsLoading={isUwGroupsLoading}
    />
  );
}
