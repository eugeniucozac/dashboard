import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';

// app
import { SignDownView } from './SignDown.view';
import { postPlacementSignDown, selectRefDataStatusesMarketQuote } from 'stores';
import * as constants from 'consts';
import * as utils from 'utils';

SignDown.propTypes = {
  policy: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default function SignDown({ policy = {}, handleClose }) {
  const dispatch = useDispatch();
  const refDataStatusesMarketQuote = useSelector(selectRefDataStatusesMarketQuote);

  const statusId = utils.referenceData.status.getIdByCode(refDataStatusesMarketQuote, constants.STATUS_MARKET_QUOTED);
  const marketsQuoted = utils.markets.getByStatusIds(utils.policy.getMarkets(policy), [statusId]);
  const writtenTotalLineToStand = utils.markets.getLineSize(utils.markets.filterByLineToStand(marketsQuoted));
  const writtenTotal = utils.markets.getLineSize(marketsQuoted);

  const fields = [
    {
      name: 'signedDownPercentage',
      type: 'number',
      value: Math.min(writtenTotal, 100),
      validation: Yup.number()
        .nullable()
        .min(writtenTotalLineToStand)
        .max(Math.min(writtenTotal, 100))
        .percent()
        .transform(function (value, originalvalue) {
          return this.isType(value) ? (Number.isNaN(value) ? null : value) : null;
        }),
      label: utils.string.t('placement.form.signDown.label'),
      hint: utils.string.t('placement.form.signDown.hint', {
        min: writtenTotalLineToStand,
        max: Math.min(writtenTotal, 100),
        reason: writtenTotal <= 100 ? 'maxWritten' : 'maxAllowed',
      }),
      muiComponentProps: {
        fullWidth: false,
        autoComplete: 'off',
        autoFocus: true,
        'data-testid': 'signdown-percentage',
      },
    },
    {
      name: 'policy_id',
      type: 'hidden',
      value: policy.id,
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
      handler: (values) => dispatch(postPlacementSignDown(values)),
    },
  ];

  return <SignDownView fields={fields} actions={actions} />;
}
