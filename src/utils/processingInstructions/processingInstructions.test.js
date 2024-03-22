import MockDate from 'mockdate';
import * as utils from 'utils';

describe('UTILS › processingInstructions', () => {
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
      expect(utils.processingInstructions.getRetainedBrokerageValue(undefined, undefined, undefined)).toEqual(0);
      expect(utils.processingInstructions.getRetainedBrokerageValue(1, undefined, undefined)).toEqual(0);
      expect(utils.processingInstructions.getRetainedBrokerageValue(1, 2, undefined)).toEqual(0);
      expect(utils.processingInstructions.getRetainedBrokerageValue(grossPremium, slipOrder, totalRetainedBrokerage)).toEqual(4658.62);
    });
  });

  describe('getRetainedBrokerageCurrencies', () => {
    it('should return an empty array if FX rates are not found for the current and/or previous years', () => {
      // arrange
      MockDate.set('2019');

      // assert
      expect(utils.processingInstructions.getRetainedBrokerageCurrencies()).toEqual([]);

      // act
      MockDate.set('2018');

      // assert
      expect(utils.processingInstructions.getRetainedBrokerageCurrencies()).toEqual([]);

      // act
      MockDate.set('2017');

      // assert
      expect(utils.processingInstructions.getRetainedBrokerageCurrencies()).toEqual([]);
    });

    it('should return an array of FX rates for the current year', () => {
      // arrange
      MockDate.set('2020');
      const expectedRate = (code) => expect.arrayContaining([expect.objectContaining({ currency: code })]);

      // assert
      expect(utils.processingInstructions.getRetainedBrokerageCurrencies().length).toBe(18);
      expect(utils.processingInstructions.getRetainedBrokerageCurrencies()).toEqual(expectedRate('AUD'));
      expect(utils.processingInstructions.getRetainedBrokerageCurrencies()).toEqual(expectedRate('CAD'));
      expect(utils.processingInstructions.getRetainedBrokerageCurrencies()).toEqual(expectedRate('DKK'));
      expect(utils.processingInstructions.getRetainedBrokerageCurrencies()).toEqual(expectedRate('EUR'));
      expect(utils.processingInstructions.getRetainedBrokerageCurrencies()).toEqual(expectedRate('JPY'));
      expect(utils.processingInstructions.getRetainedBrokerageCurrencies()).toEqual(expectedRate('NOK'));
      expect(utils.processingInstructions.getRetainedBrokerageCurrencies()).toEqual(expectedRate('SEK'));
      expect(utils.processingInstructions.getRetainedBrokerageCurrencies()).toEqual(expectedRate('SGD'));
      expect(utils.processingInstructions.getRetainedBrokerageCurrencies()).toEqual(expectedRate('USD'));
      expect(utils.processingInstructions.getRetainedBrokerageCurrencies()).toEqual(expectedRate('ZAR'));
      expect(utils.processingInstructions.getRetainedBrokerageCurrencies()).toEqual(expectedRate('NZD'));
      expect(utils.processingInstructions.getRetainedBrokerageCurrencies()).toEqual(expectedRate('THB'));
      expect(utils.processingInstructions.getRetainedBrokerageCurrencies()).toEqual(expectedRate('CHF'));
      expect(utils.processingInstructions.getRetainedBrokerageCurrencies()).toEqual(expectedRate('SAR'));
      expect(utils.processingInstructions.getRetainedBrokerageCurrencies()).toEqual(expectedRate('FJD'));
      expect(utils.processingInstructions.getRetainedBrokerageCurrencies()).toEqual(expectedRate('AED'));
      expect(utils.processingInstructions.getRetainedBrokerageCurrencies()).toEqual(expectedRate('HKD'));
      expect(utils.processingInstructions.getRetainedBrokerageCurrencies()).toEqual(expectedRate('GBP'));
    });
  });

  describe('getRetainedBrokerageConvertedValue', () => {
    it('should return original brokerage value', () => {
      // assert
      expect(utils.processingInstructions.getRetainedBrokerageConvertedValue()).toBeUndefined();
      expect(utils.processingInstructions.getRetainedBrokerageConvertedValue('USD')).toEqual({ rate: 1.52, value: 0 });
      expect(utils.processingInstructions.getRetainedBrokerageConvertedValue('USD', 4658.62)).toEqual({
        value: 3064.88,
        rate: 1.52,
      });
    });
    it('should return previous year if no current year is yet available', () => {
      // arrange
      MockDate.set('2021');

      // assert
      expect(utils.processingInstructions.getRetainedBrokerageConvertedValue('USD', 2434)).toEqual({
        value: 1601.31,
        rate: 1.52,
      });
    });
  });

  describe('isApproved', () => {
    it('should return true if the PI is fully approved', () => {
      // assert
      expect(utils.processingInstructions.isApproved()).toBeFalsy();
      expect(utils.processingInstructions.isApproved(null)).toBeFalsy();
      expect(utils.processingInstructions.isApproved(false)).toBeFalsy();
      expect(utils.processingInstructions.isApproved(true)).toBeFalsy();
      expect(utils.processingInstructions.isApproved([])).toBeFalsy();
      expect(utils.processingInstructions.isApproved({})).toBeFalsy();
      expect(utils.processingInstructions.isApproved('')).toBeFalsy();
      expect(utils.processingInstructions.isApproved('foo')).toBeFalsy();
      expect(utils.processingInstructions.isApproved(100)).toBeFalsy();

      expect(utils.processingInstructions.isApproved({ foo: true })).toBeFalsy();
      expect(utils.processingInstructions.isApproved({ isAccountHandlerApproved: true })).toBeFalsy();
      expect(utils.processingInstructions.isApproved({ isAuthorisedSignatoryApproved: true })).toBeFalsy();

      expect(utils.processingInstructions.isApproved({ isAccountHandlerApproved: true, isAuthorisedSignatoryApproved: true })).toBeTruthy();
    });
  });
});
