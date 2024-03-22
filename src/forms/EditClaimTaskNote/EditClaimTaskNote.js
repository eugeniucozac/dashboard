import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

// app
import { EditClaimTaskNoteView } from './EditClaimTaskNote.view';
import { useFormActions } from 'hooks';
import { editTaskNote } from 'stores';
import * as utils from 'utils';

EditClaimTaskNote.propTypes = {
  noteObj: PropTypes.object,
  setIsDirty: PropTypes.func.isRequired,
  confirmHandler: PropTypes.func.isRequired,
  breadcrumbs: PropTypes.array.isRequired,
};

export default function EditClaimTaskNote({ noteObj, breadcrumbs, setIsDirty, confirmHandler }) {
  const dispatch = useDispatch();

  const fields = [
    {
      name: 'details',
      type: 'textarea',
      value: noteObj?.notesDescription || '',
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
        return dispatch(editTaskNote(formValues, noteObj));
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
    setIsDirty(formProps.formState.isDirty);
  }, [formValues]); // eslint-disable-line react-hooks/exhaustive-deps

  return <EditClaimTaskNoteView fields={fields} buttons={{ cancel, submit }} formProps={formProps} note={noteObj} breadcrumbs={breadcrumbs} />;
}
