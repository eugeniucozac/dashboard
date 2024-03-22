import React from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// app
import styles from './PremiumProcessingCheckSigning.styles';
import { Button, FormContainer, FormFields, FormActions, FormGrid, FormAutocomplete, FormText, FormDate } from 'components';
import * as utils from 'utils';

// mui
import { makeStyles } from '@material-ui/core';

PremiumProcessingCheckSigningView.propTypes = {
  fields: PropTypes.array,
  actions: PropTypes.array,
};

export function PremiumProcessingCheckSigningView({ fields, actions }) {
  const classes = makeStyles(styles, { name: 'PremiumProcessingCheckSigning' })();

  const defaultValues = utils.form.getInitialValues(fields);
  const validationSchema = utils.form.getValidationSchema(fields);

  const { control, errors, handleSubmit, formState, setValue } = useForm({
    defaultValues,
    ...(validationSchema && { resolver: yupResolver(validationSchema) }),
  });

  const cancel = actions && actions.find((action) => action.name === 'cancel');
  const submit = actions && actions.find((action) => action.name === 'submit');

  const onSubmit = (data) => {
    return submit && utils.generic.isFunction(submit.handler) && submit.handler(data);
  };

  return (
    <div className={classes.root}>
      <FormContainer type="dialog" onSubmit={handleSubmit(onSubmit)}>
        <FormFields type="dialog">
          <FormGrid container>
            <FormGrid item xs={12} sm={6}>
              <FormText
                {...utils.form.getFieldProps(fields, 'workPackageReference')}
                control={control}
                error={errors.workPackageReference}
              />
            </FormGrid>
            <FormGrid item xs={12} sm={6}>
              <FormAutocomplete
                {...utils.form.getFieldProps(fields, 'bureauList')}
                control={control}
                error={errors.bureauList}
                handleUpdate={(id, value) => {
                  setValue(id, value);
                }}
              />
            </FormGrid>
            <FormGrid item xs={12} sm={6}>
              <FormText {...utils.form.getFieldProps(fields, 'riskReferenceId')} control={control} error={errors.riskReferenceId} />
            </FormGrid>
            <FormGrid item xs={12} sm={6}>
              <FormDate {...utils.form.getFieldProps(fields, 'packageSubmittedOn', control)} error={errors.packageSubmittedOn} />
            </FormGrid>
            <FormGrid item xs={12} sm={6}>
              <FormText {...utils.form.getFieldProps(fields, 'department')} control={control} error={errors.department} />
            </FormGrid>
            <FormGrid item xs={12} sm={6}>
              <FormText {...utils.form.getFieldProps(fields, 'gxbInstance')} control={control} error={errors.gxbInstance} />
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
