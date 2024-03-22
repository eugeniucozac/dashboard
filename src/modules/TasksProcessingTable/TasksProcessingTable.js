import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import get from 'lodash/get';
import xorBy from 'lodash/xorBy';

// app
import { TasksProcessingTableView } from './TasksProcessingTable.view';
import {
  showModal,
  hideModal,
  selectClaimsTasksProcessingPagination,
  selectPremiumProcessingPagination,
  expandSidebar,
  collapseSidebar,
  resetAdhocTaskStatus,
  selectClaimsTasksProcessingSelected,
  selectClaimsProcessingTasksSelected,
  getClaimsTasksProcessing,
  postSanctionsCheck,
  updateMultiSelectedRows,
  selectMultiSelectedCase,
  selectClaimsProcessingItem,
  singleCaseSelectRows,
  selectPremiumProcessingCasesSelected,
} from 'stores';
import { useSort, usePagination } from 'hooks';
import * as utils from 'utils';
import { RFI_ON_TASKS, API_RESPONSE_OK, TASK_TEAM_TYPE, CLAIM_PROCESSING_REQ_TYPES } from 'consts';

TasksProcessingTable.propTypes = {
  isTaskTeam: PropTypes.bool.isRequired,
  tasks: PropTypes.object.isRequired,
  cols: PropTypes.array.isRequired,
  columnProps: PropTypes.func.isRequired,
  handleUpdateTaskPriority: PropTypes.func.isRequired,
  sort: PropTypes.object.isRequired,
  handleSort: PropTypes.func.isRequired,
  handleChangePage: PropTypes.func.isRequired,
  handleChangeRowsPerPage: PropTypes.func.isRequired,
  refreshTasksGrid: PropTypes.func.isRequired,
  premiumProcessingSaveAssignee: PropTypes.func,
  isPremiumProcessing: PropTypes.bool,
};

export default function TasksProcessingTable({
  isTaskTeam,
  tasks,
  cols: colsArr,
  columnProps,
  sort: sortObj,
  handleSort,
  handleChangePage,
  handleChangeRowsPerPage,
  handleUpdateTaskPriority,
  refreshTasksGrid,
  premiumProcessingSaveAssignee,
  isPremiumProcessing,
}) {
  const dispatch = useDispatch();
  const uiSidebarExpanded = useSelector((state) => get(state, 'ui.sidebar.expanded'));
  const tasksProcessingSelected = useSelector(selectClaimsTasksProcessingSelected);
  const tasksProcessingPagination = useSelector(selectClaimsTasksProcessingPagination);
  const premiumProcessingPagination = useSelector(selectPremiumProcessingPagination);
  const [singleCaseRowSelected, setSingleCaseRowSelected] = useState({});
  const { cols, sort } = useSort(colsArr, sortObj, handleSort);
  const pagination = usePagination(
    tasks?.items || [],
    isPremiumProcessing ? premiumProcessingPagination : tasksProcessingPagination,
    handleChangePage,
    handleChangeRowsPerPage
  );
  const taskItems = tasks?.items || [];
  const hasTasks = utils.generic.isValidArray(taskItems, true);
  const premiumProcessCheckBoxSelectedTaskList = useSelector(selectMultiSelectedCase);
  const premiumProcessSelectedTaskList = useSelector(selectPremiumProcessingCasesSelected);
  const tasksProcessingSelectedLength = tasksProcessingSelected?.length || 0;

  useEffect(() => {
    if (tasksProcessingSelectedLength !== 1) {
      dispatch(collapseSidebar());
    }
  }, [tasksProcessingSelectedLength]); // eslint-disable-line react-hooks/exhaustive-deps
  const selectCheckBox = (taskObj) => {
    const selectedPpTasksArray = xorBy(premiumProcessCheckBoxSelectedTaskList, [taskObj], taskObj?.taskId ? 'taskId' : 'processId');
    if (taskObj?.taskId || taskObj?.processId) {
      dispatch(updateMultiSelectedRows(selectedPpTasksArray));
    }
  };
  const selectSingleTask = (taskObj) => {
    const selectedTask = xorBy([singleCaseRowSelected], [taskObj], taskObj?.taskId ? 'taskId' : 'processId');
    if (!uiSidebarExpanded || selectedTask?.length > 1) {
      dispatch(singleCaseSelectRows(taskObj));
      setSingleCaseRowSelected(taskObj);
      dispatch(expandSidebar());
    } else {
      dispatch(singleCaseSelectRows({}));
      setSingleCaseRowSelected({});
      dispatch(collapseSidebar());
    }
  };
  const selectTask = (taskObj) => (e) => {
    if (isPremiumProcessing) {
      if (e.target.nodeName === 'INPUT') {
        selectCheckBox(taskObj);
      } else {
        selectSingleTask(taskObj);
      }
    } else {
      const selectedTasksArray = xorBy(tasksProcessingSelected, [taskObj], 'taskId');

      if (taskObj?.taskId) {
        dispatch(selectClaimsProcessingTasksSelected(taskObj, true));
        if (!uiSidebarExpanded && selectedTasksArray?.length === 1) {
          dispatch(expandSidebar());
        }
      }
    }
  };

  const handleEditAdhoc = (claim) => {
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
            claim,
            cancelHandler: () => {
              dispatch(hideModal());
            },
          },
        },
      })
    );
  };

  const handleCreateRFITaskLevel = (claim) => {
    dispatch(selectClaimsProcessingItem(claim, true));
    dispatch(
      showModal({
        component: 'CLAIMS_CREATE_RFI_STEPPER',
        props: {
          title: utils.string.t('claims.processing.taskFunction.createRFI'),
          hideCompOnBlur: false,
          fullWidth: true,
          maxWidth: 'md',
          disableAutoFocus: true,
          componentProps: {
            claim,
            type: RFI_ON_TASKS,
            cancelHandler: () => {
              dispatch(hideModal());
            },
          },
        },
      })
    );
  };

  const createSanctionsCheck = (selectedTask) => {
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

  return (
    <TasksProcessingTableView
      isTaskTeam={isTaskTeam}
      hasTasks={hasTasks}
      taskItems={taskItems}
      tasksSelected={tasksProcessingSelected}
      cols={cols}
      columnProps={columnProps}
      handleUpdateTaskPriority={handleUpdateTaskPriority}
      sort={sort}
      pagination={pagination}
      handleSort={handleSort}
      isPremiumProcessing={isPremiumProcessing}
      premiumProcessCheckBoxSelectedTaskList={premiumProcessCheckBoxSelectedTaskList}
      premiumProcessSelectedTaskList={premiumProcessSelectedTaskList}
      handlers={{
        selectTask,
        handleEditAdhoc,
        handleCreateRFITaskLevel,
        createSanctionsCheck,
      }}
      refreshTasksGrid={refreshTasksGrid}
      premiumProcessingSaveAssignee={premiumProcessingSaveAssignee}
      isTaskGridLoading={tasks?.isTaskGridLoading}
      isTaskGridDataFetchingError={tasks?.isTaskGridDataFetchingError}
    />
  );
}
