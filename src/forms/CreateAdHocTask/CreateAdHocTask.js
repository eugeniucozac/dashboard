import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import moment from 'moment';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

//app
import styles from './CreateAdHocTask.styles';
import { CreateAdHocTaskView } from './CreateAdHocTask.view';
import {
  showModal,
  hideModal,
  getPriorityLevels,
  selectPriorities,
  getUsersByOrg,
  selectClaimsAssignedToUsers,
  postSaveAdHocTask,
  postEditAdHocTask,
  resetClaimsAssignedToUsers,
  setDmsTaskContextType,
  resetDmsTaskTypeContext,
  getClaimRefTasks,
} from 'stores';
import * as utils from 'utils';
import * as constants from 'consts';

// mui
import { makeStyles } from '@material-ui/core';

//mui
CreateAdHocTask.propTypes = {
  claim: PropTypes.object,
  cancelHandler: PropTypes.func,
  submitHandler: PropTypes.func,
};

export default function CreateAdHocTask({ claim, cancelHandler, submitHandler }) {
  const classes = makeStyles(styles, { name: 'CreateAdHocTask' })();
  const dispatch = useDispatch();
  const [resetKey, setResetKey] = useState();
  const [additionalResetKey, setAdditionalResetKey] = useState();
  // Redux
  const priorities = useSelector(selectPriorities);
  const selectAssignees = useSelector(selectClaimsAssignedToUsers);
  const assignedToUsers = selectAssignees?.items;
  const taskDetails = claim?.taskRef ? { ...claim } : null;
  const isEditFlag = utils.generic.isValidObject(taskDetails);
  const [isTaskSubmitted, setIsTaskSubmitted] = useState(false);
  const [isUploadDocuments, setIsUploadDocuments] = useState(false);
  const [adHocTaskData, setAdHocTaskData] = useState({});

  // State
  const [additionalAssigneeList, setAdditionalAssigneeList] = useState(assignedToUsers);
  const reminderList = [
    { id: '1D', name: utils.string.t('claims.processing.taskReminderLabels.oneDayBfr') },
    { id: '2D', name: utils.string.t('claims.processing.taskReminderLabels.twoDayBfr') },
    { id: '3D', name: utils.string.t('claims.processing.taskReminderLabels.threeDayBfr') },
    { id: '4D', name: utils.string.t('claims.processing.taskReminderLabels.fourDayBfr') },
    { id: '1W', name: utils.string.t('claims.processing.taskReminderLabels.oneWeekBfr') },
    { id: '2W', name: utils.string.t('claims.processing.taskReminderLabels.twoWeekBfr') },
    { id: 'NA', name: utils.string.t('claims.processing.taskReminderLabels.noReminder') },
  ];
  const claimRef = claim?.claimRef || taskDetails?.processRef;
  const [taskStatus, setTaskStatus] = useState(taskDetails?.status);
  const taskStatusOptions = constants.TASK_STATUS;

  const getAssigneeFromList = (searchedEmail) => {
    if (searchedEmail && assignedToUsers) {
      let userData = assignedToUsers?.find((user) => searchedEmail.toLowerCase() === user.email.toLowerCase());
      return userData || null;
    }
    return '';
  };
  const fields = [
    {
      name: 'taskName',
      type: 'text',
      label: utils.string.t('claims.processing.taskDetailsLabels.taskName'),
      validation: Yup.string().required(utils.string.t('validation.required')),
      value: taskDetails?.taskType || '',
      muiComponentProps: {
        disabled: taskDetails !== null,
        classes: {
          root: classes.newLabel,
        },
      },
    },
    {
      name: 'priority',
      type: 'select',
      label: utils.string.t('claims.processing.taskDetailsLabels.priority'),
      options: utils.generic.isValidArray(priorities, true) ? priorities : [],
      optionKey: 'id',
      optionLabel: 'description',
      validation: Yup.string().required(utils.string.t('validation.required')),
      defaultValue: priorities?.find(({ description, id }) => description === taskDetails?.priority || id === constants?.PRIORITIES_ID[1])?.id,
      muiComponentProps: {
        classes: {
          root: classes.newLabel,
        },
      },
    },
    {
      name: 'status',
      type: 'autocompletemui',
      options: taskStatusOptions,
      label: utils.string.t('app.status'),
      optionKey: 'id',
      optionLabel: 'status',
      muiComponentProps: {
        disabled: constants.TASK_TYPES_NATIVE === taskDetails?.taskCategory || taskDetails === null,
        classes: {
          root: classes.newLabel,
        },
      },
      defaultValue: taskStatusOptions?.find(({ status }) => status === taskStatus),
    },
    {
      name: 'assignedTo',
      type: 'autocompletemui',
      label: utils.string.t('claims.processing.taskDetailsLabels.assignedTo'),
      options: utils.generic.isValidArray(assignedToUsers, true) ? assignedToUsers : [],
      optionKey: 'email',
      optionLabel: 'fullName',
      validation: !taskDetails && Yup.object().required(utils.string.t('validation.required')).nullable(),
      defaultValue: taskDetails && utils.generic.isValidArray(assignedToUsers) ? getAssigneeFromList(taskDetails.assignee) : null,
      muiComponentProps: {
        disabled: taskDetails !== null,
        classes: {
          root: classes.newLabel,
        },
      },
    },
    {
      name: 'addtlAssignee',
      type: 'autocompletemui',
      options: [{ id: -1, fullName: '', email: '' }, ...(utils.generic.isValidArray(additionalAssigneeList) ? additionalAssigneeList : [])],
      optionKey: 'email',
      optionLabel: 'fullName',
      defaultValue: taskDetails && utils.generic.isValidArray(assignedToUsers) ? getAssigneeFromList(taskDetails.additionalAssignee) : null,
      muiComponentProps: {
        disabled: taskDetails !== null,
      },
    },
    {
      name: 'reminder',
      type: 'autocompletemui',
      options: reminderList?.length ? reminderList : [],
      label: utils.string.t('claims.processing.taskDetailsLabels.reminder'),
      optionKey: 'id',
      optionLabel: 'name',
      defaultValue: utils.generic.isValidObject(taskDetails) && reminderList?.find((item) => item?.id === taskDetails?.reminder),
      muiComponentProps: {
        classes: {
          root: classes.newLabel,
        },
      },
    },
    {
      type: 'datepicker',
      name: 'targetDueDate',
      icon: 'TodayIcon',
      label: utils.string.t('claims.processing.taskDetailsLabels.targetDueDate'),
      muiComponentProps: {
        fullWidth: true,
        classes: {
          root: classes.datepicker,
        },
      },
      validation: Yup.date()
        .nullable()
        .test('from', utils.string.t('claims.processing.validation.targetLessThanCreatedDate'), function (value) {
          const createdDate = new moment();
          return value && createdDate ? moment(value).isSameOrAfter(createdDate, 'day') : true;
        }),
      outputFormat: 'iso',
      value: moment(taskDetails?.targetDueDate) || '',
    },
    {
      name: 'description',
      type: 'textarea',
      label: utils.string.t('claims.processing.taskDetailsLabels.description'),
      muiComponentProps: {
        inputProps: { maxLength: 350 },
        multiline: true,
        rows: 5,
        rowsMax: 5,
        'data-testid': 'details',
        classes: {
          root: classes.newLabel,
        },
      },
      validation: Yup.string().required(utils.string.t('validation.required')),
      value: taskDetails?.description || '',
    },
  ];
  const defaultValues = utils.form.getInitialValues(fields);
  const validationSchema = utils.form.getValidationSchema(fields);
  const { control, reset, errors, handleSubmit, formState, watch, setValue } = useForm({
    defaultValues,
    ...(validationSchema && { resolver: yupResolver(validationSchema) }),
  });
  const { isDirty } = formState;
  const assignedToField = watch('assignedTo');
  const taskStatusChanged = watch('status');

  const createEligibleList = (allList, existingAssignees) => {
    if (utils.generic.isValidArray(existingAssignees, true)) {
      return allList.filter(({ email }) => existingAssignees.indexOf(email.toLowerCase()) === -1);
    } else {
      return allList;
    }
  };
  const onClosingUploadModal = () => {
    dispatch(hideModal());
  };

  useEffect(() => {
    if (assignedToField) {
      const existingAssignees = taskDetails?.assignee.toLowerCase();
      setAdditionalAssigneeList(
        createEligibleList(assignedToUsers, [...(existingAssignees ? existingAssignees : []), assignedToField?.email?.toLowerCase()])
      );
      setAdditionalResetKey(new Date().getTime());
    }
    isEditFlag && setResetKey(new Date().getTime());
  }, [assignedToUsers, assignedToField]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (taskStatusChanged) {
      setTaskStatus(taskStatusChanged.status);
    }
  }, [taskStatusChanged]);
  const handleCreateAdhocCancel = () => {
    if (isDirty) {
      dispatch(
        showModal({
          component: 'CONFIRM',
          props: {
            fullWidth: true,
            title: utils.string.t('claims.complexityRulesManagementDetails.alertModal.title'),
            maxWidth: 'xs',
            componentProps: {
              confirmLabel: utils.string.t('app.yes'),
              cancelLabel: utils.string.t('app.no'),
              confirmMessage: utils.string.t('claims.processing.modal.adhocCancelLabel'),
              buttonColors: { confirm: 'secondary', cancel: 'default' },
              submitHandler: () => {
                utils.generic.isFunction(cancelHandler) && cancelHandler();
              },
              handleClose: () => {},
            },
          },
        })
      );
    } else {
      dispatch(hideModal());
    }
  };

  const handleAdHocTaskSubmit = (values) => {
    const adHocData = {
      additionalAssignee: values?.addtlAssignee?.email,
      assignedTo: values?.assignedTo?.email,
      bpmProcessId: claim.processID,
      claimRef: values.claimRef,
      description: values.description,
      followUpdate: null,
      priority: values?.priority,
      reminder: values.reminder?.id,
      requestedBy: null,
      targetDueDate: values.targetDueDate,
      taskName: values.taskName,
    };
    if (taskDetails !== null) {
      const editAdHocData = {
        taskId: taskDetails.taskId,
        bpmProcessId: claim.rootProcessId,
        priority: values?.priority,
        reminder: values.reminder?.id,
        targetDueDate: values.targetDueDate,
        description: values.description,
        status: taskStatus,
        followUpDate: null,
      };
      dispatch(postEditAdHocTask(editAdHocData, taskDetails?.taskId)).then(
        () => utils.generic.isFunction(submitHandler) && submitHandler()
      );
    } else {
      dispatch(postSaveAdHocTask(adHocData)).then((createdAdHocTaskData) => {
        setIsTaskSubmitted(true);
        setAdHocTaskData({ taskId: createdAdHocTaskData?.data?.id });
        dispatch(setDmsTaskContextType({ type: constants.DMS_TASK_CONTEXT_TYPE_ADHOC, refId: createdAdHocTaskData?.data?.id }));
      });
    }
  };
  const actions = [
    {
      name: 'secondary',
      label: utils.string.t('app.cancel'),
      handler: () => {
        handleCreateAdhocCancel();
      },
    },
    {
      name: 'submit',
      label: utils.string.t('app.saveClose'),
      handler: (values) => {
        handleAdHocTaskSubmit(values);
      },
    },
  ];

  const docsPromptActions = {
    no: {
      label: utils.string.t('app.no'),
      handler: () => {
        setIsUploadDocuments(false);
        dispatch(hideModal());
      },
    },
    yes: {
      label: utils.string.t('app.yes'),
      handler: () => {
        setIsUploadDocuments(true);
      },
    },
  };

  useEffect(() => {
    dispatch(setDmsTaskContextType({ type: constants.DMS_TASK_CONTEXT_TYPE_ADHOC }));
    dispatch(getPriorityLevels());
    dispatch(resetClaimsAssignedToUsers());
    dispatch(getUsersByOrg(claim?.team, [claim], 'createAdHocTask'));
    setResetKey(new Date().getTime());

    return () => {
      dispatch(resetDmsTaskTypeContext());
      dispatch(getClaimRefTasks({ requestType: constants.CLAIM_PROCESSING_REQ_TYPES.search }));
      dispatch(getClaimRefTasks({ requestType: constants.CLAIM_PROCESSING_REQ_TYPES.filter }));
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (utils.generic.isInvalidOrEmptyArray(priorities)) return null;

  return (
    <CreateAdHocTaskView
      claimRef={claimRef}
      taskDetails={taskDetails}
      actions={actions}
      fields={fields}
      control={control}
      errors={errors}
      setValue={setValue}
      handleSubmit={handleSubmit}
      formState={formState}
      reset={reset}
      resetKey={resetKey}
      additionalResetKey={additionalResetKey}
      isEditFlag={isEditFlag}
      adHocTaskData={adHocTaskData}
      isTaskSubmitted={isTaskSubmitted}
      docsPromptActions={docsPromptActions}
      isUploadDocuments={isUploadDocuments}
      handlers={{
        onClosingUploadModal,
      }}
    />
  );
}
