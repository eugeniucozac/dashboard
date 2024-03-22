import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

//app
import { TaskSummaryActionsView } from './TaskSummaryActions.view';
import {
  showModal,
  hideModal,
  selectClaimsTasksProcessingSelected,
  selectClaimsTasksProcessing,
  getClaimsTasksProcessing,
  postSanctionsCheck,
  resetAdhocTaskStatus,
} from 'stores';
import * as utils from 'utils';
import {
  REASSIGN_ENABLED_TASK_STATUSES,
  TASK_TYPES_NATIVE,
  RFI_ON_TASKS,
  API_RESPONSE_OK,
  TASK_TEAM_TYPE,
  CLAIM_PROCESSING_REQ_TYPES,
} from 'consts';

export default function TaskSummaryActions() {
  const dispatch = useDispatch();

  // Redux management
  const tasksProcessingSelected = useSelector(selectClaimsTasksProcessingSelected);
  const claimsTasksProcessing = useSelector(selectClaimsTasksProcessing);
  const selectedTask = tasksProcessingSelected[0];
  const isReAssignEnabled = !REASSIGN_ENABLED_TASK_STATUSES.includes(selectedTask?.status);
  const taskType = claimsTasksProcessing?.taskType;
  const isRFIEnabled = selectedTask?.taskCategory === TASK_TYPES_NATIVE;

  const reAssign = async () => {
    if (selectedTask) {
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
              taskDetails: [selectedTask],
              submitHandler: () => {
                refreshTasksData();
              },
            },
          },
        })
      );
    }
  };

  const updateTaskPriority = () => {
    if (selectedTask) {
      dispatch(
        showModal({
          component: 'SET_PRIORITY',
          props: {
            title: utils.string.t('claims.modals.taskFunction.setTaskPriorityTitle'),
            fullWidth: true,
            maxWidth: 'sm',
            disableAutoFocus: true,
            componentProps: {
              task: selectedTask,
              handlers: {
                cancel: () => {
                  dispatch(hideModal());
                },
                submit: () => {
                  refreshTasksData();
                  dispatch(hideModal());
                },
              },
            },
          },
        })
      );
    }
  };
  const createSanctionsCheck = () => {
    if (selectedTask) {
      dispatch(
        showModal({
          component: 'CONFIRM',
          props: {
            title: utils.string.t('status.alert'),
            hint: utils.string.t('claims.processing.sanctionsChecksNotification.conformationAlert'),
            fullWidth: true,
            maxWidth: 'xs',
            componentProps: {
              cancelLabel: utils.string.t('app.no'),
              confirmLabel: utils.string.t('app.yes'),
              submitHandler: () => {
                dispatch(postSanctionsCheck({ taskId: selectedTask?.taskId, rootProcessId: selectedTask?.rootProcessId })).then(
                  (response) => {
                    dispatch(hideModal());
                    if (response.status === API_RESPONSE_OK) {
                      dispatch(
                        getClaimsTasksProcessing({ requestType: CLAIM_PROCESSING_REQ_TYPES.search, taskType: TASK_TEAM_TYPE.myTask })
                      );
                    }
                  }
                );
              },
              cancelHandler: () => {},
            },
          },
        })
      );
    }
  };

  const handleCreateRFITaskLevel = () => {
    if (selectedTask) {
      dispatch(
        showModal({
          component: 'CREATE_RFI',
          props: {
            title: utils.string.t('claims.processing.taskFunction.createRFI'),
            hideCompOnBlur: false,
            fullWidth: true,
            maxWidth: 'md',
            disableAutoFocus: true,
            componentProps: {
              claim: selectedTask,
              type: RFI_ON_TASKS,
              cancelHandler: () => {
                dispatch(hideModal());
              },
            },
          },
        })
      );
    }
  };

  const handleEditAdhoc = () => {
    dispatch(resetAdhocTaskStatus());
    dispatch(
      showModal({
        component: 'CREATE_AD_HOC_TASK',
        props: {
          title: utils.string.t('claims.processing.taskFunction.editTask'),
          hideCompOnBlur: false,
          fullWidth: true,
          maxWidth: 'md',
          disableAutoFocus: true,
          componentProps: {
            claim: selectedTask,
            cancelHandler: () => {
              dispatch(hideModal());
            },
          },
        },
      })
    );
  };

  const refreshTasksData = () => {
    dispatch(getClaimsTasksProcessing({ requestType: CLAIM_PROCESSING_REQ_TYPES.search, taskType: taskType }));
  };

  return (
    <TaskSummaryActionsView
      isReAssignEnabled={isReAssignEnabled}
      selectedTask={selectedTask}
      isRFIEnabled={isRFIEnabled}
      handlers={{
        reAssign,
        updateTaskPriority,
        createSanctionsCheck,
        handleCreateRFITaskLevel,
        handleEditAdhoc,
      }}
    />
  );
}
