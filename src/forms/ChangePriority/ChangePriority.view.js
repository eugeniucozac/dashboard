import React from 'react';
import PropTypes from 'prop-types';

//app
import * as utils from 'utils';
import { Button, FormContainer, FormGrid, FormText, FormLabel, FormActions, FormAutocompleteMui, FormSelect } from 'components';
import { useFormActions } from 'hooks';
import styles from './ChangePriority.style';

//mui
import { makeStyles } from '@material-ui/core';

ChangePriorityView.propTypes = {
  fields: PropTypes.array.isRequired,
  actions: PropTypes.array.isRequired,
  control: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  formState: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
};

export function ChangePriorityView({ fields, control, actions, reset, handleSubmit, formState, errors }) {
  const classes = makeStyles(styles, { name: 'ChangePriority' })();
  const { cancel, submit } = useFormActions(actions, reset);

  return (
    <div className={classes.root}>
      <FormContainer className={classes.formcontainer} onSubmit={handleSubmit(submit.handler)}>
        <FormGrid align="center">
          <FormGrid item xs={10}>
            <FormLabel label={`${utils.string.t('claims.processing.taskFunction.priority')}`} align="left" />
            <FormSelect {...utils.form.getFieldProps(fields, 'priority', control, errors)} />
          </FormGrid>
          <FormGrid item xs={10}>
            <FormLabel label={`${utils.string.t('claims.processing.taskFunction.team')}`} align="left" />
            <FormSelect {...utils.form.getFieldProps(fields, 'team', control, errors)} />
          </FormGrid>
          <FormGrid item xs={10}>
            <FormLabel label={`${utils.string.t('claims.processing.taskFunction.assignTo')}`} align="left" />
            <FormAutocompleteMui {...utils.form.getFieldProps(fields, 'sendTo', control, errors)} />
          </FormGrid>
          <FormGrid item xs={10}>
            <FormLabel label={`${utils.string.t('claims.processing.taskFunction.notes')}`} align="left" />
            <FormText {...utils.form.getFieldProps(fields, 'notes', control, errors)} />
          </FormGrid>
        </FormGrid>
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
      </FormContainer>
    </div>
  );
}
