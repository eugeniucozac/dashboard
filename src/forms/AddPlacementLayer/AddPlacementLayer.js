import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';

// app
import { AddPlacementLayerView } from './AddPlacementLayer.view';
import { enqueueNotification, hideModal, selectRefDataBusinessTypes, selectRefDataCurrencies, postPlacementAddLayer } from 'stores';
import { useMedia } from 'hooks';
import * as utils from 'utils';
import { CURRENCY_USD } from 'consts';

AddPlacementLayer.propTypes = {
  businessTypeId: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
  handleClose: PropTypes.func.isRequired,
};

export default function AddPlacementLayer({ businessTypeId, handleClose }) {
  const dispatch = useDispatch();
  const media = useMedia();
  const refDataBusinessTypes = useSelector(selectRefDataBusinessTypes);
  const refDataCurrencies = useSelector(selectRefDataCurrencies);

  useEffect(
    () => {
      if (!refDataBusinessTypes || !refDataBusinessTypes.length > 0) {
        dispatch(hideModal());
        dispatch(enqueueNotification('notification.generic.reload', 'error'));
      }
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  // if a businessTypeId is provided, it becomes the default option
  // if businessTypeId is 0, the first of option is pre-selected by default
  // anything else will leave the field empty by default
  let defaultBusinessType;

  if (businessTypeId) {
    defaultBusinessType = refDataBusinessTypes.find((type) => type.id === businessTypeId);
  } else if (businessTypeId === 0) {
    defaultBusinessType = refDataBusinessTypes[0];
  }

  const defaultValue = defaultBusinessType ? [defaultBusinessType] : [];
  const defaultCurrency = utils.referenceData.currencies.getByCode(refDataCurrencies, CURRENCY_USD);

  const fields = [
    {
      name: 'businessType',
      type: 'autocomplete',
      value: defaultValue,
      options: refDataBusinessTypes,
      optionKey: 'id',
      optionLabel: 'description',
      validation: Yup.array()
        .of(Yup.mixed().required(utils.string.t('placement.form.class.required')))
        .required(utils.string.t('placement.form.class.required')),
      label: utils.string.t('placement.form.class.label'),
      innerComponentProps: {
        maxMenuHeight: media.mobile ? 340 : 270,
      },
      muiComponentProps: {
        autoFocus: !Boolean(defaultBusinessType),
        'data-testid': 'business-class',
      },
    },
    {
      name: 'currency',
      type: 'select',
      value: defaultCurrency.code || '',
      options: refDataCurrencies,
      optionKey: 'code',
      optionLabel: 'code',
      validation: Yup.string().required(utils.string.t('validation.required')),
      label: utils.string.t('placement.form.currency.label'),
    },
    {
      name: 'buydown',
      type: 'checkbox',
      value: false,
      label: utils.string.t('placement.form.buydown.label'),
    },
    {
      name: 'amount',
      type: 'number',
      value: '',
      validation: Yup.number()
        .nullable()
        .min(0)
        .currency()
        .transform(function (value, originalvalue) {
          return this.isType(value) ? (Number.isNaN(value) ? null : value) : null;
        }),
      label: utils.string.t('app.amount'),
      muiComponentProps: {
        autoComplete: 'off',
        autoFocus: Boolean(defaultBusinessType),
      },
    },
    {
      name: 'excess',
      type: 'number',
      value: '',
      validation: Yup.number()
        .nullable()
        .min(0)
        .currency()
        .transform(function (value, originalvalue) {
          return this.isType(value) ? (Number.isNaN(value) ? null : value) : null;
        }),
      label: utils.string.t('app.excess'),
      muiComponentProps: {
        autoComplete: 'off',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      value: '',
      validation: Yup.string().max(280),
      label: utils.string.t('placement.form.notes.label'),
      muiComponentProps: {
        multiline: true,
        minRows: 3,
        maxRows: 6,
      },
    },
  ];

  const actions = [
    {
      name: 'cancel',
      label: utils.string.t('app.cancel'),
      handler: handleClose,
    },
    {
      name: 'submit',
      label: utils.string.t('app.submit'),
      handler: (values) => dispatch(postPlacementAddLayer(values)),
    },
  ];

  return <AddPlacementLayerView fields={fields} actions={actions} />;
}
