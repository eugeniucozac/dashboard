import React from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// app
import {
  Button,
  FormContainer,
  FormActions,
  FormGrid,
  FormFields,
  FormLegend,
  FormDate,
  FormCheckbox,
  FormSelect,
  FormText,
  FormHidden,
  Translate,
} from 'components';
import * as utils from 'utils';
import styles from './EditQuote.styles';

// mui
import { makeStyles, Collapse, Grid } from '@material-ui/core';

EditQuoteView.propTypes = {
  fields: PropTypes.array,
  actions: PropTypes.array,
  handleShowCapacity: PropTypes.func.isRequired,
  isCapacityVisible: PropTypes.bool.isRequired,
};

export function EditQuoteView({ fields, actions, isCapacityVisible, handleShowCapacity }) {
  const classes = makeStyles(styles, { name: 'EditQuote' })();

  const defaultValues = utils.form.getInitialValues(fields);
  const validationSchema = utils.form.getValidationSchema(fields);

  const { control, register, watch, reset, errors, handleSubmit, formState } = useForm({
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
      <FormContainer type="dialog" onSubmit={handleSubmit(onSubmit)} data-testid="form-editQuote">
        <FormFields type="dialog">
          <FormGrid container>
            <FormGrid item xs={6}>
              <FormSelect {...utils.form.getFieldProps(fields, 'statusId')} control={control} error={errors.statusId} />
            </FormGrid>

            <FormGrid item xs={6} style={{ paddingTop: 24 }}>
              <FormCheckbox
                {...utils.form.getFieldProps(fields, 'quoteOptions')}
                control={control}
                register={register}
                watch={watch}
                error={errors.quoteOptions}
              />
            </FormGrid>
          </FormGrid>

          <FormGrid container>
            <FormGrid item xs={3}>
              <FormText {...utils.form.getFieldProps(fields, 'currency')} control={control} error={errors.currency} />
            </FormGrid>
            <FormGrid item xs={6}>
              <FormText {...utils.form.getFieldProps(fields, 'premium')} control={control} error={errors.premium} />
            </FormGrid>
            <FormGrid item xs={3}>
              <FormText
                {...utils.form.getFieldProps(fields, 'writtenLinePercentage')}
                control={control}
                error={errors.writtenLinePercentage}
              />
            </FormGrid>
          </FormGrid>

          <FormText {...utils.form.getFieldProps(fields, 'subjectivities')} control={control} error={errors.subjectivities} />

          <FormGrid container style={{ marginTop: 4 }}>
            <FormGrid item xs={6}>
              <FormDate {...utils.form.getFieldProps(fields, 'quoteDate')} control={control} error={errors.quoteDate} />
            </FormGrid>
            <FormGrid item xs={6}>
              <FormDate {...utils.form.getFieldProps(fields, 'validUntilDate')} control={control} error={errors.validUntilDate} />
            </FormGrid>
          </FormGrid>

          <Collapse in={!isCapacityVisible}>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Button
                  text={<Translate label="placement.sheet.editCapacityType" />}
                  variant="outlined"
                  size="small"
                  onClick={() => handleShowCapacity(true)}
                  nestedClasses={{ btn: classes.editCapacityType }}
                />
              </Grid>
            </Grid>
          </Collapse>
          <Collapse in={isCapacityVisible}>
            <FormLegend text={<Translate label="placement.sheet.capacityType" />} nestedClasses={{ root: classes.capacityLegend }} />
            <FormSelect {...utils.form.getFieldProps(fields, 'capacityTypeId')} control={control} error={errors.capacityTypeId} />
          </Collapse>

          <FormHidden {...utils.form.getFieldProps(fields, 'policyMarketId', control, errors)} />
        </FormFields>

        <FormActions type="dialog">
          {cancel && <Button text={cancel.label} variant="text" disabled={formState.isSubmitting} onClick={onCancel} />}
          {submit && <Button text={submit.label} type="submit" disabled={formState.isSubmitting} color="primary" />}
        </FormActions>
      </FormContainer>
    </div>
  );
}
