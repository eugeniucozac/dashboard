import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import moment from 'moment';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

//app
import { CreateRFIView } from './CreateRFI.view';
import {
  REMINDER_DEFAULT,
  REMINDER_VALUES,
  REMINDER_NOT_REQUIRED,
  PRIORITIES_ID,
  RFI,
  ORGANIZATIONS,
  DMS_TASK_CONTEXT_TYPE_RFI,
} from 'consts';
import {
  selectPriorities,
  selectClaimsAssignedToUsers,
  selectRefDataQueryCodes,
  postSaveRFI,
  postUpdateRFI,
  selectUserEmail,
  selectUserOrg,
  selectUser,
  selectRefDataNewProcessType,
  selectCreateRfiInfo,
  setDmsTaskContextType,
} from 'stores';
import * as utils from 'utils';

CreateRFI.propTypes = {
  claim: PropTypes.object,
  cancelHandler: PropTypes.func,
  type: PropTypes.string,
};

export default function CreateRFI(props) {
  const dispatch = useDispatch();

  const { claim, rfiType, handleFormStatus } = props;

  // Redux
  const priorities = useSelector(selectPriorities);
  const queryCodes = useSelector(selectRefDataQueryCodes);
  const selectAssignees = useSelector(selectClaimsAssignedToUsers);
  const createRfiInfo = useSelector(selectCreateRfiInfo);
  const userEmail = useSelector(selectUserEmail);
  const userOrg = useSelector(selectUserOrg);
  const userId = useSelector(selectUser)?.id;
  const rfiProcessTypes = useSelector(selectRefDataNewProcessType);

  const assignedToUsers = selectAssignees?.items?.filter((user) => user.email !== userEmail);

  const [sendToUsers, setSendToUSers] = useState();

  const claimId = claim?.businessProcessID || claim?.claimId || null;
  const claimReference = claim?.claimReference || claim?.claimRef || null;
  const rfiProcessId = rfiProcessTypes?.find((type) => type?.processTypeDetails === RFI)?.processTypeID;
  const claimRef = claim?.claimReference || claim?.taskRef || claim?.lossRef || '';
  const teamList = [ORGANIZATIONS.mphasis, ORGANIZATIONS.ardonagh];
  const maxDescLimit = 1000;

  const fields = [
    {
      name: 'queryCode',
      type: 'autocompletemui',
      options: queryCodes || [],
      label: utils.string.t('claims.columns.createRFIColumns.queryCode'),
      optionKey: 'queryCodeDetails',
      optionLabel: 'queryCodeDescription',
      validation: Yup.object().nullable().required(utils.string.t('validation.required')),
      value: queryCodes?.find((code) => code.queryCodeDetails === createRfiInfo?.queryCode),
    },
    {
      name: 'priority',
      type: 'select',
      options: priorities || [],
      label: utils.string.t('claims.columns.createRFIColumns.priority'),
      optionKey: 'id',
      optionLabel: 'description',
      value: priorities?.find(({ id }) => id.toString() === createRfiInfo?.priority)?.id,
      validation: Yup.string().required(utils.string.t('validation.required')),
      defaultValue: priorities?.find(({ id }) => id === PRIORITIES_ID[1])?.id,
    },
    {
      name: 'teams',
      type: 'select',
      options: teamList || [],
      label: utils.string.t('claims.columns.createRFIColumns.team'),
      optionKey: 'label',
      optionLabel: 'label',
      value: teamList.find(({ label }) => label === createRfiInfo?.sendToTeam)?.label,
      validation: Yup.string().required(utils.string.t('validation.required')),
    },
    {
      name: 'sendTo',
      type: 'autocompletemui',
      options: sendToUsers || [],
      label: utils.string.t('claims.columns.createRFIColumns.sendTo'),
      optionKey: 'email',
      optionLabel: 'fullName',
      value: assignedToUsers?.find(({ email }) => email === createRfiInfo?.sendToUser),
      validation: Yup.object().nullable().required(utils.string.t('validation.required')),
    },
    {
      name: 'reminder',
      type: 'autocompletemui',
      label: utils.string.t('claims.processing.taskDetailsLabels.reminder'),
      options: REMINDER_VALUES || [],
      optionKey: 'id',
      optionLabel: 'name',
      value:
        REMINDER_VALUES?.find((item) => item.id === createRfiInfo?.reminderDate) ||
        REMINDER_VALUES?.find((item) => item.id === REMINDER_DEFAULT),
    },
    {
      type: 'datepicker',
      name: 'targetDueDate',
      icon: 'TodayIcon',
      label: utils.string.t('claims.processing.taskDetailsLabels.targetDueDate'),
      muiComponentProps: {
        fullWidth: true,
      },
      validation: Yup.date()
        .nullable()
        .test('targetDueDate', utils.string.t('claims.processing.validation.targetLessThanCreatedDate'), function (value) {
          const createdDate = new moment();
          return value && createdDate ? moment(value).isSameOrAfter(createdDate, 'day') : true;
        }),
      outputFormat: 'iso',
      value: moment(createRfiInfo?.targetDueDate) || new moment(),
    },
    {
      name: 'description',
      type: 'textarea',
      label: utils.string.t('claims.processing.taskDetailsLabels.description'),
      muiComponentProps: {
        inputProps: { maxLength: 1000 },
        multiline: true,
        minRows: 3,
        maxRows: 5,
      },
      value: createRfiInfo?.description,
      validation: Yup.string().required(utils.string.t('validation.required')),
    },
  ];

  const defaultValues = utils.form.getInitialValues(fields);
  const validationSchema = utils.form.getValidationSchema(fields);

  const {
    control,
    errors,
    handleSubmit,
    watch,
    formState: { isDirty },
  } = useForm({
    defaultValues,
    ...(validationSchema && { resolver: yupResolver(validationSchema) }),
  });
  const qcWatcher = watch('queryCode');
  const targetDateWatcher = watch('targetDueDate');
  const selectedTeam = watch('teams');

  useEffect(() => {
    // It was an important condition for earlier build of RFI. so currently commenting as it is not mentioned in current US.
    // const queryObj = queryCodes.find((query) => qcWatcher?.queryCodeDetails === query.queryCodeDetails);
    // if (qcWatcher && !createRfiInfo?.targetDueDate) {
    //   const slaTargetDate = getTargetBusinessDays(new Date(), queryObj?.sla);
    //   setValue('targetDueDate', slaTargetDate);
    // }
    if (selectedTeam) {
      const userList = assignedToUsers.filter((user) => user.organisationName === selectedTeam);
      setSendToUSers(userList);
    }
  }, [qcWatcher, selectedTeam]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isDirty) {
      handleFormStatus();
    }
  }, [isDirty, errors]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (targetDateWatcher) {
      const reminderDays = utils.date.diffDays(new moment(), new moment(targetDateWatcher));
      const remObj = [];
      REMINDER_VALUES.forEach((reminder) => {
        if (reminder.days <= reminderDays) {
          remObj.push(REMINDER_VALUES.find((list) => reminder.id === list.id));
        }
      });

      remObj.push(REMINDER_VALUES.find((list) => list.id === REMINDER_NOT_REQUIRED));
    }
  }, [targetDateWatcher]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCreateRFI = (values, nextHandler) => {
    const sendToObj = assignedToUsers.find((user) => user.email === values?.sendTo?.email);
    let rfiDetails = {
      caseIncidentRefType: rfiType,
      caseInstanceId: claim?.caseIncidentID,
      claimId: claimId?.toString() || null,
      claimRef: claimReference,
      description: values.description,
      lossId: claim?.lossDetailID?.toString() || claim?.lossDetailId?.toString() || null,
      lossRef: claim?.lossRef || null,
      priority: values?.priority || null,
      processInstanceId: claim?.rootProcessId?.toString() || claim?.processID?.toString() || null,
      processTypeId: rfiProcessId,
      queryCode: values?.queryCode?.queryCodeDetails,
      queryCodeDescription: values?.queryCode?.queryCodeDescription,
      reminderDate: values?.reminder?.id || null,
      requestedByTeam: userOrg,
      requestedByUser: userEmail,
      sendToTeam: values?.teams,
      sendToUser: sendToObj?.email,
      targetDueDate: values.targetDueDate,
      taskId: createRfiInfo?.taskId || null,
      taskRef: createRfiInfo?.taskRef || null,
      userId,
    };

    if (utils.generic.isValidObject(createRfiInfo, 'processId')) {
      rfiDetails = {
        ...rfiDetails,
        processId: createRfiInfo?.processId || '',
        processInstanceId: createRfiInfo?.processId || claim?.rootProcessId?.toString() || claim?.processID?.toString() || null,
      };
    }
    dispatch(utils.generic.isValidObject(createRfiInfo, 'processId') ? postUpdateRFI(rfiDetails) : postSaveRFI(rfiDetails)).then(
      (response) => {
        if (response) {
          dispatch(setDmsTaskContextType({ type: DMS_TASK_CONTEXT_TYPE_RFI, refId: response?.data?.taskId }));
          nextHandler();
        }
      }
    );
  };

  const submitForm = (values) => {
    handleCreateRFI(values, props.handleNextSubmit);
  };
  const skipSubmit = (values) => {
    handleCreateRFI(values, () => props.handleSkip(2));
  };

  return (
    <CreateRFIView
      {...props}
      claimRef={claimRef}
      fields={fields}
      formProps={{
        control,
        errors,
        isDirty,
        watch,
        handleSubmit,
      }}
      maxDescLimit={maxDescLimit}
      handlers={{
        submitForm,
        skipSubmit,
      }}
    />
  );
}
