import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';

//app
import { AddEditClaimRefNotesView } from './AddEditClaimRefNotes.view';
import { hideModal, showModal, postSaveClaimNotes, selectCaseIncidentDetails, selectLossSelected } from 'stores';
import * as utils from 'utils';

AddEditClaimRefNotes.propTypes = {
  claim: PropTypes.object,
};
export default function AddEditClaimRefNotes({ claim }) {
  const dispatch = useDispatch();
  const caseIncidentDetails = useSelector(selectCaseIncidentDetails);
  const lossSelected = useSelector(selectLossSelected);

  const fields = [
    {
      name: 'caseIncidentID',
      type: 'hidden',
      value: claim?.caseIncidentID || caseIncidentDetails?.caseIncidentID,
    },
    {
      name: 'notesDescription',
      type: 'textarea',
      value: '',
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
              maxWidth: 'xs',
              componentProps: {
                cancelLabel: utils.string.t('app.no'),
                confirmLabel: utils.string.t('app.yes'),
                submitHandler: () => {
                  dispatch(hideModal());
                },
                cancelHandler: () => {},
              },
            },
          })
        );
      },
    },
    {
      name: 'submit',
      label: utils.string.t('app.save'),
      handler: (values) => dispatch(postSaveClaimNotes(values)),
    },
  ];

  return <AddEditClaimRefNotesView actions={actions} fields={fields} claim={claim} loss={lossSelected} />;
}
