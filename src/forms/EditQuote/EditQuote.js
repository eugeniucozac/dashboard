import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import get from 'lodash/get';
import isNumber from 'lodash/isNumber';

// app
import * as constants from 'consts';
import { EditQuoteView } from './EditQuote.view';
import styles from './EditQuote.styles';
import {
  enqueueNotification,
  hideModal,
  postPlacementEditQuote,
  selectRefDataStatusesMarketQuote,
  selectRefDataCapacityTypes,
} from 'stores';
import * as utils from 'utils';

// mui
import { makeStyles, InputAdornment } from '@material-ui/core';
import GavelIcon from '@material-ui/icons/Gavel';

EditQuote.propTypes = {
  policy: PropTypes.object.isRequired,
  policyMarket: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default function EditQuote({ policy = {}, policyMarket = {}, handleClose }) {
  const referenceDataStatusesPolicyMarketQuote = useSelector(selectRefDataStatusesMarketQuote);
  const dispatch = useDispatch();
  const classes = makeStyles(styles, { name: 'EditQuote' })();

  const isAmountRequired = (form, value) => {
    if (isNumber(value)) return true;

    const statusQuotedId = utils.referenceData.status.getIdByCode(referenceDataStatusesPolicyMarketQuote, constants.STATUS_MARKET_QUOTED);
    return !form.statusId || form.statusId !== statusQuotedId.toString();
  };

  const isQuoteDirty = (form) => {
    return (
      form.isLeader ||
      form.lineToStand ||
      !!form.premium ||
      form.premium === 0 ||
      !!form.writtenLinePercentage ||
      form.writtenLinePercentage === 0 ||
      !!form.subjectivities ||
      !!form.validUntilDate
    );
  };

  const [isCapacityVisible, setIsCapacityVisible] = useState(false);
  const refDataStatusesMarketQuote = useSelector(selectRefDataStatusesMarketQuote);
  const refDataCapacityTypes = useSelector(selectRefDataCapacityTypes);

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
      name: 'statusId',
      type: 'select',
      value: get(policyMarket, 'statusId') || '',
      options: refDataStatusesMarketQuote,
      optionKey: 'id',
      optionLabel: 'code',
      validation: Yup.string().test('statusId', utils.string.t('validation.required'), function () {
        return isQuoteDirty(this.options.parent) ? this.options.parent.statusId : true;
      }),
      label: utils.string.t('placement.form.status.label'),
      muiComponentProps: {
        autoFocus: true,
      },
    },
    {
      name: 'quoteOptions',
      type: 'checkbox',
      options: [
        {
          label: utils.string.t('placement.form.lead.label'),
          name: 'isLeader',
          value: get(policyMarket, 'isLeader'),
        },
        {
          label: utils.string.t('placement.form.lineToStand.label'),
          name: 'lineToStand',
          value: get(policyMarket, 'lineToStand'),
        },
      ],
    },
    {
      name: 'currency',
      type: 'text',
      value: utils.policy.getCurrency(policy, ''),
      label: utils.string.t('placement.form.currency.label'),
      muiComponentProps: {
        InputProps: {
          readOnly: true,
          disabled: true,
        },
      },
    },
    {
      name: 'premium',
      type: 'number',
      value: isNumber(get(policyMarket, 'premium')) ? get(policyMarket, 'premium') : '',
      validation: Yup.number()
        .nullable()
        .min(0)
        .currency()
        .transform(function (value, originalvalue) {
          return this.isType(value) ? (Number.isNaN(value) ? null : value) : null;
        })
        .test('premium', utils.string.t('validation.required'), function () {
          return isAmountRequired(this.options.parent, this.options.parent.premium);
        }),
      label: utils.string.t('placement.form.premium.label'),
      muiComponentProps: {
        autoComplete: 'off',
      },
    },
    {
      name: 'writtenLinePercentage',
      type: 'number',
      value: isNumber(get(policyMarket, 'writtenLinePercentage')) ? get(policyMarket, 'writtenLinePercentage') : '',
      validation: Yup.number()
        .nullable()
        .min(0)
        .max(100)
        .percent()
        .transform(function (value, originalvalue) {
          return this.isType(value) ? (Number.isNaN(value) ? null : value) : null;
        })
        .test('writtenLinePercentage', utils.string.t('validation.required'), function () {
          return isAmountRequired(this.options.parent, this.options.parent.writtenLinePercentage);
        }),
      label: utils.string.t('placement.form.written.label'),
      muiComponentProps: {
        autoComplete: 'off',
        fullWidth: false,
        InputProps: {
          startAdornment: (
            <InputAdornment position="start" className={classes.iconWritten}>
              <GavelIcon />
            </InputAdornment>
          ),
        },
      },
    },
    {
      name: 'subjectivities',
      type: 'textarea',
      value: get(policyMarket, 'subjectivities') || '',
      validation: Yup.string().max(280),
      label: utils.string.t('placement.form.subjectivities.label'),
      muiComponentProps: {
        multiline: true,
        minRows: 2,
        maxRows: 6,
      },
    },
    {
      name: 'quoteDate',
      type: 'datepicker',
      label: utils.string.t('placement.form.dateFrom.label'),
      value: get(policyMarket, 'quoteDate') || utils.date.today(),
      validation: Yup.string()
        .nullable()
        .test('quoteDate', utils.string.t('validation.required'), function () {
          return isQuoteDirty(this.options.parent) ? this.options.parent.quoteDate : true;
        }),
      muiComponentProps: {
        fullWidth: true,
      },
    },
    {
      name: 'validUntilDate',
      type: 'datepicker',
      label: utils.string.t('placement.form.dateExpiry.label'),
      value: get(policyMarket, 'validUntilDate') || null,
      validation: Yup.string().nullable(),
      muiComponentProps: {
        fullWidth: true,
      },
      muiPickerProps: {
        clearable: true,
      },
    },
    {
      name: 'capacityTypeId',
      type: 'select',
      value: get(policyMarket, 'market.capacityTypeId') || '',
      margin: 'none',
      options: refDataCapacityTypes,
      optionKey: 'id',
      optionLabel: 'name',
      label: utils.string.t('placement.form.capacityType.label'),
    },
    {
      name: 'policyMarketId',
      type: 'hidden',
      value: get(policyMarket, 'id'),
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
      handler: (values) => dispatch(postPlacementEditQuote(values)),
    },
  ];

  const handleShowCapacity = () => {
    setIsCapacityVisible(true);
  };

  return <EditQuoteView fields={fields} actions={actions} isCapacityVisible={isCapacityVisible} handleShowCapacity={handleShowCapacity} />;
}
