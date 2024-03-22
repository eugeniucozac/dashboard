import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';

// app
import { BulkUpdatePolicyView } from './BulkUpdatePolicy.view';
import {
  enqueueNotification,
  hideModal,
  postPlacementBulkPolicy,
  selectRefDataStatusesMarketQuote,
  selectPlacementBulkType,
  selectPlacementBulkItems,
} from 'stores';
import * as utils from 'utils';
import * as constants from 'consts';

BulkUpdatePolicy.propTypes = {
  handleClose: PropTypes.func.isRequired,
};

export default function BulkUpdatePolicy({ handleClose }) {
  const dispatch = useDispatch();
  const placementBulkType = useSelector(selectPlacementBulkType);
  const placementBulkItems = useSelector(selectPlacementBulkItems);
  const refDataStatusesMarketQuote = useSelector(selectRefDataStatusesMarketQuote);
  const marketSpecificFields = ['status', 'premium'];

  useEffect(
    () => {
      if (!refDataStatusesMarketQuote || !refDataStatusesMarketQuote.length > 0) {
        dispatch(hideModal());
        dispatch(enqueueNotification('notification.generic.reload', 'error'));
      }
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const fields = [
    {
      name: 'status',
      type: 'select',
      value: '',
      options: refDataStatusesMarketQuote.filter((status) => status.code !== constants.STATUS_MARKET_QUOTED),
      optionKey: 'id',
      optionLabel: 'code',
      validation: Yup.string(),
      label: utils.string.t('placement.form.status.label'),
      muiComponentProps: {
        'data-testid': 'bulk-update-policy-status',
      },
    },
    {
      name: 'premium',
      type: 'number',
      value: '',
      validation: Yup.number()
        .nullable()
        .min(0)
        .currency()
        .transform(function (value, originalvalue) {
          return this.isType(value) ? (Number.isNaN(value) ? null : value) : null;
        }),
      label: utils.string.t('placement.form.premium.label'),
    },
    {
      name: 'delete',
      type: 'checkbox',
      value: false,
      label: utils.string.t('placement.form.delete.label', {
        count: placementBulkItems.length,
        type: `placement.generic.${placementBulkType === 'policy' ? 'policy' : 'market'}`,
      }),
    },
    {
      name: 'deleteConfirm',
      type: 'text',
      value: '',
      validation: Yup.string().test('deleteConfirm', utils.string.t('form.deleteConfirm.required'), function () {
        const parent = this.options.parent;
        return parent.delete ? parent.deleteConfirm === 'Delete' : true;
      }),
      label: utils.string.t('form.deleteConfirm.label'),
      hint: utils.string.t('form.deleteConfirm.hint'),
      muiComponentProps: {
        autoComplete: 'off',
      },
    },
  ];

  // remove fields specific to market if bulk type is layer
  const fieldsFiltered = fields.filter((field) => {
    return !(placementBulkType === 'policy' && marketSpecificFields.includes(field.name));
  });

  const actions = [
    {
      name: 'cancel',
      label: utils.string.t('app.cancel'),
      handler: handleClose,
    },
    {
      name: 'submit',
      label: utils.string.t('app.submit'),
      handler: (values) => dispatch(postPlacementBulkPolicy(values)),
    },
  ];

  return (
    <BulkUpdatePolicyView
      fields={fieldsFiltered}
      actions={actions}
      isBulkPolicy={placementBulkType === 'policy'}
      isBulkMarket={placementBulkType === 'policyMarket'}
    />
  );
}
