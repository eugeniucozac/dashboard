import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';

//app
import { AddLossNotesView } from './AddLossNotes.view';
import { hideModal, showModal, postSaveClaimNotes } from 'stores';
import * as utils from 'utils';

AddLossNotes.propTypes = {
  lossObj: PropTypes.object,
};
export default function AddLossNotes({ lossObj, processTypeData }) {
  const dispatch = useDispatch();
  
  const fields = [
    {
      name: 'customProcessId',
      type: 'hidden',
      value: lossObj?.lossDetailId,
    },
    {
      name: 'processTypeId',
      type: 'hidden',
      value: processTypeData?.processTypeID,
    },
    {
      name: 'processTypeName',
      type: 'hidden',
      value: processTypeData?.processTypeDetails,
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
  return <AddLossNotesView actions={actions} fields={fields} lossObj={lossObj} />;
}
