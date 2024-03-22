import * as utils from 'utils';

describe('UTILS › layers', () => {
  describe('getByBusinessType', () => {
    it('returns array of layers grouped by business type', () => {
      const layers = [
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
      expect(utils.layers.getByBusinessType()).toEqual([]);
      expect(utils.layers.getByBusinessType(null)).toEqual([]);

      expect(utils.layers.getByBusinessType(layers)).toEqual([
        ['100', [layers[0], layers[1], layers[5]]],
        ['200', [layers[2], layers[3]]],
        ['300', [layers[4]]],
        ['null', [layers[6]]],
        ['undefined', [layers[7]]],
      ]);
    });
  });

  describe('getById', () => {
    it('returns the first layer matching the ID provided', () => {
      const layers = [{ id: 0 }, { id: 1, businessTypeId: 100 }, { id: 2, businessTypeId: 200 }, { id: 3, businessTypeId: 300 }];

      // missing params
      expect(utils.layers.getById()).toBeUndefined();
      expect(utils.layers.getById([])).toBeUndefined();
      expect(utils.layers.getById([], null)).toBeUndefined();
      expect(utils.layers.getById(null, null)).toBeUndefined();
      expect(utils.layers.getById(layers)).toBeUndefined();
      expect(utils.layers.getById(layers, null)).toBeUndefined();

      expect(utils.layers.getById(layers, 999)).toBeUndefined();
      expect(utils.layers.getById(layers, 2)).toEqual(layers[2]);
    });
  });

  describe('getMarketById', () => {
    it('returns the first market matching the market ID provided from layers array', () => {
      const layers = [
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
      expect(utils.layers.getMarketById()).toBeUndefined();
      expect(utils.layers.getMarketById([])).toBeUndefined();
      expect(utils.layers.getMarketById([], null)).toBeUndefined();
      expect(utils.layers.getMarketById(null, null)).toBeUndefined();
      expect(utils.layers.getMarketById(layers)).toBeUndefined();
      expect(utils.layers.getMarketById(layers, null)).toBeUndefined();

      expect(utils.layers.getMarketById(layers, 999)).toBeUndefined();
      expect(utils.layers.getMarketById(layers, 1)).toEqual(layers[2].markets[0]);
      expect(utils.layers.getMarketById(layers, 2)).toEqual(layers[3].markets[1]);
    });
  });

  describe('getMudmap', () => {
    it('returns array of mudmap objects', () => {
      const layers = [
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
            { id: 31, name: 'a', statusId: 0, premium: 1000, writtenLinePercentage: 10, market: { capacityTypeId: 10 } }, // wrong statusId
            {
              id: 32,
              name: 'b',
              statusId: 1,
              premium: 2000,
              writtenLinePercentage: 20,
              orderPercentage: 30,
              market: { id: 'b1', edgeName: 'BBB', capacityTypeId: 10 },
            },
            {
              id: 33,
              name: 'c',
              statusId: 1,
              premium: 3000,
              writtenLinePercentage: 30,
              orderPercentage: 40,
              market: { id: 'c1', edgeName: 'CCC', capacityTypeId: 20 },
            },
            {
              id: 34,
              name: 'd',
              statusId: 1,
              premium: 4000,
              writtenLinePercentage: 40,
              orderPercentage: 50,
              market: { id: 'd1', edgeName: 'DDD', capacityTypeId: 20 },
              subjectivities: 'lorem ipsum',
            },
            { id: 35, name: 'e', statusId: 2, premium: 5000, writtenLinePercentage: 50, market: { capacityTypeId: 30 } }, // wrong statusId
          ],
        },
        {
          id: 4,
          amount: 40000,
          excess: 10000,
          isoCurrencyCode: 'USD',
          markets: [
            {
              id: 41,
              name: 'a',
              statusId: 1,
              premium: 1000,
              writtenLinePercentage: 10,
              orderPercentage: 20,
              market: { capacityTypeId: 10 },
            },
            {
              id: 42,
              name: 'b',
              statusId: 1,
              premium: 2000,
              writtenLinePercentage: 20,
              orderPercentage: 30,
              market: { capacityTypeId: 10 },
            },
            {
              id: 43,
              name: 'c',
              statusId: 1,
              premium: 3000,
              writtenLinePercentage: 30,
              orderPercentage: 40,
              market: { capacityTypeId: 10 },
            },
          ],
        },
      ];

      expect(utils.layers.getMudmap()).toEqual([]);
      expect(utils.layers.getMudmap([])).toEqual([]);
      expect(utils.layers.getMudmap([], [])).toEqual([]);
      expect(utils.layers.getMudmap([], [], 1)).toEqual([]);

      // without config
      expect(utils.layers.getMudmap(layers, [], 1)).toEqual([
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
          currency: '---',
          id: '3-32',
          leads: [{ id: 'b1', name: 'BBB', notes: '' }],
          market: 'placement.generic.primary FORMAT.NUMBER(30000)',
          order: null,
          premium: 2000,
          signed: 0.3,
          written: 0.2,
          xs: 0,
        },
        {
          amount: 30000,
          capacityId: 20,
          currency: '---',
          id: '3-33-34',
          leads: [
            { id: 'c1', name: 'CCC', notes: '' },
            { id: 'd1', name: 'DDD', notes: 'lorem ipsum' },
          ],
          market: 'placement.generic.primary FORMAT.NUMBER(30000)',
          order: null,
          premium: 'app.various',
          signed: 0.9,
          written: 0.7,
          xs: 0,
        },
      ]);

      // with config
      expect(
        utils.layers.getMudmap(
          layers,
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
          currency: '---',
          id: '3-32',
          leads: [{ id: 'b1', name: 'BBB', notes: '' }],
          market: 'placement.generic.primary FORMAT.NUMBER(30000)',
          order: 1,
          premium: 2000,
          signed: 0.3,
          written: 0.2,
          xs: 0,
        },
        {
          amount: 30000,
          capacityId: 20,
          currency: '---',
          id: '3-33-34',
          leads: [
            { id: 'c1', name: 'CCC', notes: '' },
            { id: 'd1', name: 'DDD', notes: 'lorem ipsum' },
          ],
          market: 'placement.generic.primary FORMAT.NUMBER(30000)',
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
