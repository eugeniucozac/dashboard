import * as utils from 'utils';

describe('UTILS › policies', () => {
  describe('getByBusinessType', () => {
    it('returns array of policies grouped by business type', () => {
      const policies = [
        { id: 1, businessTypeId: 100 },
        { id: 2, businessTypeId: 100 },
        { id: 3, businessTypeId: 200 },
        { id: 4, businessTypeId: 200 },
        { id: 5, businessTypeId: 300 },
        { id: 6, businessTypeId: 100 },
        { id: 7, businessTypeId: null },
        { id: 8 },
      ];

      // missing params
      expect(utils.policies.getByBusinessType()).toEqual([]);
      expect(utils.policies.getByBusinessType(null)).toEqual([]);

      expect(utils.policies.getByBusinessType(policies)).toEqual([
        ['100', [policies[0], policies[1], policies[5]]],
        ['200', [policies[2], policies[3]]],
        ['300', [policies[4]]],
        ['null', [policies[6]]],
        ['undefined', [policies[7]]],
      ]);
    });
  });

  describe('getById', () => {
    it('returns the first policy matching the ID provided', () => {
      const policies = [{ id: 0 }, { id: 1, businessTypeId: 100 }, { id: 2, businessTypeId: 200 }, { id: 3, businessTypeId: 300 }];

      // missing params
      expect(utils.policies.getById()).toBeUndefined();
      expect(utils.policies.getById([])).toBeUndefined();
      expect(utils.policies.getById([], null)).toBeUndefined();
      expect(utils.policies.getById(null, null)).toBeUndefined();
      expect(utils.policies.getById(policies)).toBeUndefined();
      expect(utils.policies.getById(policies, null)).toBeUndefined();

      expect(utils.policies.getById(policies, 999)).toBeUndefined();
      expect(utils.policies.getById(policies, 2)).toEqual(policies[2]);
    });
  });

  describe('getMarketById', () => {
    it('returns the first market matching the market ID provided from policies array', () => {
      const policies = [
        { id: 0 },
        { id: 1, businessTypeId: 100 },
        { id: 2, businessTypeId: 200, markets: [{ id: 1, name: 'foo' }] },
        {
          id: 3,
          businessTypeId: 300,
          markets: [
            { id: 1, name: 'bar' },
            { id: 2, name: 'qwerty' },
          ],
        },
      ];

      // missing params
      expect(utils.policies.getMarketById()).toBeUndefined();
      expect(utils.policies.getMarketById([])).toBeUndefined();
      expect(utils.policies.getMarketById([], null)).toBeUndefined();
      expect(utils.policies.getMarketById(null, null)).toBeUndefined();
      expect(utils.policies.getMarketById(policies)).toBeUndefined();
      expect(utils.policies.getMarketById(policies, null)).toBeUndefined();

      expect(utils.policies.getMarketById(policies, 999)).toBeUndefined();
      expect(utils.policies.getMarketById(policies, 1)).toEqual(policies[2].markets[0]);
      expect(utils.policies.getMarketById(policies, 2)).toEqual(policies[3].markets[1]);
    });
  });

  describe('getMudmap', () => {
    it('returns array of mudmap objects', () => {
      const policies = [
        {
          id: 1,
          amount: 0,
          excess: 0,
          markets: [
            {
              id: 11,
              name: 'a',
              statusId: 1,
              premium: 1000,
              writtenLinePercentage: 10,
              orderPercentage: 20,
              market: { capacityTypeId: 10 },
            },
          ],
        },
        {
          id: 2,
          amount: 0,
          excess: 0,
          markets: [
            { id: 21, name: 'a', statusId: 1, premium: 1000, writtenLinePercentage: 0, orderPercentage: 0, market: { capacityTypeId: 10 } }, // no written value
          ],
        },
        {
          id: 3,
          amount: 30000,
          excess: 0,
          markets: [
            { id: 31, name: 'a', statusId: 0, premium: 1000, isoCode: 'USD', writtenLinePercentage: 10, market: { capacityTypeId: 10 } }, // wrong statusId
            {
              id: 32,
              name: 'b',
              statusId: 1,
              premium: 2000,
              isoCode: 'USD',
              writtenLinePercentage: 20,
              orderPercentage: 30,
              market: { id: 'b1', edgeName: 'BBB', capacityTypeId: 10 },
            },
            {
              id: 33,
              name: 'c',
              statusId: 1,
              premium: 3000,
              isoCode: 'USD',
              writtenLinePercentage: 30,
              orderPercentage: 40,
              market: { id: 'c1', edgeName: 'CCC', capacityTypeId: 20 },
            },
            {
              id: 34,
              name: 'd',
              statusId: 1,
              premium: 4000,
              isoCode: 'USD',
              writtenLinePercentage: 40,
              orderPercentage: 50,
              market: { id: 'd1', edgeName: 'DDD', capacityTypeId: 20 },
              subjectivities: 'lorem ipsum',
            },
            { id: 35, name: 'e', statusId: 2, premium: 5000, isoCode: 'USD', writtenLinePercentage: 50, market: { capacityTypeId: 30 } }, // wrong statusId
          ],
        },
        {
          id: 4,
          amount: 40000,
          excess: 10000,
          markets: [
            {
              id: 41,
              name: 'a',
              statusId: 1,
              premium: 1000,
              isoCode: 'USD',
              writtenLinePercentage: 10,
              orderPercentage: 20,
              market: { capacityTypeId: 10 },
            },
            {
              id: 42,
              name: 'b',
              statusId: 1,
              premium: 2000,
              isoCode: 'USD',
              writtenLinePercentage: 20,
              orderPercentage: 30,
              market: { capacityTypeId: 10 },
            },
            {
              id: 43,
              name: 'c',
              statusId: 1,
              premium: 3000,
              isoCode: 'USD',
              writtenLinePercentage: 30,
              orderPercentage: 40,
              market: { capacityTypeId: 10 },
            },
          ],
        },
      ];

      expect(utils.policies.getMudmap()).toEqual([]);
      expect(utils.policies.getMudmap([])).toEqual([]);
      expect(utils.policies.getMudmap([], [])).toEqual([]);
      expect(utils.policies.getMudmap([], [], 1)).toEqual([]);

      // without config
      expect(utils.policies.getMudmap(policies, [], 1)).toEqual([
        {
          amount: 40000,
          capacityId: 10,
          currency: 'USD',
          id: '4-41-42-43',
          leads: [],
          market: 'FORMAT.NUMBER(40000) xs FORMAT.NUMBER(10000) USD',
          order: null,
          premium: 'app.various',
          signed: 0.9,
          written: 0.6,
          xs: 10000,
        },
        {
          amount: 30000,
          capacityId: 10,
          currency: 'USD',
          id: '3-32',
          leads: [{ id: 'b1', name: 'BBB', notes: '' }],
          market: 'placement.generic.primary FORMAT.NUMBER(30000) USD',
          order: null,
          premium: 2000,
          signed: 0.3,
          written: 0.2,
          xs: 0,
        },
        {
          amount: 30000,
          capacityId: 20,
          currency: 'USD',
          id: '3-33-34',
          leads: [
            { id: 'c1', name: 'CCC', notes: '' },
            { id: 'd1', name: 'DDD', notes: 'lorem ipsum' },
          ],
          market: 'placement.generic.primary FORMAT.NUMBER(30000) USD',
          order: null,
          premium: 'app.various',
          signed: 0.9,
          written: 0.7,
          xs: 0,
        },
      ]);

      // with config
      expect(
        utils.policies.getMudmap(
          policies,
          [
            { id: '3-32', order: 1 },
            { id: '3-33-34', order: 2 },
            { id: '4-41-42-43', order: 3 },
          ],
          1
        )
      ).toEqual([
        {
          amount: 30000,
          capacityId: 10,
          currency: 'USD',
          id: '3-32',
          leads: [{ id: 'b1', name: 'BBB', notes: '' }],
          market: 'placement.generic.primary FORMAT.NUMBER(30000) USD',
          order: 1,
          premium: 2000,
          signed: 0.3,
          written: 0.2,
          xs: 0,
        },
        {
          amount: 30000,
          capacityId: 20,
          currency: 'USD',
          id: '3-33-34',
          leads: [
            { id: 'c1', name: 'CCC', notes: '' },
            { id: 'd1', name: 'DDD', notes: 'lorem ipsum' },
          ],
          market: 'placement.generic.primary FORMAT.NUMBER(30000) USD',
          order: 2,
          premium: 'app.various',
          signed: 0.9,
          written: 0.7,
          xs: 0,
        },
        {
          amount: 40000,
          capacityId: 10,
          currency: 'USD',
          id: '4-41-42-43',
          leads: [],
          market: 'FORMAT.NUMBER(40000) xs FORMAT.NUMBER(10000) USD',
          order: 3,
          premium: 'app.various',
          signed: 0.9,
          written: 0.6,
          xs: 10000,
        },
      ]);
    });
  });
});
