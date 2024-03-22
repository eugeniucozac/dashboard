import * as utils from 'utils';

describe('UTILS › market', () => {
  describe('getId', () => {
    it('returns the market id', () => {
      expect(utils.market.getId()).toEqual('');
      expect(utils.market.getId(null)).toEqual('');
      expect(utils.market.getId({})).toEqual('');
      expect(utils.market.getId({ id: 1, name: 'foo' })).toEqual('');
      expect(utils.market.getId({ id: 2, name: 'foo', market: {} })).toEqual('');
      expect(utils.market.getId({ id: 3, name: 'foo', market: { id: 100 } })).toEqual(100);
    });
  });

  describe('getName', () => {
    it('returns the market name', () => {
      expect(utils.market.getName()).toEqual('');
      expect(utils.market.getName(null)).toEqual('');
      expect(utils.market.getName({})).toEqual('');
      expect(utils.market.getName({ id: 1, name: 'foo' })).toEqual('');
      expect(utils.market.getName({ id: 2, name: 'foo', market: {} })).toEqual('');
      expect(utils.market.getName({ id: 3, name: 'foo', market: { name: '' } })).toEqual('');
      expect(utils.market.getName({ id: 4, name: 'foo', market: { name: ' ' } })).toEqual(' ');
      expect(utils.market.getName({ id: 5, name: 'foo', market: { name: 'qwerty' } })).toEqual('qwerty');
      expect(utils.market.getName({ id: 5, name: 'foo', market: { name: 'qwerty', edgeName: ' ' } })).toEqual(' ');
      expect(utils.market.getName({ id: 5, name: 'foo', market: { name: 'qwerty', edgeName: 'something' } })).toEqual('something');
    });
  });

  describe('getNotes', () => {
    it('returns the market notes/subjectivities', () => {
      expect(utils.market.getNotes()).toEqual('');
      expect(utils.market.getNotes(null)).toEqual('');
      expect(utils.market.getNotes({})).toEqual('');
      expect(utils.market.getNotes({ id: 1, name: 'foo' })).toEqual('');
      expect(utils.market.getNotes({ id: 5, name: 'foo', subjectivities: null })).toEqual('');
      expect(utils.market.getNotes({ id: 5, name: 'foo', subjectivities: '' })).toEqual('');
      expect(utils.market.getNotes({ id: 5, name: 'foo', subjectivities: 'something' })).toEqual('something');
    });
  });

  describe('getUnderwriterGroup', () => {
    it('returns the market underwriter group', () => {
      expect(utils.market.getUnderwriterGroup()).toEqual('');
      expect(utils.market.getUnderwriterGroup(null)).toEqual('');
      expect(utils.market.getUnderwriterGroup({})).toEqual('');
      expect(utils.market.getUnderwriterGroup({ id: 1, foo: 'bar' })).toEqual('');
      expect(utils.market.getUnderwriterGroup({ id: 2, underwriterGroup: 'foo' })).toEqual('foo');
    });

    it('removes whitespace before/after the underwriter group', () => {
      expect(utils.market.getUnderwriterGroup({ id: 2, underwriterGroup: 'foo' })).toEqual('foo');
      expect(utils.market.getUnderwriterGroup({ id: 2, underwriterGroup: ' foo' })).toEqual('foo');
      expect(utils.market.getUnderwriterGroup({ id: 2, underwriterGroup: '  foo' })).toEqual('foo');
      expect(utils.market.getUnderwriterGroup({ id: 2, underwriterGroup: '  foo ' })).toEqual('foo');
      expect(utils.market.getUnderwriterGroup({ id: 2, underwriterGroup: '  foo  ' })).toEqual('foo');
      expect(utils.market.getUnderwriterGroup({ id: 2, underwriterGroup: ' foo  ' })).toEqual('foo');
      expect(utils.market.getUnderwriterGroup({ id: 2, underwriterGroup: 'foo  ' })).toEqual('foo');
      expect(utils.market.getUnderwriterGroup({ id: 2, underwriterGroup: 'foo ' })).toEqual('foo');
    });
  });

  describe('getAddress', () => {
    it('should return joined address', () => {
      expect(utils.market.getAddress(null)).toBeUndefined();
      expect(utils.market.getAddress('')).toBeUndefined();
      expect(utils.market.getAddress([])).toBeUndefined();
      expect(utils.market.getAddress({})).toBeUndefined();
      expect(
        utils.market.getAddress({
          addressLine1: 'foo,',
          otherProp: 'bar',
        })
      ).toBe('foo');
      expect(
        utils.market.getAddress({
          addressLine1: 'foo',
          addressLine2: 'bar',
          addressLine3: 'baz',
          addressLine4: 'bing',
          postCode: 'boo',
          country: 'far',
        })
      ).toBe('foo, bar, baz, bing, boo, far');
    });
  });

  describe('getCurrency', () => {
    it('returns the market isoCode', () => {
      expect(utils.market.getCurrency()).toBeFalsy();
      expect(utils.market.getCurrency(null)).toBeFalsy();
      expect(utils.market.getCurrency({})).toBeFalsy();
      expect(utils.market.getCurrency({ id: 1, name: 'foo' })).toBeFalsy();
      expect(utils.market.getCurrency({ id: 1, name: 'foo', isoCode: null })).toBeFalsy();
      expect(utils.market.getCurrency({ id: 2, isoCode: 'USD' })).toEqual('USD');
    });
  });
  describe('getSettlementIsoCode', () => {
    it('returns the market settlementIsoCode', () => {
      expect(utils.market.getSettlementIsoCode()).toEqual('---');
      expect(utils.market.getSettlementIsoCode(null)).toEqual('---');
      expect(utils.market.getSettlementIsoCode({})).toEqual('---');
      expect(utils.market.getSettlementIsoCode({ id: 1, name: 'foo' })).toEqual('---');
      expect(utils.market.getSettlementIsoCode({ id: 2, settlementIsoCode: 'USD' })).toEqual('USD');
    });
  });

  describe('getPremium', () => {
    it('returns the market premium', () => {
      expect(utils.market.getPremium()).toEqual(0);
      expect(utils.market.getPremium(null)).toEqual(0);
      expect(utils.market.getPremium({})).toEqual(0);
      expect(utils.market.getPremium({ id: 1, name: 'foo' })).toEqual(0);
      expect(utils.market.getPremium({ id: 2, premium: 1000 })).toEqual(1000);

      // falsyReturnsZero
      expect(utils.market.getPremium(null, false)).toEqual(null);
      expect(utils.market.getPremium({}, false)).toEqual(null);
      expect(utils.market.getPremium({ id: 1, name: 'foo' }, false)).toEqual(null);
      expect(utils.market.getPremium({ id: 2, premium: 1000 }, false)).toEqual(1000);
    });
  });

  describe('getLineSize', () => {
    it('returns sum of all markets written  and signed', () => {
      expect(utils.market.getLineSize()).toEqual(0);
      expect(utils.market.getLineSize(null)).toEqual(0);
      expect(utils.market.getLineSize({})).toEqual(0);

      // written
      expect(utils.market.getLineSize({})).toEqual(0);
      expect(utils.market.getLineSize({ writtenLinePercentage: 10, orderPercentage: 5 })).toEqual(10);
      expect(utils.market.getLineSize({ writtenLinePercentage: 40, orderPercentage: 20 })).toEqual(40);
      // signed
      expect(utils.market.getLineSize({ writtenLinePercentage: 10, orderPercentage: 5 }, true)).toEqual(5);
      expect(utils.market.getLineSize({ writtenLinePercentage: 40, orderPercentage: 20 }, true)).toEqual(20);
    });
  });

  describe('getLineSizeBySettlementCurrency', () => {
    it('returns sum of all markets written and signed', () => {
      expect(utils.market.getLineSizeBySettlementCurrency()).toEqual(0);
      expect(utils.market.getLineSizeBySettlementCurrency(null)).toEqual(0);
      expect(utils.market.getLineSizeBySettlementCurrency({})).toEqual(0);

      // written
      expect(utils.market.getLineSizeBySettlementCurrency({})).toEqual(0);
      expect(
        utils.market.getLineSizeBySettlementCurrency({ writtenLinePercentage: 10, settlementIsoCode: 'USD', orderPercentage: 5 }, 'USD')
      ).toEqual(10);
      expect(
        utils.market.getLineSizeBySettlementCurrency({ writtenLinePercentage: 40, settlementIsoCode: 'USD', orderPercentage: 20 }, 'USD')
      ).toEqual(40);

      // signed
      expect(
        utils.market.getLineSizeBySettlementCurrency(
          { writtenLinePercentage: 10, settlementIsoCode: 'USD', orderPercentage: 5 },
          'USD',
          true
        )
      ).toEqual(5);
      expect(
        utils.market.getLineSizeBySettlementCurrency(
          { writtenLinePercentage: 40, settlementIsoCode: 'USD', orderPercentage: 20 },
          'USD',
          true
        )
      ).toEqual(20);

      // incorrect settlementIsoCode
      expect(
        utils.market.getLineSizeBySettlementCurrency(
          { writtenLinePercentage: 10, settlementIsoCode: 'GBP', orderPercentage: 5 },
          'USD',
          true
        )
      ).toEqual(0);
      expect(
        utils.market.getLineSizeBySettlementCurrency(
          { writtenLinePercentage: 40, settlementIsoCode: 'USD', orderPercentage: 20 },
          'GBP',
          true
        )
      ).toEqual(0);
      expect(
        utils.market.getLineSizeBySettlementCurrency(
          { writtenLinePercentage: 40, settlementIsoCode: null, orderPercentage: 20 },
          'GBP',
          true
        )
      ).toEqual(0);
    });
  });

  describe('setSigned', () => {
    it('returns the market object with a modified orderPercentage value', () => {
      expect(utils.market.setSigned()).toBeUndefined();
      expect(utils.market.setSigned(null)).toBe(null);
      expect(utils.market.setSigned(true)).toBe(true);
      expect(utils.market.setSigned(false)).toBe(false);
      expect(utils.market.setSigned('')).toBe('');

      expect(utils.market.setSigned({ id: 1 })).toEqual({ id: 1, orderPercentage: undefined });
      expect(utils.market.setSigned({ id: 1, orderPercentage: '' })).toEqual({ id: 1, orderPercentage: '' });
      expect(utils.market.setSigned({ id: 1, orderPercentage: '100' })).toEqual({ id: 1, orderPercentage: '100' });
      expect(utils.market.setSigned({ id: 1, orderPercentage: 200 })).toEqual({ id: 1, orderPercentage: 200 });
      expect(utils.market.setSigned({ id: 1, orderPercentage: 0 })).toEqual({ id: 1, orderPercentage: 0 });
      expect(utils.market.setSigned({ id: 1, orderPercentage: true })).toEqual({ id: 1, orderPercentage: true });

      expect(utils.market.setSigned({ id: 1 }, 0)).toEqual({ id: 1, orderPercentage: 0 });
      expect(utils.market.setSigned({ id: 1, orderPercentage: '' }, 0)).toEqual({ id: 1, orderPercentage: 0 });
      expect(utils.market.setSigned({ id: 1, orderPercentage: '100' }, 0)).toEqual({ id: 1, orderPercentage: 0 });
      expect(utils.market.setSigned({ id: 1, orderPercentage: 200 }, 0)).toEqual({ id: 1, orderPercentage: 0 });
      expect(utils.market.setSigned({ id: 1, orderPercentage: 0 }, 0)).toEqual({ id: 1, orderPercentage: 0 });
      expect(utils.market.setSigned({ id: 1, orderPercentage: true }, 0)).toEqual({ id: 1, orderPercentage: 0 });

      expect(utils.market.setSigned({ id: 1 }, 5000)).toEqual({ id: 1, orderPercentage: 5000 });
      expect(utils.market.setSigned({ id: 1, orderPercentage: '' }, 5000)).toEqual({ id: 1, orderPercentage: 5000 });
      expect(utils.market.setSigned({ id: 1, orderPercentage: '100' }, 5000)).toEqual({ id: 1, orderPercentage: 5000 });
      expect(utils.market.setSigned({ id: 1, orderPercentage: 200 }, 5000)).toEqual({ id: 1, orderPercentage: 5000 });
      expect(utils.market.setSigned({ id: 1, orderPercentage: 0 }, 5000)).toEqual({ id: 1, orderPercentage: 5000 });
      expect(utils.market.setSigned({ id: 1, orderPercentage: true }, 5000)).toEqual({ id: 1, orderPercentage: 5000 });
    });
  });

  describe('isLineToStand', () => {
    it('returns true if market is lineToStand', () => {
      expect(utils.market.isLineToStand()).toBeFalsy();
      expect(utils.market.isLineToStand(null)).toBeFalsy();
      expect(utils.market.isLineToStand({})).toBeFalsy();
      expect(utils.market.isLineToStand({ id: 1, lineToStand: 1 })).toBeFalsy();
      expect(utils.market.isLineToStand({ id: 1, lineToStand: '' })).toBeFalsy();
      expect(utils.market.isLineToStand({ id: 1, lineToStand: 'foo' })).toBeFalsy();
      expect(utils.market.isLineToStand({ id: 1, lineToStand: 'true' })).toBeFalsy();
      expect(utils.market.isLineToStand({ id: 1, lineToStand: true })).toBeTruthy();
    });
  });

  describe('isLeader', () => {
    it('returns true if market is leader', () => {
      expect(utils.market.isLeader()).toBeFalsy();
      expect(utils.market.isLeader(null)).toBeFalsy();
      expect(utils.market.isLeader({})).toBeFalsy();
      expect(utils.market.isLeader({ id: 1, isLeader: 1 })).toBeFalsy();
      expect(utils.market.isLeader({ id: 1, isLeader: '' })).toBeFalsy();
      expect(utils.market.isLeader({ id: 1, isLeader: 'foo' })).toBeFalsy();
      expect(utils.market.isLeader({ id: 1, isLeader: 'true' })).toBeFalsy();
      expect(utils.market.isLeader({ id: 1, isLeader: true })).toBeTruthy();
    });
  });
});
