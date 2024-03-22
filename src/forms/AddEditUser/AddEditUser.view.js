import React from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// app
import styles from './AddEditUser.styles';
import {
  Button,
  FormContainer,
  FormFields,
  FormActions,
  FormGrid,
  FormSelect,
  FormText,
  FormAutocompleteMui,
  FormSwitch,
  Translate,
} from 'components';
import * as utils from 'utils';
import * as constants from 'consts';

// mui
import { Divider, Fade, makeStyles, Collapse } from '@material-ui/core';

AddEditUserView.propTypes = {
  fields: PropTypes.array,
  actions: PropTypes.array,
  isLoading: PropTypes.bool,
  userId: PropTypes.number,
  programmes: PropTypes.shape({
    programmesUserId: PropTypes.string,
    handleAddToProgrammes: PropTypes.func,
  }),
};

export function AddEditUserView({ fields, actions, userId, programmes, isLoading }) {
  const classes = makeStyles(styles, { name: 'AddEditUser' })();

  const defaultValues = utils.form.getInitialValues(fields);
  const validationSchema = utils.form.getValidationSchema(fields);

  const { control, watch, reset, errors, handleSubmit, formState, setValue } = useForm({
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

  const getAdminField = (fieldName, role) => {
    const field = utils.form.getFieldProps(fields, fieldName);

    if (role === constants.ROLE_COBROKER || role === constants.ROLE_UNDERWRITER) {
      setValue(fieldName, false);
    }

    return {
      ...field,
      muiComponentProps: {
        ...field.muiComponentProps,
        ...((role === constants.ROLE_COBROKER || role === constants.ROLE_UNDERWRITER) && { disabled: true }),
      },
    };
  };

  const watchRoleField = (fieldName, role) => {
    const field = utils.form.getFieldProps(fields, fieldName);

    if (role === constants.ROLE_UNDERWRITER) {
      setValue(fieldName, []);
    }

    return field;
  };

  return (
    <div className={classes.root}>
      <Fade in={!isLoading}>
        <FormContainer onSubmit={handleSubmit(onSubmit)} data-testid="form-addUser">
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
                <FormText {...utils.form.getFieldProps(fields, 'contactPhone')} control={control} error={errors.contactPhone} />
              </FormGrid>
            </FormGrid>

            <FormGrid item xs={12}>
              <FormGrid container>
                <FormGrid item xs={6}>
                  <FormSelect {...utils.form.getFieldProps(fields, 'role')} error={errors.role} control={control} />
                </FormGrid>
                <FormGrid item xs={6}>
                  <FormGrid container>
                    <FormGrid item xs={6} sm={6}>
                      <FormSwitch size="small" control={control} {...getAdminField('isAdmin', watch('role'))} />
                    </FormGrid>
                    <FormGrid item xs={6} sm={6}>
                      <FormSwitch control={control} {...getAdminField('isReportAdmin', watch('role'))} />
                    </FormGrid>
                  </FormGrid>
                </FormGrid>
              </FormGrid>
            </FormGrid>
            <FormGrid container>
              <FormGrid item xs={12} sm={6}>
                <Collapse in={watch('role') !== constants.ROLE_UNDERWRITER}>
                  <FormAutocompleteMui
                    {...watchRoleField('departments', watch('role'))}
                    control={control}
                    error={errors.departments}
                    handleUpdate={(id, value) => {
                      setValue(id, value);
                    }}
                  />
                </Collapse>
              </FormGrid>
              <FormGrid item xs={12} sm={6}>
                <Collapse in={watch('role') === constants.ROLE_COBROKER}>
                  <FormAutocompleteMui
                    {...watchRoleField('offices', watch('role'))}
                    control={control}
                    error={errors.clients}
                    handleUpdate={(id, value) => {
                      setValue(id, value);
                    }}
                  />
                </Collapse>
              </FormGrid>
            </FormGrid>
          </FormFields>

          {userId ? (
            <Collapse in={watch('role') === constants.ROLE_BROKER || watch('role') === constants.ROLE_UNDERWRITER}>
              <Divider />
              <FormFields type="dialog">
                <FormGrid spacing={1} container>
                  <FormGrid item xs={12}>
                    <Translate variant="h3" label="admin.quoteBindTitle" />
                  </FormGrid>
                </FormGrid>
                {programmes.programmesUserId ? (
                  <FormGrid container>
                    <FormGrid item xs={12}>
                      <FormSwitch size="small" control={control} {...getAdminField('coverholder', watch('role'))} />
                    </FormGrid>
                    <FormGrid item xs={12} sm={6}>
                      <FormAutocompleteMui
                        {...utils.form.getFieldProps(fields, 'products', control, errors)}
                        control={control}
                        error={errors.products}
                        handleUpdate={(id, value) => {
                          setValue(id, value);
                        }}
                      />
                    </FormGrid>
                    <FormGrid item xs={12} sm={6}>
                      <FormAutocompleteMui
                        {...utils.form.getFieldProps(fields, 'clients')}
                        control={control}
                        error={errors.clients}
                        handleUpdate={(id, value) => {
                          setValue(id, value);
                        }}
                      />
                    </FormGrid>
                    <FormGrid item xs={12} sm={6}>
                      <FormAutocompleteMui
                        {...utils.form.getFieldProps(fields, 'carriers')}
                        control={control}
                        error={errors.carriers}
                        handleUpdate={(id, value) => {
                          setValue(id, value);
                        }}
                      />
                    </FormGrid>
                  </FormGrid>
                ) : (
                  <FormGrid spacing={1} container>
                    <FormGrid item xs={12} sm={12}>
                      <Button
                        text={utils.string.t('products.admin.addTo')}
                        color="primary"
                        onClick={programmes.handleAddToProgrammes}
                        disabled={formState.isSubmitting}
                      />
                    </FormGrid>
                  </FormGrid>
                )}
              </FormFields>
            </Collapse>
          ) : null}

          <FormActions type="dialog">
            {cancel && <Button text={cancel.label} variant="text" onClick={onCancel} disabled={formState.isSubmitting} />}
            {submit && <Button text={submit.label} type="submit" disabled={formState.isSubmitting || !formState.isDirty} color="primary" />}
          </FormActions>
        </FormContainer>
      </Fade>
    </div>
  );
}
