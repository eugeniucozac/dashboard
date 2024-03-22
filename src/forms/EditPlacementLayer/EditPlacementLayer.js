import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import isNumber from 'lodash/isNumber';

// app
import { EditPlacementLayerView } from './EditPlacementLayer.view';
import { enqueueNotification, hideModal, selectRefDataCurrencies, selectRefDataStatusesPolicy, patchPlacementEditLayer } from 'stores';
import * as utils from 'utils';
import * as constants from 'consts';

EditPlacementLayer.propTypes = {
  layer: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default function EditPlacementLayer({ layer = {}, handleClose }) {
  const dispatch = useDispatch();
  const refDataCurrencies = useSelector(selectRefDataCurrencies);
  const refDataStatusesPolicy = useSelector(selectRefDataStatusesPolicy);
  const statusPolicyNtu = utils.referenceData.status.getIdByCode(refDataStatusesPolicy, constants.STATUS_POLICY_NTU);

  useEffect(
    () => {
      if (!refDataCurrencies || !refDataCurrencies.length > 0) {
        dispatch(hideModal());
        dispatch(enqueueNotification('notification.generic.reload', 'error'));
      }
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const fields = [
    {
      name: 'layerId',
      type: 'hidden',
      value: layer.id,
    },
    {
      name: 'departmentId',
      type: 'hidden',
      value: layer.departmentId,
    },
    {
      name: 'businessTypeId',
      type: 'hidden',
      value: layer.businessTypeId,
    },
    {
      name: 'status',
      type: 'select',
      value: layer.statusId || '',
      // we're hard coding a fake "In Progress" option here which doesn't exist in refData
      // this will actually send the value NULL to the B/E in order to reset the status
      options: [
        { id: 'null', code: utils.string.t('status.inprogress') },
        refDataStatusesPolicy.find((status) => status.id === statusPolicyNtu),
      ],
      optionKey: 'id',
      optionLabel: 'code',
      validation: Yup.string(),
      label: utils.string.t('placement.form.status.label'),
      muiComponentProps: {
        'data-testid': 'status',
      },
    },
    {
      name: 'currency',
      type: 'select',
      value: utils.layer.getCurrency(layer, ''),
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
      value: isNumber(layer.amount) ? layer.amount : '',
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
      },
    },
    {
      name: 'excess',
      type: 'number',
      value: isNumber(layer.excess) ? layer.excess : '',
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
      value: layer.notes || '',
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
      handler: (values) => dispatch(patchPlacementEditLayer(values)),
    },
  ];

  return <EditPlacementLayerView fields={fields} actions={actions} />;
}
