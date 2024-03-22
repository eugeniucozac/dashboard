import React from 'react';
import { render } from 'tests';

// app
import DynamicValue from './DynamicValue';

describe('DynamicValue', () => {
  it('should return 0', () => {
    // arrange
    const props = {
      field: {},
      values: {},
    };
    const { getByText } = render(<DynamicValue {...props} />);

    // assert
    expect(getByText('0')).toBeInTheDocument();
  });
  it('should return 0%', () => {
    // arrange
    const props = {
      field: { variant: 'percent' },
      values: {},
    };
    const { getByText } = render(<DynamicValue {...props} />);

    // assert
    expect(getByText('0')).toBeInTheDocument();
  });
  it('should return calculated sum', () => {
    // arrange
    const props = {
      field: { variant: 'percent', dynamicValue: { variant: 'sum' } },
      values: { one: '1.2342', two: '2.4443' },
    };
    const { getByText } = render(<DynamicValue {...props} />);

    // assert
    expect(getByText('3.6785%')).toBeInTheDocument();
  });
  describe('retainedBrokerageAmount', () => {
    it('should return calculated sum', () => {
      // arrange
      const props = {
        field: { variant: 'percent', dynamicValue: { variant: 'retainedBrokerageAmount' } },
        values: {
          lineItems: {
            retainedBrokerageAmount: { premiumCurrency: 'USD' },
            grossPremium: { accountHandler: '124230' },
            slipOrder: { accountHandler: '100' },
            totalRetainedBrokerage: { accountHandler: 3.75 },
          },
        },
      };
      const { getByTestId } = render(<DynamicValue {...props} />);

      // assert
      expect(getByTestId('dynamic-table-component-total')).toHaveTextContent(
        'format.currency(4658.62)format.currency(3064.88) @format.number(1.52)'
      );
    });
    it('should return 0 as calculated sum', () => {
      // arrange
      const props = {
        field: { variant: 'percent', dynamicValue: { variant: 'retainedBrokerageAmount' } },
        values: {
          lineItems: {
            retainedBrokerageAmount: { premiumCurrency: 'CAD' },
            slipOrder: { accountHandler: '100' },
            totalRetainedBrokerage: { accountHandler: 3.75 },
          },
        },
      };
      const { getByTestId } = render(<DynamicValue {...props} />);

      // assert
      expect(getByTestId('dynamic-table-component-total')).toHaveTextContent('format.currency()format.currency() @format.number(1.75)');
    });
  });
});
