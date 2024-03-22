import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';

// app
import styles from './TasksProcessingTable.styles';
import { Empty, TableHead, Pagination, Skeleton, TableCell } from 'components';
import { TasksProcessingTableRow } from 'modules';
import { ReactComponent as IconSearchFile } from '../../assets/svg/line-icon-report.svg';
import * as utils from 'utils';

// mui
import { makeStyles, Table, TableBody, TableRow, Box } from '@material-ui/core';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';

TasksProcessingTableView.propTypes = {
  isTaskTeam: PropTypes.bool.isRequired,
  hasTasks: PropTypes.bool.isRequired,
  taskItems: PropTypes.array.isRequired,
  cols: PropTypes.array.isRequired,
  columnProps: PropTypes.func.isRequired,
  handleUpdateTaskPriority: PropTypes.func.isRequired,
  sort: PropTypes.object.isRequired,
  pagination: PropTypes.shape({
    obj: PropTypes.object.isRequired,
    handlers: PropTypes.shape({
      handleChangePage: PropTypes.func.isRequired,
      handleChangeRowsPerPage: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
  refreshTasksGrid: PropTypes.func.isRequired,
  premiumProcessingSaveAssignee: PropTypes.func,
  isPremiumProcessing: PropTypes.bool,
  handlers: PropTypes.shape({
    selectTask: PropTypes.func.isRequired,
    handleEditAdhoc: PropTypes.func.isRequired,
    handleCreateRFITaskLevel: PropTypes.func.isRequired,
    createSanctionsCheck: PropTypes.func.isRequired,
  }).isRequired,
  tasksSelected: PropTypes.array.isRequired,
  premiumProcessCheckBoxSelectedTaskList: PropTypes.array,
  isTaskGridLoading: PropTypes.bool,
  isTaskGridDataFetchingError: PropTypes.bool,
  premiumProcessSelectedTaskList: PropTypes.array.isRequired,
};

export function TasksProcessingTableView({
  handleUpdateTaskPriority,
  isTaskTeam,
  hasTasks,
  taskItems,
  cols,
  columnProps,
  sort,
  pagination,
  handlers,
  refreshTasksGrid,
  premiumProcessingSaveAssignee,
  tasksSelected,
  isPremiumProcessing,
  premiumProcessCheckBoxSelectedTaskList,
  isTaskGridLoading,
  isTaskGridDataFetchingError,
  premiumProcessSelectedTaskList,
}) {
  const classes = makeStyles(styles, { name: 'TasksProcessingTable' })();

  return (
    <Box data-testid="tasks-processing-search-table">
      <Box className={classes.overFlowTable}>
        <Table stickyHeader size="small" data-testid="tasks-processing-table">
          <TableHead columns={cols} sorting={sort} nestedClasses={{ tableHead: classes.tableHead }} />
          <TableBody data-testid="tasks-list-body">
            {!isTaskGridLoading &&
              taskItems.map((task) => (
                <TasksProcessingTableRow
                  handleUpdateTaskPriority={handleUpdateTaskPriority}
                  isCheckBoxSelected={
                    isPremiumProcessing
                      ? utils.generic.isValidArray(premiumProcessCheckBoxSelectedTaskList, true) &&
                        premiumProcessCheckBoxSelectedTaskList?.map((c) => c?.processId).includes(task?.processId)
                      : utils.generic.isValidArray(tasksSelected, true) && tasksSelected?.map((c) => c?.processId).includes(task?.processId)
                  }
                  isTaskSelected={
                    isPremiumProcessing
                      ? utils.generic.isValidArray(premiumProcessSelectedTaskList, true) &&
                        premiumProcessSelectedTaskList?.map((c) => c?.processId).includes(task?.processId)
                      : utils.generic.isValidArray(tasksSelected, true) && tasksSelected?.map((c) => c?.processId).includes(task?.processId)
                  }
                  isTaskTeam={isTaskTeam}
                  premiumProcessCheckBoxSelectedTaskList={premiumProcessCheckBoxSelectedTaskList}
                  key={task.taskId || task.processId}
                  task={task}
                  columnProps={columnProps}
                  isPremiumProcessing={isPremiumProcessing}
                  handlers={{
                    selectTask: handlers.selectTask,
                    refreshTasksGrid: refreshTasksGrid,
                    premiumProcessingSaveAssignee: premiumProcessingSaveAssignee,
                    handleEditAdhoc: handlers.handleEditAdhoc,
                    handleCreateRFITaskLevel: handlers.handleCreateRFITaskLevel,
                    createSanctionsCheck: handlers.createSanctionsCheck,
                  }}
                />
              ))}
          </TableBody>
          {isTaskGridLoading && !isTaskGridDataFetchingError && (
            <TableBody data-testid="tasks-list-loading-body">
              <TableRow>
                <TableCell colSpan={cols.length}>
                  <Skeleton width="100%" height={40} animation="wave" displayNumber={get(pagination, 'obj.rowsPerPage') || 10} />
                </TableCell>
              </TableRow>
            </TableBody>
          )}
          {!hasTasks && !isTaskGridLoading && !isTaskGridDataFetchingError && (
            <TableBody data-testid="tasks-list-loading-body">
              <TableRow>
                <TableCell colSpan={cols.length}>
                  <Empty title={utils.string.t('claims.noMatchFound')} icon={<IconSearchFile />} padding />
                </TableCell>
              </TableRow>
            </TableBody>
          )}
          {isTaskGridDataFetchingError && (
            <TableBody data-testid="tasks-list-loading-body">
              <TableRow>
                <TableCell colSpan={cols.length}>
                  <Empty
                    bg={false}
                    errorText={utils.string.t('app.apiFetchingError')}
                    icon={<ErrorOutlineIcon className={classes.apiFechErrorIcon} />}
                    padding
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>
      </Box>

      {hasTasks && (
        <Pagination
          page={get(pagination, 'obj.page')}
          count={get(pagination, 'obj.rowsTotal')}
          rowsPerPage={get(pagination, 'obj.rowsPerPage')}
          onChangePage={get(pagination, 'handlers.handleChangePage')}
          onChangeRowsPerPage={get(pagination, 'handlers.handleChangeRowsPerPage')}
        />
      )}
    </Box>
  );
}
