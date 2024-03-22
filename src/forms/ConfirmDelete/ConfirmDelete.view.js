import React from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// app
import styles from './ConfirmDelete.styles';
import { Button, FormContainer, FormFields, FormActions, FormText } from 'components';
import { useFormActions } from 'hooks';
import * as utils from 'utils';

// mui
import { makeStyles } from '@material-ui/core';

ConfirmDeleteView.propTypes = {
  fields: PropTypes.array,
  actions: PropTypes.array,
};

export function ConfirmDeleteView({ fields, actions }) {
  const classes = makeStyles(styles, { name: 'ConfirmDelete' })();

  const defaultValues = utils.form.getInitialValues(fields);
  const validationSchema = utils.form.getValidationSchema(fields);

  const { control, reset, errors, handleSubmit, formState } = useForm({
    defaultValues,
    ...(validationSchema && { resolver: yupResolver(validationSchema) }),
  });

  const { cancel, submit } = useFormActions(actions, reset);

  return (
    <div className={classes.root}>
      <FormContainer type="dialog" onSubmit={handleSubmit(submit.handler)} data-testid="form-confirmDelete">
        <FormFields type="dialog">
          <FormText {...utils.form.getFieldProps(fields, 'deleteConfirm')} control={control} error={errors.deleteConfirm} />
        </FormFields>

        <FormActions type="dialog">
          {cancel && <Button text={cancel.label} variant="text" disabled={formState.isSubmitting} onClick={cancel.handler} />}
          {submit && <Button text={submit.label} type="submit" disabled={formState.isSubmitting} color="primary" danger />}
        </FormActions>
      </FormContainer>
    </div>
  );
}
