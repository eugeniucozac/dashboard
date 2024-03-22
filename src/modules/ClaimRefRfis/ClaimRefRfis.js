import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';

// app
import ClaimRefRfisView from './ClaimRefRfis.view';
import {
  selectClaimRfisSort,
  selectClaimRefRfiPagination,
  getClaimRfis,
  resetClaimRfis,
  selectClaimRefRfis,
  selectClaimRefRfiFilters,
  selectClaimsProcessingTasksSelected,
  getPriorityLevels,
  selectPriorities,
} from 'stores';
import { MultiSelect } from 'components';
import { useFlexiColumns, useSort, usePagination } from 'hooks';
import * as utils from 'utils';
import config from 'config';

ClaimRefRfis.propTypes = {
  claim: PropTypes.object.isRequired,
};

export default function ClaimRefRfis({ claim }) {
  const dispatch = useDispatch();

  const { claimRef, claimID } = claim;
  const history = useHistory();

  const claimRfis = useSelector(selectClaimRefRfis);
  const claimRfisFilters = useSelector(selectClaimRefRfiFilters);
  const claimRfisSort = useSelector(selectClaimRfisSort);
  const claimRfisPagination = useSelector(selectClaimRefRfiPagination);
  const prioritiesList = useSelector(selectPriorities);

  const [searchText, setSearchText] = useState('');
  const [resetKey, setResetKey] = useState();
  useEffect(() => {
    if (claimID) {
      dispatch(getClaimRfis({ claimID }));
    } // eslint-disable-line react-hooks/exhaustive-deps

    // cleanup
    return () => {
      dispatch(resetClaimRfis());
    };
  }, [claimRef]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (utils.generic.isInvalidOrEmptyArray(prioritiesList)) dispatch(getPriorityLevels());
  }, [dispatch, prioritiesList]);

  const cols = [
    {
      id: 'queryId',
      visible: true,
      label: utils.string.t('claims.rfis.columns.queryID'),
    },
    {
      id: 'rfiSentTo',
      visible: true,
      label: utils.string.t('claims.rfis.columns.to'),
    },
    {
      id: 'queryCode',
      visible: true,
      label: utils.string.t('claims.rfis.columns.queryCode'),
    },
    {
      id: 'queryCreatedOn',
      sort: { type: 'date', direction: 'asc' },
      visible: true,
      label: utils.string.t('claims.rfis.columns.dateOfQuery'),
    },
    {
      id: 'targetDueDate',
      sort: { type: 'date', direction: 'asc' },
      visible: true,
      label: utils.string.t('claims.rfis.columns.targetDueDate'),
    },
    {
      id: 'priority',
      visible: true,
      sort: { type: 'lexical', direction: 'asc' },
      label: utils.string.t('claims.rfis.columns.priority'),
    },
    {
      id: 'status',
      sort: { type: 'lexical', direction: 'asc' },
      visible: true,
      label: utils.string.t('claims.rfis.columns.status'),
    },
    {
      id: 'description',
      visible: true,
      label: utils.string.t('claims.rfis.columns.description'),
    },
  ];

  const filtersArray = [
    {
      id: 'queryCode',
      type: 'multiSelect',
      label: utils.string.t('claims.rfis.columns.queryCode'),
      value: [],
      options: claimRfisFilters?.queryCode || [],
      content: <MultiSelect id="queryCode" search options={claimRfisFilters?.queryCode || []} />,
    },
    {
      id: 'status',
      type: 'multiSelect',
      label: utils.string.t('claims.rfis.columns.status'),
      value: [],
      options: claimRfisFilters?.status || [],
      content: <MultiSelect id="status" search options={claimRfisFilters?.status || []} />,
    },
  ];

  const searchSubmit = ({ search }) => {
    setResetKey(new Date().getTime());
    setSearchText(search);
    dispatch(getClaimRfis({ claimID, query: search }));
  };

  const filterSearchSubmit = ({ search, filters }) => {
    dispatch(getClaimRfis({ claimID, query: search, filters }));
  };

  const resetSubmit = () => {
    dispatch(getClaimRfis({ claimID, filters: {} }));
  };

  const sortColumn = (by, dir) => {
    dispatch(getClaimRfis({ claimID, sortBy: by, direction: dir, query: searchText }));
  };

  const changePage = (newPage) => {
    dispatch(getClaimRfis({ claimID, page: newPage, query: searchText }));
  };

  const changeRowsPerPage = (rowsPerPage) => {
    dispatch(getClaimRfis({ claimID, size: rowsPerPage, query: searchText }));
  };

  const clickRfiTask = (rfi) => {
    const selectedTask = {
      assigneeFullName: rfi?.assigeeFullName,
      createdOn: claim?.createdDate,
      description: rfi?.description,
      targetDueDate: rfi?.targetDueDate,
      taskRef: rfi?.queryId,
      taskId: rfi?.bpmTaskId,
      processDefKey: rfi?.processId,
      processRef: claim?.claimRef,
      policyRef: claim?.policyRef,
      queryCode: rfi?.queryCode,
      businessProcessID: rfi?.businessProcessID,
      sourceID: rfi?.sourceID,
      policyId: rfi?.policyId,
      insured: claim?.assured,
      lossDetails: claim?.lossDetails,
      lossFromDate: claim?.lossFromDate,
      lossToDate: claim?.lossToDate,
      lossDetailID: claim?.lossDetailID,
      lossRef: claim?.lossRef,
      caseIncidentID: claim?.caseIncidentID,
      requestedByFullName: rfi?.requestedByFullName,
      requestedBy: rfi?.requestedBy,
      rfiSentTo: rfi?.rfiSentTo,
      departmentID: claim?.divisionID,
      status: rfi?.status
    };
    dispatch(selectClaimsProcessingTasksSelected(selectedTask));
    rfi?.queryId && history.push(`${config.routes.claimsProcessing.rfi}/${rfi.queryId}`);
  };

  const { columns: columnsArray, columnProps } = useFlexiColumns(cols);
  const { cols: colsSorted, sort } = useSort(columnsArray, claimRfisSort, sortColumn);
  const pagination = usePagination(claimRfis, claimRfisPagination, changePage, changeRowsPerPage);

  return (
    <ClaimRefRfisView
      rfis={claimRfis}
      cols={colsSorted}
      sort={sort}
      pagination={pagination}
      columnProps={columnProps}
      filtersArray={filtersArray}
      prioritiesList={prioritiesList}
      resetKey={resetKey}
      handlers={{
        searchSubmit,
        filterSearchSubmit,
        resetSubmit,
        clickRfiTask,
      }}
    />
  );
}
