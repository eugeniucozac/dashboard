import React from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// app
import { Button, FormCheckbox, FormGrid, FormContainer, FormFields, FormActions, FormText, Loader } from 'components';
import * as utils from 'utils';
import styles from './PlacementPDF.styles';

// mui
import { makeStyles } from '@material-ui/core';

PlacementPDFView.propTypes = {
  fields: PropTypes.array.isRequired,
  actions: PropTypes.array.isRequired,
  isRenderingPDF: PropTypes.bool.isRequired,
  showLoader: PropTypes.bool.isRequired,
  component: PropTypes.func.isRequired,
  componentProps: PropTypes.object.isRequired,
  componentRef: PropTypes.object.isRequired,
};

export function PlacementPDFView({ fields, actions, component, componentProps, componentRef, isRenderingPDF, showLoader }) {
  const Component = component;
  const classes = makeStyles(styles, { name: 'PlacementPDF' })();

  const defaultValues = utils.form.getInitialValues(fields);
  const validationSchema = utils.form.getValidationSchema(fields);

  const { control, getValues, reset, handleSubmit, formState } = useForm({
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
    <div>
      {showLoader && <Loader visible={showLoader} absolute />}
      <FormContainer type="dialog" onSubmit={handleSubmit(onSubmit)} data-testid="form-placement-pdf">
        <FormFields type="dialog">
          <FormGrid container>
            <FormGrid item xs={12}>
              <FormText {...utils.form.getFieldProps(fields, 'introduction')} control={control} />
            </FormGrid>
            <FormGrid item xs={12}>
              <FormCheckbox {...utils.form.getFieldProps(fields, 'showMudmap')} control={control} />
            </FormGrid>
          </FormGrid>
        </FormFields>

        <FormActions type="dialog">
          {cancel && <Button text={cancel.label} variant="text" disabled={formState.isSubmitting} onClick={onCancel} />}
          {submit && <Button text={submit.label} type="submit" disabled={formState.isSubmitting} color="primary" />}
        </FormActions>
      </FormContainer>
      {isRenderingPDF && (
        <div ref={componentRef} className={classes.printComponent}>
          <Component {...componentProps} formValues={getValues()} />
        </div>
      )}
    </div>
  );
}
