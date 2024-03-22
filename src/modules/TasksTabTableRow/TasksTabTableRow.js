import React from 'react';
import { useHistory } from 'react-router';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';

// app
import { TasksTabTableRowView } from './TasksTabTableRow.view';
import {
  selectCaseTaskTypeView,
  checkIsUserClaim,
  setClaimsFnolPushBackRoute,
  showModal,
  hideModal,
  getSancCheckAssociatedTask,
  selectTasksTabGridListSelected,
  setClaimsProcessingTasksListSelected,
  selectTasksTabGridList,
  getClaimsTasksProcessingList,
  selectClaimsProcessingItem,
} from 'stores';
import config from 'config';
import * as constants from 'consts';
import * as utils from 'utils';
import { Breadcrumb } from 'components';
// mui
import { Typography } from '@material-ui/core';

TasksTabTableRow.propTypes = {
  task: PropTypes.object.isRequired,
  isTaskTeam: PropTypes.bool.isRequired,
  isSelected: PropTypes.bool,
  columnProps: PropTypes.func.isRequired,
  handlers: PropTypes.shape({
    selectTask: PropTypes.func.isRequired,
    refreshTasksGrid: PropTypes.func.isRequired,
  }).isRequired,
};

export default function TasksTabTableRow(props) {
  const dispatch = useDispatch();
  const history = useHistory();
  const { task } = props;
  const { pathname } = history.location;
  const tasksSelected = useSelector(selectTasksTabGridListSelected);
  const caseTaskTypeView = useSelector(selectCaseTaskTypeView);
  const claimsTasksProcessing = useSelector(selectTasksTabGridList);
  const user = useSelector((state) => state.user);
  const searchTypeCall = constants.CLAIM_PROCESSING_REQ_TYPES.search;
  const taskType = claimsTasksProcessing?.taskType;
  const appliedFilters = claimsTasksProcessing?.appliedFilters;

  const editTask = (task) => {
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
            claim: task,
            cancelHandler: () => {
              dispatch(hideModal());
            },
            submitHandler: () => {
              dispatch(hideModal());
              props?.handlers?.refreshTasksGrid();
            },
          },
        },
      })
    );
  };

  const taskActionItems = [
    {
      id: 'editTask',
      label: utils.string.t('claims.processing.taskFunction.editTask'),
      callback: () => {
        editTask(props?.task);
      },
    },
    {
      id: 'changePriority',
      label: utils.string.t('claims.processing.taskFunction.changePriority'),
      callback: () => changePriority(),
    },
    {
      id: 'createRfi',
      label: utils.string.t('claims.processing.taskFunction.createRFI'),
      callback: () => {
        handleCreateRFITaskLevel();
      },
    },
  ];

  const handleCreateRFITaskLevel = () => {
    const breadcrumbs = [
      {
        name: 'lossRef',
        label: utils.string.t('claims.loss.text', { lossRef: task?.lossRef }),
        link: pathname,
        active: true,
      },
      task?.claimRef && {
        name: 'claimRef',
        label: `${utils.string.t('claims.rfiDashboard.breadCrumbs.claimRef', { claimRef: task?.claimRef })}`,
        link: pathname,
        active: true,
      },
      task?.taskRef && {
        name: 'taskRef',
        label: `${utils.string.t('claims.rfiDashboard.breadCrumbs.taskRef', { taskRef: task?.taskRef })}`,
        link: pathname,
        active: true,
        largeFont: true,
      },
    ];

    const TitleWBreadCrumb = () => {
      return (
        <>
          <Breadcrumb links={breadcrumbs} />
          <Typography variant="h2" style={{ paddingLeft: '1.2rem' }}>
            {utils.string.t('claims.processing.taskFunction.createRFI')}
          </Typography>
        </>
      );
    };
    dispatch(dispatch(selectClaimsProcessingItem(task, true)));
    dispatch(
      showModal({
        component: 'CLAIMS_CREATE_RFI_STEPPER',
        props: {
          titleChildren: <TitleWBreadCrumb />,
          hideCompOnBlur: false,
          fullWidth: true,
          maxWidth: 'lg',
          disableAutoFocus: true,
          componentProps: {
            claim: task,
            type: constants.RFI_ON_TASKS,
            cancelHandler: () => {
              dispatch(hideModal());
            },
          },
        },
      })
    );
  };

  const clickTask = (taskObj) => (event) => {
    if (taskObj?.taskRef) {
      event.stopPropagation();
      taskObj?.taskDefKey === constants.SANCTIONS_CHECK_KEY && dispatch(getSancCheckAssociatedTask(taskObj?.parentTaskId));
      const isUserClaim = user.emailId?.toLowerCase() === taskObj?.processOwner?.toLowerCase();
      dispatch(checkIsUserClaim(isUserClaim));
      dispatch(setClaimsProcessingTasksListSelected(taskObj));
      dispatch(setClaimsFnolPushBackRoute(constants.CLAIMS_FNOL_PUSH_BACK_ROUTES.routes.lossAndClaims));
      if (taskObj.taskType === constants.TASK_ROW_TYPE.rfi) {
        history.push(`${config.routes.claimsFNOL.rfi}/${taskObj.taskRef}`);
      } else {
        history.push({
          pathname: `${config.routes.claimsFNOL.task}/${taskObj?.taskRef}`,
          state: {
            redirectUrl: pathname,
            isTaskTeam: props?.isTaskTeam,
          },
        });
      }
    }
  };

  const changePriority = async () => {
    const tasksData = tasksSelected?.length ? tasksSelected : [task];
    dispatch(
      showModal({
        component: 'CHANGE_PRIORITY',
        props: {
          title: utils.string.t('claims.processing.taskFunction.changePriority'),
          hideCompOnBlur: false,
          fullWidth: true,
          maxWidth: 'sm',
          disableAutoFocus: true,
          componentProps: {
            task: tasksData,
            handlers: {
              submitHandler: () => {
                refreshTasksData();
              },
              cancelHandler: () => {
                dispatch(hideModal());
              },
            },
          },
        },
      })
    );
  };

  const refreshTasksData = () => {
    dispatch(getClaimsTasksProcessingList({ requestType: searchTypeCall, taskType, filterTerm: appliedFilters || null, navigation: true }));
  };

  const isTaskLinkDisabled = (task = {}) => {
    const automatedTasks = constants?.AUTOMATED_TASK_DEF_KEYS;
    return automatedTasks?.includes(task?.taskDefKey);
  }; // automated BPM task does not need task dashboard Link and tasks handlers

  return (
    <TasksTabTableRowView
      {...props}
      taskActionItems={isTaskLinkDisabled(task) ? [] : taskActionItems}
      isPremiumProcessing={props?.isPremiumProcessing}
      caseTaskTypeView={caseTaskTypeView}
      handlers={{
        selectTask: props?.handlers?.selectTask,
        clickTask,
        editTask,
      }}
      isTaskLinkDisabled={isTaskLinkDisabled(task)}
    />
  );
}
