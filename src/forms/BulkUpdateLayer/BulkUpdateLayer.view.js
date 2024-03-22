import React from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import get from 'lodash/get';

// app
import styles from './BulkUpdateLayer.styles';
import {
  Button,
  FormContainer,
  FormGrid,
  FormFields,
  FormActions,
  FormCheckbox,
  FormSelect,
  FormText,
  Translate,
  FormAutocompleteMui,
  FormDate,
} from 'components';
import * as utils from 'utils';

// mui
import { makeStyles, Box, Collapse } from '@material-ui/core';

BulkUpdateLayerView.propTypes = {
  fields: PropTypes.array,
  actions: PropTypes.array,
  isBulkLayer: PropTypes.bool,
};

export function BulkUpdateLayerView({ fields, actions, isBulkLayer }) {
  const defaultValues = utils.form.getInitialValues(fields);
  const validationSchema = utils.form.getValidationSchema(fields);

  const { control, register, watch, reset, errors, handleSubmit, formState } = useForm({
    defaultValues,
    ...(validationSchema && { resolver: yupResolver(validationSchema) }),
  });

  const isDelete = Boolean(watch('delete'));
  const classes = makeStyles(styles, { name: 'BulkUpdateLayer' })({ isDeleteChecked: isDelete });
  const cancel = actions && actions.find((action) => action.name === 'cancel');
  const submit = actions && actions.find((action) => action.name === 'submit');

  submit.label = isDelete ? <Translate label="app.delete" /> : submit.label;
  submit.danger = isDelete;

  const onCancel = () => {
    cancel && utils.generic.isFunction(cancel.handler) && cancel.handler();
    reset();
  };

  const onSubmit = (data) => {
    return submit && utils.generic.isFunction(submit.handler) && submit.handler(data);
  };

  const isSubmitDisabled = !isDelete && !formState.isDirty;

  return (
    <div className={classes.root}>
      <FormContainer type="dialog" onSubmit={handleSubmit(onSubmit)} data-testid="form-bulk-update-layer">
        <FormFields type="dialog">
          {!isBulkLayer && (
            <Collapse in={!isDelete}>
              <Box pb={1.5}>
                <FormGrid container>
                  <FormGrid item xs={5}>
                    <FormSelect {...utils.form.getFieldProps(fields, 'statusId', control, errors)} />
                  </FormGrid>
                  <FormGrid item xs={9}>
                    <FormAutocompleteMui
                      {...utils.form.getFieldProps(fields, 'uniqueMarketReference', control)}
                      error={get(errors, 'uniqueMarketReference.id')}
                    />
                  </FormGrid>
                  <FormGrid item xs={3}>
                    <FormText {...utils.form.getFieldProps(fields, 'section', control, errors)} />
                  </FormGrid>
                  <FormGrid item xs={3} nestedClasses={{ root: classes.isoCode }}>
                    <FormSelect {...utils.form.getFieldProps(fields, 'isoCode', control, errors)} />
                  </FormGrid>
                  <FormGrid item xs={6}>
                    <FormText {...utils.form.getFieldProps(fields, 'premium', control, errors)} />
                  </FormGrid>
                  <FormGrid item xs={3}>
                    <FormText {...utils.form.getFieldProps(fields, 'written', control, errors)} />
                  </FormGrid>
                  <FormGrid item xs={6}>
                    <FormDate {...utils.form.getFieldProps(fields, 'quoteDate', control, errors)} />
                  </FormGrid>
                  <FormGrid item xs={6}>
                    <FormDate {...utils.form.getFieldProps(fields, 'validUntilDate', control, errors)} />
                  </FormGrid>
                  <FormGrid item xs={12}>
                    <FormText {...utils.form.getFieldProps(fields, 'subjectivities', control, errors)} />
                  </FormGrid>
                </FormGrid>
              </Box>
            </Collapse>
          )}
          {isBulkLayer && (
            <Collapse in={!isDelete}>
              <Box pb={1.5}>
                <FormGrid container>
                  <FormGrid item xs={12} sm={6}>
                    <FormSelect {...utils.form.getFieldProps(fields, 'isoCode', control, errors)} />
                  </FormGrid>
                </FormGrid>
              </Box>
            </Collapse>
          )}
          <FormCheckbox
            {...utils.form.getFieldProps(fields, 'delete', control, errors)}
            nestedClasses={{ root: classes.checkbox }}
            register={register}
            watch={watch}
          />
          <Collapse in={isDelete}>
            <Box pt={1.5}>
              <FormText {...utils.form.getFieldProps(fields, 'deleteConfirm', control, errors)} />
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
