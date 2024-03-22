import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import xorBy from 'lodash/xorBy';
import { useHistory } from 'react-router';

//app
import { TaskCheckListView } from './TaskCheckList.view';
import {
  showModal,
  hideModal,
  getTaskChecklist,
  getNextTaskList,
  selectTaskCheckList,
  selectTaskNextActionList,
  selectUserOrganisation,
  resetTaskProcessingChecklistChanges,
  postSaveTaskCheckListActions,
  postSaveNextTaskAction,
  postCloseClaim,
  getCurrencyPurchasedValue,
  selectClaimsFnolPushBackRoute,
  selectFnolSelectedTab,
  addTaskNote,
} from 'stores';
import { FormCheckbox } from 'components';
import * as utils from 'utils';
import {
  ORGANIZATIONS,
  TASK_CHECKLIST_WARNINGS,
  CLOSE_CLAIM,
  ADVICE_AND_SETTLEMENT,
  TASK_TAB_COMPLETED_STATUS,
  CLAIMS_FNOL_PUSH_BACK_ROUTES,
  FIRST_ADVICE_FEEDBACK,
  CLAIM_ADHOC_TASK,
  SYNC_GXB_MANUAL,
  UPLOAD_DOCS_MANUAL,
} from 'consts';
import config from 'config';

//mui
import { Box } from '@material-ui/core';

TaskCheckList.propTypes = {
  task: PropTypes.object.isRequired,
  currencyPurchasedValue: PropTypes.string.isRequired,
  isCurrencyChanged: PropTypes.bool.isRequired,
  isDirtyRef: PropTypes.bool.isRequired,
  setIsDirty: PropTypes.func.isRequired,
  handleDirtyCheck: PropTypes.func.isRequired,
};
export default function TaskCheckList({
  task,
  currencyPurchasedValue,
  isCurrencyChanged,
  isDirtyRef,
  setIsDirty,
  handleDirtyCheck,
  sanctionCheckStatus,
  formHandlers,
}) {
  const dispatch = useDispatch();
  const history = useHistory();

  const taskCheckList = useSelector(selectTaskCheckList);
  const taskNextActionList = useSelector(selectTaskNextActionList);
  const userOrgDetail = useSelector(selectUserOrganisation);
  const pushBackRoute = useSelector(selectClaimsFnolPushBackRoute);
  const fnolSelectedTab = useSelector(selectFnolSelectedTab);

  const taskCode = task?.taskDefKey;
  const taskId = task?.taskId;
  const userOrgName = userOrgDetail?.name.toLowerCase() || ORGANIZATIONS.mphasis.name;
  const isMphasisUser = userOrgName === ORGANIZATIONS.mphasis.name;
  const saveType = { checkList: 'checkList', nextAction: 'nextAction', completeTask: 'completeTask' };

  const [allSelectionFlag, setAllSelectionFlag] = useState(false);
  const [nextActionFlag, setNextActionFlag] = useState(!isMphasisUser);
  const [mandatoryList, setMandatoryList] = useState([]);
  const [nextActionVal, setNextActionVal] = useState('');
  const [checkListChanges, setCheckListChanges] = useState([]);
  const [handleResetCheckbox, setHandleResetCheckbox] = useState(false);

  let fields = utils.generic.isValidArray(taskCheckList, true)
    ? taskCheckList.map((eachCheck) => ({
        name: eachCheck?.actionListID.toString(),
        type: 'checkbox',
        defaultValue: Boolean(eachCheck?.isActioned) || false,
        validation: eachCheck?.isMandatory ? Yup.bool().required() : Yup.bool(),
        muiComponentProps: {
          onChange: (name, value) => handleCheckListChange(name, value),
        },
      }))
    : [];

  const defaultValues = utils.form.getInitialValues(fields);
  const validationSchema = utils.form.getValidationSchema(fields);

  const checkListForm = useForm({
    defaultValues,
    ...(validationSchema && { resolver: yupResolver(validationSchema) }),
  });

  const headerFields = [
    {
      name: 'selectAllValues',
      type: 'checkbox',
      value: handleResetCheckbox,
      muiComponentProps: {
        onChange: (name, value) => handleAllCheckListSelected(name, value),
      },
    },
  ];

  const columns = [
    {
      id: 'select',
      label: (
        <Box mb={-1.25}>
          {utils.generic.isValidArray(taskCheckList, true) && (
            <FormCheckbox {...utils.form.getFieldProps(headerFields, 'selectAllValues')} />
          )}
        </Box>
      ),
      visible: true,
    },
    {
      id: 'ChecklistItems',
      label: utils.string.t('claims.processing.taskDetailsCheckList.columns.ChecklistItems'),
      sort: { type: 'lexical', direction: 'asc' },
      nowrap: true,
      visible: true,
      mandatory: true,
    },
    {
      id: 'lastUpdatedBy',
      label: utils.string.t('claims.processing.taskDetailsCheckList.columns.lastUpdatedBy'),
      sort: { type: 'lexical', direction: 'asc' },
      nowrap: true,
      visible: true,
      mandatory: true,
    },
    {
      id: 'lastUpdatedOn',
      label: utils.string.t('claims.processing.taskDetailsCheckList.columns.lastUpdatedOn'),
      sort: { type: 'date', direction: 'asc' },
      nowrap: true,
      visible: true,
      mandatory: true,
    },
  ];

  const popoverActions = [
    { id: 'blank', label: '', callback: () => handleNextActionSelected('') },
    ...taskNextActionList.map((action) => ({
      id: action?.taskCode,
      label: action?.taskLabel,
      data: action,
      callback: () => handleNextActionSelected(action?.taskCode),
    })),
  ];
  // this has to be removed after check list added to 'First Advice- Advise Market','First Advice- Client Acknowledgement'
  const demoTasks = [
    'First Advice - Advise to Market',
    'First Advice - Client Acknowledgement',
    'First Advice: Advise Market',
    'First Advice: Client Acknowledgement',
  ];
  const fetchDataFromBackend = () => {
    /** This if-else condition has to be removed after the 
     'First Advice- Advise Market','First Advice- Client Acknowledgement'
      checklist created
     **/
    if (demoTasks.includes(task?.description)) {
      dispatch(getTaskChecklist({ taskCode: 'FirstAdvice', taskId, userOrgName, viewLoader: false }));
    } else {
      taskCode === FIRST_ADVICE_FEEDBACK
        ? dispatch(getTaskChecklist({ taskCode: 'FirstAdviceFeedback', taskId, userOrgName, viewLoader: false }))
        : dispatch(getTaskChecklist({ taskCode, taskId, userOrgName, viewLoader: false }));
    }

    dispatch(getNextTaskList({ taskCode, viewLoader: false }));
    if (taskCode === ADVICE_AND_SETTLEMENT) {
      dispatch(getCurrencyPurchasedValue(task?.processId));
    }
  };

  const constructMandatoryList = () => {
    const result = taskCheckList
      .filter((item) => item?.isMandatory && !item?.isActioned)
      .map((item) => {
        return item?.actionListID.toString();
      });
    setMandatoryList(result);
  };

  const updateMandatoryList = (name) => {
    if (isMphasisUser) {
      const wasMandatory = !!taskCheckList.find((item) => {
        return item?.actionListID.toString() === name && item?.isMandatory;
      });
      if (wasMandatory) {
        const newList = xorBy(mandatoryList, [name]) || [];
        setMandatoryList(newList);
      }
    } else {
      setMandatoryList([]);
    }
  };

  const handleCheckListChange = (name, value) => {
    updateMandatoryList(name);
    const findCheckItem = taskCheckList.find((item) => {
      const keyCheck = item?.actionListID.toString();
      return keyCheck === name;
    });
    if (findCheckItem) {
      const constructChangeItem = [findCheckItem].map((item) => {
        return {
          actionListDetailID: item?.actionListDetailID,
          actionListID: item?.actionListID,
          isActioned: !value ? 0 : 1,
        };
      });
      const newChangeList = xorBy(checkListChanges, constructChangeItem, 'actionListID');
      setCheckListChanges(newChangeList);
    }
  };

  const handleAllCheckListSelected = (name, isAllSelected) => {
    setAllSelectionFlag(isAllSelected);
    setHandleResetCheckbox(!handleResetCheckbox);
    if (isMphasisUser) {
      if (isAllSelected) {
        setMandatoryList([]);
      } else {
        constructMandatoryList();
      }
      setNextActionFlag(isAllSelected);
    }
    const constructChangeItem = taskCheckList.map((item) => {
      return {
        actionListDetailID: item?.actionListDetailID,
        actionListID: item?.actionListID,
        isActioned: !isAllSelected ? 0 : 1,
      };
    });
    setCheckListChanges(constructChangeItem);
  };

  const handleNextActionSelected = (nextActionCode) => {
    setNextActionVal(nextActionCode);
    if (nextActionCode === CLOSE_CLAIM) {
      handleConfirmClaimClose(nextActionCode);
    } else {
      handleNextTaskWarning(saveType.nextAction, nextActionCode);
    }
  };

  const checkListChangeSave = () => {
    if (isMphasisUser && utils.generic.isValidArray(mandatoryList, true)) {
      handleMandatoryWarning();
    } else {
      saveTaskOperations(saveType.checkList);
    }
  };

  const checkListChangeReset = () => {
    checkListForm.reset();
    setAllSelectionFlag(false);
    setHandleResetCheckbox(false);
    setCheckListChanges([]);
    if (utils.generic.isValidArray(taskCheckList, true) && isMphasisUser) {
      constructMandatoryList();
    } else {
      setMandatoryList([]);
    }
  };

  const completeTask = () => {
    handleTaskCompleteWarning();
  };

  const saveTaskOperations = async (type, nextActionCode) => {
    // "nextTaskCode" is null for postSaveNextTaskAction to mark task as complete
    // "nextTaskCode" is null for postSaveTaskCheckListActions & postSaveNextTaskAction (complete task scenario)

    const saveRequest = {
      processID: task?.processId,
      nextTaskCode: type !== saveType.nextAction ? null : nextActionCode || nextActionVal,
      currencyPurchased: currencyPurchasedValue,
      approvalStatus: task?.approvalStatus,
      actionListDetails: checkListChanges,
    };

    if (type === saveType.checkList) {
      await dispatch(postSaveTaskCheckListActions(task?.taskId, saveRequest)).then((resp) => {
        if (resp.status === 'OK' || resp?.json?.statusCode === 500) {
          if (task?.taskDefKey === FIRST_ADVICE_FEEDBACK) {
            const notesDescription = formHandlers?.getValues();
            if (notesDescription?.details !== '') dispatch(addTaskNote(formHandlers?.getValues(), task));
          }
        }
      });
      fetchDataFromBackend();
    } else {
      await dispatch(postSaveNextTaskAction(task?.taskId, saveRequest)).then((resp) => {
        if (resp.status === 'OK' || resp?.json?.statusCode === 500) {
          if (
            task?.taskDefKey === FIRST_ADVICE_FEEDBACK ||
            task?.taskDefKey === CLAIM_ADHOC_TASK ||
            task?.taskDefKey === SYNC_GXB_MANUAL ||
            task?.taskDefKey === UPLOAD_DOCS_MANUAL
          ) {
            const notesDescription = formHandlers?.getValues();
            if (notesDescription?.details !== '') dispatch(addTaskNote(formHandlers?.getValues(), task));
            formHandlers?.setValue('details', '');
          }
        }
      });
      navigateToTaskGrid();
    }

    checkListChangeReset();
  };

  const closeClaimTask = async (nextActionCode) => {
    const payload = {
      nextTaskCode: nextActionCode,
      processID: task?.rootProcessId,
    };
    await dispatch(postCloseClaim(task?.taskId, payload));
    navigateToTaskGrid();
  };

  const handleMandatoryWarning = () => {
    dispatch(
      showModal({
        component: 'CHECK_LIST_ALERTS',
        props: {
          title: utils.string.t('navigation.alert'),
          hideCompOnBlur: false,
          fullWidth: true,
          maxWidth: 'sm',
          disableAutoFocus: true,
          componentProps: {
            type: TASK_CHECKLIST_WARNINGS.type.mandatory,
            handlers: {
              submit: () => {
                dispatch(hideModal());
                if (nextActionVal) {
                  handleNextTaskWarning();
                } else {
                  saveTaskOperations(saveType.checkList);
                }
              },
              cancel: () => {
                dispatch(hideModal());
              },
            },
          },
        },
      })
    );
  };

  const handleNextTaskWarning = (type = saveType.checkList, nextActionCode) => {
    dispatch(
      showModal({
        component: 'CHECK_LIST_ALERTS',
        props: {
          title: utils.string.t('navigation.alert'),
          hideCompOnBlur: false,
          fullWidth: true,
          maxWidth: 'sm',
          disableAutoFocus: true,
          componentProps: {
            type: TASK_CHECKLIST_WARNINGS.type.nextTask,
            handlers: {
              submit: () => {
                dispatch(hideModal());
                saveTaskOperations(type, nextActionCode);
              },
              cancel: () => {
                dispatch(hideModal());
              },
            },
          },
        },
      })
    );
  };

  const handleTaskCompleteWarning = () => {
    dispatch(
      showModal({
        component: 'CHECK_LIST_ALERTS',
        props: {
          title: utils.string.t('navigation.alert'),
          hideCompOnBlur: false,
          fullWidth: true,
          maxWidth: 'sm',
          disableAutoFocus: true,
          componentProps: {
            type: TASK_CHECKLIST_WARNINGS.type.completeTask,
            handlers: {
              submit: () => {
                dispatch(hideModal());
                saveTaskOperations(saveType.completeTask);
              },
              cancel: () => {
                dispatch(hideModal());
              },
            },
          },
        },
      })
    );
  };

  const checklistDirtyCheck = () => {
    if (isDirtyRef) {
      handleDirtyCheck('', true);
    } else {
      switch (pushBackRoute) {
        case CLAIMS_FNOL_PUSH_BACK_ROUTES.routes.lossAndClaims:
          return history.replace(`${config.routes.claimsFNOL.root}${fnolSelectedTab ? `/tab/${fnolSelectedTab}` : ''}`);
        case CLAIMS_FNOL_PUSH_BACK_ROUTES.routes.lossDashboard:
          return history.replace(`${config.routes.claimsFNOL.loss}/${task?.lossRef}`);
        case CLAIMS_FNOL_PUSH_BACK_ROUTES.routes.claimsDashboard:
          return history.replace(`${config.routes.claimsFNOL.claim}/${task?.processRef}`);
        default:
          return;
      }
    }
  };

  const handleConfirmClaimClose = (nextActionCode) => {
    dispatch(
      showModal({
        component: 'CONFIRM',
        props: {
          title: utils.string.t('status.alert'),
          hint: utils.string.t('claims.processing.taskDetailsCheckList.closeClaims'),
          fullWidth: true,
          maxWidth: 'xs',
          componentProps: {
            cancelLabel: utils.string.t('app.no'),
            confirmLabel: utils.string.t('app.yes'),
            submitHandler: () => {
              closeClaimTask(nextActionCode);
            },
          },
        },
      })
    );
  };

  const navigateToTaskGrid = () => {
    history.push(`${config.routes.claimsFNOL.taskTab}`);
  };

  const isCompletedTask = task?.status === TASK_TAB_COMPLETED_STATUS;
  const isCheckListChanged = utils.generic.isValidArray(checkListChanges, true);
  const hasCheckList = utils.generic.isValidArray(taskCheckList, true);
  const hasNextActions = utils.generic.isValidArray(popoverActions, true) && popoverActions.length > 1;

  useEffect(() => {
    fetchDataFromBackend();
    return () => {
      dispatch(resetTaskProcessingChecklistChanges());
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (utils.generic.isValidArray(taskCheckList, true) && isMphasisUser) {
      constructMandatoryList();
    }
  }, [taskCheckList]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isMphasisUser) {
      if (utils.generic.isValidArray(taskCheckList, true) && !utils.generic.isValidArray(mandatoryList, true)) {
        setNextActionFlag(true);
      } else {
        setNextActionFlag(false);
      }
    }
  }, [mandatoryList]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setIsDirty(isCheckListChanged || isCurrencyChanged);
  }, [isCheckListChanged, isCurrencyChanged]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <TaskCheckListView
      isCompletedTask={isCompletedTask}
      allSelectionFlag={allSelectionFlag}
      nextActionFlag={nextActionFlag}
      isMphasisUser={isMphasisUser}
      isCheckListChanged={isCheckListChanged}
      hasCheckList={hasCheckList}
      hasNextActions={hasNextActions}
      columns={columns}
      rows={taskCheckList}
      fields={fields}
      formControls={checkListForm}
      popoverActions={popoverActions}
      isCurrencyChanged={isCurrencyChanged}
      task={task}
      sanctionCheckStatus={sanctionCheckStatus}
      handlers={{
        checkListChangeSave,
        checkListChangeReset,
        completeTask,
        checklistDirtyCheck,
      }}
    />
  );
}
