import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

//app
import { ChangePriorityView } from './ChangePriority.view';
import {
  getPriorityLevels,
  selectPriorities,
  selectClaimsAssignedToUsers,
  showModal,
  getUsersByOrg,
  resetClaimsAssignedToUsers,
  selectUserEmail,
  postSaveTaskProcessingAssignees,
} from 'stores';
import * as utils from 'utils';
import * as constants from 'consts';

// mui
import { Typography } from '@material-ui/core';

ChangePriority.propTypes = {
  task: PropTypes.array,
  handlers: PropTypes.shape({
    cancelHandler: PropTypes.func,
    submitHandler: PropTypes.func,
  }),
};

export default function ChangePriority({ task, handlers }) {
  const dispatch = useDispatch();

  const priorities = useSelector(selectPriorities);
  const selectAssignees = useSelector(selectClaimsAssignedToUsers);
  const userEmail = useSelector(selectUserEmail);
  const [isCrossTeamAssignTo, setCrossTeamAssignTo] = useState(false);
  const firstTask = task?.length ? task[0] : {};
  const assignedToUsers = selectAssignees?.items?.filter((user) => user.email !== userEmail);
  const newTeam = firstTask?.team || constants.ORGANIZATIONS.mphasis.name;

  const getTeamByLabel = (label) => {
    const options = Object.values(constants.ORGANIZATIONS);
    const team = options?.find((o) => o.label === label)?.label;
    return team || null;
  };

  const fields = [
    {
      name: 'priority',
      type: 'select',
      options: priorities || [],
      optionKey: 'id',
      optionLabel: 'description',
      validation: Yup.string().required(utils.string.t('validation.required')),
      value: priorities?.find(({ description }) => description === firstTask?.priority)?.id || priorities?.[0]?.id,
    },
    {
      name: 'team',
      type: 'select',
      options: [{ ...constants.ORGANIZATIONS.mphasis }, { ...constants.ORGANIZATIONS.ardonagh }],
      optionKey: 'label',
      optionLabel: 'label',
      value: getTeamByLabel(firstTask?.team),
      validation: Yup.string().required(utils.string.t('validation.required')),
      handleUpdate: (name,value)=>{
        setCrossTeamAssignTo(value?.toLowerCase() !== firstTask?.team?.toLowerCase());
      }
    },
    {
      name: 'sendTo',
      type: 'autocompletemui',
      options: !isCrossTeamAssignTo ? assignedToUsers : [],
      optionKey: 'email',
      optionLabel: 'fullName',
      validation:
        !isCrossTeamAssignTo && Yup.object().nullable().required(utils.string.t('claims.processing.bulkAssign.validation.chooseAssignee')),
    },
    {
      name: 'notes',
      type: 'textarea',
      muiComponentProps: {
        inputProps: { maxLength: 500 },
        multiline: true,
        rows: 3,
        rowsMax: 5,
      },
      validation:
        isCrossTeamAssignTo &&
        Yup.string()
          .min(1, utils.string.t('validation.required'))
          .max(500, utils.string.t('validation.string.max'))
          .required(utils.string.t('validation.required')),
    },
  ];

  const defaultValues = utils.form.getInitialValues(fields);
  const validationSchema = utils.form.getValidationSchema(fields);

  const { control, reset, errors, handleSubmit, formState } = useForm({
    defaultValues,
    ...(validationSchema && { resolver: yupResolver(validationSchema) }),
  });

  // On click of cancel button
  const launchConfirmModal = () => {
    dispatch(
      showModal({
        component: 'CONFIRM',
        props: {
          title: utils.string.t('navigation.alert'),
          fullWidth: true,
          maxWidth: 'xs',
          componentProps: {
            confirmLabel: utils.string.t('app.yes'),
            cancelLabel: utils.string.t('app.no'),
            confirmMessage: (
              <Typography variant="h5" color="secondary">
                {utils.string.t('claims.notes.notifications.alertPopup')}
              </Typography>
            ),
            submitHandler: () => {
              handlers.cancelHandler();
            },
            handleClose: () => {},
          },
        },
      })
    );
  };

  const actions = [
    {
      name: 'cancel',
      label: utils.string.t('app.cancel'),
      handler: () => {
        launchConfirmModal();
      },
    },
    {
      name: 'submit',
      label: utils.string.t('app.set'),
      handler: (values) => {
        handleChangePriority(values);
      },
    },
  ];

  const handleChangePriority = async (values) => {
    const data = task?.map((ele) => {
      return {
        assignTo: values?.sendTo?.email,
        caseIncidentID: ele.caseIncidentID,
        notesDescription: values?.notes,
        priority: values?.priority,
        processId: ele.processId,
        taskId: ele.taskId,
        team: values?.team,
      };
    });
    await dispatch(postSaveTaskProcessingAssignees(data));
    if (handlers.submitHandler) {
      handlers.submitHandler();
    }
  };

  useEffect(() => {
    if (utils.generic.isInvalidOrEmptyArray(priorities)) {
      dispatch(getPriorityLevels());
    }
    dispatch(resetClaimsAssignedToUsers());
    dispatch(getUsersByOrg(newTeam, task, 'addAssignee'));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!priorities?.length) return null;

  return (
    <ChangePriorityView
      actions={actions}
      fields={fields}
      control={control}
      reset={reset}
      handleSubmit={handleSubmit}
      formState={formState}
      errors={errors}
    />
  );
}
