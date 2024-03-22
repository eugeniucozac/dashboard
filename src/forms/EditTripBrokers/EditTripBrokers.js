import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import get from 'lodash/get';

// app
import { EditTripBrokersView } from './EditTripBrokers.view';
import { editTripVisit, putTrip, hideModal, selectRefDataDepartmentUsers } from 'stores';
import * as utils from 'utils';

EditTripBrokers.propTypes = {
  visit: PropTypes.object.isRequired,
  inlineEditMode: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default function EditTripBrokers({ visit = {}, inlineEditMode, handleClose }) {
  const dispatch = useDispatch();
  const refDataDepartmentUsers = useSelector(selectRefDataDepartmentUsers);
  const users = get(visit, 'users') || [];

  const usersOptions = utils.users.getWithName(refDataDepartmentUsers).map((broker) => {
    return {
      ...broker,
      label: utils.user.fullname(broker),
    };
  });

  const usersSelected = users.map((user) => {
    return {
      ...user,
      label: utils.user.fullname(user),
    };
  });

  const fields = [
    {
      name: 'users',
      type: 'autocomplete',
      value: usersSelected || [],
      label: utils.string.t('form.brokers.label'),
      hint: utils.string.t('form.brokers.hint'),
      options: usersOptions,
      optionKey: 'id',
      optionLabel: 'label',
      validation: Yup.array().min(1, utils.string.t('trips.validation.users')).required(utils.string.t('trips.validation.users')),
      muiComponentProps: {
        autoFocus: true,
      },
      innerComponentProps: {
        isMulti: true,
        allowEmpty: true,
        maxMenuHeight: 200,
        'data-testid': 'brokers',
      },
    },
    {
      name: 'id',
      type: 'hidden',
      value: visit.id,
    },
  ];

  const actions = [
    {
      name: 'cancel',
      label: utils.string.t('app.cancel'),
      handler: handleClose,
    },
    {
      name: 'submit',
      label: utils.string.t('app.submit'),
      handler: (formData) => {
        dispatch(hideModal());
        dispatch(editTripVisit(formData));

        if (inlineEditMode) {
          dispatch(putTrip());
        }
      },
    },
  ];

  return <EditTripBrokersView fields={fields} actions={actions} />;
}
