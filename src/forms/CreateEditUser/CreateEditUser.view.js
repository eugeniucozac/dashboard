import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// app
import styles from './CreateEditUser.styles';
import { Button, FormActions, FormAutocomplete, FormContainer, FormFields, FormGrid, FormSelect, FormText } from 'components';
import { useFormActions } from 'hooks';
import * as utils from 'utils';

// mui
import { makeStyles } from '@material-ui/core';

CreateEditUserView.propTypes = {
  fields: PropTypes.array.isRequired,
  actions: PropTypes.array.isRequired,
  onChangeGroups: PropTypes.func.isRequired,
  onChangeXbInstances: PropTypes.func.isRequired,
  setTeamLoaded: PropTypes.func.isRequired,
  user: PropTypes.object,
  showClaimGroups: PropTypes.func.isRequired,
};

export function CreateEditUserView({ fields, actions, onChangeGroups, onChangeXbInstances, setTeamLoaded, user, showClaimGroups }) {
  const classes = makeStyles(styles, { name: 'CreateEditUser' })();

  const defaultValues = utils.form.getInitialValues(fields);
  const validationSchema = utils.form.getValidationSchema(fields);
  const { control, watch, reset, errors, handleSubmit, formState, setValue, setError } = useForm({
    defaultValues,
    ...(validationSchema && { resolver: yupResolver(validationSchema) }),
  });

  const groups = watch('groups');
  const xbInstances = watch('xbInstances');
  const departments = watch('departments');
  const businessProcesses = watch('businessProcesses');

  useEffect(() => {
    onChangeGroups(groups);
  }, [groups]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const xbInstanceNames = xbInstances.map((xbi) => xbi.edgeSourceName);

    //remove any departments that don't have this XB instance name in their name.
    setValue(
      'departments',
      departments.filter((dept) => xbInstanceNames.includes(dept.name.split('-').pop()))
    );
    onChangeXbInstances(xbInstances);
  }, [xbInstances]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const teamEnableDisableSelection =
      businessProcesses?.length === 1 && businessProcesses?.some((itm) => itm?.businessProcessName === 'Claims');
    setTeamLoaded(teamEnableDisableSelection);
  }, [businessProcesses]); // eslint-disable-line react-hooks/exhaustive-deps

  const { cancel, submit } = useFormActions(actions, reset, null, setError);

  return (
    <div className={classes.root}>
      <FormContainer type="dialog" onSubmit={handleSubmit(submit.handler)} data-testid="form-addUser">
        <FormFields type="dialog">
          <FormGrid container>
            <FormGrid item xs={12} sm={6}>
              <FormText {...utils.form.getFieldProps(fields, 'firstName')} control={control} error={errors.firstName} />
            </FormGrid>
            <FormGrid item xs={12} sm={6}>
              <FormText {...utils.form.getFieldProps(fields, 'lastName')} control={control} error={errors.lastName} />
            </FormGrid>
          </FormGrid>

          <FormGrid container>
            <FormGrid item xs={12} sm={6}>
              <FormText {...utils.form.getFieldProps(fields, 'emailId')} control={control} error={errors.emailId} />
            </FormGrid>
            <FormGrid item xs={12} sm={6}>
              <FormAutocomplete
                {...utils.form.getFieldProps(fields, 'businessProcesses')}
                control={control}
                error={errors.businessProcesses}
                handleUpdate={(id, value) => {
                  setValue('team', []);
                  setValue('groups', []);
                  setValue(id, value, { shouldDirty: true });
                }}
              />
            </FormGrid>
          </FormGrid>

          <FormGrid container>
            <FormGrid item xs={12} sm={6}>
              <FormSelect
                {...utils.form.getFieldProps(fields, 'team')}
                control={control}
                error={errors.team}
                handleUpdate={(id, value) => {
                  showClaimGroups(id, value);
                  setValue('groups', []);
                  setValue(id, value, { shouldDirty: true });
                }}
              />
            </FormGrid>
            <FormGrid item xs={12} sm={6}>
              <FormAutocomplete
                {...utils.form.getFieldProps(fields, 'groups')}
                control={control}
                error={errors.groups}
                handleUpdate={(id, value) => {
                  setValue('role', '');
                  setValue(id, value, { shouldDirty: true });
                }}
              />
            </FormGrid>
          </FormGrid>

          <FormGrid container>
            <FormGrid item xs={12} sm={6}>
              <FormSelect
                {...utils.form.getFieldProps(fields, 'role')}
                error={errors.role}
                control={control}
                handleUpdate={(id, value) => {
                  setValue(id, value, { shouldDirty: true });
                }}
              />
            </FormGrid>
            <FormGrid item xs={12} sm={6}>
              <FormAutocomplete
                {...utils.form.getFieldProps(fields, 'xbInstances')}
                control={control}
                error={errors.xbInstances}
                handleUpdate={(id, value) => {
                  setValue(id, value, { shouldDirty: true });
                }}
              />
            </FormGrid>
          </FormGrid>

          <FormGrid container>
            <FormGrid item xs={12} sm={6}>
              <FormAutocomplete
                {...utils.form.getFieldProps(fields, 'departments')}
                control={control}
                error={errors.departments}
                handleUpdate={(id, value) => {
                  setValue(id, value, { shouldDirty: true });
                }}
              />
            </FormGrid>
          </FormGrid>
        </FormFields>

        <FormActions type="dialog">
          {cancel && <Button text={cancel.label} variant="text" onClick={cancel.handler} disabled={formState.isSubmitting} />}
          {submit && <Button text={submit.label} type="submit" disabled={formState.isSubmitting || !formState.isDirty} color="primary" />}
        </FormActions>
      </FormContainer>
    </div>
  );
}
