import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// app
import styles from './TasksProcessingTableRow.styles';
import { FormCheckbox, Link, TableCell, PopoverMenu, Status, Translate, AvatarGroup, Tooltip } from 'components';
import * as utils from 'utils';
import { TASK_TAB_COMPLETED_STATUS, TASK_TAB_INPROGRESS_STATUS } from 'consts';
import config from 'config';
import { TASK_TEAM_TYPE } from 'consts';

// mui
import { makeStyles, Box, TableRow } from '@material-ui/core';
import { ThreeSixty, PersonAdd } from '@material-ui/icons';

TasksProcessingTableRowView.propTypes = {
  isTaskTeam: PropTypes.bool,
  caseTaskTypeView: PropTypes.string,
  task: PropTypes.object.isRequired,
  isCheckBoxSelected: PropTypes.bool,
  isPremiumProcessing: PropTypes.bool,
  columnProps: PropTypes.func.isRequired,
  taskActionItems: PropTypes.array.isRequired,
  selectedTaskItemLength: PropTypes.number,
  handlers: PropTypes.shape({
    selectTask: PropTypes.func.isRequired,
    clickTask: PropTypes.func.isRequired,
    reAssignTask: PropTypes.func.isRequired,
  }).isRequired,
  isTaskSelected: PropTypes.bool.isRequired,
};

export function TasksProcessingTableRowView({
  caseTaskTypeView,
  isTaskTeam,
  task,
  isCheckBoxSelected,
  columnProps,
  taskActionItems,
  isPremiumProcessing,
  selectedTaskItemLength,
  handlers,
  isTaskSelected,
}) {
  const classes = makeStyles(styles, { name: 'TasksProcessingTableRow' })();

  const classesRow = {
    [classes.row]: true,
    [classes.checkBoxSelected]: isCheckBoxSelected,
    [classes.rowSelected]: isTaskSelected,
  };
  const getStatus = (task) => {
    const targetDate = new Date(task?.targetDueDate).getTime();
    const createdDate = new Date(task?.createdOn).getTime();
    const dateNow = new Date().getTime();
    const targetDDMMYY = utils.string.t('format.date', {
      value: { date: task?.targetDueDate, format: config.ui.format.date.slashNumeric },
    });
    const dateNowDDMMYY = utils.string.t('format.date', { value: { date: new Date(), format: config.ui.format.date.slashNumeric } });
    if (isPremiumProcessing) {
      return { type: 'success' };
    } else {
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
    }
  };
  const status = getStatus(task);

  const assignTask = (data) => (event) => {
    event.stopPropagation();
    handlers.reAssignTask(data);
  };

  return (
    <TableRow hover onClick={handlers.selectTask(task)} className={classnames(classesRow)}>
      <TableCell {...columnProps('id')}>
        <Box display="flex" alignItems="center">
          <FormCheckbox
            name={`checkbox-${task?.taskId || task?.processId}`}
            type="checkbox"
            value={isCheckBoxSelected}
            nestedClasses={{ root: classes.checkbox }}
          />
        </Box>
      </TableCell>
      <TableCell {...columnProps('taskRef')}>{task?.taskRef}</TableCell>
      <TableCell {...columnProps('createdOn')}>
        {utils.string.t('format.date', { value: { date: task.createdOn, format: config.ui.format.date.text } })}
      </TableCell>
      <TableCell {...columnProps(isPremiumProcessing ? 'taskName' : 'taskType')}>
        {isPremiumProcessing ? task?.taskName : task?.taskType}
      </TableCell>

      <TableCell {...columnProps('description')} title={task?.description} nestedClasses={{ root: classes.description }}>
        {task?.description}
      </TableCell>

      <TableCell {...columnProps('targetDueDate')} className={getStatus(task)?.dateAlert ? classes.dateAlert : ''}>
        {utils.string.t('format.date', { value: { date: task.targetDueDate, format: config.ui.format.date.text } })}
      </TableCell>
      <TableCell {...columnProps('processRef')}>{task?.processRef}</TableCell>
      {!isPremiumProcessing && isTaskTeam && <TableCell {...columnProps('assignee')}>{task?.assigneeFullName?.trim()}</TableCell>}
      {isPremiumProcessing && caseTaskTypeView !== 'myTask' && (
        <TableCell {...columnProps('assignee')}>
          <Box>
            <Tooltip title={task?.assignee?.trim()} placement={'right'} arrow={true}>
              <AvatarGroup users={[{ id: 1, firstName: task?.assigneeFullName?.trim() }]} size={20} variant={'circular'} />
            </Tooltip>
            {caseTaskTypeView === 'myTeam' && (
              <Box display={'flex'} justifyContent={'start'} ml={2.5}>
                <Link
                  text={task?.assigneeFullName?.trim() ? utils.string.t('app.reAssign') : utils.string.t('app.assign')}
                  disabled={selectedTaskItemLength > 1}
                  icon={task?.assigneeFullName?.trim() ? ThreeSixty : PersonAdd}
                  color={'secondary'}
                  nestedClasses={{
                    link: classes.assigneeLink,
                  }}
                  iconPosition={'left'}
                  handleClick={assignTask(task)}
                />
              </Box>
            )}
          </Box>
        </TableCell>
      )}
      {!isPremiumProcessing && <TableCell {...columnProps('additionalAssignee')}>{task?.additionalAssigneeFullName?.trim()}</TableCell>}
      <TableCell {...columnProps('priority')}>{task?.priority}</TableCell>
      <TableCell {...columnProps('status')}>
        {task?.status && <Status size="sm" text={<Translate label={task?.status} />} status={status?.type} />}
      </TableCell>
      {!isPremiumProcessing && <TableCell {...columnProps('requestedBy')}>{task?.requestedByFullName?.trim()}</TableCell>}
      {!isPremiumProcessing && <TableCell {...columnProps('team')}>{task?.team}</TableCell>}
      {isPremiumProcessing && (
        <>
          <TableCell {...columnProps('inceptionDate')}>{task?.inceptionDate}</TableCell>
          <TableCell {...columnProps('assuredName')}>{task?.assuredName}</TableCell>
          <TableCell {...columnProps('type')}>{task?.type}</TableCell>
          <TableCell {...columnProps('group')}>{task?.group}</TableCell>
          <TableCell {...columnProps('departmentName')}>{task?.departmentName}</TableCell>
          <TableCell {...columnProps('processSubType')}>{task?.processSubType}</TableCell>
          <TableCell {...columnProps('xbInstanceId')}>{task?.xbInstanceName}</TableCell>
        </>
      )}
      {isPremiumProcessing && caseTaskTypeView === TASK_TEAM_TYPE.myTeam && (
        <TableCell {...columnProps('actions')} className={classes.styickyColumnRight}>
          <Box m={0.5}>
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
          </Box>
        </TableCell>
      )}
      {!isPremiumProcessing && (
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
      )}
    </TableRow>
  );
}
