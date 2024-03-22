import React from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// app
import styles from './AddEditClientOffice.styles';
import { Button, FormContainer, FormFields, FormActions, FormGrid, FormText, FormAutocomplete } from 'components';
import * as utils from 'utils';

// mui
import { makeStyles } from '@material-ui/core';

AddEditClientOfficeView.propTypes = {
  fields: PropTypes.array,
  actions: PropTypes.array,
  getAccountOptions: PropTypes.func,
};

export function AddEditClientOfficeView({ fields, actions, getAccountOptions }) {
  const classes = makeStyles(styles, { name: 'AddEditClientOffice' })();

  const defaultValues = utils.form.getInitialValues(fields);
  const validationSchema = utils.form.getValidationSchema(fields);

  const { control, reset, errors, handleSubmit, formState, setValue } = useForm({
    defaultValues,
    ...(validationSchema && { resolver: yupResolver(validationSchema) }),
  });

  const cancel = actions && actions.find((action) => action.name === 'cancel');
  const submit = actions && actions.find((action) => action.name === 'submit');

  const onCancel = () => {
    cancel && utils.generic.isFunction(cancel.handler) && cancel.handler();
    reset();
  };

  const onSubmit = (data) => {
    return submit && utils.generic.isFunction(submit.handler) && submit.handler(data);
  };

  return (
    <div className={classes.root}>
      <FormContainer type="dialog" onSubmit={handleSubmit(onSubmit)} data-testid="form-addClientOffice">
        <FormFields type="dialog">
          <FormGrid container>
            <FormGrid item xs={12}>
              <FormAutocomplete
                {...utils.form.getFieldProps(fields, 'parent')}
                control={control}
                error={errors.parent}
                handleUpdate={(id, value) => {
                  getAccountOptions(value);
                  setValue(id, value);
                  setValue('clients', []);
                }}
              />
            </FormGrid>
            <FormGrid item xs={12}>
              <FormAutocomplete
                {...utils.form.getFieldProps(fields, 'clients')}
                error={errors.clients}
                control={control}
                handleUpdate={(id, value) => {
                  setValue(id, value);
                }}
              />
            </FormGrid>
            <FormGrid item xs={12}>
              <FormText {...utils.form.getFieldProps(fields, 'name')} control={control} error={errors.name} />
            </FormGrid>
          </FormGrid>
        </FormFields>

        <FormActions type="dialog">
          {cancel && <Button text={cancel.label} variant="text" onClick={onCancel} disabled={formState.isSubmitting} />}
          {submit && <Button text={submit.label} type="submit" disabled={formState.isSubmitting} color="primary" />}
        </FormActions>
      </FormContainer>
    </div>
  );
}
