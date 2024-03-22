import React from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';

// app
import { ConfirmDeclineView } from './ConfirmDecline.view';
import * as utils from 'utils';

ConfirmDecline.propTypes = {
  submitHandler: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default function ConfirmDecline({ submitHandler, handleClose }) {
  const regexDecline = new RegExp(`^${utils.string.t('risks.decline')}$`);

  const fields = [
    {
      name: 'declineConfirm',
      type: 'text',
      value: '',
      validation: Yup.string()
        .matches(regexDecline, utils.string.t('form.declineConfirm.required'))
        .required(utils.string.t('form.declineConfirm.required')),
      label: utils.string.t('form.declineConfirm.label'),
      hint: utils.string.t('form.declineConfirm.hint'),
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
      label: utils.string.t('risks.decline'),
      handler: () => {
        if (utils.generic.isFunction(submitHandler)) {
          return submitHandler();
        }
      },
    },
  ];

  return <ConfirmDeclineView fields={fields} actions={actions} />;
}
