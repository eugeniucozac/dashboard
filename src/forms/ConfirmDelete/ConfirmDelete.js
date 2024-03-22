import React from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';

// app
import { ConfirmDeleteView } from './ConfirmDelete.view';
import * as utils from 'utils';

ConfirmDelete.propTypes = {
  submitHandler: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default function ConfirmDelete({ submitHandler, handleClose }) {
  const regexDelete = new RegExp(`^${utils.string.t('app.delete')}$`);

  const fields = [
    {
      name: 'deleteConfirm',
      type: 'text',
      value: '',
      validation: Yup.string()
        .matches(regexDelete, utils.string.t('form.deleteConfirm.required'))
        .required(utils.string.t('form.deleteConfirm.required')),
      label: utils.string.t('form.deleteConfirm.label'),
      hint: utils.string.t('form.deleteConfirm.hint'),
      muiComponentProps: {
        autoComplete: 'off',
        autoFocus: true,
      },
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
      handler: () => {
        if (utils.generic.isFunction(submitHandler)) {
          return submitHandler();
        }
      },
    },
  ];

  return <ConfirmDeleteView fields={fields} actions={actions} />;
}
