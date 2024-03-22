import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

//app
import { useFormActions } from 'hooks';
import { EditLossNotesRowView } from './EditLossNotesRow.view';
import { hideModal, showModal, getEditClaimRefNotes } from 'stores';
import * as utils from 'utils';

EditLossNotesRow.propTypes = {
  claim: PropTypes.object,
};
export default function EditLossNotesRow({ note }) {
  const dispatch = useDispatch();

  const fields = [
    {
      name: 'caseIncidentNotesID',
      type: 'hidden',
      value: note?.caseIncidentNotesID,
    },
    {
      name: 'notesDescription',
      type: 'textarea',
      value: note?.notesDescription,
      validation: Yup.string().max(1000, utils.string.t('validation.string.max')).required(utils.string.t('validation.required')),
      muiComponentProps: {
        multiline: true,
        rows: 3,
        rowsMax: 6,
      },
    },
  ];

  const actions = [
    {
      name: 'cancel',
      label: utils.string.t('app.cancel'),
      handler: () => {
        dispatch(
          showModal({
            component: 'CONFIRM',
            props: {
              title: utils.string.t('status.alert'),
              hint: utils.string.t('claims.notes.notifications.alertPopup'),
              fullWidth: true,
              hideCompOnBlur: false,
              maxWidth: 'xs',
              componentProps: {
                cancelLabel: utils.string.t('app.no'),
                confirmLabel: utils.string.t('app.yes'),
                submitHandler: () => {
                  dispatch(hideModal());
                },
              },
            },
          })
        );
      },
    },
    {
      name: 'submit',
      label: utils.string.t('app.save'),
      handler: (values) => {
        dispatch(getEditClaimRefNotes(values));
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

  return <EditLossNotesRowView fields={fields} buttons={{ cancel, submit }} formProps={formProps} note={note} />;
}
