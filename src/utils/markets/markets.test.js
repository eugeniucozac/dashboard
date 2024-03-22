import * as utils from 'utils';

describe('UTILS › markets', () => {
  describe('getByStatusIds', () => {
    it('returns array of markets matching the status ID provided', () => {
      const markets = [
        { id: 0 },
        { id: 1, statusId: null },
        { id: 2, statusId: '' },
        { id: 3, statusId: 10 },
        { id: 4, statusId: 10 },
        { id: 5, statusId: 20 },
        { id: 6, statusId: 30 },
        { id: 7, statusId: 30 },
        { id: 8, statusId: 40 },
        { id: 9 },
      ];

      expect(utils.markets.getByStatusIds()).toEqual([]);
      expect(utils.markets.getByStatusIds(null)).toEqual([]);
      expect(utils.markets.getByStatusIds(null, [])).toEqual([]);
      expect(utils.markets.getByStatusIds(markets)).toEqual([]);
      expect(utils.markets.getByStatusIds(markets, null)).toEqual([]);
      expect(utils.markets.getByStatusIds(markets, [])).toEqual([]);
      expect(utils.markets.getByStatusIds(markets, [1])).toEqual([]);
      expect(utils.markets.getByStatusIds(markets, [10])).toEqual([markets[3], markets[4]]);
      expect(utils.markets.getByStatusIds(markets, [20])).toEqual([markets[5]]);
      expect(utils.markets.getByStatusIds(markets, [30])).toEqual([markets[6], markets[7]]);
      expect(utils.markets.getByStatusIds(markets, [10, 30])).toEqual([markets[3], markets[4], markets[6], markets[7]]);
      expect(utils.markets.getByStatusIds(markets, [null])).toEqual([markets[1]]);
      expect(utils.markets.getByStatusIds(markets, [''])).toEqual([markets[2]]);
    });
  });

  describe('filterByLineToStand', () => {
    it('returns empty array if markets is not valid', () => {
      expect(utils.markets.filterByLineToStand()).toEqual([]);
      expect(utils.markets.filterByLineToStand(null)).toEqual([]);
      expect(utils.markets.filterByLineToStand(false)).toEqual([]);
      expect(utils.markets.filterByLineToStand(true)).toEqual([]);
      expect(utils.markets.filterByLineToStand([])).toEqual([]);
      expect(utils.markets.filterByLineToStand({})).toEqual([]);
    });

    it('returns array of markets with lineToStand', () => {
      const markets = [
        { id: 0 },
        { id: 1, lineToStand: 0 },
        { id: 2, lineToStand: 'yes' },
        { id: 3, lineToStand: true },
        { id: 4, lineToStand: true },
        { id: 5 },
        { id: 6, lineToStand: 1 },
        { id: 7, lineToStand: null },
        { id: 8, lineToStand: 'true' },
        { id: 9 },
      ];

      expect(utils.markets.filterByLineToStand(markets)).toEqual([
        { id: 3, lineToStand: true },
        { id: 4, lineToStand: true },
      ]);
    });
  });

  describe('getPremiumByCurrency', () => {
    const markets = [
      { id: 0 },
      { id: 1, writtenLinePercentage: null },
      { id: 2, writtenLinePercentage: '' },
      { id: 3, writtenLinePercentage: 'foo' },
      { id: 4, writtenLinePercentage: 0 },
      { id: 5, writtenLinePercentage: 20, premium: 1000 },

      { id: 6, orderPercentage: null },
      { id: 7, orderPercentage: null, writtenLinePercentage: null },
      { id: 8, orderPercentage: null, writtenLinePercentage: '' },
      { id: 9, orderPercentage: null, writtenLinePercentage: 'foo' },
      { id: 10, orderPercentage: null, writtenLinePercentage: 0 },
      { id: 11, orderPercentage: null, writtenLinePercentage: 20, premium: 2000 },

      { id: 12, orderPercentage: '', premium: 3000 },
      { id: 13, orderPercentage: '', writtenLinePercentage: null, premium: 3000 },
      { id: 14, orderPercentage: '', writtenLinePercentage: '', premium: 3000 },
      { id: 15, orderPercentage: '', writtenLinePercentage: 'foo', premium: 3000 },
      { id: 16, orderPercentage: '', writtenLinePercentage: 0, premium: 3000 },
      { id: 17, orderPercentage: '', writtenLinePercentage: 20, premium: 3000 },

      { id: 18, orderPercentage: 'foo' },
      { id: 19, orderPercentage: 'foo', writtenLinePercentage: null },
      { id: 20, orderPercentage: 'foo', writtenLinePercentage: '' },
      { id: 21, orderPercentage: 'foo', writtenLinePercentage: 'foo' },
      { id: 22, orderPercentage: 'foo', writtenLinePercentage: 0 },
      { id: 23, orderPercentage: 'foo', writtenLinePercentage: 20 },

      { id: 24, orderPercentage: 0 },
      { id: 25, orderPercentage: 0, writtenLinePercentage: null },
      { id: 26, orderPercentage: 0, writtenLinePercentage: '' },
      { id: 27, orderPercentage: 0, writtenLinePercentage: 'foo' },
      { id: 28, orderPercentage: 0, writtenLinePercentage: 0 },
      { id: 29, orderPercentage: 0, writtenLinePercentage: 20, premium: 4000 },

      { id: 30, orderPercentage: 50 },
      { id: 31, orderPercentage: 50, writtenLinePercentage: null, premium: null },
      { id: 32, orderPercentage: 50, writtenLinePercentage: '', premium: '' },
      { id: 33, orderPercentage: 50, writtenLinePercentage: 'foo', premium: 'foo' },
      { id: 34, orderPercentage: 50, writtenLinePercentage: 0, premium: 0 },
      { id: 35, orderPercentage: 50, writtenLinePercentage: 20, premium: 5000 },
    ];

    it('returns {} if markets is not valid', () => {
      expect(utils.markets.getPremiumByCurrency()).toEqual({});
      expect(utils.markets.getPremiumByCurrency(null)).toEqual({});
      expect(utils.markets.getPremiumByCurrency(false)).toEqual({});
      expect(utils.markets.getPremiumByCurrency(true)).toEqual({});
      expect(utils.markets.getPremiumByCurrency([])).toEqual({});
      expect(utils.markets.getPremiumByCurrency({})).toEqual({});
    });

    it('returns {} if currency is missing', () => {
      expect(utils.markets.getPremiumByCurrency(markets)).toEqual({});
    });

    it('returns the sum of markets premiums', () => {
      expect(utils.markets.getPremiumByCurrency(markets, 'USD')).toEqual({ USD: 833.3333333333333 });
      expect(utils.markets.getPremiumByCurrency(markets, 'USD', false)).toEqual({ USD: 833.3333333333333 });
      expect(utils.markets.getPremiumByCurrency(markets, 'USD', false, false)).toEqual({ USD: 833.3333333333333 });
      expect(utils.markets.getPremiumByCurrency(markets, 'USD', true, false)).toEqual({ USD: 833.3333333333333 });
    });

    it('returns the sum of markets premiums if toOrder', () => {
      expect(utils.markets.getPremiumByCurrency(markets, 'EUR', false, true)).toEqual({ EUR: 3000 });
    });

    it('returns the sum of markets premiums if toOrder and isSigned', () => {
      expect(utils.markets.getPremiumByCurrency(markets, 'GBP', true, true)).toEqual({ GBP: 2500 });
    });
  });

  describe('getCurrency', () => {
    it('returns undefined if markets is not valid', () => {
      expect(utils.markets.getCurrency()).toBeUndefined();
      expect(utils.markets.getCurrency(null)).toBeUndefined();
      expect(utils.markets.getCurrency(false)).toBeUndefined();
      expect(utils.markets.getCurrency(true)).toBeUndefined();
      expect(utils.markets.getCurrency([])).toBeUndefined();
      expect(utils.markets.getCurrency({})).toBeUndefined();
    });

    it('returns false if there are multiple currencies', () => {
      const markets = [
        { id: 0, isoCode: null },
        { id: 1, writtenLinePercentage: null, isoCode: 'USD' },
        { id: 2, writtenLinePercentage: '', isoCode: 'EUR' },
      ];
      expect(utils.markets.getCurrency(markets)).toBeFalsy();
    });

    it('returns isoCode if currencies are the same', () => {
      const markets = [
        { id: 0, isoCode: 'EUR' },
        { id: 1, writtenLinePercentage: null, isoCode: 'EUR' },
        { id: 2, writtenLinePercentage: '', isoCode: 'EUR' },
      ];
      expect(utils.markets.getCurrency(markets)).toEqual('EUR');
    });
  });

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

    it('returns {} if markets is not valid', () => {
      expect(utils.markets.getPremiumBySettlementCurrency()).toEqual({});
      expect(utils.markets.getPremiumBySettlementCurrency(null)).toEqual({});
      expect(utils.markets.getPremiumBySettlementCurrency(false)).toEqual({});
      expect(utils.markets.getPremiumBySettlementCurrency(true)).toEqual({});
      expect(utils.markets.getPremiumBySettlementCurrency([])).toEqual({});
      expect(utils.markets.getPremiumBySettlementCurrency({})).toEqual({});
    });

    it('returns the sum of markets premiums', () => {
      expect(utils.markets.getPremiumBySettlementCurrency(markets)).toEqual({
        '---': 583.3333333333333,
        GBP: 111.1111111111111,
        USD: 138.88888888888889,
      });
      expect(utils.markets.getPremiumBySettlementCurrency(markets, false)).toEqual({
        '---': 583.3333333333333,
        GBP: 111.1111111111111,
        USD: 138.88888888888889,
      });
      expect(utils.markets.getPremiumBySettlementCurrency(markets, false, false)).toEqual({
        '---': 583.3333333333333,
        GBP: 111.1111111111111,
        USD: 138.88888888888889,
      });
      expect(utils.markets.getPremiumBySettlementCurrency(markets, true, false)).toEqual({
        '---': 583.3333333333333,
        GBP: 111.1111111111111,
        USD: 138.88888888888889,
      });
    });

    it('returns the sum of markets premiums if toOrder', () => {
      expect(utils.markets.getPremiumBySettlementCurrency(markets, false, true)).toEqual({ '---': 1200, GBP: 800, USD: 1000 });
    });

    it('returns the sum of markets premiums if toOrder and isSigned', () => {
      expect(utils.markets.getPremiumBySettlementCurrency(markets, true, true)).toEqual({ '---': 0, GBP: 0, USD: 2500 });
    });
  });

  describe('getLineSize', () => {
    const markets = [
      { id: 0 },
      { id: 1, writtenLinePercentage: null },
      { id: 2, writtenLinePercentage: '' },
      { id: 3, writtenLinePercentage: 'foo' },
      { id: 4, writtenLinePercentage: 0 },
      { id: 5, writtenLinePercentage: 20 },

      { id: 6, orderPercentage: null },
      { id: 7, orderPercentage: null, writtenLinePercentage: null },
      { id: 8, orderPercentage: null, writtenLinePercentage: '' },
      { id: 9, orderPercentage: null, writtenLinePercentage: 'foo' },
      { id: 10, orderPercentage: null, writtenLinePercentage: 0 },
      { id: 11, orderPercentage: null, writtenLinePercentage: 20 },

      { id: 12, orderPercentage: '' },
      { id: 12, orderPercentage: '', writtenLinePercentage: null },
      { id: 13, orderPercentage: '', writtenLinePercentage: '' },
      { id: 14, orderPercentage: '', writtenLinePercentage: 'foo' },
      { id: 15, orderPercentage: '', writtenLinePercentage: 0 },
      { id: 16, orderPercentage: '', writtenLinePercentage: 20 },

      { id: 17, orderPercentage: 'foo' },
      { id: 18, orderPercentage: 'foo', writtenLinePercentage: null },
      { id: 19, orderPercentage: 'foo', writtenLinePercentage: '' },
      { id: 20, orderPercentage: 'foo', writtenLinePercentage: 'foo' },
      { id: 20, orderPercentage: 'foo', writtenLinePercentage: 0 },
      { id: 21, orderPercentage: 'foo', writtenLinePercentage: 20 },

      { id: 22, orderPercentage: 0 },
      { id: 23, orderPercentage: 0, writtenLinePercentage: null },
      { id: 24, orderPercentage: 0, writtenLinePercentage: '' },
      { id: 25, orderPercentage: 0, writtenLinePercentage: 'foo' },
      { id: 26, orderPercentage: 0, writtenLinePercentage: 0 },
      { id: 27, orderPercentage: 0, writtenLinePercentage: 20 },

      { id: 28, orderPercentage: 50 },
      { id: 29, orderPercentage: 50, writtenLinePercentage: null },
      { id: 30, orderPercentage: 50, writtenLinePercentage: '' },
      { id: 31, orderPercentage: 50, writtenLinePercentage: 'foo' },
      { id: 32, orderPercentage: 50, writtenLinePercentage: 0 },
      { id: 33, orderPercentage: 50, writtenLinePercentage: 20 },
    ];

    it('returns 0 if markets is not valid', () => {
      expect(utils.markets.getLineSize()).toEqual(0);
      expect(utils.markets.getLineSize(null)).toEqual(0);
      expect(utils.markets.getLineSize(false)).toEqual(0);
      expect(utils.markets.getLineSize(true)).toEqual(0);
      expect(utils.markets.getLineSize([])).toEqual(0);
      expect(utils.markets.getLineSize({})).toEqual(0);
    });

    it('returns the sum of markets line size', () => {
      expect(utils.markets.getLineSize(markets)).toEqual(120);
    });

    it('returns the sum of markets line size if isSigned', () => {
      expect(utils.markets.getLineSize(markets, true)).toEqual(300);
    });
  });

  describe('hasMultiplePremiums', () => {
    it('should return false if premium array is uniq', () => {
      expect(utils.markets.hasMultiplePremiums([{ premium: 20 }])).toBe(false);
      expect(utils.markets.hasMultiplePremiums([{ premium: 20 }, { premium: 20 }])).toBe(false);
    });

    it('should return true if premium array is not uniq', () => {
      expect(utils.markets.hasMultiplePremiums([{ premium: 30 }, { premium: 20 }])).toBe(true);
    });
  });

  describe('order', () => {
    it('returns an empty array if not a valid array', () => {
      expect(utils.markets.order()).toEqual([]);
      expect(utils.markets.order([])).toEqual([]);
      expect(utils.markets.order({})).toEqual([]);
      expect(utils.markets.order(null)).toEqual([]);
      expect(utils.markets.order(true)).toEqual([]);
      expect(utils.markets.order(false)).toEqual([]);
      expect(utils.markets.order('')).toEqual([]);
      expect(utils.markets.order(1)).toEqual([]);
    });

    it('returns array of markets ordered', () => {
      const markets = [
        { id: 0 },
        { id: 1, premium: null, writtenLinePercentage: 10 },
        { id: 2, premium: 0, writtenLinePercentage: 0 },
        { id: 3, premium: 8000 },
        { id: 4, premium: 3000 },
        { id: 5, premium: 3000, writtenLinePercentage: 10 },
        { id: 6, isLeader: true },
        { id: 7, isLeader: true, premium: 2000, writtenLinePercentage: null },
        { id: 8, isLeader: true, premium: 3000, writtenLinePercentage: 20 },
        { id: 9, premium: 5000, writtenLinePercentage: 30 },
        { id: 10, isLeader: false, premium: 45000 },
        { id: 11, premium: 5000 },
        { id: 12, premium: 1000, writtenLinePercentage: 90 },
        { id: 13, premium: 0, writtenLinePercentage: 50 },
        { id: 14, premium: 2000, writtenLinePercentage: 30 },
        { id: 15, isLeader: null, premium: 2000, writtenLinePercentage: 40 },
      ];

      expect(utils.markets.order(markets)).toEqual([
        { id: 7, isLeader: true, premium: 2000, writtenLinePercentage: null },
        { id: 8, isLeader: true, premium: 3000, writtenLinePercentage: 20 },
        { id: 6, isLeader: true },
        { id: 13, premium: 0, writtenLinePercentage: 50 },
        { id: 2, premium: 0, writtenLinePercentage: 0 },
        { id: 12, premium: 1000, writtenLinePercentage: 90 },
        { id: 15, isLeader: null, premium: 2000, writtenLinePercentage: 40 },
        { id: 14, premium: 2000, writtenLinePercentage: 30 },
        { id: 5, premium: 3000, writtenLinePercentage: 10 },
        { id: 4, premium: 3000 },
        { id: 9, premium: 5000, writtenLinePercentage: 30 },
        { id: 11, premium: 5000 },
        { id: 3, premium: 8000 },
        { id: 10, isLeader: false, premium: 45000 },
        { id: 1, premium: null, writtenLinePercentage: 10 },
        { id: 0 },
      ]);
    });

    it('returns array of markets ordered first by underwriter group', () => {
      const markets = [
        { id: 0, underwriterGroup: 'B' },
        { id: 1, premium: null, writtenLinePercentage: 10, underwriterGroup: 'C' },
        { id: 2, premium: 0, writtenLinePercentage: 0 },
        { id: 3, premium: 8000, underwriterGroup: 'B' },
        { id: 4, premium: 3000, underwriterGroup: 'B' },
        { id: 5, premium: 3000, writtenLinePercentage: 10 },
        { id: 6, isLeader: true, underwriterGroup: 'B' },
        { id: 7, isLeader: 1, premium: 2000, writtenLinePercentage: null, underwriterGroup: 'C' },
        { id: 8, isLeader: true, premium: 3000, writtenLinePercentage: 20 },
        { id: 9, premium: 5000, writtenLinePercentage: 30, underwriterGroup: 'A' },
        { id: 10, isLeader: false, premium: 45000, underwriterGroup: 'C' },
        { id: 11, premium: 5000, underwriterGroup: 'C' },
        { id: 12, premium: 1000, writtenLinePercentage: 90, underwriterGroup: 'C' },
        { id: 13, premium: 0, writtenLinePercentage: 50, underwriterGroup: 'A' },
        { id: 14, premium: 2000, writtenLinePercentage: 30 },
        { id: 15, isLeader: null, premium: 2000, writtenLinePercentage: 40, underwriterGroup: 'D' },
      ];

      expect(utils.markets.order(markets, true)).toEqual([
        { id: 13, premium: 0, writtenLinePercentage: 50, underwriterGroup: 'A' },
        { id: 9, premium: 5000, writtenLinePercentage: 30, underwriterGroup: 'A' },
        { id: 6, isLeader: true, underwriterGroup: 'B' },
        { id: 4, premium: 3000, underwriterGroup: 'B' },
        { id: 3, premium: 8000, underwriterGroup: 'B' },
        { id: 0, underwriterGroup: 'B' },
        { id: 12, premium: 1000, writtenLinePercentage: 90, underwriterGroup: 'C' },
        { id: 7, isLeader: 1, premium: 2000, writtenLinePercentage: null, underwriterGroup: 'C' },
        { id: 11, premium: 5000, underwriterGroup: 'C' },
        { id: 10, isLeader: false, premium: 45000, underwriterGroup: 'C' },
        { id: 1, premium: null, writtenLinePercentage: 10, underwriterGroup: 'C' },
        { id: 15, isLeader: null, premium: 2000, writtenLinePercentage: 40, underwriterGroup: 'D' },
        { id: 8, isLeader: true, premium: 3000, writtenLinePercentage: 20 },
        { id: 2, premium: 0, writtenLinePercentage: 0 },
        { id: 14, premium: 2000, writtenLinePercentage: 30 },
        { id: 5, premium: 3000, writtenLinePercentage: 10 },
      ]);
    });
  });

  describe('signDown', () => {
    describe('without line to stand', () => {
      it('returns array of markets with updated percentage property', () => {
        const markets = [
          { id: 0 },
          { id: 1, writtenLinePercentage: null },
          { id: 2, writtenLinePercentage: 0 },
          { id: 3, writtenLinePercentage: 10 },
          { id: 4, writtenLinePercentage: 30 },
        ];

        const marketsExpected0 = [
          { id: 0, orderPercentage: 0 },
          { id: 1, writtenLinePercentage: null, orderPercentage: 0 },
          { id: 2, writtenLinePercentage: 0, orderPercentage: 0 },
          { id: 3, writtenLinePercentage: 10, orderPercentage: 0 },
          { id: 4, writtenLinePercentage: 30, orderPercentage: 0 },
        ];

        const marketsExpected5 = [
          { id: 0, orderPercentage: 0 },
          { id: 1, writtenLinePercentage: null, orderPercentage: 0 },
          { id: 2, writtenLinePercentage: 0, orderPercentage: 0 },
          { id: 3, writtenLinePercentage: 10, orderPercentage: 1.25 },
          { id: 4, writtenLinePercentage: 30, orderPercentage: 3.75 },
        ];

        const marketsExpected10 = [
          { id: 0, orderPercentage: 0 },
          { id: 1, writtenLinePercentage: null, orderPercentage: 0 },
          { id: 2, writtenLinePercentage: 0, orderPercentage: 0 },
          { id: 3, writtenLinePercentage: 10, orderPercentage: 2.5 },
          { id: 4, writtenLinePercentage: 30, orderPercentage: 7.5 },
        ];

        const marketsExpected80 = [
          { id: 0, orderPercentage: 0 },
          { id: 1, writtenLinePercentage: null, orderPercentage: 0 },
          { id: 2, writtenLinePercentage: 0, orderPercentage: 0 },
          { id: 3, writtenLinePercentage: 10, orderPercentage: 20 },
          { id: 4, writtenLinePercentage: 30, orderPercentage: 60 },
        ];

        expect(utils.markets.signDown()).toEqual([]);
        expect(utils.markets.signDown([])).toEqual([]);
        expect(utils.markets.signDown([], null)).toEqual([]);
        expect(utils.markets.signDown([], 10)).toEqual([]);
        expect(utils.markets.signDown(JSON.parse(JSON.stringify(markets)))).toEqual(markets);
        expect(utils.markets.signDown(JSON.parse(JSON.stringify(markets)), null)).toEqual(markets);
        expect(utils.markets.signDown(JSON.parse(JSON.stringify(markets)), 0)).toStrictEqual(marketsExpected0);
        expect(utils.markets.signDown(JSON.parse(JSON.stringify(markets)), '0')).toStrictEqual(marketsExpected0);
        expect(utils.markets.signDown(JSON.parse(JSON.stringify(markets)), 5)).toStrictEqual(marketsExpected5);
        expect(utils.markets.signDown(JSON.parse(JSON.stringify(markets)), '5')).toStrictEqual(marketsExpected5);
        expect(utils.markets.signDown(JSON.parse(JSON.stringify(markets)), 10)).toStrictEqual(marketsExpected10);
        expect(utils.markets.signDown(JSON.parse(JSON.stringify(markets)), '10')).toStrictEqual(marketsExpected10);
        expect(utils.markets.signDown(JSON.parse(JSON.stringify(markets)), 80)).toStrictEqual(marketsExpected80);
        expect(utils.markets.signDown(JSON.parse(JSON.stringify(markets)), '80')).toStrictEqual(marketsExpected80);
      });
    });

    describe('with line to stand', () => {
      it('returns array of markets with updated percentage property', () => {
        const markets = [
          { id: 0 },
          { id: 1, writtenLinePercentage: null },
          { id: 2, writtenLinePercentage: 0 },
          { id: 3, writtenLinePercentage: 10, lineToStand: true },
          { id: 4, writtenLinePercentage: 30 },
        ];

        const marketsExpected0 = [
          { id: 0, orderPercentage: 0 },
          { id: 1, writtenLinePercentage: null, orderPercentage: 0 },
          { id: 2, writtenLinePercentage: 0, orderPercentage: 0 },
          { id: 3, writtenLinePercentage: 10, orderPercentage: 10, lineToStand: true },
          { id: 4, writtenLinePercentage: 30, orderPercentage: 0 },
        ];

        const marketsExpected5 = [
          { id: 0, orderPercentage: 0 },
          { id: 1, writtenLinePercentage: null, orderPercentage: 0 },
          { id: 2, writtenLinePercentage: 0, orderPercentage: 0 },
          { id: 3, writtenLinePercentage: 10, orderPercentage: 10, lineToStand: true },
          { id: 4, writtenLinePercentage: 30, orderPercentage: 0 },
        ];

        const marketsExpected10 = [
          { id: 0, orderPercentage: 0 },
          { id: 1, writtenLinePercentage: null, orderPercentage: 0 },
          { id: 2, writtenLinePercentage: 0, orderPercentage: 0 },
          { id: 3, writtenLinePercentage: 10, orderPercentage: 10, lineToStand: true },
          { id: 4, writtenLinePercentage: 30, orderPercentage: 0 },
        ];

        const marketsExpected80 = [
          { id: 0, orderPercentage: 0 },
          { id: 1, writtenLinePercentage: null, orderPercentage: 0 },
          { id: 2, writtenLinePercentage: 0, orderPercentage: 0 },
          { id: 3, writtenLinePercentage: 10, orderPercentage: 10, lineToStand: true },
          { id: 4, writtenLinePercentage: 30, orderPercentage: 70 },
        ];

        expect(utils.markets.signDown()).toEqual([]);
        expect(utils.markets.signDown([])).toEqual([]);
        expect(utils.markets.signDown([], null)).toEqual([]);
        expect(utils.markets.signDown([], 10)).toEqual([]);
        expect(utils.markets.signDown(JSON.parse(JSON.stringify(markets)))).toEqual(markets);
        expect(utils.markets.signDown(JSON.parse(JSON.stringify(markets)), null)).toEqual(markets);
        expect(utils.markets.signDown(JSON.parse(JSON.stringify(markets)), 0)).toStrictEqual(marketsExpected0);
        expect(utils.markets.signDown(JSON.parse(JSON.stringify(markets)), '0')).toStrictEqual(marketsExpected0);
        expect(utils.markets.signDown(JSON.parse(JSON.stringify(markets)), 5)).toStrictEqual(marketsExpected5);
        expect(utils.markets.signDown(JSON.parse(JSON.stringify(markets)), '5')).toStrictEqual(marketsExpected5);
        expect(utils.markets.signDown(JSON.parse(JSON.stringify(markets)), 10)).toStrictEqual(marketsExpected10);
        expect(utils.markets.signDown(JSON.parse(JSON.stringify(markets)), '10')).toStrictEqual(marketsExpected10);
        expect(utils.markets.signDown(JSON.parse(JSON.stringify(markets)), 80)).toStrictEqual(marketsExpected80);
        expect(utils.markets.signDown(JSON.parse(JSON.stringify(markets)), '80')).toStrictEqual(marketsExpected80);
      });
    });
  });
});
