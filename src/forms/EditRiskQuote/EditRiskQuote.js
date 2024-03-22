import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';

// app
import { EditRiskQuoteView } from './EditRiskQuote.view';
import { patchRiskQuote } from 'stores';
import * as utils from 'utils';

EditRiskQuote.propTypes = {
  quote: PropTypes.object.isRequired,
  handleClose: PropTypes.func,
};

export function EditRiskQuote({ quote, handleClose }) {
  const dispatch = useDispatch();

  const handleSubmit = (data) => {
    return dispatch(patchRiskQuote(data, quote));
  };

  const handleSubmitAndAccept = (data) => {
    return dispatch(patchRiskQuote(data, quote, true));
  };

  const handleCancel = () => {
    if (utils.generic.isFunction(handleClose)) {
      handleClose();
    }
  };

  // abort
  if (!quote || !quote.id) return null;

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
        value: facility.value,
        options: [facility],
        label: utils.string.t('app.facility'),
      },
      {
        gridSize: { xs: 12, sm: 6 },
        type: 'number',
        name: 'premium',
        value: quote.premium,
        label: `${utils.string.t('risks.grossPremium')}${quote?.currency ? ` (${quote?.currency.trim()})` : ``}`,
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
        value: quote.validUntil,
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
      value: quote.riskId,
    },
  ];

  const actions = [
    {
      name: 'secondary',
      label: utils.string.t('risks.updateAndAccept'),
      handler: handleSubmitAndAccept,
      tooltip: {
        title: utils.string.t('risks.updateLegend.submitAccept'),
      },
    },
    {
      name: 'submit',
      label: utils.string.t('risks.update'),
      handler: handleSubmit,
      tooltip: {
        title: utils.string.t('risks.updateLegend.submit'),
      },
    },
    {
      name: 'cancel',
      label: utils.string.t('app.cancel'),
      handler: handleCancel,
    },
  ];

  return <EditRiskQuoteView fields={fields} actions={actions} />;
}

export default EditRiskQuote;
