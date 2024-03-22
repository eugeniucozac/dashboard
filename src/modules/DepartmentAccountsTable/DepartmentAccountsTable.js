import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { firstBy } from 'thenby';

// app
import { DepartmentAccountsTableView } from './DepartmentAccountsTable.view';
import { selectPlacementId, selectRefDataStatusesPlacement } from 'stores';
import { usePagination, useSort } from 'hooks';
import * as utils from 'utils';

DepartmentAccountsTable.propTypes = {
  rows: PropTypes.array.isRequired,
  cols: PropTypes.array.isRequired,
  sort: PropTypes.object.isRequired,
  pagination: PropTypes.object.isRequired,
  handlers: PropTypes.shape({
    handleChangePage: PropTypes.func.isRequired,
    handleChangeRowsPerPage: PropTypes.func.isRequired,
    handleSort: PropTypes.func.isRequired,
    handleClickRow: PropTypes.func,
    handleDoubleClickRow: PropTypes.func,
    handleNtuClick: PropTypes.func,
    handleEditPlacementClick: PropTypes.func,
    handleRemovePlacementClick: PropTypes.func,
  }).isRequired,
};

export default function DepartmentAccountsTable({ rows = [], cols: colsArr, sort: sortObj, pagination: paginationObj, handlers }) {
  const placementSelectedId = useSelector(selectPlacementId);
  const refDataStatusesPlacement = useSelector(selectRefDataStatusesPlacement);

  const { cols, sort } = useSort(colsArr, sortObj, handlers.handleSort);
  const itemsOrdered = rows.sort(firstBy(utils.sort.array(sort.type, sort.by, sort.direction)));

  return (
    <DepartmentAccountsTableView
      items={itemsOrdered}
      cols={cols}
      sort={sort}
      pagination={usePagination(itemsOrdered, paginationObj, handlers.handleChangePage, handlers.handleChangeRowsPerPage)}
      placementId={placementSelectedId}
      placementStatuses={refDataStatusesPlacement}
      handleClickRow={handlers.handleClickRow}
      handleDoubleClickRow={handlers.handleDoubleClickRow}
      handleNtuClick={handlers.handleNtuClick}
      handleEditPlacementClick={handlers.handleEditPlacementClick}
      handleRemovePlacementClick={handlers.handleRemovePlacementClick}
    />
  );
}
