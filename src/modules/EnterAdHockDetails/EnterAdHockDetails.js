import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import moment from 'moment';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import EnterAdHockDetailsView from './EnterAdHockDetails.view';

import * as utils from 'utils';

import { yupResolver } from '@hookform/resolvers/yup';
import {
  selectPriorities,
  selectClaimsAssignedToUsers,
  postSaveAdHocTask,
  selectUser,
  selectAdhocTaskData,
  postEditAdHocTask,
} from 'stores';

EnterAdHockDetails.propTypes = {
  handleNext: PropTypes.func.isRequired,
  handleSkipUpload: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  claim: PropTypes.object.isRequired,
  handleFormStatus: PropTypes.func.isRequired,
  reminderList: PropTypes.array.isRequired,
};
EnterAdHockDetails.defaultProps = {
  handleNext: () => {},
  handleSkipUpload: () => {},
  handleCancel: () => {},
  claim: {},
  handleFormStatus: () => {},
  reminderList: [],
};

export default function EnterAdHockDetails({ handleNext, handleSkipUpload, handleCancel, claim, handleFormStatus, reminderList }) {
  const dispatch = useDispatch();
  const priorities = useSelector(selectPriorities);
  const selectAssignees = useSelector(selectClaimsAssignedToUsers);
  const loginUserInfo = useSelector(selectUser);
  const [users, setfilterUser] = useState([]);
  const taskDetails = useSelector(selectAdhocTaskData);

  const defaultOrganization = {
    organisationName: loginUserInfo?.organisation?.name,
    organisationId: loginUserInfo?.organisation?.id,
  };

  const team = [
    {
      organisationName: 'Mphasis',
      organisationId: 1,
    },
    {
      organisationName: 'Ardonagh',
      organisationId: 2,
    },
  ];

  const defaultPriority = {
    id: '2',
    name: null,
    description: 'Medium',
  };
  const fields = [
    {
      id: 'taskName',
      name: 'taskName',
      type: 'text',
      label: utils.string.t('claims.processing.taskDetailsLabels.taskName'),
      value: taskDetails?.name || '',
      validation: Yup.string().required(utils.string.t('validation.required')),
    },
    {
      name: 'priority',
      id: 'priority',
      type: 'select',
      label: utils.string.t('claims.processing.taskDetailsLabels.priority'),
      options: utils.generic.isValidArray(priorities, true) ? priorities : [],
      optionKey: 'id',
      optionLabel: 'description',
      validation: Yup.string().required(utils.string.t('validation.required')),
      defaultValue: Boolean(taskDetails?.priority) ? priorities?.find(({ id }) => id === taskDetails?.priority)?.id : defaultPriority?.id,
    },
    {
      id: 'team',
      name: 'team',
      type: 'select',
      label: utils.string.t('claims.processing.taskDetailsLabels.team'),
      options: utils.generic.isValidArray(team, true) ? team : [],
      defaultValue: Boolean(taskDetails?.sendToTeam)
        ? team?.find(({ organisationName }) => organisationName?.toLowerCase() === taskDetails?.sendToTeam?.toLowerCase())?.organisationId
        : defaultOrganization?.organisationId,
      optionKey: 'organisationId',
      optionLabel: 'organisationName',
      validation: Yup.string().required(utils.string.t('validation.required')),
    },
    {
      id: 'assignTo',
      name: 'assignTo',
      type: 'autocompletemui',
      label: utils.string.t('claims.processing.taskDetailsLabels.assignedTo'),
      options: utils.generic.isValidArray(users, true) ? users : [],
      optionKey: 'email',
      optionLabel: 'fullName',
      validation: Yup.object().required(utils.string.t('validation.required')).nullable(),
      defaultValue: null,
    },
    {
      id: 'taskDescription',
      name: 'taskDescription',
      label: `${utils.string.t('claims.processing.taskDetailsLabels.description')}`,
      type: 'textarea',
      value: taskDetails?.description || '',
      muiComponentProps: {
        multiline: true,
        rows: 5,
        rowsMax: 5,
      },
      validation: Yup.string().required(utils.string.t('validation.required')),
    },
    {
      id: 'targetDueDate',
      type: 'datepicker',
      name: 'targetDueDate',
      label: utils.string.t('claims.processing.taskDetailsLabels.targetDueDate'),
      icon: 'TodayIcon',
      value: Boolean(taskDetails?.dueDate) ? taskDetails?.dueDate : null,
      muiComponentProps: {
        fullWidth: true,
      },
      validation: Yup.date()
        .required(utils.string.t('validation.required'))
        .nullable()
        .test('from', utils.string.t('claims.processing.validation.targetLessThanCreatedDate'), function (value) {
          const createdDate = new moment();
          return value && createdDate ? moment(value).isSameOrAfter(createdDate, 'day') : true;
        }),
    },
    {
      id: 'reminder',
      name: 'reminder',
      type: 'autocompletemui',
      label: utils.string.t('claims.processing.taskDetailsLabels.reminder'),
      options: reminderList?.length ? reminderList : [],
      optionKey: 'id',
      optionLabel: 'name',
      validation: Yup.object().nullable(),
      defaultValue: Boolean(taskDetails?.reminder) ? reminderList?.find(({ id }) => id === taskDetails?.reminder) : null,
    },
  ];

  const defaultValues = utils.form.getInitialValues(fields);
  const validationSchema = utils.form.getValidationSchema(fields);

  const { errors, control, handleSubmit, formState, watch, setValue } = useForm({
    defaultValues,
    ...(validationSchema && { resolver: yupResolver(validationSchema) }),
  });
  const formIsDirty = formState.isDirty;
  const watchTeam = watch('team');
  const assignedTo = watch('assignTo');

  useEffect(() => {
    let filteredUser = [];
    if (Boolean(taskDetails?.sendToTeam)) {
      filteredUser = selectAssignees?.items?.filter(
        (profile) => profile?.organisationName?.toLowerCase() === taskDetails?.sendToTeam?.toLowerCase()
      );
      setfilterUser(filteredUser);
      const assignedTo = filteredUser?.find(({ email }) => email?.toLowerCase() === taskDetails?.sendToUser?.toLowerCase());
      setValue('assignTo', assignedTo);
    } else if (Boolean(watchTeam)) {
      filteredUser = selectAssignees?.items?.filter((profile) => profile?.organisationId === watchTeam);
      setfilterUser(filteredUser);
    } else if (watchTeam === null) {
      setfilterUser(selectAssignees?.items);
    } else {
      filteredUser = selectAssignees?.items?.filter((profile) => profile?.organisationId === loginUserInfo?.organisation?.id);
      setfilterUser(filteredUser);
    }
    if (Boolean(assignedTo)) {
      const isValidSelection = !filteredUser?.some(({ email }) => assignedTo?.email?.toLowerCase() === email?.toLowerCase());
      isValidSelection && setValue('assignTo', null);
    }
  }, [selectAssignees, watchTeam]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (formIsDirty) {
      handleFormStatus();
    }
  }, [formIsDirty]); // eslint-disable-line react-hooks/exhaustive-deps

  const createAdHocTask = (values) => {
    const targetDueDate =
      utils.string.t('format.date', { value: { date: watch('targetDueDate'), format: 'YYYY-MM-DDT00:00:00.000' } }) + 'Z';
    const adHocData = {
      assignedTo: values?.assignTo?.email,
      bpmProcessId: Boolean(taskDetails?.id) ? taskDetails?.processInstanceId : claim?.processID,
      claimRef: claim?.claimReference,
      description: values?.taskDescription,
      priority: Number(values?.priority),
      reminder: values?.reminder?.id,
      requestedByTeam: loginUserInfo?.organisation?.name,
      sendToTeam: values?.assignTo?.organisationName,
      sendToUser: values?.assignTo?.email,
      status: claim?.status,
      targetDueDate: targetDueDate,
      taskName: values?.taskName,
    };
    if (formIsDirty) {
      if (Boolean(taskDetails?.id)) {
        dispatch(postEditAdHocTask(adHocData, taskDetails?.id)).then((response) => {
          if (response?.status === 'OK') {
            handleNext();
          }
        });
      } else {
        dispatch(postSaveAdHocTask(adHocData)).then((response) => {
          if (response?.status === 'OK') {
            handleNext();
          }
        });
      }
    } else {
      handleNext();
    }
  };

  const skipUploadDocs = (values) => {
    const targetDueDate =
      utils.string.t('format.date', { value: { date: watch('targetDueDate'), format: 'YYYY-MM-DDT00:00:00.000' } }) + 'Z';
    const adHocData = {
      assignedTo: values?.assignTo?.email,
      bpmProcessId: Boolean(taskDetails?.id) ? taskDetails?.processInstanceId : claim?.processID,
      claimRef: claim?.claimReference,
      description: values?.taskDescription,
      priority: Number(values?.priority),
      reminder: values?.reminder?.id,
      requestedByTeam: loginUserInfo?.organisation?.name,
      sendToTeam: values?.assignTo?.organisationName,
      sendToUser: values?.assignTo?.email,
      status: claim?.status,
      targetDueDate: targetDueDate,
      taskName: values?.taskName,
    };
    if (formIsDirty) {
      if (Boolean(taskDetails?.id)) {
        dispatch(postEditAdHocTask(adHocData, taskDetails?.id)).then((response) => {
          if (response?.status === 'OK') {
            handleSkipUpload();
          }
        });
      } else {
        dispatch(postSaveAdHocTask(adHocData)).then((response) => {
          if (response?.status === 'OK') {
            handleSkipUpload();
          }
        });
      }
    } else {
      handleSkipUpload();
    }
  };

  return (
    <EnterAdHockDetailsView
      fields={fields}
      handleCancel={handleCancel}
      errors={errors}
      control={control}
      claim={claim}
      handleSubmit={handleSubmit}
      createAdHocTask={createAdHocTask}
      skipUploadDocs={skipUploadDocs}
    />
  );
}
