import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

//app
import { TableCell, Status, Chip, Link } from 'components';
import * as utils from 'utils';
import { useHistory } from 'react-router';
import config from 'config';
import * as constants from 'consts';

//mui
import styles from './ClaimActionTable.styles';
import { makeStyles, TableRow, Typography } from '@material-ui/core';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

import {
  selectLossInformation,
  selectClaimsInformation,
  getSancCheckAssociatedTask,
  checkIsUserClaim,
  setClaimsProcessingTasksListSelected,
  setClaimsFnolPushBackRoute,
  selectUser,
} from 'stores';
ClaimActionRow.prototype = {
  data: PropTypes.array.isRequired,
  columnProps: PropTypes.array.isRequired,
  onClick: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  level: PropTypes.number.isRequired,
};

export function ClaimActionRow({ data, columnProps, onClick, isOpen, level }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const classes = makeStyles(styles, { name: 'LossActionTable' })({ expanded: isOpen, level });
  const hasChildren = data.actionChildItemList.length;
  const chipColor = ['info', 'success', 'alert', 'error', 'light'];
  const user = useSelector(selectUser);
  const lossInformation = useSelector(selectLossInformation);
  const claimsInformation = useSelector(selectClaimsInformation);

  const isTaskLinkDisabled = (task = {}) => {
    const automatedTasks = constants?.AUTOMATED_TASK_DEF_KEYS;
    return automatedTasks?.includes(task?.taskDefKey) || task?.status === constants.TASK_TAB_COMPLETED_STATUS;
  }; // automated BPM task does not need task dashboard Link and tasks handlers

  const actionType = (event) => {
    const additionalData = {
      taskRef: data?.actionID,
      lossDetailID: lossInformation?.lossDetailID,
      lossRef: lossInformation?.lossRef,
      departmentID: claimsInformation?.departmentID,
      sourceID: claimsInformation?.sourceID,
      processRef: claimsInformation?.claimReference,
    };
    const taskData = { ...data, ...additionalData };
    if (taskData?.taskRef) {
      event.stopPropagation();
      taskData?.taskDefKey === constants.SANCTIONS_CHECK_KEY && dispatch(getSancCheckAssociatedTask(taskData?.parentTaskId));
      const isUserClaim = user.fullName?.toLowerCase() === taskData?.assignedTo?.toLowerCase();
      dispatch(checkIsUserClaim(isUserClaim));
      dispatch(setClaimsProcessingTasksListSelected(taskData));
      dispatch(setClaimsFnolPushBackRoute(constants.CLAIMS_FNOL_PUSH_BACK_ROUTES.routes.lossAndClaims));
      if (taskData.taskType === constants.TASK_ROW_TYPE.rfi) {
        history.push(`${config.routes.claimsFNOL.rfi}/${taskData.taskRef}`);
      } else {
        history.push(`${config.routes.claimsFNOL.task}/${taskData?.taskRef}`);
      }
    }
  };

  return (
    <>
      <TableRow onClick={onClick} className={classes.row} key={data?.actionID} data-testid={`search-row-${data?.actionID}`} hover>
        <TableCell {...columnProps('actionId')} data-testid={`row-col-${data?.actionID}`}>
          {hasChildren ? <KeyboardArrowDownIcon className={classes.arrow} /> : null}
          {isTaskLinkDisabled(data) ? data?.actionID : <Link text={`${data?.actionID}`} color="secondary" onClick={actionType} />}
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
