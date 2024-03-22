import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

// app
import { Accordion, Summary } from 'components';
import { TaskClaimDetailsSidebar, TaskSidebarNotes, TaskSidebarDocument, TaskSummaryActions } from 'modules';
import * as utils from 'utils';
import { selectClaimsTasksProcessingSelected, selectClaimsTasksProcessingType } from 'stores';
import { TASK_TEAM_TYPE, TASK_ROW_TYPE } from 'consts';

// mui
import { Box } from '@material-ui/core';

TaskSummaryView.propTypes = {
  allowNavigation: PropTypes.func.isRequired,
};

export function TaskSummaryView({ allowNavigation }) {
  const tasksProcessingSelected = useSelector(selectClaimsTasksProcessingSelected);
  const taskTabTypeSelected = useSelector(selectClaimsTasksProcessingType);
  const selectedTask = tasksProcessingSelected[0];
  const isNotesRequired = taskTabTypeSelected === TASK_TEAM_TYPE.myTask && selectedTask?.taskType === TASK_ROW_TYPE.rfi;

  return (
    <Summary>
      <Box>
        <Accordion expanded title={utils.string.t('claims.processing.summary.accordions.details')}>
          <TaskClaimDetailsSidebar />
        </Accordion>
        <Accordion expanded title={utils.string.t('claims.processing.summary.accordions.actions')}>
          <TaskSummaryActions />
        </Accordion>
        <Accordion expanded title={utils.string.t('claims.processing.summary.accordions.documents')}>
          <TaskSidebarDocument />
        </Accordion>
        {!isNotesRequired && (
          <Accordion expanded title={utils.string.t('claims.processing.summary.accordions.notes')}>
            <TaskSidebarNotes allowNavigation={allowNavigation} />
          </Accordion>
        )}
      </Box>
    </Summary>
  );
}
