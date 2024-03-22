import React from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// app
import styles from './PremiumProcessingCheckSigningReject.styles';
import {
  Button,
  FormContainer,
  FormSelect,
  FormActions,
  FormGrid,
  FormCheckbox,
  FormText,
  Translate,
  FormDate,
  FormAutocomplete,
} from 'components';
import * as utils from 'utils';

// mui
import { makeStyles, Divider } from '@material-ui/core';

PremiumProcessingCheckSigningRejectView.propTypes = {
  fields: PropTypes.array,
  actions: PropTypes.array,
};

export function PremiumProcessingCheckSigningRejectView({ fields, actions }) {
  const classes = makeStyles(styles, { name: 'PremiumProcessingCheckSigningReject' })();

  const defaultValues = utils.form.getInitialValues(fields);
  const validationSchema = utils.form.getValidationSchema(fields);

  const { control, errors, watch, handleSubmit, formState, setValue } = useForm({
    defaultValues,
    ...(validationSchema && { resolver: yupResolver(validationSchema) }),
  });
  const CheckBoxValue = watch('checkBoxMessage');
  const cancel = actions && actions.find((action) => action.name === 'cancel');
  const submit = actions && actions.find((action) => action.name === 'submit');

  const onSubmit = (data) => {
    return submit && utils.generic.isFunction(submit.handler) && submit.handler(data);
  };

  return (
    <div className={classes.root}>
      <FormContainer type="dialog" onSubmit={handleSubmit(onSubmit)} nestedClasses={{ root: classes.leftMargin }}>
        <FormGrid item xs={12}>
          <Translate variant="h5" label="premiumProcessing.checkSigningReject.rejectMessage" />
        </FormGrid>
        <FormGrid item xs={4}>
          <FormSelect {...utils.form.getFieldProps(fields, 'chooseReason')} error={errors.chooseReason} control={control} />
        </FormGrid>
        <Divider />
        <FormCheckbox
          {...utils.form.getFieldProps(fields, 'checkBoxMessage', control)}
          nestedClasses={{ root: classes.checkboxAlignment }}
        />

        {CheckBoxValue && (
          <FormContainer className={classes.bottomMargin}>
            <Translate variant="h5" label="premiumProcessing.checkSigningReject.textMessage" />
            <FormGrid container spacing={3}>
              <FormGrid item xs={4}>
                <FormText
                  {...utils.form.getFieldProps(fields, 'workPackageReference')}
                  control={control}
                  error={errors.workPackageReference}
                />
              </FormGrid>
              <FormGrid item xs={4}>
                <FormAutocomplete
                  {...utils.form.getFieldProps(fields, 'bureauList')}
                  control={control}
                  error={errors.bureauList}
                  handleUpdate={(id, value) => {
                    setValue(id, value);
                  }}
                />
              </FormGrid>
              <FormGrid item xs={4}>
                <FormDate {...utils.form.getFieldProps(fields, 'packageSubmittedDate', control)} error={errors.packageSubmittedDate} />
              </FormGrid>
            </FormGrid>
          </FormContainer>
        )}
      </FormContainer>
      <FormActions type="dialog">
        {cancel && (
          <Button text={cancel.label} variant="outlined" size="medium" disabled={formState.isSubmitting} onClick={cancel.handler} />
        )}
        {submit && (
          <Button
            text={!CheckBoxValue ? utils.string.t('premiumProcessing.checkSigningReject.rejectCase') : submit.label}
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
