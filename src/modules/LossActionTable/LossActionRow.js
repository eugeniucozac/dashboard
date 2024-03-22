import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

//app
import { TableCell, Status, Chip, Link } from 'components';
import * as utils from 'utils';
import { useHistory } from 'react-router';
import config from 'config';
import * as constants from 'consts';
import { getSancCheckAssociatedTask, setClaimsProcessingTasksListSelected } from 'stores';

//mui
import styles from './LossActionTable.styles';
import { makeStyles, TableRow, Typography } from '@material-ui/core';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
LossActionRow.prototype = {
  data: PropTypes.array.isRequired,
  columnProps: PropTypes.array.isRequired,
  onClick: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  level: PropTypes.number.isRequired,
};

export function LossActionRow({ data, columnProps, onClick, isOpen, level }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const classes = makeStyles(styles, { name: 'LossActionTable' })({ expanded: isOpen, level });
  const hasChildren = data.actionChildItemList?.length;
  const chipColor = ['info', 'success', 'alert', 'error', 'light'];
  const lossAction = data.actionName === 'Create Loss';

  const isTaskLinkDisabled = (task = {}) => {
    const automatedTasks = constants?.AUTOMATED_TASK_DEF_KEYS;
    return automatedTasks?.includes(task?.taskDefKey);
  };

  const { pathname } = history.location;

  const actionType = async (data) => {
    if (!lossAction) {
      const task = await dispatch(getSancCheckAssociatedTask(data?.taskId));
      await dispatch(setClaimsProcessingTasksListSelected(task));
      history.push({
        pathname: `${config.routes.claimsFNOL.task}/${task?.taskRef}`,
        state: {
          redirectUrl: pathname,
        },
      });
    }
  };

  return (
    <>
      <TableRow onClick={onClick} className={classes.row} key={data?.actionID} data-testid={`search-row-${data?.actionID}`} hover>
        <TableCell {...columnProps('actionId')} data-testid={`row-col-${data?.actionID}`}>
          {hasChildren ? <KeyboardArrowDownIcon className={classes.arrow} /> : null}
          {isTaskLinkDisabled(data) ? (
            data?.actionID
          ) : (
            <Link text={`${lossAction ? 'Loss' : ''} ${data?.actionID}`} color="secondary" onClick={() => actionType(data)} />
          )}
        </TableCell>
        <TableCell {...columnProps('name')} data-testid={`row-col-${data?.actionName}`}>
          <Chip label={data?.actionName} size="small" type={chipColor[level]} variant="outlined" />
        </TableCell>
        <TableCell {...columnProps('description')} data-testid={`row-col-${data?.description}`}>
          {data?.description}
        </TableCell>
        <TableCell {...columnProps('team')} data-testid={`row-col-${data?.team}`}>
          {data?.team}
        </TableCell>
        <TableCell {...columnProps('assignedTo')} data-testid={`row-col-${data?.assignedTo}`}>
          {data?.assignedTo}
        </TableCell>
        <TableCell {...columnProps('createdDate')} data-testid={`row-col-${data?.dateCreated}`}>
          {utils.string.t('format.date', {
            value: { date: data?.dateCreated, format: config.ui.format.date.textTime },
          })}
        </TableCell>
        <TableCell {...columnProps('targetDate')} data-testid={`row-col-${data?.targetDueDate}`}>
          <Typography variant="body2" color="error">
            {utils.string.t('format.date', {
              value: { date: data?.targetDueDate, format: config.ui.format.date.text },
            })}
          </Typography>
        </TableCell>
        <TableCell {...columnProps('priority')} data-testid={`row-col-${data?.priority}`}>
          {data?.priority}
        </TableCell>
        <TableCell {...columnProps('status')} data-testid={`row-col-${data?.status}`}>
          {data?.status && (
            <Status
              size="sm"
              text={data.status}
              status={data.status === 'Complete' ? 'success' : utils.string.replaceLowerCase(data.status, 'withDash')}
            />
          )}
        </TableCell>
        <TableCell {...columnProps('taskCompleted')} data-testid={`row-col-${data?.completedOn}`}>
          {utils.string.t('format.date', {
            value: { date: data?.completedOn, format: config.ui.format.date.textTime },
          })}
        </TableCell>
      </TableRow>
    </>
  );
}
