import React from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// app
import styles from './AddDepartmentMarket.styles';
import {
  Button,
  FormActions,
  FormAutocomplete,
  FormContainer,
  FormFields,
  FormGrid,
  FormHidden,
  FormLegend,
  FormSelect,
  Translate,
} from 'components';
import { AddRiskRow } from 'modules';
import { useFormActions } from 'hooks';
import * as utils from 'utils';

// mui
import { makeStyles, Box, Collapse } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

AddDepartmentMarketView.propTypes = {
  fields: PropTypes.array,
  actions: PropTypes.array,
  isUnderwritersVisible: PropTypes.bool,
  handlers: PropTypes.shape({
    showUnderwriters: PropTypes.func.isRequired,
  }).isRequired,
};

export function AddDepartmentMarketView({ fields, actions, isUnderwritersVisible, handlers }) {
  const classes = makeStyles(styles, { name: 'AddDepartmentMarket' })();

  const defaultValues = utils.form.getInitialValues(fields);
  const validationSchema = utils.form.getValidationSchema(fields);

  const { control, register, errors, setValue, watch, reset, handleSubmit, formState, trigger } = useForm({
    defaultValues,
    ...(validationSchema && { resolver: yupResolver(validationSchema) }),
  });

  const { cancel, submit } = useFormActions(actions, reset);

  const departmentIdProps = utils.form.getFieldProps(fields, 'departmentId', control);
  const marketsProps = utils.form.getFieldProps(fields, 'markets', control, errors);
  const capacityTypeIdProps = utils.form.getFieldProps(fields, 'capacityTypeId', control, errors);
  const underwritersProps = utils.form.getFieldProps(fields, 'underwriters', control);

  return (
    <div className={classes.root}>
      <FormContainer type="dialog" onSubmit={handleSubmit(submit.handler)} data-testid="form-addDepartmentMarket">
        <FormFields type="dialog">
          <FormGrid container>
            <FormGrid item xs={12}>
              <FormAutocomplete
                {...marketsProps}
                handleUpdate={(id, values) => {
                  marketsProps.callback(values, setValue, reset);
                }}
              />
            </FormGrid>

            <FormGrid item xs={12}>
              <FormSelect {...capacityTypeIdProps} />
            </FormGrid>

            <FormGrid item xs={12}>
              <Collapse in={!isUnderwritersVisible}>
                <Box mt={2} display="flex" justifyContent="flex-end">
                  <Button
                    text={<Translate label="market.addUnderwriters" />}
                    icon={AddIcon}
                    variant="outlined"
                    size="small"
                    onClick={() => handlers.showUnderwriters(true)}
                    disabled={formState.isSubmitting}
                  />
                </Box>
              </Collapse>
            </FormGrid>

            <FormGrid item xs={12}>
              <Collapse in={isUnderwritersVisible}>
                <Box mt={1.5}>
                  <FormLegend text={underwritersProps.label} />
                </Box>
                <Box mt={-2} data-testid="foo">
                  <AddRiskRow field={underwritersProps} formProps={{ control, register, watch, errors, setValue, trigger }} />
                </Box>
              </Collapse>
            </FormGrid>
          </FormGrid>

          <FormHidden {...departmentIdProps} />
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
