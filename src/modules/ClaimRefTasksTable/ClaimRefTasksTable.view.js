import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';

// app
import styles from './ClaimRefTasksTable.styles';
import { Empty, Overflow, TableHead, Pagination } from 'components';
import { ClaimRefTasksTableRow } from 'modules';
import { ReactComponent as IconSearchFile } from '../../assets/svg/line-icon-search-file.svg';
import { useSort } from 'hooks';
import * as utils from 'utils';
import { TASK_TAB_COMPLETED_STATUS, TASK_TAB_INPROGRESS_STATUS, SANCTIONS_CHECK_STATUSES } from 'consts';
import config from 'config';

// mui
import { makeStyles, Table, TableBody, Box } from '@material-ui/core';

ClaimRefTasksTableView.propTypes = {
  taskItems: PropTypes.array.isRequired,
  cols: PropTypes.array.isRequired,
  columnProps: PropTypes.func.isRequired,
  sort: PropTypes.object.isRequired,
  handlers: PropTypes.shape({
    pagination: PropTypes.shape({
      obj: PropTypes.object.isRequired,
      handlers: PropTypes.shape({
        handleChangePage: PropTypes.func.isRequired,
        handleChangeRowsPerPage: PropTypes.func.isRequired,
      }).isRequired,
    }).isRequired,
    handleSort: PropTypes.func.isRequired,
    selectTask: PropTypes.func.isRequired,
  }),
};

export function ClaimRefTasksTableView({ taskItems, cols: colsArr, columnProps, sort: sortObj, handlers }) {
  const classes = makeStyles(styles, { name: 'ClaimRefTasksTable' })();
  const { cols, sort } = useSort(colsArr, sortObj, handlers.handleSort);

  const hasTasks = utils.generic.isValidArray(taskItems, true);

  const getStatus = (task) => {
    if (task?.status) {
      const targetDate = new Date(task.targetDueDate).getTime();
      const createdDate = new Date(task.createdOn).getTime();
      const dateNow = new Date().getTime();

      const targetDDMMYY = utils.string.t('format.date', {
        value: { date: task?.targetDueDate, format: config.ui.format.date.slashNumeric },
      });
      const dateNowDDMMYY = utils.string.t('format.date', { value: { date: new Date(), format: config.ui.format.date.slashNumeric } });

      if (task?.approvalStatus === SANCTIONS_CHECK_STATUSES.rejected) {
        return { type: 'error' };
      } else if (targetDate > createdDate && task.status === TASK_TAB_COMPLETED_STATUS) return { type: 'success' };
      else if (
        targetDate >= createdDate &&
        targetDate > dateNow &&
        targetDate !== dateNow &&
        targetDDMMYY !== dateNowDDMMYY &&
        task.status === TASK_TAB_INPROGRESS_STATUS
      )
        return { type: 'success' };
      else if (targetDate === dateNow || targetDDMMYY === dateNowDDMMYY) return { type: 'alert' };
      else if (targetDate <= dateNow && task.status === TASK_TAB_INPROGRESS_STATUS) {
        return { type: 'error', dateAlert: true };
      }
    }
  };

  return (
    <Box data-testid="tasks-tab">
      <Overflow>
        <Table size="small" data-testid="tasks-table">
          <TableHead columns={cols} sorting={sort} nestedClasses={{ tableHead: classes.tableHead }} />
          <TableBody>
            {hasTasks &&
              taskItems.map((task) => {
                return (
                  <ClaimRefTasksTableRow
                    key={task.taskId}
                    task={task}
                    columnProps={columnProps}
                    getStatus={getStatus}
                    selectTask={handlers.selectTask}
                  />
                );
              })}
          </TableBody>
        </Table>
      </Overflow>
      {!hasTasks && <Empty title={utils.string.t('claims.noMatchFound')} icon={<IconSearchFile />} padding />}
      {hasTasks && (
        <Pagination
          page={get(handlers.pagination, 'obj.page')}
          count={get(handlers.pagination, 'obj.rowsTotal')}
          rowsPerPage={get(handlers.pagination, 'obj.rowsPerPage')}
          onChangePage={get(handlers.pagination, 'handlers.handleChangePage')}
          onChangeRowsPerPage={get(handlers.pagination, 'handlers.handleChangeRowsPerPage')}
        />
      )}
    </Box>
  );
}
