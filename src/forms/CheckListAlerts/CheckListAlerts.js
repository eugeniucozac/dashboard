import React from 'react';
import PropTypes from 'prop-types';

// app
import { CheckListAlertsView } from './CheckListAlerts.view';
import * as utils from 'utils';
import { useFormActions } from 'hooks';
import { TASK_CHECKLIST_WARNINGS } from 'consts';

CheckListAlerts.propTypes = {
  type: PropTypes.oneOf(TASK_CHECKLIST_WARNINGS.all),
  handlers: PropTypes.shape({
    submit: PropTypes.func.isRequired,
    cancel: PropTypes.func.isRequired,
  }).isRequired,
};

export default function CheckListAlerts({ type, handlers }) {
  const actions = [
    {
      name: 'cancel',
      label: utils.string.t('app.cancel'),
      handler: () => handlers.cancel(),
    },
    {
      name: 'submit',
      label: utils.string.t('app.confirm'),
      handler: () => handlers.submit(),
    },
  ];

  const { cancel, submit } = useFormActions(actions);

  return (
    <CheckListAlertsView
      type={type}
      actions={{
        submit,
        cancel,
      }}
    />
  );
}
