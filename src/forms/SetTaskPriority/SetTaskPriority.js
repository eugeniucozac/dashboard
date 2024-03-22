import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';

//app
import { SetTaskPriorityView } from './SetTaskPriority.view';
import { getPriorityLevels, selectPriorities, postEditTaskPriority } from 'stores';
import * as utils from 'utils';

SetTaskPriority.propTypes = {
  task: PropTypes.object.isRequired,
  handlers: PropTypes.shape({
    cancel: PropTypes.func,
    submit: PropTypes.func,
  }).isRequired,
};

export default function SetTaskPriority({ task, handlers }) {
  const dispatch = useDispatch();
  const priorities = useSelector(selectPriorities);
  const [resetKey, setResetKey] = useState();

  const fields = [
    {
      name: 'taskId',
      type: 'hidden',
      value: task?.taskRef || '',
      validation: Yup.string().required(utils.string.t('form.taskId.required')),
      muiComponentProps: {
        InputProps: {
          readOnly: true,
        },
      },
    },
    {
      name: 'claimRef',
      type: 'text',
      value: task?.processRef || '',
      validation: Yup.string().required(utils.string.t('form.claimRef.required')),
      muiComponentProps: {
        multiline: false,
      },
    },

    {
      name: 'priority',
      type: 'autocompletemui',
      options: priorities || [],
      value: priorities?.find(({ description }) => description === task.priority) || priorities?.[0],
      optionKey: 'id',
      optionLabel: 'description',
      validation: Yup.object().required(utils.string.t('validation.required')),
    },
  ];

  const actions = [
    {
      name: 'cancel',
      label: utils.string.t('app.cancel'),
      handler: () => handlers.cancel(),
    },
    {
      name: 'submit',
      label: utils.string.t('app.set'),
      handler: async (values) => {
        await dispatch(postEditTaskPriority({ priority: values?.priority?.id, taskId: task?.taskId }));
        handlers.submit();
      },
    },
  ];

  useEffect(() => {
    if (utils.generic.isInvalidOrEmptyArray(priorities)) {
      dispatch(getPriorityLevels());
    }
    setResetKey(new Date().getTime());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!priorities?.length) return null;

  return <SetTaskPriorityView actions={actions} fields={fields} task={task} resetKey={resetKey} />;
}
