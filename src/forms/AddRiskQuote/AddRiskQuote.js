import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';

// app
import { AddRiskQuoteView } from './AddRiskQuote.view';
import { postRiskQuote } from 'stores';
import * as utils from 'utils';

AddRiskQuote.propTypes = {
  risk: PropTypes.object.isRequired,
  quote: PropTypes.object.isRequired,
  handleClose: PropTypes.func,
};

export function AddRiskQuote({ risk, quote, handleClose }) {
  const dispatch = useDispatch();

  const handleSubmit = (data) => {
    return dispatch(postRiskQuote(data));
  };

  const handleCancel = () => {
    if (utils.generic.isFunction(handleClose)) {
      handleClose();
    }
  };

  // abort
  if (!risk?.id || !quote?.facility) return null;

  const facility = {
    label: quote.facility.name,
    value: JSON.stringify({
      facilityId: quote.facility.id,
      carrierId: quote.facility.carrierId,
    }),
  };

  const fields = [
    [
      {
        gridSize: { xs: 12 },
        type: 'select',
        name: 'facility',
        disabled: true,
        value: facility.value || '',
        options: [facility],
        label: utils.string.t('app.facility'),
      },
      {
        gridSize: { xs: 12, sm: 6 },
        type: 'number',
        name: 'premium',
        value: '',
        label: `${utils.string.t('risks.netPremium')}${quote?.currency ? ` (${quote?.currency.trim()})` : ``}`,
        validation: Yup.number()
          .nullable()
          .transform(function (value, originalvalue) {
            return this.isType(value) ? (Number.isNaN(value) ? null : value) : null;
          })
          .currency()
          .required(utils.string.t('validation.required')),
      },
      {
        gridSize: { xs: 12, sm: 6 },
        type: 'datepicker',
        name: 'validUntil',
        label: utils.string.t('form.dateValidUntil.label'),
        value: null,
        outputFormat: 'iso',
        muiPickerProps: {
          minDate: utils.date.tomorrow(),
        },
        muiComponentProps: {
          fullWidth: true,
        },
        validation: Yup.string().nullable().required(utils.string.t('form.dateValidUntil.required')),
      },
    ],
    {
      type: 'hidden',
      name: 'riskId',
      value: risk.id,
    },
  ];

  const actions = [
    {
      name: 'submit',
      label: utils.string.t('app.submit'),
      handler: handleSubmit,
    },
    {
      name: 'cancel',
      label: utils.string.t('app.cancel'),
      handler: handleCancel,
    },
  ];

  return <AddRiskQuoteView fields={fields} actions={actions} />;
}

export default AddRiskQuote;
