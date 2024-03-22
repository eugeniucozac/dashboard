import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// app
import styles from './TasksTabTableRow.style';
import { FormCheckbox, Link, TableCell, PopoverMenu, Status } from 'components';
import * as utils from 'utils';
import { TASK_TAB_COMPLETED_STATUS, TASK_TAB_INPROGRESS_STATUS } from 'consts';
import config from 'config';

// mui
import { makeStyles, Box, TableRow } from '@material-ui/core';

TasksTabTableRowView.propTypes = {
  task: PropTypes.object.isRequired,
  isSelected: PropTypes.bool,
  columnProps: PropTypes.func.isRequired,
  taskActionItems: PropTypes.array.isRequired,
  isMultiSelect: PropTypes.bool,
  isTaskLinkDisabled: PropTypes.bool,
  handlers: PropTypes.shape({
    selectTask: PropTypes.func.isRequired,
    clickTask: PropTypes.func.isRequired,
  }).isRequired,
};

export function TasksTabTableRowView({ task, isSelected, columnProps, taskActionItems, isMultiSelect, handlers, isTaskLinkDisabled }) {
  const classes = makeStyles(styles, { name: 'TasksTabTableRow' })();

  const classesRow = {
    [classes.row]: true,
    [classes.rowSelected]: isSelected,
  };

  const getStatus = (task) => {
    const targetDate = new Date(task?.targetDueDate).getTime();
    const createdDate = new Date(task?.createdOn).getTime();
    const dateNow = new Date().getTime();
    const targetDDMMYY = utils.string.t('format.date', {
      value: { date: task?.targetDueDate, format: config.ui.format.date.slashNumeric },
    });
    const dateNowDDMMYY = utils.string.t('format.date', { value: { date: new Date(), format: config.ui.format.date.slashNumeric } });
    if (targetDate > createdDate && task?.status?.toLowerCase() === TASK_TAB_COMPLETED_STATUS.toLowerCase()) return { type: 'success' };
    else if (
      targetDate >= createdDate &&
      targetDate > dateNow &&
      targetDate !== dateNow &&
      targetDDMMYY !== dateNowDDMMYY &&
      task?.status?.toLowerCase() === TASK_TAB_INPROGRESS_STATUS.toLowerCase()
    )
      return { type: 'success' };
    else if (targetDate === dateNow || targetDDMMYY === dateNowDDMMYY) {
      return { type: 'alert' };
    } else if (targetDate <= dateNow && task?.status?.toLowerCase() === TASK_TAB_INPROGRESS_STATUS.toLowerCase())
      return { type: 'error', dateAlert: true };
  };

  return (
    <TableRow hover onClick={handlers?.selectTask(task)} className={classnames(classesRow)}>
      <TableCell {...columnProps('taskRef')}>
        <Box display="flex" alignItems="center">
          {isMultiSelect && !isTaskLinkDisabled && (
            <FormCheckbox
              name={`checkbox-${task?.taskId || task?.processId}`}
              type="checkbox"
              value={isSelected}
              nestedClasses={{ root: classes.checkbox }}
            />
          )}
          {isTaskLinkDisabled ? (
            <span className={isMultiSelect ? classes.taskRefSpacing : ''}>{task?.taskRef}</span>
          ) : (
            <Link text={task?.taskRef} color="secondary" onClick={handlers?.clickTask(task)} />
          )}
        </Box>
      </TableCell>
      <TableCell {...columnProps('createdOn')}>
        {utils.string.t('format.date', { value: { date: task.createdOn, format: config.ui.format.date.text } })}
      </TableCell>
      <TableCell {...columnProps('taskType')}>{task?.taskType}</TableCell>

      <TableCell {...columnProps('description')} title={task?.description} nestedClasses={{ root: classes.description }}>
        {task?.description}
      </TableCell>

      <TableCell {...columnProps('targetDueDate')} className={getStatus(task)?.dateAlert ? classes.dateAlert : ''}>
        {utils.string.t('format.date', { value: { date: task.targetDueDate, format: config.ui.format.date.text } })}
      </TableCell>
      <TableCell {...columnProps('assignee')}>{task?.assigneeFullName?.trim()}</TableCell>
      <TableCell {...columnProps('processRef')}>{task?.processRef}</TableCell>
      <TableCell {...columnProps('status')}>
      {task?.status && (
            <Status
              size="sm"
              text={task?.status}
              status={task?.status === 'Complete' ? 'success' : utils.string.replaceLowerCase(task?.status, 'withDash')}
            />
          )}
      </TableCell>
      <TableCell {...columnProps('priority')}>{task?.priority}</TableCell>
      <TableCell {...columnProps('actions')}>
        <PopoverMenu
          id="search-menu-list"
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          items={taskActionItems}
        />
      </TableCell>
    </TableRow>
  );
}
