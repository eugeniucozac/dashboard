import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { createFilterOptions } from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core';
import isNumber from 'lodash/isNumber';

// app
import { BulkUpdateLayerView } from './BulkUpdateLayer.view';
import styles from './BulkUpdateLayer.styles';
import {
  enqueueNotification,
  hideModal,
  postPlacementBulkLayer,
  selectRefDataStatusesMarketQuote,
  selectPlacementBulkType,
  selectPlacementBulkItemsLayers,
  selectPlacementBulkItemsMarkets,
  selectRefDataCurrencies,
  selectPlacementLayers,
  selectRefDataStatusIdByCode,
} from 'stores';
import * as utils from 'utils';
import * as constants from 'consts';

BulkUpdateLayer.propTypes = {
  handleClose: PropTypes.func.isRequired,
  isLayerBulkEdit: PropTypes.bool,
};

export default function BulkUpdateLayer({ handleClose, isLayerBulkEdit }) {
  const classes = makeStyles(styles, { name: 'BulkUpdateLayer' })();
  const dispatch = useDispatch();
  const placementBulkType = useSelector(selectPlacementBulkType);
  const placementBulkItems = useSelector(selectPlacementBulkItemsLayers);
  const placementBulkItemMarkets = useSelector(selectPlacementBulkItemsMarkets);
  const refDataStatusesMarketQuote = useSelector(selectRefDataStatusesMarketQuote);
  const refDataCurrencies = useSelector(selectRefDataCurrencies);
  const placementLayers = useSelector(selectPlacementLayers);
  const statusQuotedId = useSelector(selectRefDataStatusIdByCode('market', constants.STATUS_MARKET_QUOTED));
  const marketSpecificFields = [
    'statusId',
    'premium',
    'isoCode',
    'uniqueMarketReference',
    'section',
    'written',
    'quoteDate',
    'validUntilDate',
    'subjectivities',
  ];

  useEffect(
    () => {
      if (!refDataStatusesMarketQuote || !refDataStatusesMarketQuote.length > 0) {
        dispatch(hideModal());
        dispatch(enqueueNotification('notification.generic.reload', 'error'));
      }
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );
  const isLayerMarketAmountRequired = (form, value) => {
    if (isNumber(value)) return true;
    return !form.layerMarket_statusId || form.layerMarket_statusId.toString() !== statusQuotedId.toString();
  };
  const getUmrOptions = () => {
    const umrSet = new Set();

    if (utils.generic.isValidArray(placementLayers)) {
      placementLayers.forEach((layer) => {
        if (utils.generic.isValidArray(layer.markets)) {
          layer.markets.forEach((market) => {
            const umr = market.uniqueMarketReference;

            if (umr) {
              umrSet.add(market.uniqueMarketReference);
            }
          });
        }
      });
    }
    return [...umrSet].sort().map((umr) => ({ id: umr, label: umr }));
  };
  const umrOptions = getUmrOptions();

  const fields = [
    {
      name: 'isoCode',
      type: 'select',
      value: '',
      options: refDataCurrencies,
      optionKey: 'code',
      optionLabel: 'code',
      label: utils.string.t('placement.form.currency.label'),
      nestedClasses: {
        root: classes.isoCode,
      },
    },
    {
      name: 'uniqueMarketReference',
      type: 'autocompletemui',
      label: utils.string.t('placement.form.uniqueMarketReference.label'),
      value: null,
      options: umrOptions,
      optionsCreatable: true,
      optionKey: 'id',
      optionLabel: 'label',
      muiComponentProps: {
        filterOptions: (options, params) => {
          const filtered = createFilterOptions()(options, params);

          // Suggest the creation of a new value
          if (params.inputValue !== '') {
            filtered.push({
              id: params.inputValue,
              label: `${utils.string.t('app.add')} "${params.inputValue}"`,
            });
          }

          return filtered;
        },
      },
      validation: Yup.object({
        id: Yup.string().matches(/^[a-zA-Z0-9]*$/, utils.string.t('validation.string.alphaNumericOnly')),
      }).nullable(),
    },
    {
      name: 'section',
      type: 'text',
      label: utils.string.t('placement.form.section.label'),
      value: '',
      validation: Yup.string()
        .trim()
        .max(2)
        .uppercase()
        .matches(/^[A-Z]{0,2}$/, utils.string.t('validation.string.alphaOnly')),
      muiComponentProps: {
        inputProps: {
          maxLength: 2,
        },
        InputProps: {
          classes: {
            input: classes.section,
          },
        },
      },
    },
    {
      name: 'statusId',
      type: 'select',
      label: utils.string.t('placement.marketing.fields.status'),
      value: '',
      options: refDataStatusesMarketQuote,
      optionKey: 'id',
      optionLabel: 'code',
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
      name: 'written',
      type: 'number',
      value: '',
      validation: Yup.number()
        .nullable()
        .min(0)
        .max(100)
        .percent()
        .transform(function (value, originalvalue) {
          return this.isType(value) ? (Number.isNaN(value) ? null : value) : null;
        })
        .test('written', utils.string.t('validation.required'), function () {
          return isLayerMarketAmountRequired(this.options.parent, this.options.parent.layerMarket_writtenLinePercentage);
        }),
      label: utils.string.t('placement.form.written.label'),
      muiComponentProps: {
        autoComplete: 'off',
        fullWidth: false,
      },
    },
    {
      name: 'quoteDate',
      type: 'datepicker',
      icon: 'TodayIcon',
      label: utils.string.t('placement.form.quoteReceived.label'),
      value: null,
      muiComponentProps: {
        fullWidth: true,
      },
    },
    {
      name: 'validUntilDate',
      type: 'datepicker',
      label: utils.string.t('placement.form.quoteExpiry.label'),
      value: null,
      muiComponentProps: {
        fullWidth: true,
      },
      muiPickerProps: {
        clearable: true,
      },
    },
    {
      name: 'subjectivities',
      type: 'textarea',
      value: '',
      validation: Yup.string().max(280),
      label: utils.string.t('placement.form.subjectivities.label'),
      muiComponentProps: {
        multiline: true,
        minRows: 1,
        maxRows: 6,
      },
    },
    {
      name: 'delete',
      type: 'checkbox',
      value: false,
      label: utils.string.t('placement.form.delete.label', {
        count: isLayerBulkEdit ? placementBulkItems.length : placementBulkItemMarkets.length,
        type: `placement.generic.${isLayerBulkEdit ? 'layer' : 'line'}`,
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
    return !(placementBulkType === 'layer' && marketSpecificFields.includes(field.name));
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
      handler: (values) => {
        if (isLayerBulkEdit) {
          dispatch(postPlacementBulkLayer(values, 'layer'));
        } else {
          dispatch(postPlacementBulkLayer(values, 'layerMarket'));
        }
      },
    },
  ];

  return <BulkUpdateLayerView fields={fieldsFiltered} actions={actions} isBulkLayer={isLayerBulkEdit} />;
}
