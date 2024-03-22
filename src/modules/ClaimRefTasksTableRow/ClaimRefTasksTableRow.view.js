import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';

// app
import styles from './ClaimRefTasksTableRow.styles';
import { FormCheckbox, TableCell, Translate, Status } from 'components';
import { selectClaimsProcessingTasksSelected, getSancCheckAssociatedTask } from 'stores';
import * as utils from 'utils';
import config from 'config';
import { SANCTIONS_CHECK_KEY, TASK_ROW_TYPE } from 'consts';

// mui
import { makeStyles, Box, TableRow, Link } from '@material-ui/core';

ClaimRefTasksTableRowView.propTypes = {
  task: PropTypes.object.isRequired,
  isSelected: PropTypes.bool,
  columnProps: PropTypes.func.isRequired,
  getStatus: PropTypes.func.isRequired,
  selectTask: PropTypes.func.isRequired,
};

export function ClaimRefTasksTableRowView({ task, isSelected, columnProps, getStatus, selectTask }) {
  const classes = makeStyles(styles, { name: 'ClaimRefTasksTableRow' })();
  const { control, register, watch } = useForm();
  const dispatch = useDispatch();
  const history = useHistory();
  const classesRow = {
    [classes.row]: true,
    [classes.rowSelected]: isSelected,
  };

  const field = [
    {
      name: task?.taskId?.toString(),
      type: 'checkbox',
      defaultValue: '',
    },
  ];

  const clickTask = (taskobj) => (event) => {
    if (taskobj?.taskId) {
      event.stopPropagation();
      if (taskobj?.taskDefKey === SANCTIONS_CHECK_KEY) {
        dispatch(getSancCheckAssociatedTask(taskobj?.parentTaskId));
      }
      dispatch(selectClaimsProcessingTasksSelected(taskobj));
      if (taskobj.taskType === TASK_ROW_TYPE.rfi) {
        history.push(`${config.routes.claimsProcessing.rfi}/${taskobj.taskRef}`);
      } else {
        history.push(`${config.routes.claimsProcessing.task}/${taskobj.taskRef}`);
      }
    }
  };

  return (
    <TableRow hover onClick={selectTask(task)} className={classnames(classesRow)}>
      <TableCell {...columnProps('taskRef')}>
        <Box display="flex" alignItems="center">
          <FormCheckbox
            {...utils.form.getFieldProps(field, task?.taskId?.toString())}
            control={control}
            register={register}
            watch={watch}
            nestedClasses={{ root: classes.checkbox }}
          />
        </Box>
      </TableCell>
      <TableCell {...columnProps('taskRef')}>
        <Link color="secondary" onClick={clickTask(task)}>
          {task?.taskRef}
        </Link>
      </TableCell>
      <TableCell {...columnProps('createdOn')}>
        {utils.string.t('format.date', { value: { date: task?.createdOn, format: config.ui.format.date.textTime } })}
      </TableCell>
      <TableCell {...columnProps('team')}>{task?.team}</TableCell>
      <TableCell {...columnProps('taskType')}>{task?.taskType}</TableCell>
      <TableCell {...columnProps('description')} title={task?.description} nestedClasses={{ root: classes.description }}>
        {task?.description}
      </TableCell>
      <TableCell {...columnProps('targetDueDate')} className={getStatus(task)?.dateAlert ? classes.dateAlert : ''}>
        {utils.string.t('format.date', { value: { date: task?.targetDueDate, format: config.ui.format.date.text } })}
      </TableCell>
      <TableCell {...columnProps('assignee')}>{task?.assigneeFullName}</TableCell>
      <TableCell {...columnProps('additionalAssignee')}>{task?.additionalAssignee}</TableCell>
      <TableCell {...columnProps('priority')}>{task?.priority}</TableCell>
      <TableCell {...columnProps('status')}>
        <Status size="sm" text={<Translate label={task?.status} />} status={getStatus(task)?.type} />
      </TableCell>
    </TableRow>
  );
}
