import * as utils from 'utils';

describe('UTILS › layer', () => {
  describe('getMarkets', () => {
    it('returns the layer markets', () => {
      // missing params
      expect(utils.layer.getMarkets()).toEqual([]);
      expect(utils.layer.getMarkets(null)).toEqual([]);
      expect(utils.layer.getMarkets([])).toEqual([]);
      expect(utils.layer.getMarkets({})).toEqual([]);

      expect(utils.layer.getMarkets({ id: 0 })).toEqual([]);
      expect(utils.layer.getMarkets({ id: 1, markets: [] })).toEqual([]);
      expect(utils.layer.getMarkets({ id: 2, markets: [{ id: 1, name: 'foo' }] })).toEqual([{ id: 1, name: 'foo' }]);
      expect(
        utils.layer.getMarkets({
          id: 3,
          markets: [
            { id: 1, name: 'bar' },
            { id: 2, name: 'qwerty' },
          ],
        })
      ).toEqual([
        { id: 1, name: 'bar' },
        { id: 2, name: 'qwerty' },
      ]);
    });
  });

  describe('getName', () => {
    it('returns name of layer based on amount and excess values', () => {
      expect(utils.layer.getName()).toEqual('');
      expect(utils.layer.getName({})).toEqual('--');

      expect(utils.layer.getName({ amount: 1000 })).toEqual('placement.generic.primary FORMAT.NUMBER(1000)');
      expect(utils.layer.getName({ amount: 1000, isoCurrencyCode: 'USD' })).toEqual('placement.generic.primary FORMAT.NUMBER(1000) USD');

      expect(utils.layer.getName({ excess: 200 })).toEqual('xs FORMAT.NUMBER(200)');
      expect(utils.layer.getName({ excess: 200, isoCurrencyCode: 'USD' })).toEqual('xs FORMAT.NUMBER(200) USD');

      expect(utils.layer.getName({ amount: 1000, excess: 200 })).toEqual('FORMAT.NUMBER(1000) xs FORMAT.NUMBER(200)');
      expect(utils.layer.getName({ amount: 1000, excess: 200, isoCurrencyCode: 'USD' })).toEqual(
        'FORMAT.NUMBER(1000) xs FORMAT.NUMBER(200) USD'
      );
    });
  });

  describe('getCurrency', () => {
    it('returns currency of layer', () => {
      expect(utils.layer.getCurrency({ isoCurrencyCode: 1 })).toEqual(1);
      expect(utils.layer.getCurrency({ isoCurrencyCode: 'USD' })).toEqual('USD');
    });

    it('returns default value "---" unless param is overridden', () => {
      expect(utils.layer.getCurrency()).toEqual('---');
      expect(utils.layer.getCurrency({})).toEqual('---');
      expect(utils.layer.getCurrency({ isoCurrencyCode: '' })).toEqual('---');
    });

    it('returns custom default value ifparam is specified', () => {
      expect(utils.layer.getCurrency({}, null)).toEqual(null);
      expect(utils.layer.getCurrency({}, 'FOO')).toEqual('FOO');
      expect(utils.layer.getCurrency({ isoCurrencyCode: '' }, '')).toEqual('');
    });
  });

  describe('isPrimary', () => {
    it('returns true if layer only has amount value (and no excess)', () => {
      expect(utils.layer.isPrimary()).toBeFalsy();
      expect(utils.layer.isPrimary(null)).toBeFalsy();
      expect(utils.layer.isPrimary({})).toBeFalsy();
      expect(utils.layer.isPrimary({ id: 1 })).toBeFalsy();
      expect(utils.layer.isPrimary({ id: 1, excess: 20 })).toBeFalsy();
      expect(utils.layer.isPrimary({ id: 1, excess: 20, amount: 1000 })).toBeFalsy();
      expect(utils.layer.isPrimary({ id: 1, amount: 1000 })).toBeTruthy();
    });
  });
});
