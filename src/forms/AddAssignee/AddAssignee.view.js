import React from 'react';
import PropTypes from 'prop-types';

// app
import styles from './AddAssignee.styles';
import * as utils from 'utils';
import { Button, FormActions, FormAutocompleteMui, FormContainer, FormGrid, FormLabel } from 'components';

// mui
import { makeStyles, Box, Typography } from '@material-ui/core';
AddAssigneeView.propTypes = {
  fields: PropTypes.array.isRequired,
  control: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  assigneeResetKey: PropTypes.number,
  resetKey: PropTypes.number,
  assignBtnStatus: PropTypes.bool,
  isPremiumProcessing: PropTypes.bool,
  actions: PropTypes.shape({
    submit: PropTypes.object.isRequired,
    cancel: PropTypes.object.isRequired,
  }).isRequired,
  handlers: PropTypes.shape({
    submit: PropTypes.func.isRequired,
    cancel: PropTypes.func.isRequired,
  }).isRequired,
};

export function AddAssigneeView({
  fields,
  control,
  errors,
  assigneeResetKey,
  resetKey,
  assignBtnStatus,
  actions,
  isPremiumProcessing,
  handlers,
}) {
  const classes = makeStyles(styles, { name: 'AddAssignee' })();

  return (
    <div className={classes.root}>
      <FormContainer className={classes.formcontainer} onSubmit={handlers.submit}>
        <Box>
          <FormGrid container direction="row" className={classes.requiredLabelGrid}>
            <FormGrid item xs={12}>
              <Typography className={classes.requiredLabel}>{utils.string.t('app.requiredFields')}</Typography>
            </FormGrid>
          </FormGrid>
          <FormGrid container spacing={0} className={classes.formGridcontainer}>
            <FormGrid item xs={5}>
              <FormLabel nestedClasses={{ root: classes.formLabel }} label={`${utils.string.t('app.assignTo')} *`} align="right" />
            </FormGrid>
            <FormGrid item xs={6} key={assigneeResetKey}>
              <FormAutocompleteMui {...utils.form.getFieldProps(fields, 'addAssignee', control)} error={errors.addAssignee} />
            </FormGrid>
          </FormGrid>
          {!isPremiumProcessing && (
            <FormGrid container spacing={0} className={classes.formGridcontainer}>
              <FormGrid item xs={5}>
                <FormLabel
                  nestedClasses={{ root: classes.formLabel }}
                  label={`${utils.string.t('claims.processing.taskDetailsLabels.additionalAssignee')}`}
                  align="right"
                />
              </FormGrid>
              <FormGrid item xs={6} key={resetKey}>
                <FormAutocompleteMui
                  {...utils.form.getFieldProps(fields, 'addAdditionalAssignee', control)}
                  error={errors.addAdditionalAssignee}
                />
              </FormGrid>
            </FormGrid>
          )}
        </Box>
      </FormContainer>
      <FormActions type="dialog">
        <Button text={actions.cancel.label} variant="outlined" size="medium" onClick={() => handlers.cancel()} />
        <Button
          text={actions.submit.label}
          size="medium"
          color="primary"
          type="submit"
          onClick={handlers.submit(actions.submit.handler)}
          disabled={assignBtnStatus}
        />
      </FormActions>
    </div>
  );
}
