import React from 'react';
import PropTypes from 'prop-types';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// app
import styles from './AddMarket.styles';
import {
  Button,
  FormContainer,
  FormFields,
  FormActions,
  FormGrid,
  FormLegend,
  FormDate,
  FormAutocomplete,
  FormCheckbox,
  FormSelect,
  FormText,
  Translate,
} from 'components';
import * as utils from 'utils';

// mui
import { makeStyles, Box, Collapse, Grid } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

AddMarketView.propTypes = {
  fields: PropTypes.array,
  actions: PropTypes.array,
  setNonPFMarket: PropTypes.func.isRequired,
  nonPFMarket: PropTypes.object,
};

export function AddMarketView({ fields, actions, isQuoteVisible, handleShowQuote, handleUpdateUnderwriters, setNonPFMarket, nonPFMarket }) {
  const classes = makeStyles(styles, { name: 'AddMarket' })();

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
      <FormContainer type="dialog" onSubmit={handleSubmit(onSubmit)} data-testid="form-addMarket">
        <FormFields type="dialog">
          <FormLegend text={<Translate label="placement.generic.market" />} />

          <FormAutocomplete
            {...utils.form.getFieldProps(fields, 'market')}
            control={control}
            error={errors.market}
            handleUpdate={(id, value) => {
              const isNew = value[0] && value[0].__isNew__;
              const market = isNew ? [{ ...value[0], edgeName: value[0].label, name: value[0].label }] : value;
              setValue(id, market);

              setNonPFMarket(isNew ? market[0] : undefined);

              // reset the underwriter dropdown field
              // populate underwriters field with the array from selected market
              setValue('underwriter', []);
              handleUpdateUnderwriters(value[0]);

              trigger(id);
            }}
          />

          {nonPFMarket && (
            <FormSelect
              {...utils.form.getFieldProps(fields, 'capacityTypeId')}
              control={control}
              error={errors.capacityTypeId}
              hint={utils.string.t('placement.form.capacityType.hint', { market: nonPFMarket.name })}
            />
          )}

          <FormAutocomplete
            {...utils.form.getFieldProps(fields, 'underwriter')}
            control={control}
            error={errors.underwriter}
            handleUpdate={(id, value) => {
              setValue(id, value);
            }}
          />

          <Controller
            control={control}
            name="policy"
            render={(props) => <input {...props} {...utils.form.getFieldProps(fields, 'policy')} />}
          />

          <Collapse in={!isQuoteVisible}>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Button
                  text={<Translate label="placement.sheet.addQuote" />}
                  icon={AddIcon}
                  variant="outlined"
                  size="small"
                  onClick={() => handleShowQuote(true)}
                  disabled={formState.isSubmitting}
                  nestedClasses={{ btn: classes.addQuote }}
                />
              </Grid>
            </Grid>
          </Collapse>

          <Collapse in={isQuoteVisible}>
            <FormLegend text={<Translate label="placement.generic.quote" />} nestedClasses={{ root: classes.quoteLegend }} />
          </Collapse>

          <Collapse in={isQuoteVisible}>
            <FormGrid container>
              <FormGrid item xs={6}>
                <FormSelect {...utils.form.getFieldProps(fields, 'status')} control={control} error={errors.status} />
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

            <FormGrid container nestedClasses={{ root: classes.dateFields }}>
              <FormGrid item xs={6}>
                <FormDate {...utils.form.getFieldProps(fields, 'quoteDate')} control={control} error={errors.quoteDate} />
              </FormGrid>
              <FormGrid item xs={6}>
                <FormDate {...utils.form.getFieldProps(fields, 'validUntilDate')} control={control} error={errors.validUntilDate} />
              </FormGrid>
            </FormGrid>
          </Collapse>

          <Collapse in={!isQuoteVisible}>
            <Box style={{ height: 150 }} />
          </Collapse>
        </FormFields>

        <FormActions type="dialog">
          {cancel && <Button text={cancel.label} variant="text" onClick={onCancel} disabled={formState.isSubmitting} />}
          {submit && <Button text={submit.label} type="submit" disabled={formState.isSubmitting} color="primary" />}
        </FormActions>
      </FormContainer>
    </div>
  );
}
