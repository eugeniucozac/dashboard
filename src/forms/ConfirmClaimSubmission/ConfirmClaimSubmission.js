import React from 'react';
import { useDispatch } from 'react-redux';

// app
import { ConfirmClaimSubmissionView } from './ConfirmClaimSubmission.view';
import { hideModal, submitClaimDetailsInformation } from 'stores';
import * as utils from 'utils';

export default function ConfirmClaimSubmission(props) {
  const dispatch = useDispatch();
  const actions = [
    {
      name: 'submit',
      label: utils.string.t('app.yes'),
      handler: () => dispatch(hideModal()),
    },
    {
      name: 'cancel',
      label: utils.string.t('app.no'),
      handler: () => dispatch(submitClaimDetailsInformation()),
    },
  ];

  const handleCancel = () => {
    dispatch(hideModal());
  };

  const handleSubmit = () => {
    dispatch(submitClaimDetailsInformation());
    dispatch(hideModal());
    props.handleNext();
  };

  return <ConfirmClaimSubmissionView actions={actions} handleCancel={handleCancel} handleSubmit={handleSubmit} />;
}
