import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

// app
import { ClaimRefTasksTableView } from './ClaimRefTasksTable.view';
import { selectClaimRefTasksPagination } from 'stores';
import { useSort, usePagination } from 'hooks';

ClaimRefTasksTable.propTypes = {
  tasks: PropTypes.array.isRequired,
  cols: PropTypes.array.isRequired,
  columnProps: PropTypes.func.isRequired,
  sort: PropTypes.object.isRequired,
  handlers: PropTypes.shape({
    handleSort: PropTypes.func.isRequired,
    handleChangePage: PropTypes.func.isRequired,
    handleChangeRowsPerPage: PropTypes.func.isRequired,
    selectTask: PropTypes.func.isRequired,
  }),
};

export default function ClaimRefTasksTable({ tasks, cols: colsArr, columnProps, sort: sortObj, handlers }) {
  const tasksProcessingPagination = useSelector(selectClaimRefTasksPagination);
  const { cols, sort } = useSort(colsArr, sortObj, handlers.handleSort);
  const pagination = usePagination(
    tasks?.length > 0 ? tasks : [],
    tasksProcessingPagination,
    handlers.handleChangePage,
    handlers.handleChangeRowsPerPage
  );

  return (
    <ClaimRefTasksTableView
      taskItems={tasks?.length > 0 ? tasks : []}
      cols={cols}
      columnProps={columnProps}
      sort={sort}
      handlers={{
        pagination: pagination,
        handleSort: handlers.handleSort,
        selectTask: handlers.selectTask,
      }}
    />
  );
}
