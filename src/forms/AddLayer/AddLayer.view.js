import React from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// app
import styles from './AddLayer.styles';
import { Button, FormContainer, FormFields, FormActions, FormGrid, FormAutocomplete, FormCheckbox, FormSelect, FormText } from 'components';
import * as utils from 'utils';

// mui
import { makeStyles, Collapse } from '@material-ui/core';

AddLayerView.propTypes = {
  fields: PropTypes.array,
  actions: PropTypes.array,
};

export function AddLayerView({ fields, actions }) {
  const classes = makeStyles(styles, { name: 'AddLayer' })();

  const defaultValues = utils.form.getInitialValues(fields);
  const validationSchema = utils.form.getValidationSchema(fields);

  const { control, register, watch, reset, errors, handleSubmit, setValue, trigger, formState } = useForm({
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
      <FormContainer type="dialog" onSubmit={handleSubmit(onSubmit)} data-testid="form-addLayer">
        <FormFields type="dialog">
          <FormAutocomplete
            {...utils.form.getFieldProps(fields, 'businessType')}
            control={control}
            error={errors.businessType}
            handleUpdate={(id, value) => {
              setValue(id, value);
              trigger(id);
            }}
          />

          <FormGrid container nestedClasses={{ root: classes.currency }}>
            <FormGrid item xs={4}>
              <FormSelect {...utils.form.getFieldProps(fields, 'currency')} control={control} error={errors.currency} />
            </FormGrid>
            <FormGrid item xs={8} nestedClasses={{ root: classes.buyDown }}>
              <FormCheckbox {...utils.form.getFieldProps(fields, 'buydown')} control={control} register={register} watch={watch} />
            </FormGrid>
          </FormGrid>

          <Collapse in={!watch('buydown')}>
            <FormGrid container nestedClasses={{ root: classes.collapse }}>
              <FormGrid item xs={6}>
                <FormText {...utils.form.getFieldProps(fields, 'amount')} control={control} error={errors.amount} />
              </FormGrid>
              <FormGrid item xs={6}>
                <FormText {...utils.form.getFieldProps(fields, 'excess')} control={control} error={errors.excess} />
              </FormGrid>
            </FormGrid>
          </Collapse>

          <FormText {...utils.form.getFieldProps(fields, 'notes')} control={control} error={errors.notes} />
        </FormFields>

        <FormActions type="dialog">
          {cancel && <Button text={cancel.label} variant="text" onClick={onCancel} disabled={formState.isSubmitting} />}
          {submit && <Button text={submit.label} type="submit" disabled={formState.isSubmitting} color="primary" />}
        </FormActions>
      </FormContainer>
    </div>
  );
}
