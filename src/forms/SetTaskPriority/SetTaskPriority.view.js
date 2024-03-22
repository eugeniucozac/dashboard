import React from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';

//app
import * as utils from 'utils';
import { Button, FormAutocompleteMui, FormContainer, FormFields, FormGrid, FormLabel, FormActions, FormHidden } from 'components';
import { useFormActions } from 'hooks';
import styles from './SetTaskPriority.styles';

//mui
import { makeStyles, Typography } from '@material-ui/core';

SetTaskPriorityView.propTypes = {
  fields: PropTypes.array.isRequired,
  actions: PropTypes.array.isRequired,
  task: PropTypes.object,
  resetKey: PropTypes.number.isRequired,
};

export function SetTaskPriorityView({ actions, fields, task, resetKey }) {
  const classes = makeStyles(styles, { name: 'SetTaskPriority' })();
  const defaultValues = utils.form.getInitialValues(fields);

  const { control, reset, errors, handleSubmit, formState } = useForm({ defaultValues });

  const { cancel, submit } = useFormActions(actions, reset);

  return (
    <div className={classes.root}>
      <FormContainer type="dialog" onSubmit={handleSubmit} data-testid="form-edit-set-task-priority">
        <FormFields type="dialog">
          <FormGrid container spacing={2}>
            <FormGrid container alignItems="center">
              <FormGrid item xs={2}>
                <FormLabel label={utils.string.t('claims.processing.taskDetailsLabels.claimRef')} align="right" />
              </FormGrid>
              <FormGrid item xs={10}>
                <Typography variant="body2">{task?.processRef}</Typography>
              </FormGrid>
            </FormGrid>
            <FormGrid container alignItems="center">
              <FormGrid item xs={2}>
                <FormLabel label={utils.string.t('claims.processing.taskDetailsLabels.taskRef')} align="right" />
              </FormGrid>
              <FormGrid item xs={10}>
                <FormHidden {...utils.form.getFieldProps(fields, 'taskId', control)} className={classes.taskId} />
                <Typography variant="body2">{task?.taskRef}</Typography>
              </FormGrid>
            </FormGrid>
            <FormGrid item xs={12} sm={6}>
              <FormGrid container alignItems="center">
                <FormGrid item xs={4}>
                  <FormLabel label={utils.string.t('claims.processing.taskDetailsLabels.priority')} align="right" />
                </FormGrid>
                <FormGrid item xs={8} key={resetKey}>
                  <FormAutocompleteMui {...utils.form.getFieldProps(fields, 'priority', control)} error={errors.priority} />
                </FormGrid>
              </FormGrid>
            </FormGrid>
          </FormGrid>
        </FormFields>
      </FormContainer>
      <FormActions type="dialog">
        {cancel && (
          <Button text={cancel.label} variant="outlined" size="medium" disabled={formState.isSubmitting} onClick={cancel.handler} />
        )}
        {submit && (
          <Button
            text={submit.label}
            type="submit"
            disabled={formState.isSubmitting}
            onClick={handleSubmit(submit.handler)}
            color="primary"
          />
        )}
      </FormActions>
    </div>
  );
}
