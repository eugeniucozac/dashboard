import React from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// app
import styles from './UpdateStatus.styles';
import { Button, FormContainer, FormFields, FormActions, FormGrid, FormSelect, FormText, FormLabel } from 'components';
import { useFormActions } from 'hooks';
import * as utils from 'utils';

// mui
import { makeStyles } from '@material-ui/core';

UpdateStatusView.propTypes = {
  fields: PropTypes.array,
  actions: PropTypes.array,
  confirmCancelHandler: PropTypes.func,
};

export function UpdateStatusView({ fields, actions, confirmCancelHandler }) {
  const classes = makeStyles(styles, { name: 'UpdateStatus' })();

  const defaultValues = utils.form.getInitialValues(fields);
  const validationSchema = utils.form.getValidationSchema(fields);

  const { control, reset, errors, handleSubmit, formState } = useForm({
    defaultValues,
    ...(validationSchema && { resolver: yupResolver(validationSchema) }),
  });

  const { cancel, submit } = useFormActions(actions, reset);

  return (
    <div className={classes.root}>
      <FormContainer type="dialog" onSubmit={handleSubmit} data-testid="form-updateStatus">
        <FormFields type="dialog">
          <FormGrid container alignItems="center">
            <FormGrid item xs={4}>
              <FormLabel label={`${utils.string.t('claims.updateStatus.changeTo')} *`} align="right" />
            </FormGrid>
            <FormGrid item xs={8}>
              <FormSelect {...utils.form.getFieldProps(fields, 'claimStatusId', control)} error={errors.claimStatusId} />
            </FormGrid>
          </FormGrid>
          <FormGrid container>
            <FormGrid item xs={4}>
              <FormLabel label={`${utils.string.t('claims.updateStatus.remarks')} *`} align="right" />
            </FormGrid>
            <FormGrid item xs={8}>
              <FormText {...utils.form.getFieldProps(fields, 'statusRemarks', control)} error={errors.statusRemarks} />
            </FormGrid>
          </FormGrid>
        </FormFields>
        <FormActions type="dialog">
          {cancel && (
            <Button text={cancel.label} variant="outlined" onClick={() => confirmCancelHandler()} disabled={formState.isSubmitting} />
          )}
          {submit && (
            <Button
              text={submit.label}
              type="submit"
              color="primary"
              onClick={handleSubmit(submit.handler)}
              disabled={formState.isSubmitting}
            />
          )}
        </FormActions>
      </FormContainer>
    </div>
  );
}
