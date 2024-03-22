import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';

import { LinearProgress } from '@material-ui/core';

import { Button, FormActions, Empty } from 'components';
import RenderStep from 'forms/AddEditQuoteBind/RenderStep';
import { postCoverages } from 'stores';
import { ReactComponent as Loading } from 'assets/svg/loading.svg';

import * as utils from 'utils';

export const CoverageForm = ({ formData, riskId, riskType, coverageDefinitionFields, handleHideForm }) => {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isEdit, editCoverage, coverageId } = formData;

  const coverageFields = utils.risk.parseFields(coverageDefinitionFields, {});
  const defaultValues = isEdit && editCoverage ? editCoverage : utils.form.getInitialValues(coverageFields);

  const validationSchema = utils.form.getValidationSchema(coverageFields);

  const handleCancel = () => {
    handleHideForm();
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const postData = isEdit
      ? { riskId, riskType, data, definitions: coverageDefinitionFields, isEdit, coverageId }
      : { riskId, riskType, data, definitions: coverageDefinitionFields };

    await dispatch(postCoverages(postData));

    setIsSubmitting(false);
    handleHideForm();
  };

  const onError = (errors, e) => console.log(errors, e);

  const methods = useForm({
    shouldUnregister: false,
    defaultValues,
    ...(validationSchema && { resolver: yupResolver(validationSchema) }),
    mode: 'onChange',
  });

  return (
    <>
      <FormProvider {...methods} data-testid={isEdit ? 'coverage-form-edit' : 'coverage-form'}>
        {isSubmitting ? (
          <div>
            <LinearProgress />
            <Empty width={400} title={utils.string.t('products.coverageSubmitInProgress')} icon={<Loading />} padding />
          </div>
        ) : (
          <>
            <RenderStep fieldsArray={coverageFields} fields={coverageFields} classes={{}} options={{ gridSize: { xs: 6, md: 6, xl: 6 } }} />

            <FormActions type="dialog">
              <Button text={utils.string.t('app.cancel')} variant="text" disabled={methods.formState.isSubmitting} onClick={handleCancel} />

              <Button
                text={utils.string.t('app.submit')}
                type="submit"
                disabled={methods.formState.isSubmitting || isSubmitting}
                onClick={() => methods.handleSubmit(onSubmit, onError)()}
                color="primary"
              />
            </FormActions>
          </>
        )}
      </FormProvider>
    </>
  );
};
