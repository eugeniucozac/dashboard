import React from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// app
import styles from './EditDepartmentMarket.styles';
import { Button, FormActions, FormContainer, FormFields, FormGrid, FormHidden, FormLegend, FormSelect, FormText } from 'components';
import { AddRiskRow } from 'modules';
import { useFormActions } from 'hooks';
import * as utils from 'utils';

// mui
import { makeStyles, Box } from '@material-ui/core';

EditDepartmentMarketView.propTypes = {
  fields: PropTypes.array,
  actions: PropTypes.array,
};

export function EditDepartmentMarketView({ fields, actions }) {
  const classes = makeStyles(styles, { name: 'EditDepartmentMarket' })();

  const defaultValues = utils.form.getInitialValues(fields);
  const validationSchema = utils.form.getValidationSchema(fields);

  const { control, register, errors, setValue, watch, reset, handleSubmit, formState, trigger } = useForm({
    defaultValues,
    ...(validationSchema && { resolver: yupResolver(validationSchema) }),
  });

  const { cancel, submit } = useFormActions(actions, reset);

  const departmentIdProps = utils.form.getFieldProps(fields, 'departmentId', control);
  const departmentMarketIdProps = utils.form.getFieldProps(fields, 'departmentMarketId', control);
  const marketIdProps = utils.form.getFieldProps(fields, 'marketId', control);
  const marketProps = utils.form.getFieldProps(fields, 'market', control, errors);
  const capacityTypeIdProps = utils.form.getFieldProps(fields, 'capacityTypeId', control, errors);
  const underwritersProps = utils.form.getFieldProps(fields, 'underwriters', control);
  const previousUnderwritersProps = utils.form.getFieldProps(fields, 'previousUnderwriters', control);

  return (
    <div className={classes.root}>
      <FormContainer type="dialog" onSubmit={handleSubmit(submit.handler)} data-testid="form-editDepartmentMarket">
        <FormFields type="dialog">
          <FormGrid container>
            <FormGrid item xs={12}>
              <FormText {...marketProps} />
            </FormGrid>

            <FormGrid item xs={12}>
              <FormSelect {...capacityTypeIdProps} />
            </FormGrid>

            <FormGrid item xs={12}>
              <Box mt={4.5}>
                <FormLegend text={underwritersProps.label} />
              </Box>
              <Box mt={-2} data-testid="foo">
                <AddRiskRow field={underwritersProps} formProps={{ control, register, watch, errors, setValue, trigger }} />
              </Box>
            </FormGrid>
          </FormGrid>

          <FormHidden {...departmentIdProps} />
          <FormHidden {...departmentMarketIdProps} />
          <FormHidden {...marketIdProps} />
          <FormHidden {...previousUnderwritersProps} />
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
