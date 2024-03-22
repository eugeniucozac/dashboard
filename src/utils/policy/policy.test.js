import * as utils from 'utils';

describe('UTILS › policy', () => {
  describe('getMarkets', () => {
    it('returns the policy markets', () => {
      // missing params
      expect(utils.policy.getMarkets()).toEqual([]);
      expect(utils.policy.getMarkets(null)).toEqual([]);
      expect(utils.policy.getMarkets([])).toEqual([]);
      expect(utils.policy.getMarkets({})).toEqual([]);

      expect(utils.policy.getMarkets({ id: 0 })).toEqual([]);
      expect(utils.policy.getMarkets({ id: 1, markets: [] })).toEqual([]);
      expect(utils.policy.getMarkets({ id: 2, markets: [{ id: 1, name: 'foo' }] })).toEqual([{ id: 1, name: 'foo' }]);
      expect(
        utils.policy.getMarkets({
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

  // TODO added on 18/11/2020: add tests
  describe('getPremiumByCurrency', () => {});

  describe('getPremiumBySettlementCurrency', () => {
    const markets = [
      { id: 0, settlementIsoCode: null },
      { id: 1, writtenLinePercentage: null, settlementIsoCode: null },
      { id: 2, writtenLinePercentage: '', settlementIsoCode: null },
      { id: 3, writtenLinePercentage: 'foo', settlementIsoCode: null },
      { id: 4, writtenLinePercentage: 0, settlementIsoCode: null },
      { id: 5, writtenLinePercentage: 20, premium: 1000, settlementIsoCode: null },

      { id: 6, orderPercentage: null },
      { id: 7, orderPercentage: null, writtenLinePercentage: null, settlementIsoCode: null },
      { id: 8, orderPercentage: null, writtenLinePercentage: '', settlementIsoCode: null },
      { id: 9, orderPercentage: null, writtenLinePercentage: 'foo', settlementIsoCode: null },
      { id: 10, orderPercentage: null, writtenLinePercentage: 0, settlementIsoCode: null },
      { id: 11, orderPercentage: null, writtenLinePercentage: 20, premium: 2000, settlementIsoCode: null },

      { id: 12, orderPercentage: '', premium: 3000 },
      { id: 13, orderPercentage: '', writtenLinePercentage: null, premium: 3000, settlementIsoCode: null },
      { id: 14, orderPercentage: '', writtenLinePercentage: '', premium: 3000, settlementIsoCode: null },
      { id: 15, orderPercentage: '', writtenLinePercentage: 'foo', premium: 3000, settlementIsoCode: null },
      { id: 16, orderPercentage: '', writtenLinePercentage: 0, premium: 3000, settlementIsoCode: null },
      { id: 17, orderPercentage: '', writtenLinePercentage: 20, premium: 3000, settlementIsoCode: null },

      { id: 18, orderPercentage: 'foo' },
      { id: 19, orderPercentage: 'foo', writtenLinePercentage: null, settlementIsoCode: null },
      { id: 20, orderPercentage: 'foo', writtenLinePercentage: '', settlementIsoCode: null },
      { id: 21, orderPercentage: 'foo', writtenLinePercentage: 'foo', settlementIsoCode: null },
      { id: 22, orderPercentage: 'foo', writtenLinePercentage: 0, settlementIsoCode: null },
      { id: 23, orderPercentage: 'foo', writtenLinePercentage: 20, settlementIsoCode: null },

      { id: 24, orderPercentage: 0 },
      { id: 25, orderPercentage: 0, writtenLinePercentage: null, settlementIsoCode: 'GBP' },
      { id: 26, orderPercentage: 0, writtenLinePercentage: '', settlementIsoCode: 'GBP' },
      { id: 27, orderPercentage: 0, writtenLinePercentage: 'foo', settlementIsoCode: 'GBP' },
      { id: 28, orderPercentage: 0, writtenLinePercentage: 0, settlementIsoCode: 'GBP' },
      { id: 29, orderPercentage: 0, writtenLinePercentage: 20, premium: 4000, settlementIsoCode: 'GBP' },

      { id: 30, orderPercentage: 50 },
      { id: 31, orderPercentage: 50, writtenLinePercentage: null, premium: null, settlementIsoCode: 'USD' },
      { id: 32, orderPercentage: 50, writtenLinePercentage: '', premium: '', settlementIsoCode: 'USD' },
      { id: 33, orderPercentage: 50, writtenLinePercentage: 'foo', premium: 'foo', settlementIsoCode: 'USD' },
      { id: 34, orderPercentage: 50, writtenLinePercentage: 0, premium: 0, settlementIsoCode: 'USD' },
      { id: 35, orderPercentage: 50, writtenLinePercentage: 20, premium: 5000, settlementIsoCode: 'USD' },
    ];

    const policy = { markets };

    it('returns 0 if markets is not valid', () => {
      expect(utils.policy.getPremiumBySettlementCurrency()).toEqual({});
      expect(utils.policy.getPremiumBySettlementCurrency(null)).toEqual({});
      expect(utils.policy.getPremiumBySettlementCurrency(false)).toEqual({});
      expect(utils.policy.getPremiumBySettlementCurrency(true)).toEqual({});
      expect(utils.policy.getPremiumBySettlementCurrency([])).toEqual({});
      expect(utils.policy.getPremiumBySettlementCurrency({})).toEqual({});
    });

    it('returns the sum of markets premiums', () => {
      expect(utils.policy.getPremiumBySettlementCurrency(policy)).toEqual({ '---': 1200, GBP: 800, USD: 1000 });
      expect(utils.policy.getPremiumBySettlementCurrency(policy, false)).toEqual({ '---': 1200, GBP: 800, USD: 1000 });
      expect(utils.policy.getPremiumBySettlementCurrency(policy, false, false)).toEqual({
        '---': 583.3333333333333,
        GBP: 111.1111111111111,
        USD: 138.88888888888889,
      });
      expect(utils.policy.getPremiumBySettlementCurrency(policy, true, false)).toEqual({
        '---': 583.3333333333333,
        GBP: 111.1111111111111,
        USD: 138.88888888888889,
      });
    });

    it('returns the sum of markets premiums if toOrder', () => {
      expect(utils.policy.getPremiumBySettlementCurrency(policy, false, true)).toEqual({ '---': 1200, GBP: 800, USD: 1000 });
    });

    it('returns the sum of markets premiums if toOrder and isSigned', () => {
      expect(utils.policy.getPremiumBySettlementCurrency(policy, true, true)).toEqual({ '---': 0, GBP: 0, USD: 2500 });
    });
  });

  describe('getName', () => {
    it('returns name of policy based on amount and excess values', () => {
      const markets = [{ id: 1, writtenLinePercentage: null, isoCode: 'USD' }];

      expect(utils.policy.getName()).toEqual('');
      expect(utils.policy.getName({})).toEqual('--');

      expect(utils.policy.getName({ amount: 1000 })).toEqual('placement.generic.primary FORMAT.NUMBER(1000)');
      expect(utils.policy.getName({ amount: 1000, markets })).toEqual('placement.generic.primary FORMAT.NUMBER(1000) USD');

      expect(utils.policy.getName({ excess: 200 })).toEqual('xs FORMAT.NUMBER(200)');
      expect(utils.policy.getName({ excess: 200, markets })).toEqual('xs FORMAT.NUMBER(200) USD');

      expect(utils.policy.getName({ amount: 1000, excess: 200 })).toEqual('FORMAT.NUMBER(1000) xs FORMAT.NUMBER(200)');
      expect(utils.policy.getName({ amount: 1000, excess: 200, markets })).toEqual('FORMAT.NUMBER(1000) xs FORMAT.NUMBER(200) USD');

      expect(utils.policy.getName({ amount: 0, excess: 0, uniqueMarketReference: 'CA123' })).toEqual('CA123');
      expect(utils.policy.getName({ amount: 0, excess: 0, uniqueMarketReference: 'CA123', markets })).toEqual('CA123');
    });
  });

  describe('getCurrency', () => {
    const policy = { id: 1 };

    it('returns undefined if markets is not valid', () => {
      expect(utils.policy.getCurrency(policy)).toBeUndefined();
    });

    it('returns false if there are multiple currencies', () => {
      const policy = {
        market: [
          { id: 0, isoCode: null },
          { id: 1, writtenLinePercentage: null, isoCode: 'USD' },
          { id: 2, writtenLinePercentage: '', isoCode: 'EUR' },
        ],
      };
      expect(utils.policy.getCurrency(policy)).toBeFalsy();
    });

    it('returns isoCode if currencies are the same', () => {
      const policy = {
        markets: [
          { id: 0, isoCode: 'EUR' },
          { id: 1, writtenLinePercentage: null, isoCode: 'EUR' },
          { id: 2, writtenLinePercentage: '', isoCode: 'EUR' },
        ],
      };
      expect(utils.policy.getCurrency(policy)).toEqual('EUR');
    });
  });

  describe('hasBoundPremium', () => {
    it('returns true if policy has premiums', () => {
      // policy not valid
      expect(utils.policy.hasBoundPremium()).toBeFalsy();
      expect(utils.policy.hasBoundPremium(null)).toBeFalsy();

      // policy is not origin GXB
      expect(
        utils.policy.hasBoundPremium({ id: 1, origin: 'OMS', markets: [{ id: 2, settlementIsoCode: 'XX', premium: 1000 }] })
      ).toBeFalsy();

      // policy doesn't have premiums
      expect(
        utils.policy.hasBoundPremium({
          id: 1,
          origin: 'GXB',
          markets: [{ id: 2, settlementIsoCode: 'XX', premium: 1000, orderPercentage: 0 }],
        })
      ).toBeFalsy();
      expect(
        utils.policy.hasBoundPremium({
          id: 1,
          origin: 'GXB',
          markets: [{ id: 2, settlementIsoCode: 'XX', premium: 0, orderPercentage: 2 }],
        })
      ).toBeFalsy();

      // ok
      expect(
        utils.policy.hasBoundPremium({
          id: 1,
          origin: 'GXB',
          markets: [{ id: 2, settlementIsoCode: 'XX', premium: 1000, orderPercentage: 2 }],
        })
      ).toBeTruthy();
    });
  });

  describe('isPrimary', () => {
    it('returns true if policy only has amount value (and no excess)', () => {
      expect(utils.policy.isPrimary()).toBeFalsy();
      expect(utils.policy.isPrimary(null)).toBeFalsy();
      expect(utils.policy.isPrimary({})).toBeFalsy();
      expect(utils.policy.isPrimary({ id: 1 })).toBeFalsy();
      expect(utils.policy.isPrimary({ id: 1, excess: 20 })).toBeFalsy();
      expect(utils.policy.isPrimary({ id: 1, excess: 20, amount: 1000 })).toBeFalsy();
      expect(utils.policy.isPrimary({ id: 1, amount: 1000 })).toBeTruthy();
    });
  });

  describe('isOriginEdge', () => {
    it('returns true if policy is origin Edge/OMS', () => {
      // missing params
      expect(utils.policy.isOriginEdge()).toBeFalsy();
      expect(utils.policy.isOriginEdge(null)).toBeFalsy();
      expect(utils.policy.isOriginEdge([])).toBeFalsy();
      expect(utils.policy.isOriginEdge({})).toBeFalsy();

      expect(utils.policy.isOriginEdge({ origin: '' })).toBeFalsy();
      expect(utils.policy.isOriginEdge({ origin: 'FOO' })).toBeFalsy();
      expect(utils.policy.isOriginEdge({ origin: 'EDGE' })).toBeFalsy();
      expect(utils.policy.isOriginEdge({ origin: 'GXB' })).toBeFalsy();
      expect(utils.policy.isOriginEdge({ origin: 'OMS' })).toBeTruthy();
    });
  });

  describe('isOriginGxb', () => {
    it('returns true if policy is origin GXB', () => {
      // missing params
      expect(utils.policy.isOriginGxb()).toBeFalsy();
      expect(utils.policy.isOriginGxb(null)).toBeFalsy();
      expect(utils.policy.isOriginGxb([])).toBeFalsy();
      expect(utils.policy.isOriginGxb({})).toBeFalsy();

      expect(utils.policy.isOriginGxb({ origin: '' })).toBeFalsy();
      expect(utils.policy.isOriginGxb({ origin: 'FOO' })).toBeFalsy();
      expect(utils.policy.isOriginGxb({ origin: 'EDGE' })).toBeFalsy();
      expect(utils.policy.isOriginGxb({ origin: 'OMS' })).toBeFalsy();
      expect(utils.policy.isOriginGxb({ origin: 'GXB' })).toBeTruthy();
    });
  });
});
