import React from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// app
import styles from './EditPlacementLayer.styles';
import { Button, FormContainer, FormHidden, FormFields, FormActions, FormGrid, FormCheckbox, FormSelect, FormText } from 'components';
import { useMedia } from 'hooks';
import * as utils from 'utils';

// mui
import { makeStyles, Collapse } from '@material-ui/core';

EditPlacementLayerView.propTypes = {
  fields: PropTypes.array,
  actions: PropTypes.array,
};

export function EditPlacementLayerView({ fields, actions }) {
  const classes = makeStyles(styles, { name: 'EditPlacementLayer' })();
  const media = useMedia();

  const spacing = media.mobile ? 2 : media.tablet ? 3 : 4;
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
      <FormContainer type="dialog" onSubmit={handleSubmit(onSubmit)} data-testid="form-edit-layer">
        <FormFields type="dialog">
          <FormGrid container spacing={spacing}>
            <FormGrid item xs={12} sm={6}>
              <FormSelect {...utils.form.getFieldProps(fields, 'status', control, errors)} />
            </FormGrid>
          </FormGrid>

          <FormGrid container spacing={spacing} nestedClasses={{ root: classes.currency }}>
            <FormGrid item xs={4}>
              <FormSelect {...utils.form.getFieldProps(fields, 'currency', control, errors)} />
            </FormGrid>
            <FormGrid item xs={8} nestedClasses={{ root: classes.buyDown }}>
              <FormCheckbox {...utils.form.getFieldProps(fields, 'buydown', control, errors)} register={register} watch={watch} />
            </FormGrid>
          </FormGrid>

          <Collapse in={!watch('buydown')}>
            <FormGrid container spacing={spacing} nestedClasses={{ root: classes.collapse }}>
              <FormGrid item xs={6}>
                <FormText {...utils.form.getFieldProps(fields, 'amount', control, errors)} />
              </FormGrid>
              <FormGrid item xs={6}>
                <FormText {...utils.form.getFieldProps(fields, 'excess', control, errors)} />
              </FormGrid>
            </FormGrid>
          </Collapse>

          <FormText {...utils.form.getFieldProps(fields, 'notes', control, errors)} />

          <FormHidden {...utils.form.getFieldProps(fields, 'layerId', control, errors)} />
          <FormHidden {...utils.form.getFieldProps(fields, 'departmentId', control, errors)} />
          <FormHidden {...utils.form.getFieldProps(fields, 'businessTypeId', control, errors)} />
        </FormFields>

        <FormActions type="dialog">
          {cancel && <Button text={cancel.label} variant="text" onClick={onCancel} disabled={formState.isSubmitting} />}
          {submit && <Button text={submit.label} type="submit" disabled={formState.isSubmitting} color="primary" />}
        </FormActions>
      </FormContainer>
    </div>
  );
}
