import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';

// app
import { getStatuses, hideModal, selectClaimsStatuses, editStatus, showModal, selectClaimStatusObj } from 'stores';
import { UpdateStatusView } from './UpdateStatus.view';
import * as utils from 'utils';

export default function UpdateStatus(props) {
  const dispatch = useDispatch();
  let statuses = useSelector(selectClaimsStatuses);
  const claimsStatusObj = useSelector(selectClaimStatusObj);

  useEffect(
    () => {
      dispatch(getStatuses());
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  if (props.claimStatusID?.toString() === claimsStatusObj.Failed) {
    statuses = statuses.filter(
      (status) => status.id?.toString() === claimsStatusObj.Cancel || status.id?.toString() === claimsStatusObj.DRAFT
    );
  } else if (props.claimStatusID?.toString() === claimsStatusObj.DRAFT) {
    statuses = statuses.filter((status) => status.id?.toString() === claimsStatusObj.Cancel);
  } else if (props.claimStatusID?.toString() === claimsStatusObj.Cancel) {
    statuses = statuses.filter((status) => status.id?.toString() === claimsStatusObj.DRAFT);
  }

  const fields = [
    {
      name: 'claimStatusId',
      value: props.claimStatusID,
      type: 'select',
      optionKey: 'id',
      optionLabel: 'name',
      options: statuses,
      validation: Yup.string().required(utils.string.t('validation.required')),
    },
    {
      name: 'statusRemarks',
      type: 'textarea',
      value: '',
      validation: Yup.string()
        .max(255, utils.string.t('claims.updateStatus.validation.remarksMaxLength'))
        .required(utils.string.t('claims.updateStatus.validation.remarks')),
      muiComponentProps: {
        inputProps: { maxLength: 255 },
        multiline: true,
        rows: 4,
        rowsMax: 4,
        'data-testid': 'statusRemarks',
      },
    },
  ];

  const confirmCancelHandler = () => {
    dispatch(
      showModal({
        component: 'CONFIRM',
        props: {
          title: utils.string.t('claims.modals.confirm.title'),
          subtitle: utils.string.t('claims.modals.confirm.subtitle'),
          fullWidth: true,
          maxWidth: 'sm',
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
  };

  const actions = [
    {
      name: 'submit',
      label: utils.string.t('app.update'),
      handler: (values) => dispatch(editStatus(values, props.claimID)),
    },
    {
      name: 'cancel',
      label: utils.string.t('app.cancel'),
      handler: () => dispatch(hideModal()),
    },
  ];

  return <UpdateStatusView actions={actions} fields={fields} confirmCancelHandler={confirmCancelHandler} />;
}
