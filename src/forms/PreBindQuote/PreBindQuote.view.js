import React from 'react';
import PropTypes from 'prop-types';
import { FormProvider, useForm } from 'react-hook-form';
import { useFormActions } from 'hooks';
import { yupResolver } from '@hookform/resolvers/yup';

// app
import styles from './PreBindQuote.styles';
import * as utils from 'utils';

// mui
import { makeStyles } from '@material-ui/core';
import { Button, Empty, FormFields, FormActions } from 'components';

import RenderStep from '../AddEditQuoteBind/RenderStep';
import { ReactComponent as Loading } from '../../assets/svg/loading.svg';

PreBindQuoteView.propTypes = {
  actions: PropTypes.array.isRequired,
  fields: PropTypes.array.isRequired,
};

export function PreBindQuoteView({ actions, fields, defaultValues, isLoading }) {
  const classes = makeStyles(styles, { name: 'PreBindQuote' })();

  const validationSchema = utils.form.getValidationSchema(fields);
  const hasValidFields = utils.generic.isValidArray(fields, true);

  const methods = useForm({
    shouldUnregister: false,
    defaultValues,
    ...(validationSchema && { resolver: yupResolver(validationSchema) }),
    mode: 'onChange',
  });
  const { cancel, submit } = useFormActions(actions, methods.reset);

  return (
    <div className={classes.root}>
      <FormProvider {...methods}>
        <FormFields type="dialog">
          {!isLoading ? (
            <>
              {hasValidFields ? (
                <RenderStep fieldsArray={fields} fields={fields} classes={classes} options={{ gridSize: { xs: 6, md: 4, xl: 4 } }} />
              ) : (
                <Empty width={400} title={utils.string.t('products.preBindLoadError')} icon={<Loading />} padding />
              )}
            </>
          ) : (
            <Empty width={400} title={utils.string.t('products.loadInProgress')} icon={<Loading />} padding />
          )}
        </FormFields>
        {!isLoading && hasValidFields ? (
          <FormActions type="dialog">
            {cancel && <Button text={cancel.label} variant="text" disabled={methods.formState.isSubmitting} onClick={cancel.handler} />}
            {submit && (
              <Button
                text={submit.label}
                type="submit"
                disabled={methods.formState.isSubmitting}
                onClick={methods.handleSubmit(submit.handler)}
                color="primary"
              />
            )}
          </FormActions>
        ) : null}
      </FormProvider>
    </div>
  );
}
