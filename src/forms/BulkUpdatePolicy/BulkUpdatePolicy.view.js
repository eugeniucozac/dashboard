import React from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// app
import styles from './BulkUpdatePolicy.styles';
import { Button, FormContainer, FormGrid, FormFields, FormActions, FormCheckbox, FormSelect, FormText, Translate } from 'components';
import * as utils from 'utils';

// mui
import { makeStyles, Box, Collapse } from '@material-ui/core';

BulkUpdatePolicyView.propTypes = {
  fields: PropTypes.array,
  actions: PropTypes.array,
  isBulkPolicy: PropTypes.bool,
  isBulkMarket: PropTypes.bool,
};

export function BulkUpdatePolicyView({ fields, actions, isBulkPolicy, isBulkMarket }) {
  const defaultValues = utils.form.getInitialValues(fields);
  const validationSchema = utils.form.getValidationSchema(fields);

  const { control, register, watch, reset, errors, handleSubmit, formState } = useForm({
    defaultValues,
    ...(validationSchema && { resolver: yupResolver(validationSchema) }),
  });

  const isDelete = Boolean(watch('delete'));
  const classes = makeStyles(styles, { name: 'BulkUpdatePolicy' })({ isDeleteChecked: isDelete });
  const cancel = actions && actions.find((action) => action.name === 'cancel');
  const submit = actions && actions.find((action) => action.name === 'submit');

  submit.label = isBulkPolicy || isDelete ? <Translate label="app.delete" /> : submit.label;
  submit.danger = isBulkPolicy || isDelete;

  const onCancel = () => {
    cancel && utils.generic.isFunction(cancel.handler) && cancel.handler();
    reset();
  };

  const onSubmit = (data) => {
    return submit && utils.generic.isFunction(submit.handler) && submit.handler(data);
  };

  const isSubmitDisabled = (isBulkPolicy && !isDelete) || (isBulkMarket && !isDelete && !watch('status') && !watch('premium'));

  return (
    <div className={classes.root}>
      <FormContainer type="dialog" onSubmit={handleSubmit(onSubmit)} data-testid="form-bulk-update-policy">
        <FormFields type="dialog">
          {isBulkMarket && (
            <Collapse in={!isDelete}>
              <Box pb={1.5}>
                <FormGrid container>
                  <FormGrid item xs={12} sm={6}>
                    <FormSelect {...utils.form.getFieldProps(fields, 'status')} control={control} error={errors.status} />
                  </FormGrid>
                  <FormGrid item xs={12} sm={6}>
                    <FormText {...utils.form.getFieldProps(fields, 'premium')} control={control} error={errors.premium} />
                  </FormGrid>
                </FormGrid>
              </Box>
            </Collapse>
          )}

          <FormCheckbox
            {...utils.form.getFieldProps(fields, 'delete')}
            nestedClasses={{ root: classes.checkbox }}
            control={control}
            register={register}
            watch={watch}
            error={errors.delete}
          />

          <Collapse in={isDelete}>
            <Box pt={1.5}>
              <FormText {...utils.form.getFieldProps(fields, 'deleteConfirm')} control={control} error={errors.deleteConfirm} />
            </Box>
          </Collapse>
        </FormFields>

        <FormActions type="dialog">
          {cancel && <Button text={cancel.label} variant="text" disabled={formState.isSubmitting} onClick={onCancel} />}
          {submit && (
            <Button
              text={submit.label}
              type="submit"
              disabled={formState.isSubmitting || isSubmitDisabled}
              color="primary"
              danger={submit.danger}
            />
          )}
        </FormActions>
      </FormContainer>
    </div>
  );
}
