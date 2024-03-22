import * as utils from 'utils';

describe('UTILS › currency', () => {
  it('should export the required methods', () => {
    expect(utils.currency).toHaveProperty('cleanDollarString');
    expect(utils.currency).toHaveProperty('getCode');
  });

  describe('cleanDollarString', () => {
    it('should return null if falsy value is passed to function', () => {
      expect(utils.currency.cleanDollarString()).toBeNull();
      expect(utils.currency.cleanDollarString(false)).toBeNull();
      expect(utils.currency.cleanDollarString(null)).toBeNull();
      expect(utils.currency.cleanDollarString(0)).toBeNull();
      expect(utils.currency.cleanDollarString('')).toBeNull();
    });

    it('should remove dollar sign from the string', () => {
      expect(utils.currency.cleanDollarString('$10000.12')).toEqual(10000.12);
      expect(utils.currency.cleanDollarString('$ 10000.12')).toEqual(10000.12);
      expect(utils.currency.cleanDollarString(' $ 10000.12')).toEqual(10000.12);
      expect(utils.currency.cleanDollarString('  $  10000.12')).toEqual(10000.12);
      expect(utils.currency.cleanDollarString('10000.12  $  ')).toEqual(10000.12);
      expect(utils.currency.cleanDollarString('10000.12 $ ')).toEqual(10000.12);
      expect(utils.currency.cleanDollarString('10000.12 $')).toEqual(10000.12);
    });

    it('should remove space from the string', () => {
      expect(utils.currency.cleanDollarString('10 000.1234')).toEqual(10000.1234);
      expect(utils.currency.cleanDollarString(' 10 000.1234')).toEqual(10000.1234);
      expect(utils.currency.cleanDollarString('  10 000.1234')).toEqual(10000.1234);
      expect(utils.currency.cleanDollarString('  10 000.1234 ')).toEqual(10000.1234);
      expect(utils.currency.cleanDollarString('  10 000.1234  ')).toEqual(10000.1234);
      expect(utils.currency.cleanDollarString(' 10 000.1234  ')).toEqual(10000.1234);
      expect(utils.currency.cleanDollarString('10 000.1234  ')).toEqual(10000.1234);
      expect(utils.currency.cleanDollarString('10 000.1234 ')).toEqual(10000.1234);
      expect(utils.currency.cleanDollarString('0.1234')).toEqual(0.1234);
      expect(utils.currency.cleanDollarString(' 0.1234')).toEqual(0.1234);
      expect(utils.currency.cleanDollarString(' 0.12 34')).toEqual(0.1234);
      expect(utils.currency.cleanDollarString(' 0.12 34 ')).toEqual(0.1234);
      expect(utils.currency.cleanDollarString('  0.12  34  ')).toEqual(0.1234);
    });

    it('should remove commas from the string', () => {
      expect(utils.currency.cleanDollarString('10,000.12')).toEqual(10000.12);
      expect(utils.currency.cleanDollarString('10,000,000.12')).toEqual(10000000.12);
    });

    it('should remove any unwanted characters from the string', () => {
      expect(utils.currency.cleanDollarString('$10,000.12')).toEqual(10000.12);
      expect(utils.currency.cleanDollarString('$ 10,000.12')).toEqual(10000.12);
      expect(utils.currency.cleanDollarString(' $ 10,000.12')).toEqual(10000.12);
      expect(utils.currency.cleanDollarString('  $  10,000.12')).toEqual(10000.12);
      expect(utils.currency.cleanDollarString('10,000.12  $  ')).toEqual(10000.12);
      expect(utils.currency.cleanDollarString('10,000.12 $ ')).toEqual(10000.12);
      expect(utils.currency.cleanDollarString('10,000.12 $')).toEqual(10000.12);
    });
  });

  describe('getCode', () => {
    it('should return null if falsy value is passed to function', () => {
      const currencies = [
        { id: 1, name: 'Dollars', code: 'USD' },
        { id: 2, name: 'British Pounds', code: 'GBP' },
        { id: 3, name: 'Euros', code: 'EUR' },
        { id: 4, name: 'Swiss Francs' },
      ];

      expect(utils.currency.getCode()).toEqual('');
      expect(utils.currency.getCode(null)).toEqual('');
      expect(utils.currency.getCode(null, null)).toEqual('');
      expect(utils.currency.getCode([])).toEqual('');
      expect(utils.currency.getCode([], null)).toEqual('');
      expect(utils.currency.getCode([], 1)).toEqual('');
      expect(utils.currency.getCode(currencies)).toEqual('');
      expect(utils.currency.getCode(currencies, null)).toEqual('');
      expect(utils.currency.getCode(currencies, 0)).toEqual('');
      expect(utils.currency.getCode(currencies, 1)).toEqual('USD');
      expect(utils.currency.getCode(currencies, 2)).toEqual('GBP');
      expect(utils.currency.getCode(currencies, 3)).toEqual('EUR');
      expect(utils.currency.getCode(currencies, 4)).toEqual('');
    });
  });
});
