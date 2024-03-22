import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import { useHistory, useParams } from 'react-router';

// app
import { TaskDashboardView } from './TaskDashboard.view';
import {
  showModal,
  hideModal,
  selectTasksTabGridListSelected,
  selectTaskDashboardTaskDetails,
  selectIsTaskDashboardTaskDetailsLoading,
  resetTaskDashboardData,
  getClaimsTasksProcessing,
  getClaimsTaskDashboardDetail,
  postSanctionsCheck,
  getClaimsPreviewInformation,
  selectClaimsProcessingItem,
  selectedClaimsProcessingTaskType,
  getPolicyInformation,
  resetPolicyInformation,
  getLossInformation,
  getPolicySections,
  getCatCodes,
  selectClaimsFnolPushBackRoute,
  selectFnolSelectedTab,
  setClaimsTabSelectedItem,
} from 'stores';
import { Breadcrumb } from 'components';
import * as utils from 'utils';
import config from 'config';
import {
  REASSIGN_ENABLED_TASK_STATUSES,
  TASK_TYPES_NATIVE,
  RFI_ON_TASKS,
  TASK_TAB_COMPLETED_STATUS,
  API_RESPONSE_OK,
  TASK_TEAM_TYPE,
  CLAIM_PROCESSING_REQ_TYPES,
  CLAIMS_FNOL_PUSH_BACK_ROUTES,
} from 'consts';
// mui
import { Typography } from '@material-ui/core';

export default function TaskDashboard() {
  const dispatch = useDispatch();
  const history = useHistory();
  const params = useParams();

  const brand = useSelector((state) => state.ui.brand);
  const fnolSelectedTab = useSelector(selectFnolSelectedTab);
  const { pathname } = history.location;

  // Redux management
  const taskSelectedFromTasksTab = useSelector(selectTasksTabGridListSelected);
  const isTaskDetailsLoading = useSelector(selectIsTaskDashboardTaskDetailsLoading);

  const [taskSelected = {}] = taskSelectedFromTasksTab;
  const { processRef, taskId, sourceID, businessProcessID, processId, caseIncidentID, departmentID } = taskSelected;
  const claimData = {
    claimReference: processRef,
    taskID: taskId,
    sourceID,
    claimID: businessProcessID,
    departmentID,
  };
  const taskDashboardTaskDetails = useSelector(selectTaskDashboardTaskDetails);
  const pushBackRoute = useSelector(selectClaimsFnolPushBackRoute);

  // State management
  const [selectedTab, setSelectedTab] = useState(params?.tab || 'taskDetails');

  const hasValidTaskDashboardDetails = utils.generic.isValidObject(taskDashboardTaskDetails, 'taskRef');
  const selectedTask = hasValidTaskDashboardDetails ? taskDashboardTaskDetails : taskSelectedFromTasksTab[0];
  const isTaskClosed = selectedTask?.status === TASK_TAB_COMPLETED_STATUS;

  const user = useSelector((state) => state.user);
  const userHasAllTasksPermission = utils.app.access.feature('claimsFNOL.myTeamTasks', ['read', 'create', 'update'], user);
  const isUsersTasks = user.emailId?.toLowerCase() === selectedTask?.assignee?.toLowerCase();
  const isTeamClaim = user?.organisation?.name === selectedTask?.team;
  const taskType = isUsersTasks ? TASK_TEAM_TYPE.myTask : TASK_TEAM_TYPE.myTeam;
  const allowedNavigationUrls = [];
  const [isDirtyCheck, setIsDirtyCheck] = useState(false);

  // on load
  useEffect(() => {
    const currentTaskRef = selectedTask?.taskRef;
    if (hasValidTaskDashboardDetails && currentTaskRef && !isTaskClosed) {
      dispatch(selectedClaimsProcessingTaskType(taskType));
      dispatch(getClaimsTaskDashboardDetail({ query: currentTaskRef, claimID: businessProcessID, viewLoader: false }));
    }

    async function storeClaimDetails() {
      const claimInfo = await dispatch(
        getClaimsPreviewInformation({
          claimId: claimData?.claimID,
          claimRefParams: claimData?.claimReference,
          sourceIdParams: claimData?.sourceID,
          divisionIDParams: claimData?.departmentID,
          viewLoader: false,
        })
      );
      if (utils.generic.isValidObject(claimInfo)) {
        const { claimReference, lossDetailID, sourceID, policyID } = claimInfo;
        const claimDetails = {
          ...claimInfo,
          claimRef: claimReference,
          lossRef: lossDetailID,
          sourceId: sourceID,
          policyId: policyID,
          processID: processId,
          caseIncidentID,
        };
        await dispatch(selectClaimsProcessingItem(claimDetails, true));
        dispatch(getPolicyInformation({ viewLoader: false }));
        dispatch(
          getLossInformation({
            lossDetailsId: taskSelected?.lossDetailID,
            sourceIdParams: taskSelected?.sourceID,
            divisionIdParam: taskSelected?.departmentID,
            claimRefParam: taskSelected?.processRef,
            viewLoader: false,
          })
        );
        dispatch(setClaimsTabSelectedItem(claimDetails, true));
        dispatch(getPolicySections({ xbPolicyID: claimInfo?.policyID, xbInstanceID: claimInfo?.sourceID, viewLoader: false }));
        dispatch(getCatCodes(false));
      }
    }
    storeClaimDetails();
    // cleanup
    return () => {
      dispatch(resetTaskDashboardData());
      dispatch(resetPolicyInformation());
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!hasValidTaskDashboardDetails && !isTaskDetailsLoading) {
      dispatch(getClaimsTaskDashboardDetail({ query: params?.id })).then((res) => {
        if (!res?.data?.searchValue?.length) {
          history.replace(config.routes.claimsFNOL.root);
        }
      });
    }
  }, [hasValidTaskDashboardDetails]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelectTab = (tabName) => {
    if (isDirtyCheck && selectedTab === 'taskDetails') {
      handleDirtyCheck(tabName, false);
    } else {
      setSelectedTab(tabName);
    }
  };

  const handleUpdateTaskPriority = (task) => {
    dispatch(
      showModal({
        component: 'SET_PRIORITY',
        props: {
          title: utils.string.t('claims.modals.taskFunction.setTaskPriorityTitle'),
          fullWidth: true,
          maxWidth: 'sm',
          disableAutoFocus: true,
          componentProps: {
            task,
            handlers: {
              cancel: () => dispatch(hideModal()),
              submit: () => dispatch(hideModal()),
            },
          },
        },
      })
    );
  };

  const handleCreateRFITaskLevel = (task) => {
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
            type: RFI_ON_TASKS,
            cancelHandler: () => {
              dispatch(hideModal());
            },
          },
        },
      })
    );
  };

  const handleEditTask = (task) => {
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
              refreshTasksData();
              dispatch(hideModal());
            },
          },
        },
      })
    );
  };
  const tabs = [
    { value: 'taskDetails', label: utils.string.t('claims.processing.taskFunctionalityTabs.taskDetails') },
    { value: 'viewDocuments', label: utils.string.t('claims.processing.taskFunctionalityTabs.viewDocuments') },
    { value: 'notes', label: utils.string.t('claims.processing.taskFunctionalityTabs.notes') },
  ];

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

  const isDisabled = isTaskClosed || !isUsersTasks;

  let taskActions = [
    {
      id: 'reAssignTask',
      label: utils.string.t('claims.processing.taskFunction.reAssignTask'),
      disabled:
        REASSIGN_ENABLED_TASK_STATUSES.indexOf(selectedTask?.status) === -1 || !(userHasAllTasksPermission && isTeamClaim) || isTaskClosed,
      callback: () => {
        if (utils.generic.isValidObject(selectedTask)) {
          reAssignTask(selectedTask);
        }
      },
    },
    {
      id: 'editTask',
      label: utils.string.t('claims.processing.taskFunction.editTask'),
      disabled: isDisabled,
      callback: () => {
        utils.generic.isValidObject(selectedTask) && handleEditTask(selectedTask);
      },
    },
    {
      id: 'changePriority',
      label: utils.string.t('claims.processing.taskFunction.changePriority'),
      callback: () => changePriority(),
    },
    {
      id: 'setTaskPriority',
      label: utils.string.t('claims.processing.taskFunction.setTaskPriority'),
      disabled: isDisabled,
      callback: () => {
        handleUpdateTaskPriority(selectedTask);
      },
    },
    {
      id: 'createRFI',
      label: utils.string.t('claims.processing.taskFunction.createRFI'),
      callback: () => {
        utils.generic.isValidObject(selectedTask) && handleCreateRFITaskLevel(selectedTask);
      },
    },
    ...(selectedTask?.taskCategory === TASK_TYPES_NATIVE
      ? [
          {
            id: 'createSanctionsCheck',
            label: utils.string.t('claims.processing.summary.buttons.createSanctionsChecks'),
            disabled: isDisabled,
            callback: () => {
              createSanctionsCheck(selectedTask);
            },
          },
        ]
      : []),
  ];
  const breadcrumbs = [
    {
      name: 'claimsProcessing',
      label: utils.string.t('claims.loss.title'),
      link: `${config.routes.claimsFNOL.root}${fnolSelectedTab ? `/tab/${fnolSelectedTab}` : ''}`,
    },
    {
      name: 'lossRef',
      label: `${utils.string.t('claims.loss.text', { lossRef: selectedTask?.lossRef })}`,
      link: `${config.routes.claimsFNOL.loss}/${selectedTask?.lossRef}`,
    },
    {
      name: 'claimRef',
      label: `${utils.string.t('claims.claimRef.text', { claimRef: selectedTask?.processRef })}`,
      link: `${config.routes.claimsFNOL.claim}/${selectedTask?.processRef}`,
    },
    {
      name: 'taskRef',
      label: `${utils.string.t('claims.processing.task.title', { id: selectedTask?.taskRef })}`,
      link: `${config.routes.claimsFNOL.task}/${selectedTask?.taskRef}`,
      active: true,
    },
  ];

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
            taskDetails: [currentTaskDetails],
            submitHandler: () => {
              refreshTasksData();
            },
          },
        },
      })
    );
  };

  const refreshTasksData = () => {
    dispatch(getClaimsTaskDashboardDetail({ query: selectedTask?.taskRef, claimID: businessProcessID }));
  };

  const handleDirtyCheck = (tabName, isNavigationAllowed) => {
    dispatch(
      showModal({
        component: 'CONFIRM',
        props: {
          title: utils.string.t('status.alert'),
          hint: utils.string.t('claims.notes.notifications.alertPopup'),
          fullWidth: true,
          maxWidth: 'xs',
          componentProps: {
            cancelLabel: utils.string.t('app.no'),
            confirmLabel: utils.string.t('app.yes'),
            submitHandler: () => {
              tabName !== '' && setSelectedTab(tabName);
              if (isNavigationAllowed) {
                switch (pushBackRoute) {
                  case CLAIMS_FNOL_PUSH_BACK_ROUTES.routes.lossAndClaims:
                    return history.replace(`${config.routes.claimsFNOL.root}${fnolSelectedTab ? `/tab/${fnolSelectedTab}` : ''}`);
                  case CLAIMS_FNOL_PUSH_BACK_ROUTES.routes.lossDashboard:
                    return history.replace(`${config.routes.claimsFNOL.loss}/${selectedTask?.lossRef}`);
                  case CLAIMS_FNOL_PUSH_BACK_ROUTES.routes.claimsDashboard:
                    return history.replace(`${config.routes.claimsFNOL.claim}/${selectedTask?.processRef}`);
                  default:
                    return;
                }
              }
            },
          },
        },
      })
    );
  };

  const changePriority = () => {
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
            task: [selectedTask],
            handlers: {
              cancelHandler: () => {
                dispatch(hideModal());
              },
            },
          },
        },
      })
    );
  };

  // abort
  if (!selectedTask) return null;

  return (
    <>
      <Helmet>
        <title>{`${utils.string.t('claims.processing.title')} - ${utils.app.getAppName(brand)}`}</title>
      </Helmet>
      <TaskDashboardView
        task={selectedTask}
        tabs={tabs}
        selectedTab={selectedTab}
        breadcrumbs={breadcrumbs}
        handleSelectTab={handleSelectTab}
        reAssignTask={reAssignTask}
        popoverActions={taskActions}
        handleDirtyCheck={handleDirtyCheck}
        isDirtyRef={isDirtyCheck}
        setIsDirty={setIsDirtyCheck}
        allowedNavigationUrls={allowedNavigationUrls}
      />
    </>
  );
}
