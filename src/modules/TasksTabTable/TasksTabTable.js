import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';

// app
import { TasksTabTableView } from './TasksTabTable.view';
import {
  selectTasksTabGridListPagination,
  collapseSidebar,
  selectTasksTabGridListSelected,
  setClaimsProcessingTasksListSelected,
} from 'stores';
import { useSort, usePagination } from 'hooks';
import * as utils from 'utils';

TasksTabTable.propTypes = {
  isTaskTeam: PropTypes.bool.isRequired,
  tasks: PropTypes.object.isRequired,
  cols: PropTypes.array.isRequired,
  columnProps: PropTypes.func.isRequired,
  handleUpdateTaskPriority: PropTypes.func.isRequired,
  sort: PropTypes.object.isRequired,
  handleSort: PropTypes.func.isRequired,
  handleChangePage: PropTypes.func.isRequired,
  handleChangeRowsPerPage: PropTypes.func.isRequired,
  refreshTasksGrid: PropTypes.func.isRequired,
  isMultiSelect: PropTypes.bool,
  multiSelectField: PropTypes.array,
  control: PropTypes.object,
};

export default function TasksTabTable({
  isTaskTeam,
  tasks,
  cols: colsArr,
  columnProps,
  sort: sortObj,
  handleSort,
  handleChangePage,
  handleChangeRowsPerPage,
  handleUpdateTaskPriority,
  refreshTasksGrid,
  isMultiSelect,
  multiSelectField,
  control,
}) {
  const dispatch = useDispatch();
  const tasksProcessingSelected = useSelector(selectTasksTabGridListSelected);
  const tasksProcessingPagination = useSelector(selectTasksTabGridListPagination);
  const { cols, sort } = useSort(colsArr, sortObj, handleSort);
  const pagination = usePagination(tasks?.items || [], tasksProcessingPagination, handleChangePage, handleChangeRowsPerPage);
  const taskItems = tasks?.items || [];
  const hasTasks = utils.generic.isValidArray(taskItems, true);

  const tasksProcessingSelectedLength = tasksProcessingSelected?.length || 0;

  useEffect(() => {
    if (tasksProcessingSelectedLength !== 1) {
      dispatch(collapseSidebar());
    }
  }, [tasksProcessingSelectedLength]); // eslint-disable-line react-hooks/exhaustive-deps

  const selectTask = (taskObj) => () => {
    if (taskObj?.taskId) {
      dispatch(setClaimsProcessingTasksListSelected(taskObj, true));
    }
  };

  return (
    <TasksTabTableView
      isTaskTeam={isTaskTeam}
      hasTasks={hasTasks}
      taskItems={taskItems}
      tasksSelected={tasksProcessingSelected}
      cols={cols}
      columnProps={columnProps}
      handleUpdateTaskPriority={handleUpdateTaskPriority}
      sort={sort}
      pagination={pagination}
      handleSort={handleSort}
      handlers={{
        selectTask,
      }}
      refreshTasksGrid={refreshTasksGrid}
      isMultiSelect={isMultiSelect}
      multiSelectField={multiSelectField}
      control={control}
    />
  );
}
