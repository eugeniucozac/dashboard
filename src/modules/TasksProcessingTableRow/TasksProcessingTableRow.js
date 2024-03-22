import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';

// app
import { TasksProcessingTableRowView } from './TasksProcessingTableRow.view';
import {
  showModal,
  selectClaimsProcessingTasksSelected,
  getCurrencyPurchasedValue,
  getSancCheckAssociatedTask,
  selectCaseTaskTypeView,
  resetPremiumProcessingTaskSearch,
  resetPremiumProcessingTasksFilters,
  getPremiumProcessingTasksDetails,
  checkIsUserClaim,
} from 'stores';
import config from 'config';
import * as utils from 'utils';
import * as constants from 'consts';

TasksProcessingTableRow.propTypes = {
  task: PropTypes.object.isRequired,
  isTaskTeam: PropTypes.bool.isRequired,
  isCheckBoxSelected: PropTypes.bool,
  columnProps: PropTypes.func.isRequired,
  isPremiumProcessing: PropTypes.bool,
  premiumProcessCheckBoxSelectedTaskList: PropTypes.array,
  handlers: PropTypes.shape({
    selectTask: PropTypes.func.isRequired,
    refreshTasksGrid: PropTypes.func.isRequired,
    handleEditAdhoc: PropTypes.func.isRequired,
    handleCreateRFITaskLevel: PropTypes.func.isRequired,
    createSanctionsCheck: PropTypes.func.isRequired,
    premiumProcessingSaveAssignee: PropTypes.func,
  }).isRequired,
  isTaskSelected: PropTypes.bool.isRequired,
};

export default function TasksProcessingTableRow(props) {
  const dispatch = useDispatch();
  const history = useHistory();

  const currentTask = props.task;
  const isRFIEnabled = currentTask?.taskCategory === constants.TASK_TYPES_NATIVE;
  const isRFIType = currentTask?.taskType === constants.RFI;
  const isTaskClosed = currentTask?.status === constants.TASK_TAB_COMPLETED_STATUS;
  const caseTaskTypeView = useSelector(selectCaseTaskTypeView);
  const user = useSelector((state) => state.user);
  const selectedTaskItemLength =
    (utils.generic.isValidArray(props?.premiumProcessSelectedTaskList, true) && props?.premiumProcessSelectedTaskList.length) || 0;

  let taskActionItems = [
    {
      id: 'reAssignTask',
      label: props.isPremiumProcessing ? utils.string.t('app.assignTo') : utils.string.t('claims.processing.taskFunction.reAssignTask'),
      disabled:
        (!props.isPremiumProcessing && !constants.REASSIGN_ENABLED_TASK_STATUSES.includes(currentTask.status)) ||
        (props.isPremiumProcessing && selectedTaskItemLength > 1),
      callback: () => reAssignTask(currentTask),
    },
    {
      id: 'createRFI',
      label: utils.string.t('claims.processing.taskFunction.createRFI'),
      disabled: props.isPremiumProcessing && !isRFIEnabled,
      callback: () => {
        dispatch(selectClaimsProcessingTasksSelected(currentTask));
        props.handlers.handleCreateRFITaskLevel(currentTask);
      },
    },
    ...(!props.isPremiumProcessing
      ? [
          {
            id: 'editTask',
            label: utils.string.t('claims.processing.taskFunction.editTask'),
            disabled: isRFIType,
            callback: () => {
              dispatch(selectClaimsProcessingTasksSelected(currentTask));
              props.handlers.handleEditAdhoc(currentTask);
            },
          },
          {
            id: 'setTaskPriority',
            label: utils.string.t('claims.processing.taskFunction.setTaskPriority'),
            callback: () => props.handleUpdateTaskPriority(props.task),
          },
          ...(currentTask?.taskCategory === constants.TASK_TYPES_NATIVE
            ? [
                {
                  id: 'createSanctionsCheck',
                  label: utils.string.t('claims.processing.summary.buttons.createSanctionsChecks'),
                  disabled: isTaskClosed,
                  callback: () => {
                    dispatch(selectClaimsProcessingTasksSelected(currentTask));
                    props.handlers.createSanctionsCheck(currentTask);
                  },
                },
              ]
            : []),
        ]
      : []),
  ];

  const clickTask = (taskObj) => (event) => {
    if (props.isPremiumProcessing) {
      if (taskObj?.taskId || taskObj?.processId) {
        dispatch(resetPremiumProcessingTaskSearch());
        dispatch(resetPremiumProcessingTasksFilters());
        dispatch(getPremiumProcessingTasksDetails({ requestType: 'search', taskType: caseTaskTypeView, filterTerm: [] }));
        dispatch(getPremiumProcessingTasksDetails({ requestType: 'filter', taskType: caseTaskTypeView, filterTerm: [] }));
        history.push(
          `${config.routes.premiumProcessing.case}/${taskObj?.taskId || taskObj?.processId}/${
            constants.PREMIUM_PROCESSING_TAB_CASE_DETAILS
          }`
        );
      }
    } else {
      if (taskObj?.taskRef) {
        event.stopPropagation();
        if (taskObj?.taskDefKey === constants.SANCTIONS_CHECK_KEY) {
          dispatch(getSancCheckAssociatedTask(taskObj?.parentTaskId));
        }
        const isUserClaim = user.emailId?.toLowerCase() === taskObj?.processOwner?.toLowerCase();
        dispatch(checkIsUserClaim(isUserClaim));
        dispatch(selectClaimsProcessingTasksSelected(taskObj));
        if (taskObj?.taskDefKey === constants.ADVICE_AND_SETTLEMENT) {
          dispatch(getCurrencyPurchasedValue(taskObj?.processId));
        }
        if (taskObj.taskType === constants.TASK_ROW_TYPE.rfi) {
          history.push(`${config.routes.claimsProcessing.rfi}/${taskObj.taskRef}`);
        } else {
          history.push(`${config.routes.claimsProcessing.task}/${taskObj.taskRef}`);
        }
      }
    }
  };

  const reAssignTask = async (currentTaskDetails) => {
    await dispatch(
      showModal({
        component: 'ADD_ASSIGNEE',
        props: {
          title: utils.string.t('app.assign'),
          hideCompOnBlur: false,
          fullWidth: true,
          maxWidth: 'sm',
          disableAutoFocus: true,
          componentProps: {
            isPremiumProcessing: props.isPremiumProcessing,
            taskDetails: [currentTaskDetails],
            submitHandler: (data) => {
              props.handlers.refreshTasksGrid();
              if (props.isPremiumProcessing) {
                props.handlers.premiumProcessingSaveAssignee(data.premiumProcessingSaveAssigneeResponse);
              }
            },
          },
        },
      })
    );
  };

  return (
    <TasksProcessingTableRowView
      {...props}
      taskActionItems={taskActionItems}
      isPremiumProcessing={props.isPremiumProcessing}
      caseTaskTypeView={caseTaskTypeView}
      selectedTaskItemLength={selectedTaskItemLength}
      handlers={{
        selectTask: props.handlers.selectTask,
        clickTask,
        reAssignTask,
      }}
    />
  );
}
