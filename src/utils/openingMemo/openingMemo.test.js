import MockDate from 'mockdate';
import * as utils from 'utils';

describe('UTILS › openingMemo', () => {
  beforeEach(() => {
    MockDate.set('2020');
  });

  afterEach(() => {
    MockDate.reset();
  });

  describe('getRetainedBrokerageValue', () => {
    it('should return retained brokerage value', () => {
      // arrange
      const grossPremium = 124230;
      const slipOrder = 100;
      const totalRetainedBrokerage = 3.75;

      // assert
      expect(utils.openingMemo.getRetainedBrokerageValue(undefined, undefined, undefined)).toEqual(0);
      expect(utils.openingMemo.getRetainedBrokerageValue(1, undefined, undefined)).toEqual(0);
      expect(utils.openingMemo.getRetainedBrokerageValue(1, 2, undefined)).toEqual(0);
      expect(utils.openingMemo.getRetainedBrokerageValue(grossPremium, slipOrder, totalRetainedBrokerage)).toEqual(4658.62);
    });
  });

  describe('getRetainedBrokerageCurrencies', () => {
    it('should return an empty array if FX rates are not found for the current and/or previous years', () => {
      // arrange
      MockDate.set('2019');

      // assert
      expect(utils.openingMemo.getRetainedBrokerageCurrencies()).toEqual([]);

      // act
      MockDate.set('2018');

      // assert
      expect(utils.openingMemo.getRetainedBrokerageCurrencies()).toEqual([]);

      // act
      MockDate.set('2017');

      // assert
      expect(utils.openingMemo.getRetainedBrokerageCurrencies()).toEqual([]);
    });

    it('should return an array of FX rates for the current year', () => {
      // arrange
      MockDate.set('2020');
      const expectedRate = (code) => expect.arrayContaining([expect.objectContaining({ currency: code })]);

      // assert
      expect(utils.openingMemo.getRetainedBrokerageCurrencies().length).toBe(18);
      expect(utils.openingMemo.getRetainedBrokerageCurrencies()).toEqual(expectedRate('AUD'));
      expect(utils.openingMemo.getRetainedBrokerageCurrencies()).toEqual(expectedRate('CAD'));
      expect(utils.openingMemo.getRetainedBrokerageCurrencies()).toEqual(expectedRate('DKK'));
      expect(utils.openingMemo.getRetainedBrokerageCurrencies()).toEqual(expectedRate('EUR'));
      expect(utils.openingMemo.getRetainedBrokerageCurrencies()).toEqual(expectedRate('JPY'));
      expect(utils.openingMemo.getRetainedBrokerageCurrencies()).toEqual(expectedRate('NOK'));
      expect(utils.openingMemo.getRetainedBrokerageCurrencies()).toEqual(expectedRate('SEK'));
      expect(utils.openingMemo.getRetainedBrokerageCurrencies()).toEqual(expectedRate('SGD'));
      expect(utils.openingMemo.getRetainedBrokerageCurrencies()).toEqual(expectedRate('USD'));
      expect(utils.openingMemo.getRetainedBrokerageCurrencies()).toEqual(expectedRate('ZAR'));
      expect(utils.openingMemo.getRetainedBrokerageCurrencies()).toEqual(expectedRate('NZD'));
      expect(utils.openingMemo.getRetainedBrokerageCurrencies()).toEqual(expectedRate('THB'));
      expect(utils.openingMemo.getRetainedBrokerageCurrencies()).toEqual(expectedRate('CHF'));
      expect(utils.openingMemo.getRetainedBrokerageCurrencies()).toEqual(expectedRate('SAR'));
      expect(utils.openingMemo.getRetainedBrokerageCurrencies()).toEqual(expectedRate('FJD'));
      expect(utils.openingMemo.getRetainedBrokerageCurrencies()).toEqual(expectedRate('AED'));
      expect(utils.openingMemo.getRetainedBrokerageCurrencies()).toEqual(expectedRate('HKD'));
      expect(utils.openingMemo.getRetainedBrokerageCurrencies()).toEqual(expectedRate('GBP'));
    });
  });

  describe('getRetainedBrokerageConvertedValue', () => {
    it('should return original brokerage value', () => {
      // assert
      expect(utils.openingMemo.getRetainedBrokerageConvertedValue()).toBeUndefined();
      expect(utils.openingMemo.getRetainedBrokerageConvertedValue('USD')).toEqual({ rate: 1.52, value: 0 });
      expect(utils.openingMemo.getRetainedBrokerageConvertedValue('USD', 4658.62)).toEqual({
        value: 3064.88,
        rate: 1.52,
      });
    });
    it('should return previous year if no current year is yet available', () => {
      // arrange
      MockDate.set('2021');

      // assert
      expect(utils.openingMemo.getRetainedBrokerageConvertedValue('USD', 2434)).toEqual({
        value: 1601.31,
        rate: 1.52,
      });
    });
  });

  describe('isApproved', () => {
    it('should return true if the opening memo is fully approved', () => {
      // assert
      expect(utils.openingMemo.isApproved()).toBeFalsy();
      expect(utils.openingMemo.isApproved(null)).toBeFalsy();
      expect(utils.openingMemo.isApproved(false)).toBeFalsy();
      expect(utils.openingMemo.isApproved(true)).toBeFalsy();
      expect(utils.openingMemo.isApproved([])).toBeFalsy();
      expect(utils.openingMemo.isApproved({})).toBeFalsy();
      expect(utils.openingMemo.isApproved('')).toBeFalsy();
      expect(utils.openingMemo.isApproved('foo')).toBeFalsy();
      expect(utils.openingMemo.isApproved(100)).toBeFalsy();

      expect(utils.openingMemo.isApproved({ foo: true })).toBeFalsy();
      expect(utils.openingMemo.isApproved({ isAccountHandlerApproved: true })).toBeFalsy();
      expect(utils.openingMemo.isApproved({ isAuthorisedSignatoryApproved: true })).toBeFalsy();

      expect(utils.openingMemo.isApproved({ isAccountHandlerApproved: true, isAuthorisedSignatoryApproved: true })).toBeTruthy();
    });
  });
});
