import * as utils from 'utils';

describe('UTILS › number', () => {
  describe('isEven', () => {
    it('should return true if number is even', () => {
      expect(utils.number.isEven()).toBeFalsy();
      expect(utils.number.isEven(null)).toBeFalsy();
      expect(utils.number.isEven(false)).toBeFalsy();
      expect(utils.number.isEven(true)).toBeFalsy();
      expect(utils.number.isEven({})).toBeFalsy();
      expect(utils.number.isEven([])).toBeFalsy();
      expect(utils.number.isEven('')).toBeFalsy();
      expect(utils.number.isEven(' ')).toBeFalsy();
      expect(utils.number.isEven('foo')).toBeFalsy();
      expect(utils.number.isEven(-3)).toBeFalsy();
      expect(utils.number.isEven(-1)).toBeFalsy();
      expect(utils.number.isEven(1)).toBeFalsy();
      expect(utils.number.isEven(3)).toBeFalsy();

      expect(utils.number.isEven(-10)).toBeTruthy();
      expect(utils.number.isEven(-2)).toBeTruthy();
      expect(utils.number.isEven(0)).toBeTruthy();
      expect(utils.number.isEven(2)).toBeTruthy();
      expect(utils.number.isEven(10)).toBeTruthy();
    });
  });

  describe('isOdd', () => {
    it('should return true if number is odd', () => {
      expect(utils.number.isOdd()).toBeFalsy();
      expect(utils.number.isOdd(null)).toBeFalsy();
      expect(utils.number.isOdd(false)).toBeFalsy();
      expect(utils.number.isOdd(true)).toBeFalsy();
      expect(utils.number.isOdd({})).toBeFalsy();
      expect(utils.number.isOdd([])).toBeFalsy();
      expect(utils.number.isOdd('')).toBeFalsy();
      expect(utils.number.isOdd(' ')).toBeFalsy();
      expect(utils.number.isOdd('foo')).toBeFalsy();
      expect(utils.number.isOdd(-10)).toBeFalsy();
      expect(utils.number.isOdd(-2)).toBeFalsy();
      expect(utils.number.isOdd(0)).toBeFalsy();
      expect(utils.number.isOdd(2)).toBeFalsy();
      expect(utils.number.isOdd(10)).toBeFalsy();

      expect(utils.number.isOdd(-3)).toBeTruthy();
      expect(utils.number.isOdd(-1)).toBeTruthy();
      expect(utils.number.isOdd(1)).toBeTruthy();
      expect(utils.number.isOdd(3)).toBeTruthy();
    });
  });
});
