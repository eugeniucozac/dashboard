import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';

// app
import styles from './CreateInWhitespace.styles';
import { CreateInWhitespaceView } from './CreateInWhitespace.view';
import { getTemplates, patchPolicyPostWhitespace } from 'stores';
import * as utils from 'utils';

// mui
import { makeStyles } from '@material-ui/core';

export function CreateInWhitespace({ handleClose, policy }) {
  const classes = makeStyles(styles, { name: 'CreateInWhitespace' })();
  const dispatch = useDispatch();
  const templates = useSelector((state) => state.whitespace.templates.items) || [];
  const templatesLoading = useSelector((state) => state.whitespace.templates.loading);

  useEffect(
    () => {
      dispatch(getTemplates());
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleSubmit = (payload) => {
    return dispatch(patchPolicyPostWhitespace(policy, payload));
  };

  const handleCancel = () => {
    if (utils.generic.isFunction(handleClose)) {
      handleClose();
    }
  };

  const fields = [
    [
      {
        gridSize: { xs: 12 },
        type: 'select',
        name: 'productType',
        value: '__placeholder__',
        options: [
          { label: utils.string.t('whitespace.selectTemplate'), value: '__placeholder__', placeholder: true },
          ...utils.form.getSelectOptions('templates', { templates }),
        ],
        label: utils.string.t('whitespace.template'),
        validation: Yup.string()
          .transform((value) => (value === '__placeholder__' ? '' : value))
          .required(utils.string.t('validation.required')),
      },
      {
        type: 'text',
        label: utils.string.t('whitespace.reference'),
        value: policy.umrId || '',
        name: 'umrId',
        validation: Yup.string().uppercase().required(utils.string.t('validation.required')),
        muiComponentProps: {
          classes: { root: classes.umr },
          ...(policy.umrId && { InputProps: { readOnly: true, disabled: true } }),
        },
      },
    ],
  ];

  const actions = [
    {
      name: 'submit',
      label: utils.string.t('app.create'),
      handler: handleSubmit,
    },
    {
      name: 'cancel',
      label: utils.string.t('app.cancel'),
      handler: handleCancel,
    },
  ];

  return <CreateInWhitespaceView fields={fields} actions={actions} loading={templatesLoading} />;
}

export default CreateInWhitespace;
