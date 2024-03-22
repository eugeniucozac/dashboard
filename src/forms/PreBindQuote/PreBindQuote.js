import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// app
import { PreBindQuoteView } from './PreBindQuote.view';
import {
  getPreBindDefinitions,
  selectPreBindInfo,
  selectIsPreBindInfoLoading,
  postPreBindInfo,
  postRiskQuoteResponse,
  requestToBind,
} from 'stores';
import * as utils from 'utils';
import { RISK_QUOTE_PREBIND, RISK_QUOTE_STATUS_BOUND } from 'consts';

PreBindQuote.defaultProps = {
  handleClose: () => {},
};

export function PreBindQuote({ product, risk, quote, isPreBind, isReqBind, handleClose }) {
  const dispatch = useDispatch();
  const productName = product;
  const preBindInfo = useSelector(selectPreBindInfo);
  const isPreBindInfoLoading = useSelector(selectIsPreBindInfoLoading);
  const type = RISK_QUOTE_PREBIND;
  const riskData = risk?.risk;
  const riskId = risk?.id;
  const facilityId = quote?.facilityId;

  useEffect(
    () => {
      dispatch(getPreBindDefinitions(productName, type, facilityId));
    },
    [productName] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const fields = utils.risk.parseFields(preBindInfo?.product, {});

  const handleSubmit = async (data) => {
    const requestPayload = { ...data, riskType: productName };
    const res = await dispatch(postPreBindInfo(riskId, requestPayload));
    if (isPreBind) {
      const bindInfo = {
        quoteId: quote?.id,
        effectiveFrom: risk?.inceptionDate,
        effectiveTo: risk?.expiryDate,
        riskId,
        responseStatus: RISK_QUOTE_STATUS_BOUND,
      };
      if (res) {
        if (isReqBind) {
          return dispatch(requestToBind(quote));
        } else {
          return dispatch(postRiskQuoteResponse(bindInfo));
        }
      }
    } else {
      return res;
    }
  };

  const handleCancel = () => {
    if (utils.generic.isFunction(handleClose())) {
      handleClose();
    }
  };
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

  return (
    <PreBindQuoteView
      actions={actions}
      fields={fields}
      defaultValues={riskData ? utils.form.getFormattedValues(riskData, fields) : utils.form.getInitialValues(fields)}
      isLoading={isPreBindInfoLoading}
    />
  );
}

export default PreBindQuote;
