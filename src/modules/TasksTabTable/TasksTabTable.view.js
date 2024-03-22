import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { useSelector } from 'react-redux';

// app
import styles from './TasksTabTable.style';
import { Empty, Overflow, TableHead, Pagination, TableCell, Skeleton, FormLabel, FormSwitch } from 'components';
import { TasksTabTableRow } from 'modules';
import { ReactComponent as IconSearchFile } from '../../assets/svg/line-icon-search-file.svg';
import { selectTasksTabGridList } from 'stores';
import * as utils from 'utils';

// mui
import { makeStyles, Table, TableBody, Box, TableRow } from '@material-ui/core';

TasksTabTableView.propTypes = {
  isTaskTeam: PropTypes.bool.isRequired,
  hasTasks: PropTypes.bool.isRequired,
  taskItems: PropTypes.array.isRequired,
  cols: PropTypes.array.isRequired,
  columnProps: PropTypes.func.isRequired,
  handleUpdateTaskPriority: PropTypes.func.isRequired,
  sort: PropTypes.object.isRequired,
  isMultiSelect: PropTypes.bool,
  multiSelectField: PropTypes.array,
  control: PropTypes.object,
  refreshTasksGrid: PropTypes.func.isRequired,
  tasksSelected: PropTypes.array.isRequired,
  pagination: PropTypes.shape({
    obj: PropTypes.object.isRequired,
    handlers: PropTypes.shape({
      handleChangePage: PropTypes.func.isRequired,
      handleChangeRowsPerPage: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
  handlers: PropTypes.shape({
    selectTask: PropTypes.func.isRequired,
  }).isRequired,
};

export function TasksTabTableView({
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
  tasksSelected,
  isMultiSelect,
  multiSelectField,
  control,
}) {
  const classes = makeStyles(styles, { name: 'TasksTabTable' })();
  const claimsTasksProcessing = useSelector(selectTasksTabGridList);

  return (
    <Box data-testid="tasks-processing-search-table">
      <Overflow>
        <Table size="small" data-testid="tasks-processing-table">
          <TableHead columns={cols} sorting={sort} />
          <TableBody data-testid="tasks-list-body">
            {claimsTasksProcessing?.isTableLoading && (
              <TableRow>
                <TableCell colSpan={cols.length}>
                  <Skeleton height={40} animation="wave" displayNumber={10} />
                </TableCell>
              </TableRow>
            )}
            {hasTasks &&
              !claimsTasksProcessing?.isTableLoading &&
              taskItems.map((task) => (
                <TasksTabTableRow
                  handleUpdateTaskPriority={handleUpdateTaskPriority}
                  isSelected={
                    utils.generic.isValidArray(tasksSelected, true) && tasksSelected.map((c) => c.processId).includes(task.processId)
                  }
                  isTaskTeam={isTaskTeam}
                  key={task.taskId || task.processId}
                  task={task}
                  columnProps={columnProps}
                  handlers={{
                    selectTask: handlers.selectTask,
                    refreshTasksGrid: refreshTasksGrid,
                  }}
                  isMultiSelect={isMultiSelect}
                />
              ))}
          </TableBody>
        </Table>
      </Overflow>
      {!hasTasks && <Empty title={utils.string.t('claims.noMatchFound')} icon={<IconSearchFile />} padding />}
      {hasTasks && (
        <Box mt={1} display="flex" alignItems="flex-start">
          <Box display="flex" alignItems="center" flexGrow={1} style={{ minHeight: 52 }}>
            <Box m={1}>
              <FormLabel label={utils.string.t('dms.view.multiSelect')} align="left" />
            </Box>
            <FormSwitch {...utils.form.getFieldProps(multiSelectField, 'multiselect', control)} nestedClasses={{ root: classes.switch }} />
          </Box>
          <Box flexShrink={0}>
            <Pagination
              page={get(pagination, 'obj.page')}
              count={get(pagination, 'obj.rowsTotal')}
              rowsPerPage={get(pagination, 'obj.rowsPerPage')}
              onChangePage={get(pagination, 'handlers.handleChangePage')}
              onChangeRowsPerPage={get(pagination, 'handlers.handleChangeRowsPerPage')}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
}
