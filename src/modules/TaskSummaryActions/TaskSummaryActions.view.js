import React from 'react';
import PropTypes from 'prop-types';

// app
import styles from './TaskSummaryActions.styles';
import { Button } from 'components';
import * as utils from 'utils';
import { TASK_TYPES_NATIVE, TASK_TAB_COMPLETED_STATUS } from 'consts';

// mui
import { makeStyles, Grid } from '@material-ui/core';

TaskSummaryActionsView.propTypes = {
  isReAssignEnabled: PropTypes.bool.isRequired,
  selectedTask: PropTypes.object,
  isRFIEnabled: PropTypes.bool.isRequired,
  handlers: PropTypes.shape({
    reAssign: PropTypes.func.isRequired,
    updateTaskPriority: PropTypes.func.isRequired,
    createSanctionsCheck: PropTypes.func.isRequired,
    handleCreateRFITaskLevel: PropTypes.func.isRequired,
    handleEditAdhoc: PropTypes.func.isRequired,
  }).isRequired,
};

export function TaskSummaryActionsView({ isReAssignEnabled, isRFIEnabled, handlers, selectedTask }) {
  const classes = makeStyles(styles, { name: 'TaskSummaryActions' })();
  const isTaskClosed = selectedTask?.status === TASK_TAB_COMPLETED_STATUS;

  return (
    <Grid container className={classes.taskActionsWrapper}>
      <Grid item className={classes.taskActionsRow}>
        <Button
          color="primary"
          variant="outlined"
          disabled={isReAssignEnabled}
          text={utils.string.t('app.reAssign')}
          onClick={handlers.reAssign}
        />
        <Button
          color="primary"
          variant="outlined"
          text={utils.string.t('claims.processing.summary.buttons.setPriority')}
          onClick={handlers.updateTaskPriority}
        />
        <Button
          color="primary"
          variant="outlined"
          disabled={!isRFIEnabled}
          text={utils.string.t('claims.processing.taskFunction.editTask')}
          onClick={handlers.handleEditAdhoc}
        />
      </Grid>
      <Grid item xs={12} className={classes.taskActionsRow}>
        {selectedTask?.taskCategory === TASK_TYPES_NATIVE && !isTaskClosed && (
          <Button
            color="primary"
            variant="outlined"
            text={utils.string.t('claims.processing.summary.buttons.createSanctionsChecks')}
            onClick={handlers.createSanctionsCheck}
          />
        )}
        <Button
          color="primary"
          variant="outlined"
          disabled={!isRFIEnabled}
          text={utils.string.t('claims.processing.summary.buttons.createNewRFI')}
          onClick={handlers.handleCreateRFITaskLevel}
        />
      </Grid>
    </Grid>
  );
}
