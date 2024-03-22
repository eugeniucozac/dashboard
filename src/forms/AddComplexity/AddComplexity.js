import React from 'react';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import isEqual from 'lodash/isEqual';
import { yupResolver } from '@hookform/resolvers/yup';

// app
import { AddComplexityView } from './AddComplexity.view';
import * as utils from 'utils';
import { postClaimsComplexityValues, showModal, hideModal } from 'stores';
import { useFormActions } from 'hooks';

export default function AddComplexity() {
  const dispatch = useDispatch();

  const fields = [
    {
      name: 'complexityRulesValue',
      type: 'text',
      value: '',
      validation: Yup.string().trim().required(utils.string.t('validation.required')).max(75, utils.string.t('validation.string.max')),
    },
  ];

  const actions = [
    {
      name: 'cancel',
      label: utils.string.t('app.cancel'),
      handler: () => dispatch(hideModal()),
    },
    {
      name: 'submit',
      label: utils.string.t('app.add'),
      handler: (values) => dispatch(postClaimsComplexityValues(values)),
    },
  ];

  const defaultValues = utils.form.getInitialValues(fields);
  const validationSchema = utils.form.getValidationSchema(fields);

  const { control, errors, watch, handleSubmit } = useForm({
    defaultValues,
    ...(validationSchema && { resolver: yupResolver(validationSchema) }),
  });

  const { cancel, submit } = useFormActions(actions);

  const formValues = watch();

  const defaultValuesToString = Object.entries(defaultValues).reduce((acc, [key, value]) => {
    return { ...acc, [key]: value?.toString() || '' };
  }, {});

  const formValuesToString = Object.entries(formValues).reduce((acc, [key, value]) => {
    return { ...acc, [key]: value?.toString() || '' };
  }, {});

  const isPageEdited = !isEqual(defaultValuesToString, formValuesToString);

  const cancelModal = () => {
    if (isPageEdited) {
      dispatch(
        showModal({
          component: 'CONFIRM',
          props: {
            fullWidth: true,
            title: utils.string.t('claims.complexityRulesManagementDetails.alertModal.title'),
            maxWidth: 'xs',
            componentProps: {
              confirmLabel: utils.string.t('app.yes'),
              cancelLabel: utils.string.t('app.no'),
              confirmMessage: utils.string.t('claims.complexityRulesManagementDetails.alertModal.subTitle'),
              buttonColors: { confirm: 'secondary', cancel: 'primary' },
              submitHandler: () => {
                dispatch(hideModal());
              },
              cancelHandler: () => {},
              handleClose: () => {},
            },
          },
        })
      );
    } else {
      dispatch(hideModal());
    }
  };

  return (
    <AddComplexityView
      fields={fields}
      control={control}
      errors={errors}
      submit={submit}
      cancel={cancel}
      isPageEdited={isPageEdited}
      handlers={{
        handleSubmit,
        cancelModal,
      }}
    />
  );
}
