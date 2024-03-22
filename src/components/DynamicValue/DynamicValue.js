import React from 'react';
import get from 'lodash/get';

// app
import { Translate } from 'components';
import { CURRENCY_USD } from 'consts';
import * as utils from 'utils';
import config from 'config';

export function DynamicValue({ values, field }) {
  return <div data-testid="dynamic-table-component-total">{getValue(field, values)}</div>;
}

const getValue = (field, values) => {
  if (!field || !field.dynamicValue || typeof values !== 'object') return 0;
  const { variant } = field.dynamicValue;

  if (variant === 'sum') {
    return (
      <>
        {utils.generic.getSumOfArray(Object.values(values), config.ui.format.percent.decimal)}
        {field.variant === 'percent' && '%'}
      </>
    );
  }
  if (variant === 'retainedBrokerageAmount') {
    const premiumCurrency = get(values, 'lineItems.retainedBrokerageAmount.premiumCurrency') || CURRENCY_USD;
    const grossPremium = get(values, 'lineItems.grossPremium.accountHandler');
    const slipOrder = get(values, 'lineItems.slipOrder.accountHandler');
    const totalRetainedBrokerage = get(values, 'lineItems.totalRetainedBrokerage.accountHandler');

    const brokerageAmount = utils.openingMemo.getRetainedBrokerageValue(grossPremium, slipOrder, totalRetainedBrokerage);
    const convertedBrokerage = utils.openingMemo.getRetainedBrokerageConvertedValue(premiumCurrency, brokerageAmount);

    return (
      <div>
        <Translate label="format.currency" options={{ value: { number: brokerageAmount, currency: premiumCurrency } }} />
        {convertedBrokerage && (
          <>
            <br />
            <Translate label="format.currency" options={{ value: { number: convertedBrokerage.value, currency: 'GBP' } }} /> @
            <Translate label="format.number" options={{ value: { number: convertedBrokerage.rate, format: { trimMantissa: false } } }} />
          </>
        )}
      </div>
    );
  }
  return 0;
};

export default DynamicValue;
