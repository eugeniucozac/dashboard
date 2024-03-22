import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';

// app
import { createClientOffice, editClientOffice, getReferenceDataByType } from 'stores';
import { AddEditClientOfficeView } from './AddEditClientOffice.view';
import * as utils from 'utils';

export default function AddEditClientOffice({ handleClose, office = {} }) {
  const dispatch = useDispatch();
  const parentList = useSelector((state) => state.parent.list);
  const accountList = useSelector((state) => state.referenceData.clients) || [];

  const handleSubmit = (updatedClientOffice) => {
    if (office.id) {
      return dispatch(editClientOffice(updatedClientOffice, office));
    } else {
      return dispatch(createClientOffice(updatedClientOffice));
    }
  };

  const handleCancel = () => {
    if (utils.generic.isFunction(handleClose)) {
      handleClose();
    }
  };

  useEffect(
    () => {
      if (!office.parent || !office.parent.name) return;
      dispatch(getReferenceDataByType('client', office.parent.name));
    },
    [office] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const getAccountOptions = (value) => {
    if (!utils.generic.isValidArray(value, true)) return;
    dispatch(getReferenceDataByType('client', value[0].name));
  };

  const fields = [
    {
      name: 'parent',
      label: utils.string.t('admin.form.client.label'),
      type: 'autocomplete',
      value: office.parent ? [office.parent] : [],
      options: parentList,
      optionKey: 'id',
      optionLabel: 'name',
      innerComponentProps: {
        maxMenuHeight: 120,
        allowEmpty: true,
        'data-testid': 'parent',
      },
      validation: Yup.array().min(1, utils.string.t('validation.required')).required(utils.string.t('validation.required')),
    },
    {
      name: 'clients',
      label: utils.string.t('admin.form.accounts.label'),
      type: 'autocomplete',
      value: office.clients || [],
      options: accountList,
      optionKey: 'id',
      optionLabel: 'name',
      muiComponentProps: {
        'data-testid': 'clients',
      },
      innerComponentProps: {
        isMulti: true,
        allowEmpty: true,
        maxMenuHeight: 120,
        'data-testid': 'clients',
      },
      validation: Yup.array().min(1, utils.string.t('validation.required')).required(utils.string.t('validation.required')),
    },
    {
      name: 'name',
      label: utils.string.t('admin.form.office.label'),
      value: office.name || '',
      type: 'text',
      validation: Yup.string().required(utils.string.t('validation.required')),
    },
  ];

  const actions = [
    {
      name: 'submit',
      label: office.id ? utils.string.t('app.save') : utils.string.t('app.create'),
      handler: handleSubmit,
    },
    {
      name: 'cancel',
      label: utils.string.t('app.cancel'),
      handler: handleCancel,
    },
  ];

  return <AddEditClientOfficeView getAccountOptions={getAccountOptions} actions={actions} fields={fields} />;
}
