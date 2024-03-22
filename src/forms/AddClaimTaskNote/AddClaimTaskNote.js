import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

// app
import { AddClaimTaskNoteView } from './AddClaimTaskNote.view';
import { useFormActions } from 'hooks';
import { addTaskNote } from 'stores';
import * as utils from 'utils';

AddClaimTaskNote.propTypes = {
  taskObj: PropTypes.object.isRequired,
  breadcrumbs: PropTypes.array.isRequired,
  setIsDirty: PropTypes.func.isRequired,
  confirmHandler: PropTypes.func.isRequired,
};

export default function AddClaimTaskNote({ taskObj, breadcrumbs, setIsDirty, confirmHandler }) {
  const dispatch = useDispatch();

  const fields = [
    {
      name: 'claimRef',
      type: 'hidden',
      value: taskObj?.processRef || '',
      textOnly: true,
    },
    {
      name: 'taskId',
      type: 'hidden',
      value: taskObj?.taskRef,
      textOnly: true,
    },
    {
      name: 'taskType',
      type: 'hidden',
      value: taskObj?.taskType || '',
      textOnly: true,
    },
    {
      name: 'details',
      type: 'textarea',
      value: '',
      muiComponentProps: {
        multiline: true,
        rows: 3,
        rowsMax: 6,
      },
      validation: Yup.string().max(1000, utils.string.t('validation.string.max')).required(utils.string.t('validation.required')),
    },
  ];

  const actions = [
    {
      name: 'cancel',
      label: utils.string.t('app.cancel'),
      handler: () => {
        confirmHandler();
      },
    },
    {
      name: 'submit',
      label: utils.string.t('app.save'),
      handler: (formValues) => {
        return dispatch(addTaskNote(formValues, taskObj));
      },
    },
  ];

  const defaultValues = utils.form.getInitialValues(fields);
  const validationSchema = utils.form.getValidationSchema(fields);

  const formProps = useForm({
    defaultValues,
    ...(validationSchema && { resolver: yupResolver(validationSchema) }),
  });

  const { cancel, submit } = useFormActions(actions);

  const formValues = formProps.watch(['details']);

  useEffect(() => {
    // the form is considered dirty if any of the values are truthy
    const isDirty = Object.values(formValues).some((v) => Boolean(v));

    setIsDirty(isDirty);
  }, [formValues]); // eslint-disable-line react-hooks/exhaustive-deps

  return <AddClaimTaskNoteView fields={fields} buttons={{ cancel, submit }} formProps={formProps} breadcrumbs={breadcrumbs} />;
}
