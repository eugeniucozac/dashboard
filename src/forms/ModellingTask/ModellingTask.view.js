import React from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormHelperText from '@material-ui/core/FormHelperText';

// app
import styles from './ModellingTask.styles';
import * as utils from 'utils';

import {
  Button,
  FormContainer,
  FormFields,
  FormActions,
  FormGrid,
  FormDate,
  FormCheckbox,
  FormText,
  FormRadio,
  FormFileDrop,
  FormAutocomplete,
  FormSelect,
  Translate,
} from 'components';

// mui
import { makeStyles, Box } from '@material-ui/core';

ModellingTaskView.propTypes = {
  fields: PropTypes.array,
  actions: PropTypes.array,
  createdModellingTask: PropTypes.object,
  folderValue: PropTypes.string,
  isNew: PropTypes.bool,
  validateFileType: PropTypes.func,
};

export function ModellingTaskView({ fields, actions, isNew, validateFileType }) {
  const classes = makeStyles(styles, { name: 'ModellingTask' })();
  const defaultValues = utils.form.getInitialValues(fields);
  const validationSchema = utils.form.getValidationSchema(fields);

  const { control, register, watch, reset, errors, handleSubmit, setValue, trigger, formState, getValues } = useForm({
    defaultValues,
    ...(validationSchema && { resolver: yupResolver(validationSchema) }),
  });

  const modellingTypeValue = watch('modellingType');
  const fileTypeValue = watch('fileType');

  const cancel = actions && actions.find((action) => action.name === 'cancel');
  const submit = actions && actions.find((action) => action.name === 'submit');

  const update = (id, value) => {
    setValue(id, value);
    trigger(id);
  };
  const onCancel = () => {
    cancel && utils.generic.isFunction(cancel.handler) && cancel.handler();
    reset();
  };

  const onSubmit = (data, errors) => {
    const formData = getValues();
    return submit && utils.generic.isFunction(submit.handler) && submit.handler(formData);
  };

  return (
    <div className={classes.root}>
      <FormContainer type="dialog" onSubmit={handleSubmit(onSubmit)} data-testid="form-addLayer">
        <FormFields type="dialog">
          <FormGrid container>
            <FormGrid item xs={12}>
              <FormAutocomplete
                {...utils.form.getFieldProps(fields, 'insured')}
                handleUpdate={update}
                control={control}
                error={errors.insured}
              />
            </FormGrid>
          </FormGrid>
          <FormGrid container>
            <FormGrid item xs={6}>
              <FormRadio
                {...utils.form.getFieldProps(fields, 'modellingType', control, errors)}
                muiFormGroupProps={{ className: classes.formRadio }}
              />
            </FormGrid>
            <FormGrid item xs={6}>
              <FormDate {...utils.form.getFieldProps(fields, 'dueDate')} control={control} error={errors.dueDate} />
            </FormGrid>
          </FormGrid>

          <FormGrid container>
            {isNew ? (
              <FormGrid item xs={6}>
                <Translate label="placement.generic.attachments" />
                <FormFileDrop
                  control={control}
                  onChange={(file) => {
                    setValue('file', file);
                  }}
                  name="file"
                  dragLabel={utils.string.t('form.dragDrop.dragFileEmailHere')}
                  showUploadPreview={true}
                  fileNameLength={30}
                />
              </FormGrid>
            ) : null}
            <FormGrid item xs={6}>
              <Box className={isNew ? classes.fileTypeGridNew : classes.fileTypeGrid}>
                <FormCheckbox
                  {...utils.form.getFieldProps(fields, 'fileType')}
                  control={control}
                  register={register}
                  watch={watch}
                  error={errors.fileType}
                />
                {validateFileType(modellingTypeValue, fileTypeValue) ? (
                  <FormHelperText className={classes.helpertext}>{utils.string.t('placement.modelling.fileType.label')}</FormHelperText>
                ) : null}
              </Box>
            </FormGrid>

            {!isNew ? (
              <FormGrid item xs={6}>
                <FormSelect {...utils.form.getFieldProps(fields, 'status')} control={control} />
              </FormGrid>
            ) : null}
          </FormGrid>
          <FormGrid container>
            <FormGrid item xs={12}>
              <FormText {...utils.form.getFieldProps(fields, 'notes')} control={control} error={errors.notes} />
            </FormGrid>
          </FormGrid>
        </FormFields>

        <FormActions type="dialog">
          {cancel && <Button text={cancel.label} variant="text" onClick={onCancel} disabled={formState.isSubmitting} />}
          {submit && <Button text={submit.label} type="submit" disabled={formState.isSubmitting} color="primary" />}
        </FormActions>
      </FormContainer>
    </div>
  );
}
