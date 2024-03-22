import React from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// app
import styles from './EditPlacement.styles';
import {
  Button,
  FormContainer,
  FormActions,
  FormGrid,
  FormFields,
  FormAutocomplete,
  FormDate,
  FormHidden,
  FormText,
  FormSelect,
} from 'components';
import { useFormActions } from 'hooks';
import * as utils from 'utils';

// mui
import { makeStyles, Box, Typography } from '@material-ui/core';

EditPlacementView.propTypes = {
  fields: PropTypes.array,
  actions: PropTypes.array,
  gxbBrokers: PropTypes.array,
  officeCoBrokers: PropTypes.array,
};

export function EditPlacementView({ fields, actions, gxbBrokers, officeCoBrokers }) {
  const classes = makeStyles(styles, { name: 'EditPlacement' })();

  const defaultValues = utils.form.getInitialValues(fields);
  const validationSchema = utils.form.getValidationSchema(fields);

  const { control, setValue, trigger, reset, errors, handleSubmit, formState } = useForm({
    defaultValues,
    ...(validationSchema && { resolver: yupResolver(validationSchema) }),
  });

  const { cancel, submit } = useFormActions(actions, reset);

  const update = (id, value) => {
    setValue(id, value);
    trigger(id);
  };

  return (
    <div className={classes.root}>
      <FormContainer type="dialog" onSubmit={handleSubmit(submit.handler)} data-testid="form-editPlacement">
        <FormFields type="dialog">
          <FormGrid container>
            <FormGrid item xs={6}>
              <FormAutocomplete
                {...utils.form.getFieldProps(fields, 'brokers')}
                control={control}
                error={errors.brokers}
                handleUpdate={update}
              />
            </FormGrid>

            {utils.generic.isValidArray(gxbBrokers, true) && (
              <Box mt={-2.5} mb={3.5}>
                <Typography variant="body2" className={classes.list}>
                  <span className={classes.listTitle}>{utils.string.t('placement.form.gxbBrokers.label')}:</span>
                  {gxbBrokers.map((broker) => utils.user.fullname(broker)).join(', ')}
                </Typography>
              </Box>
            )}

            <FormGrid item xs={6}>
              <FormAutocomplete
                {...utils.form.getFieldProps(fields, 'cobrokers')}
                control={control}
                error={errors.cobrokers}
                handleUpdate={update}
              />
            </FormGrid>
          </FormGrid>

          {utils.generic.isValidArray(officeCoBrokers, true) && (
            <Box mt={-2.5} mb={3.5}>
              <Typography variant="body2" className={classes.list}>
                <span className={classes.listTitle}>{utils.string.t('placement.form.assignedCobrokers.label')}:</span>
                {officeCoBrokers.map((cobroker) => utils.user.fullname(cobroker)).join(', ')}
              </Typography>
            </Box>
          )}

          <FormGrid container>
            <FormGrid item xs={6}>
              <FormSelect {...utils.form.getFieldProps(fields, 'department')} error={errors.statusLabel} control={control} />
            </FormGrid>

            <FormGrid item xs={6}>
              <FormAutocomplete
                {...utils.form.getFieldProps(fields, 'clients')}
                control={control}
                error={errors.clients}
                handleUpdate={update}
              />
            </FormGrid>
          </FormGrid>

          <FormGrid container>
            <FormGrid item xs={6}>
              <FormAutocomplete
                {...utils.form.getFieldProps(fields, 'insureds')}
                control={control}
                error={errors.insureds}
                handleUpdate={update}
              />
            </FormGrid>
            <FormGrid item xs={6}>
              <FormSelect {...utils.form.getFieldProps(fields, 'statusLabel')} error={errors.statusLabel} control={control} />
            </FormGrid>
          </FormGrid>

          <FormHidden {...utils.form.getFieldProps(fields, 'placementId')} control={control} />

          <FormGrid container>
            <FormGrid item xs={12}>
              <FormText {...utils.form.getFieldProps(fields, 'description')} control={control} />
            </FormGrid>
          </FormGrid>

          <FormGrid container>
            <FormGrid item xs={6}>
              <FormDate {...utils.form.getFieldProps(fields, 'inceptionDate')} control={control} error={errors.inceptionDate} />
            </FormGrid>
          </FormGrid>
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
