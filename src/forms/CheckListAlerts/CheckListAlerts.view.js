import React from 'react';
import PropTypes from 'prop-types';

// app
import styles from './CheckListAlerts.styles';
import { Button, FormContainer, FormActions } from 'components';
import * as utils from 'utils';
import { TASK_CHECKLIST_WARNINGS } from 'consts';

// mui
import { makeStyles, Box, Typography } from '@material-ui/core';

CheckListAlertsView.propTypes = {
  type: PropTypes.oneOf(TASK_CHECKLIST_WARNINGS.all),
  actions: PropTypes.shape({
    submit: PropTypes.object.isRequired,
    cancel: PropTypes.object.isRequired,
  }).isRequired,
};
export function CheckListAlertsView({ type, actions }) {
  const classes = makeStyles(styles, { name: 'CheckListAlerts' })();
  const { cancel, submit } = actions;

  return (
    <div className={classes.root}>
      <FormContainer type="dialog">
        <Box p={5}>
          {type === TASK_CHECKLIST_WARNINGS.type.mandatory && (
            <Typography>{utils.string.t('claims.processing.taskDetailsCheckList.mandatoryTaskWarning')}</Typography>
          )}
          {type === TASK_CHECKLIST_WARNINGS.type.nextTask && (
            <Typography>{utils.string.t('claims.processing.taskDetailsCheckList.nextTaskNavWarning')}</Typography>
          )}
          {type === TASK_CHECKLIST_WARNINGS.type.completeTask && (
            <Typography>{utils.string.t('claims.processing.taskDetailsCheckList.taskCompleteWarning')}</Typography>
          )}
        </Box>
        <FormActions type="dialog">
          {cancel && <Button text={cancel.label} variant="text" onClick={cancel.handler} />}
          {submit && <Button text={submit.label} color="primary" onClick={submit.handler} />}
        </FormActions>
      </FormContainer>
    </div>
  );
}
