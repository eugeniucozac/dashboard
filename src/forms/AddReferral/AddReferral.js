import React from 'react';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import isEqual from 'lodash/isEqual';
import { yupResolver } from '@hookform/resolvers/yup';

// app
import { AddReferralView } from './AddReferral.view';
import { postComplexityAddReferral, showModal, hideModal } from 'stores';
import * as utils from 'utils';
import { useFormActions } from 'hooks';

export default function AddReferral() {
  const dispatch = useDispatch();

  const fields = [
    {
      name: 'addReferralValue',
      type: 'text',
      value: '',
      validation: Yup.string().trim().required(utils.string.t('validation.required')).max(75, utils.string.t('validation.string.max')),
    },
  ];

  const actions = [
    {
      name: 'cancel',
      label: utils.string.t('app.cancel'),
      handler: () => hideModal(),
    },
    {
      name: 'submit',
      label: utils.string.t('app.add'),
      handler: (values) => {
        return dispatch(postComplexityAddReferral(values));
      },
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
    <AddReferralView
      fields={fields}
      control={control}
      errors={errors}
      submit={submit}
      cancel={cancel}
      handleSubmit={handleSubmit}
      cancelModal={cancelModal}
    />
  );
}
