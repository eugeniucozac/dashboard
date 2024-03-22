import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// app
import styles from './EditProductsFacility.styles';
import {
  Button,
  FormActions,
  FormAutocompleteMui,
  FormContainer,
  FormDate,
  FormFields,
  FormGrid,
  FormLegend,
  FormSelect,
  FormText,
  FormCheckbox,
} from 'components';
import { AddRiskRow } from 'modules';
import { useFormActions } from 'hooks';
import * as utils from 'utils';
import { COUNTRY_RATES } from 'consts';

// mui
import { makeStyles, Box } from '@material-ui/core';

EditProductsFacilityView.propTypes = {
  fields: PropTypes.object.isRequired,
  ratesCountries: PropTypes.array,
  actions: PropTypes.array.isRequired,
  isRateField: PropTypes.bool.isRequired,
  isRatesLoaded: PropTypes.bool.isRequired,
};

export function EditProductsFacilityView({ fields: { details, rates }, ratesCountries, actions, isRateField, isRatesLoaded }) {
  const classes = makeStyles(styles, { name: 'EditProductsFacility' })();

  const combinedFields = isRateField ? [...rates] : [...details];
  const defaultValues = {
    ...utils.form.getInitialValues(combinedFields),
    ...(utils.generic.isValidArray(ratesCountries, true) && { countries: ratesCountries }),
  };
  const validationSchema = utils.form.getValidationSchema(combinedFields);

  const { control, register, reset, watch, errors, setValue, formState, handleSubmit, trigger } = useForm({
    defaultValues,
    ...(validationSchema && { resolver: yupResolver(validationSchema) }),
  });

  const { cancel, submit } = useFormActions(actions, reset);

  return (
    <div className={classes.root}>
      <FormContainer type="dialog" onSubmit={handleSubmit(submit)} autoComplete="off" data-testid="form-edit-products-facility">
        <FormFields type="dialog">
          {utils.generic.isValidArray(combinedFields, true) ? (
            <FormGrid container>
              {isRateField ? (
                <>
                  <FormGrid item xs={12} nestedClasses={{ root: classes.legend }}>
                    <FormLegend text={utils.string.t('products.admin.facilities.legends.rates')} />
                  </FormGrid>

                  <FormGrid item xs={3}>
                    <FormText {...utils.form.getFieldProps(rates, 'brokerageFee', control, errors)} />
                  </FormGrid>

                  <FormGrid item xs={3}>
                    <FormText {...utils.form.getFieldProps(rates, 'clientCommissionRate', control, errors)} />
                  </FormGrid>

                  <FormGrid item xs={3}>
                    <FormText {...utils.form.getFieldProps(rates, 'brokerCommissionRate', control, errors)} />
                  </FormGrid>

                  <FormGrid item xs={3}>
                    <FormText {...utils.form.getFieldProps(rates, 'reinsuranceRate', control, errors)} />
                  </FormGrid>

                  <FormGrid item xs={12}>
                    <Box mt={-2} mb={5}>
                      <AddRiskRow
                        field={utils.form.getFieldProps(rates, 'countries')}
                        formProps={{ control, register, watch, errors, setValue, trigger }}
                        overflow={false}
                        formatData={COUNTRY_RATES}
                      />
                    </Box>
                  </FormGrid>
                </>
              ) : (
                <>
                  <FormGrid item xs={12} nestedClasses={{ root: classes.legend }}>
                    <FormLegend text={utils.string.t('products.admin.facilities.legends.settings')} />
                  </FormGrid>
                  <FormGrid item xs={12} sm={6}>
                    <FormAutocompleteMui
                      {...utils.form.getFieldProps(details, 'permissionToBindGroups')}
                      control={control}
                      error={errors.permissionToBindGroups}
                      handleUpdate={(id, value) => {
                        setValue(id, value);
                      }}
                    />
                  </FormGrid>
                  <FormGrid item xs={12} sm={6}>
                    <FormAutocompleteMui
                      {...utils.form.getFieldProps(details, 'permissionToDismissIssuesGroups')}
                      control={control}
                      error={errors.permissionToDismissIssuesGroups}
                      handleUpdate={(id, value) => {
                        setValue(id, value);
                      }}
                    />
                  </FormGrid>
                  <FormGrid item xs={12} sm={6}>
                    <FormAutocompleteMui
                      {...utils.form.getFieldProps(details, 'notifiedUsers')}
                      control={control}
                      error={errors.notifiedUsers}
                      handleUpdate={(id, value) => {
                        setValue(id, value);
                      }}
                    />
                  </FormGrid>

                  <FormGrid item xs={12} sm={6}>
                    <FormCheckbox {...utils.form.getFieldProps(details, 'preBind')} control={control} register={register} watch={watch} />
                  </FormGrid>

                  <FormGrid item xs={12} nestedClasses={{ root: classes.legend }}>
                    <FormLegend text={utils.string.t('products.admin.facilities.legends.details')} />
                  </FormGrid>

                  <FormGrid item xs={6} md={4}>
                    <FormText {...utils.form.getFieldProps(details, 'name', control, errors)} />
                  </FormGrid>

                  <FormGrid item xs={6} md={2}>
                    <FormText {...utils.form.getFieldProps(details, 'brokerCode', control, errors)} />
                  </FormGrid>

                  <FormGrid item xs={12} sm={6} md={3}>
                    <FormSelect {...utils.form.getFieldProps(details, 'carrierId', control, errors)} />
                  </FormGrid>

                  <FormGrid item xs={12} sm={6} md={3}>
                    <FormSelect {...utils.form.getFieldProps(details, 'productCode', control, errors)} />
                  </FormGrid>

                  <FormGrid item xs={7} sm={8} md={4}>
                    <FormText {...utils.form.getFieldProps(details, 'capacity', control, errors)} />
                  </FormGrid>

                  <FormGrid item xs={5} sm={4} md={2}>
                    <FormText {...utils.form.getFieldProps(details, 'quoteValidDays', control, errors)} />
                  </FormGrid>

                  <FormGrid item xs={6} md={3}>
                    <FormDate {...utils.form.getFieldProps(details, 'liveFrom', control, errors)} />
                  </FormGrid>

                  <FormGrid item xs={6} md={3}>
                    <FormDate {...utils.form.getFieldProps(details, 'liveTo', control, errors)} />
                  </FormGrid>

                  <FormGrid item xs={6} md={4}>
                    <FormText {...utils.form.getFieldProps(details, 'broker', control, errors)} />
                  </FormGrid>

                  <FormGrid item xs={6} md={4}>
                    <FormText {...utils.form.getFieldProps(details, 'coverholderName', control, errors)} />
                  </FormGrid>

                  <FormGrid item xs={6} md={4}>
                    <FormText {...utils.form.getFieldProps(details, 'coverholderPin', control, errors)} />
                  </FormGrid>

                  <FormGrid item xs={6} md={4}>
                    <FormText {...utils.form.getFieldProps(details, 'umr', control, errors)} />
                  </FormGrid>

                  <FormGrid item xs={6} md={4}>
                    <FormText {...utils.form.getFieldProps(details, 'agreementNumber', control, errors)} />
                  </FormGrid>

                  <FormGrid item xs={12} sm={6}>
                    <FormSelect {...utils.form.getFieldProps(details, 'pricerCode', control, errors)} />
                  </FormGrid>
                </>
              )}
            </FormGrid>
          ) : null}
        </FormFields>

        <FormActions type="dialog">
          {cancel && <Button text={cancel.label} variant="text" disabled={formState.isSubmitting} onClick={cancel.handler} />}
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
