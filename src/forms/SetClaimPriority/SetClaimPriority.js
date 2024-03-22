import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';

//app
import { SetClaimPriorityView } from './SetClaimPriority.view';
import { hideModal, showModal, getPriorityLevels, selectPriorities, editClaimPriority } from 'stores';
import * as utils from 'utils';

SetClaimPriority.propTypes = {
  claim: PropTypes.object,
};

export default function SetClaimPriority({ claim }) {
  const dispatch = useDispatch();
  const priorities = useSelector(selectPriorities);

  const fields = [
    {
      name: 'priority',
      type: 'autocompletemui',
      options: priorities || [],
      optionKey: 'id',
      optionLabel: 'description',
      value: priorities?.find((item) => claim?.priority === item?.description),
      validation: Yup.object().required(utils.string.t('validation.required')),
    },
  ];

  const actions = [
    {
      name: 'cancel',
      label: utils.string.t('app.exit'),
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
      handler: (values) => {
        const value = { priority: values?.priority?.id };
        dispatch(editClaimPriority(value, priorities, claim));
      },
    },
  ];

  useEffect(
    () => {
      if (utils.generic.isInvalidOrEmptyArray(priorities)) {
        dispatch(getPriorityLevels());
      }
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  return <SetClaimPriorityView actions={actions} fields={fields} />;
}
