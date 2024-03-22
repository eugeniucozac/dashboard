import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';

//app
import TaskSidebarNotesView from './TaskSidebarNotes.view';
import { selectClaimsTasksProcessingSelected } from 'stores';
import * as utils from 'utils';

TaskSidebarNotes.propTypes = {
  allowNavigation: PropTypes.func.isRequired,
};

export default function TaskSidebarNotes({ allowNavigation }) {
  const claimsTaskProcessingSelected = useSelector(selectClaimsTasksProcessingSelected);
  const taskSelected = claimsTaskProcessingSelected?.[0];

  const fields = [
    {
      name: 'caseIncidentID',
      type: 'hidden',
      value: claimsTaskProcessingSelected?.[0]?.caseIncidentID,
    },
    {
      name: 'taskId',
      type: 'hidden',
      value: claimsTaskProcessingSelected?.[0]?.taskId,
    },
    {
      name: 'addNotes',
      type: 'textarea',
      value: '',
      validation: Yup.string().max(1000, utils.string.t('validation.string.max')).required(utils.string.t('validation.required')),
      muiComponentProps: {
        multiline: true,
        rows: 3,
        rowsMax: 6,
      },
    },
  ];

  // abort
  if (!utils.generic.isValidObject(taskSelected, 'caseIncidentID')) return null;

  return <TaskSidebarNotesView fields={fields} task={taskSelected} allowNavigation={allowNavigation} />;
}
