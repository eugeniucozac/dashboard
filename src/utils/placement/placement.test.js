import * as utils from 'utils';

describe('UTILS › placement', () => {
  describe('getInsureds', () => {
    it('return insureds names separated by comma', () => {
      const placementNull = null;
      const placementEmpty = {};
      const placementWithoutInsureds = { id: 1 };
      const placementWithoutNames = { id: 1, insureds: [{ id: 1 }, { id: 2 }] };
      const placementWithNameSingle = { id: 1, insureds: [{ id: 1, name: 'foo' }] };
      const placementWithName = {
        id: 1,
        insureds: [
          { id: 1, name: 'foo' },
          { id: 2, name: 'bar' },
        ],
      };
      const placementWithMixed = { id: 1, insureds: [{ id: 1, name: 'Foo' }, { id: 2 }, { id: 3, name: 'QWERTY' }] };
      const placementWithMixedEmpty = {
        id: 1,
        insureds: [
          { id: 1, name: 'Foo' },
          { id: 2 },
          { id: 3, name: 'QWERTY' },
          { id: 4, name: '' },
          { id: 5, name: ' ' },
          { id: 6, name: 'last' },
        ],
      };

      expect(utils.placement.getInsureds(placementNull)).toEqual('');
      expect(utils.placement.getInsureds(placementEmpty)).toEqual('');
      expect(utils.placement.getInsureds(placementWithoutInsureds)).toEqual('');
      expect(utils.placement.getInsureds(placementWithoutNames)).toEqual('');
      expect(utils.placement.getInsureds(placementWithNameSingle)).toEqual('foo');
      expect(utils.placement.getInsureds(placementWithName)).toEqual('foo, bar');
      expect(utils.placement.getInsureds(placementWithMixed)).toEqual('Foo, QWERTY');
      expect(utils.placement.getInsureds(placementWithMixedEmpty)).toEqual('Foo, QWERTY, last');
    });
  });

  describe('getClients', () => {
    it('return clients names separated by comma', () => {
      const placementNull = null;
      const placementEmpty = {};
      const placementWithoutInsureds = { id: 1 };
      const placementWithoutNames = { id: 1, clients: [{ id: 1 }, { id: 2 }] };
      const placementWithNameSingle = { id: 1, clients: [{ id: 1, name: 'foo' }] };
      const placementWithName = {
        id: 1,
        clients: [
          { id: 1, name: 'foo' },
          { id: 2, name: 'bar' },
        ],
      };
      const placementWithMixed = { id: 1, clients: [{ id: 1, name: 'Foo' }, { id: 2 }, { id: 3, name: 'QWERTY' }] };
      const placementWithMixedEmpty = {
        id: 1,
        clients: [
          { id: 1, name: 'Foo' },
          { id: 2 },
          { id: 3, name: 'QWERTY' },
          { id: 4, name: '' },
          { id: 5, name: ' ' },
          { id: 6, name: 'last' },
        ],
      };

      expect(utils.placement.getClients(placementNull)).toEqual([]);
      expect(utils.placement.getClients(placementEmpty)).toEqual([]);
      expect(utils.placement.getClients(placementWithoutInsureds)).toEqual([]);
      expect(utils.placement.getClients(placementWithoutNames)).toEqual([]);
      expect(utils.placement.getClients(placementWithNameSingle)).toEqual(['foo']);
      expect(utils.placement.getClients(placementWithName)).toEqual(['foo', 'bar']);
      expect(utils.placement.getClients(placementWithMixed)).toEqual(['Foo', 'QWERTY']);
      expect(utils.placement.getClients(placementWithMixedEmpty)).toEqual(['Foo', 'QWERTY', 'last']);
    });
  });

  describe('getOffices', () => {
    it('return an empty array if params are not valid', () => {
      expect(utils.placement.getOffices()).toEqual([]);
      expect(utils.placement.getOffices(null)).toEqual([]);
      expect(utils.placement.getOffices(false)).toEqual([]);
      expect(utils.placement.getOffices(true)).toEqual([]);
      expect(utils.placement.getOffices('')).toEqual([]);
      expect(utils.placement.getOffices('foo')).toEqual([]);
      expect(utils.placement.getOffices(1)).toEqual([]);
      expect(utils.placement.getOffices([])).toEqual([]);
    });

    it("return array of clients' offices", () => {
      const placement = {
        id: 1,
        clients: [
          { id: 1 },
          { id: 2, offices: [] },
          { id: 3, offices: [{ id: 10 }, { id: 20, name: '' }, { id: 30, name: 'foo' }, { id: 40, name: 'foo' }, { id: 50, name: 'bar' }] },
          {
            id: 4,
            offices: [
              { id: 10 },
              { id: 20, name: '' },
              { id: 30, name: 'foo' },
              { id: 50, name: 'bar' },
              { id: 60, name: 'biz' },
              { id: 70, name: 'boz' },
            ],
          },
        ],
      };

      expect(utils.placement.getOffices(placement)).toEqual(['foo', 'bar', 'biz', 'boz']);
    });
  });

  describe('getOfficeCobrokers', () => {
    const placementNull = null;
    const placementEmpty = {};
    const placement_ClientsMissing = { id: 1 };
    const placement_ClientsEmpty = { id: 1, clients: [] };
    const placement_Clients_CobrokersMissing = { id: 1, clients: [{ id: 10, type: 'office' }] };
    const placement_Clients_CobrokersEmpty = { id: 1, clients: [{ id: 10, type: 'office', cobrokers: [] }] };

    const placement_ClientsTypeMissing = {
      id: 1,
      clients: [{ id: 10, cobrokers: [{ name: 'Albert', id: 1000 }] }],
    };

    const placement_ClientsTypeIncorrect = {
      id: 1,
      clients: [{ id: 10, type: 'foo', cobrokers: [{ name: 'Albert', id: 1000 }] }],
    };

    const placement_Clients_Cobrokers = {
      id: 1,
      clients: [{ id: 10, type: 'office', cobrokers: [{ name: 'Albert', id: 1000 }] }],
    };

    const placement_Clients_CobrokersMultiple = {
      id: 1,
      clients: [
        {
          id: 10,
          type: 'office',
          cobrokers: [
            { name: 'Albert', id: 1000 },
            { name: 'Bob', id: 2000 },
            { name: 'Chris', id: 3000 },
          ],
        },
      ],
    };

    const placement_Clients_CobrokersDuplicate = {
      id: 1,
      clients: [
        {
          id: 10,
          type: 'office',
          cobrokers: [
            { name: 'Albert', id: 1000 },
            { name: 'Bob', id: 1000 }, // same ID as Albert
            { name: 'Chris', id: 3000 },
          ],
        },
      ],
    };

    const placement_ClientsMultiple_CobrokersMultiple = {
      id: 1,
      clients: [
        {
          id: 10,
          type: 'office',
          cobrokers: [
            { name: 'Albert', id: 1000 },
            { name: 'Bob', id: 2000 },
            { name: 'Chris', id: 3000 },
          ],
        },
        {
          id: 20,
          type: 'office',
          cobrokers: [
            { name: 'Dennis', id: 4000 },
            { name: 'Earl', id: 5000 },
          ],
        },
      ],
    };

    const placement_ClientsMultiple_CobrokersDuplicate = {
      id: 1,
      clients: [
        {
          id: 10,
          type: 'office',
          cobrokers: [
            { name: 'Albert', id: 1000 },
            { name: 'Bob', id: 1000 }, // same ID as Albert
            { name: 'Chris', id: 3000 },
          ],
        },
        {
          id: 20,
          type: 'office',
          cobrokers: [
            { name: 'Dennis', id: 3000 }, // same ID as Chris
            { name: 'Earl', id: 5000 },
            { name: 'Frank', id: 5000 },
            { name: 'George', id: 5000 },
          ],
        },
      ],
    };

    it('returns an empty array if the placement is missing, null or empty', () => {
      expect(utils.placement.getOfficeCobrokers()).toEqual([]);
      expect(utils.placement.getOfficeCobrokers(placementNull)).toEqual([]);
      expect(utils.placement.getOfficeCobrokers(placementEmpty)).toEqual([]);
    });

    it('returns an empty array if the placement clients is missing or empty', () => {
      expect(utils.placement.getOfficeCobrokers(placement_ClientsMissing)).toEqual([]);
      expect(utils.placement.getOfficeCobrokers(placement_ClientsEmpty)).toEqual([]);
    });

    it('returns an empty array if the clients\' type is missing or not "office"', () => {
      expect(utils.placement.getOfficeCobrokers(placement_ClientsTypeMissing)).toEqual([]);
      expect(utils.placement.getOfficeCobrokers(placement_ClientsTypeIncorrect)).toEqual([]);
    });

    it('returns an empty array if the placement clients offices cobrokers is missing or empty', () => {
      expect(utils.placement.getOfficeCobrokers(placement_Clients_CobrokersMissing)).toEqual([]);
      expect(utils.placement.getOfficeCobrokers(placement_Clients_CobrokersEmpty)).toEqual([]);
    });

    it('returns an array of cobrokers found in placement > clients > cobrokers', () => {
      expect(utils.placement.getOfficeCobrokers(placement_Clients_Cobrokers)).toEqual([{ name: 'Albert', id: 1000 }]);

      expect(utils.placement.getOfficeCobrokers(placement_Clients_CobrokersMultiple)).toEqual([
        { name: 'Albert', id: 1000 },
        { name: 'Bob', id: 2000 },
        { name: 'Chris', id: 3000 },
      ]);

      expect(utils.placement.getOfficeCobrokers(placement_ClientsMultiple_CobrokersMultiple)).toEqual([
        { name: 'Albert', id: 1000 },
        { name: 'Bob', id: 2000 },
        { name: 'Chris', id: 3000 },
        { name: 'Dennis', id: 4000 },
        { name: 'Earl', id: 5000 },
      ]);
    });

    it('returns an array without duplicate cobrokers', () => {
      expect(utils.placement.getOfficeCobrokers(placement_Clients_CobrokersDuplicate)).toEqual([
        { name: 'Albert', id: 1000 },
        { name: 'Chris', id: 3000 },
      ]);

      expect(utils.placement.getOfficeCobrokers(placement_ClientsMultiple_CobrokersDuplicate)).toEqual([
        { name: 'Albert', id: 1000 },
        { name: 'Chris', id: 3000 },
        { name: 'Earl', id: 5000 },
      ]);
    });
  });

  describe('getYear', () => {
    const placementNull = null;
    const placementEmpty = {};
    const placementWithoutDate = { id: 1 };
    const placementWithDateEmpty = { id: 1, inceptionDate: '' };

    it('return placement year', () => {
      expect(utils.placement.getYear(placementNull)).toEqual('');
      expect(utils.placement.getYear(placementEmpty)).toEqual('');
      expect(utils.placement.getYear(placementWithoutDate)).toEqual('');
      expect(utils.placement.getYear(placementWithDateEmpty)).toEqual('');
      expect(utils.placement.getYear({ id: 1, inceptionDate: '2018-12-07' })).toEqual(2018);
      expect(utils.placement.getYear({ id: 1, inceptionDate: '2018-12' })).toEqual(2018);
      expect(utils.placement.getYear({ id: 1, inceptionDate: '2018' })).toEqual(2018);
    });
    it('return placement year (integers are treated as timestamps by new Date())', () => {
      expect(utils.placement.getYear({ id: 1, inceptionDate: 2000 })).toEqual(1970);
      expect(utils.placement.getYear({ id: 1, inceptionDate: 1500000000000 })).toEqual(2017);
    });
    it('return placement year (invalid date formats)', () => {
      expect(utils.placement.getYear({ id: 1, inceptionDate: '30-10-2019' })).toEqual('');
      expect(utils.placement.getYear({ id: 1, inceptionDate: '10-2019' })).toEqual('');
    });
  });

  describe('getDepartmentName', () => {
    const placementNull = null;
    const placementEmpty = {};
    const placementWithoutDeptId = { id: 1 };
    const placementWithDeptId = { id: 1, departmentId: 20 };

    const deptsNull = null;
    const deptsEmpty = [];
    const deptsWithoutDeptId = [{ foo: 1 }];
    const deptsWithDeptId = [
      { id: 1, name: 'one' },
      { id: 2, name: 'two' },
      { id: 20, name: 'twenty' },
    ];

    it('return placement department name (missing params)', () => {
      expect(utils.placement.getDepartmentName()).toEqual('');
      expect(utils.placement.getDepartmentName(placementNull)).toEqual('');
      expect(utils.placement.getDepartmentName(deptsNull)).toEqual('');
      expect(utils.placement.getDepartmentName(placementNull, deptsNull)).toEqual('');
    });
    it('return placement department name (placement null)', () => {
      expect(utils.placement.getDepartmentName(placementNull, deptsNull)).toEqual('');
      expect(utils.placement.getDepartmentName(placementNull, deptsEmpty)).toEqual('');
      expect(utils.placement.getDepartmentName(placementNull, deptsWithoutDeptId)).toEqual('');
      expect(utils.placement.getDepartmentName(placementNull, deptsWithDeptId)).toEqual('');
    });
    it('return placement department name (placement empty)', () => {
      expect(utils.placement.getDepartmentName(placementEmpty, deptsNull)).toEqual('');
      expect(utils.placement.getDepartmentName(placementEmpty, deptsEmpty)).toEqual('');
      expect(utils.placement.getDepartmentName(placementEmpty, deptsWithoutDeptId)).toEqual('');
      expect(utils.placement.getDepartmentName(placementEmpty, deptsWithDeptId)).toEqual('');
    });
    it('return placement department name (placement without dept ID)', () => {
      expect(utils.placement.getDepartmentName(placementWithoutDeptId, deptsNull)).toEqual('');
      expect(utils.placement.getDepartmentName(placementWithoutDeptId, deptsEmpty)).toEqual('');
      expect(utils.placement.getDepartmentName(placementWithoutDeptId, deptsWithoutDeptId)).toEqual('');
      expect(utils.placement.getDepartmentName(placementWithoutDeptId, deptsWithDeptId)).toEqual('');
    });
    it('return placement department name (placement with dept ID', () => {
      expect(utils.placement.getDepartmentName(placementWithDeptId, deptsNull)).toEqual('');
      expect(utils.placement.getDepartmentName(placementWithDeptId, deptsEmpty)).toEqual('');
      expect(utils.placement.getDepartmentName(placementWithDeptId, deptsWithoutDeptId)).toEqual('');
      expect(utils.placement.getDepartmentName(placementWithDeptId, deptsWithDeptId)).toEqual('twenty');
    });
  });

  describe('getTabsByBusinessTypeId', () => {
    const department = {
      businessTypes: [
        { id: 50, description: 'Fifty' },
        { id: 100, description: 'Hundred' },
        { id: 200, description: 'Two Hundred' },
        { id: 300, description: 'Three Hundred' },
      ],
    };

    const layersOrPolicies = [
      { id: 1, businessTypeId: 100 },
      { id: 2, businessTypeId: 100 },
      { id: 3, businessTypeId: 300 },
      { id: 4, businessTypeId: 400 },
      { id: 5 },
    ];

    it('return placement year', () => {
      expect(utils.placement.getTabsByBusinessTypeId()).toEqual([]);
      expect(utils.placement.getTabsByBusinessTypeId([])).toEqual([]);
      expect(utils.placement.getTabsByBusinessTypeId([], null)).toEqual([]);
      expect(utils.placement.getTabsByBusinessTypeId(layersOrPolicies, {})).toEqual([]);
      expect(utils.placement.getTabsByBusinessTypeId(layersOrPolicies, department)).toEqual([
        { value: 100, label: 'Hundred' },
        { value: 300, label: 'Three Hundred' },
      ]);
    });
  });

  // describe('getPremiumByCurrency', () => {
  //   // add test if/when method is created
  // });

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

    const placement = { policies: [{ markets, origin: 'GXB' }] };
    const placementOMS = { policies: [{ markets, origin: 'OMS' }] };

    it('returns 0 if markets is not valid', () => {
      expect(utils.placement.getPremiumBySettlementCurrency()).toEqual({});
      expect(utils.placement.getPremiumBySettlementCurrency(null)).toEqual({});
      expect(utils.placement.getPremiumBySettlementCurrency(false)).toEqual({});
      expect(utils.placement.getPremiumBySettlementCurrency(true)).toEqual({});
      expect(utils.placement.getPremiumBySettlementCurrency([])).toEqual({});
      expect(utils.placement.getPremiumBySettlementCurrency({})).toEqual({});
    });

    it('returns the sum of markets premiums', () => {
      expect(utils.placement.getPremiumBySettlementCurrency(placement)).toEqual({ '---': 0, GBP: 0, USD: 2500 });
      expect(utils.placement.getPremiumBySettlementCurrency(placement, true, true)).toEqual({ '---': 0, GBP: 0, USD: 2500 });
      expect(utils.placement.getPremiumBySettlementCurrency(placement, true, false)).toEqual({
        '---': 583.3333333333333,
        GBP: 111.1111111111111,
        USD: 138.88888888888889,
      });
      expect(utils.placement.getPremiumBySettlementCurrency(placement, false, false)).toEqual({
        '---': 583.3333333333333,
        GBP: 111.1111111111111,
        USD: 138.88888888888889,
      });
      expect(utils.placement.getPremiumBySettlementCurrency(placement, false, true)).toEqual({ '---': 1200, GBP: 800, USD: 1000 });
      expect(utils.placement.getPremiumBySettlementCurrency(placement, true, true)).toEqual({ '---': 0, GBP: 0, USD: 2500 });
    });

    it('returns empty if origin not GXB', () => {
      expect(utils.placement.getPremiumBySettlementCurrency(placementOMS, true, true)).toEqual({});
    });
  });

  describe('mergePremiumsByCurrency', () => {
    it('merges sum of objects', () => {
      expect(utils.placement.mergePremiumsByCurrency({ USD: 250, GBP: 1000, '-': 50 }, { USD: 1250, GBP: 600, '-': 150 })).toEqual({
        USD: 1500,
        GBP: 1600,
        '-': 200,
      });
      expect(utils.placement.mergePremiumsByCurrency({ USD: 250, GBP: 1000, '-': 50 }, { USD: 1250 })).toEqual({
        USD: 1500,
        GBP: 1000,
        '-': 50,
      });
    });
  });

  describe('isBound', () => {
    it('return true if placement has status ID for bound', () => {
      expect(utils.placement.isBound()).toBeFalsy();
      expect(utils.placement.isBound(null)).toBeFalsy();
      expect(utils.placement.isBound({})).toBeFalsy();
      expect(utils.placement.isBound(null, null)).toBeFalsy();
      expect(utils.placement.isBound(null, 1)).toBeFalsy();
      expect(utils.placement.isBound({}, null)).toBeFalsy();
      expect(utils.placement.isBound({}, 1)).toBeFalsy();
      expect(utils.placement.isBound({ statusId: null })).toBeFalsy();
      expect(utils.placement.isBound({ statusId: null }, null)).toBeFalsy();
      expect(utils.placement.isBound({ statusId: null }, 1)).toBeFalsy();
      expect(utils.placement.isBound({ statusId: 1 })).toBeFalsy();
      expect(utils.placement.isBound({ statusId: 1 }, null)).toBeFalsy();
      expect(utils.placement.isBound({ statusId: 1 }, '')).toBeFalsy();
      expect(utils.placement.isBound({ statusId: 1 }, 'foo')).toBeFalsy();
      expect(utils.placement.isBound({ statusId: 1 }, 2)).toBeFalsy();
      expect(utils.placement.isBound({ statusId: 1 }, 1)).toBeTruthy();
    });
  });

  describe('getByYear', () => {
    const placement2019 = {
      id: 1,
      inceptionDate: new Date('2019-01-01'),
      policies: [{ origin: 'GXB', markets: [{ orderPercentage: 1, premium: 200 }] }],
    };
    const placement2020a = {
      id: 1,
      inceptionDate: new Date('2020-01-01'),
      policies: [{ origin: 'GXB', markets: [{ orderPercentage: 1, premium: 200 }] }],
    };
    const placement2020b = {
      id: 1,
      inceptionDate: new Date('2020-01-30'),
      policies: [{ origin: 'GXB', markets: [{ orderPercentage: 1, premium: 200 }] }],
    };
    const placement2020c = { id: 1, inceptionDate: new Date('2020-02-15'), policies: [{ origin: 'GXB', markets: [] }] };
    const placement2020d = {
      id: 1,
      inceptionDate: new Date('2020-02-20'),
      policies: [{ origin: 'OMS', markets: [{ orderPercentage: 1, premium: 200 }] }],
    };
    const placement2021 = {
      id: 1,
      inceptionDate: new Date('2021-01-01'),
      policies: [{ origin: 'GXB', markets: [{ orderPercentage: 1, premium: 200 }] }],
    };

    it('return placements filtered by year', () => {
      expect(utils.placement.getByYear()).toEqual([]);
      expect(utils.placement.getByYear(null)).toEqual([]);
      expect(utils.placement.getByYear(null, null)).toEqual([]);
      expect(utils.placement.getByYear(null, '')).toEqual([]);
      expect(utils.placement.getByYear(null, 'foo')).toEqual([]);
      expect(utils.placement.getByYear(null, 2020)).toEqual([]);
      expect(utils.placement.getByYear({})).toEqual([]);
      expect(utils.placement.getByYear({}, null)).toEqual([]);
      expect(utils.placement.getByYear({}, '')).toEqual([]);
      expect(utils.placement.getByYear({}, 'foo')).toEqual([]);
      expect(utils.placement.getByYear({}, 2020)).toEqual([]);
      expect(utils.placement.getByYear([])).toEqual([]);
      expect(utils.placement.getByYear([], null)).toEqual([]);
      expect(utils.placement.getByYear([], '')).toEqual([]);
      expect(utils.placement.getByYear([], 'foo')).toEqual([]);
      expect(utils.placement.getByYear([], 2020)).toEqual([]);
      expect(utils.placement.getByYear([{ id: 1, inceptionDate: '' }])).toEqual([]);
      expect(utils.placement.getByYear([{ id: 1, inceptionDate: '' }], null)).toEqual([]);
      expect(utils.placement.getByYear([{ id: 1, inceptionDate: '' }], '')).toEqual([]);
      expect(utils.placement.getByYear([{ id: 1, inceptionDate: '' }], 'foo')).toEqual([]);
      expect(utils.placement.getByYear([{ id: 1, inceptionDate: '' }], 2020)).toEqual([]);

      expect(utils.placement.getByYear([placement2019], 2020)).toEqual([]);
      expect(utils.placement.getByYear([placement2020a], 2020)).toEqual([placement2020a]);
      expect(utils.placement.getByYear([placement2020b], 2020)).toEqual([placement2020b]);
      expect(utils.placement.getByYear([placement2020c], 2020)).toEqual([placement2020c]);
      expect(utils.placement.getByYear([placement2020d], 2020)).toEqual([placement2020d]);
      expect(utils.placement.getByYear([placement2021], 2020)).toEqual([]);
      expect(
        utils.placement.getByYear([placement2019, placement2020a, placement2020b, placement2020c, placement2020d, placement2021], 2020)
      ).toEqual([placement2020a, placement2020b, placement2020c, placement2020d]);
    });

    it('return placements filtered by year and which have premiums', () => {
      expect(utils.placement.getByYear([placement2019], 2020, true)).toEqual([]);
      expect(utils.placement.getByYear([placement2020a], 2020, true)).toEqual([placement2020a]);
      expect(utils.placement.getByYear([placement2020b], 2020, true)).toEqual([placement2020b]);
      expect(utils.placement.getByYear([placement2020c], 2020, true)).toEqual([]);
      expect(utils.placement.getByYear([placement2020d], 2020, true)).toEqual([]);
      expect(utils.placement.getByYear([placement2021], 2020, true)).toEqual([]);
      expect(
        utils.placement.getByYear(
          [placement2019, placement2020a, placement2020b, placement2020c, placement2020d, placement2021],
          2020,
          true
        )
      ).toEqual([placement2020a, placement2020b]);
    });
  });

  describe('isPhysicalLoss', () => {
    it('return true if placement department is physical loss', () => {
      expect(utils.placement.isPhysicalLoss()).toBeFalsy();
      expect(utils.placement.isPhysicalLoss(null)).toBeFalsy();
      expect(utils.placement.isPhysicalLoss({})).toBeFalsy();
      expect(utils.placement.isPhysicalLoss({ departmentId: 6 })).toBeFalsy();
      expect(utils.placement.isPhysicalLoss({ departmentId: 21 })).toBeTruthy();
    });
  });

  describe('getFilteredBreadcrumbs', () => {
    it('should show for placement which is showForPhysicalLoss=true and assigned to a physical loss department', () => {
      // arrange
      const breadcrumbs = [{ name: 'overview', route: 'route/overview', showForPhysicalLoss: true }];

      // assert
      expect(
        utils.placement.getFilteredBreadcrumbs({
          breadcrumbs,
          placement: { id: 1, departmentId: 21, statusId: 3 },
          isBroker: true,
          statusBoundId: 3,
        })
      ).toEqual([{ ...breadcrumbs[0], link: 'route/overview/1' }]);
    });

    it('should hide for placement which is showForPhysicalLoss=true and not assigned to a physical loss department', () => {
      // arrange
      const breadcrumbs = [{ name: 'overview', route: 'route/overview', showForPhysicalLoss: true }];

      // assert
      expect(
        utils.placement.getFilteredBreadcrumbs({
          breadcrumbs,
          placement: { id: 1, departmentId: 6, statusId: 3 },
          isBroker: true,
          statusBoundId: 3,
        })
      ).toEqual([]);
    });

    it('should show for placement which is showForPhysicalLoss=false and not assigned to a physical loss department', () => {
      // arrange
      const breadcrumbs = [{ name: 'overview', route: 'route/overview' }];

      // assert
      expect(
        utils.placement.getFilteredBreadcrumbs({
          breadcrumbs,
          placement: { id: 1, departmentId: 21, statusId: 3 },
          isBroker: true,
          statusBoundId: 3,
        })
      ).toEqual([{ ...breadcrumbs[0], link: 'route/overview/1' }]);
    });

    it('should hide if showForIsBroker=true and not a broker', () => {
      // arrange
      const breadcrumbs = [{ name: 'overview', route: 'route/overview', showForIsBroker: true }];

      // assert
      expect(
        utils.placement.getFilteredBreadcrumbs({
          breadcrumbs,
          placement: { id: 1, departmentId: 21, statusId: 3 },
          isBroker: false,
          statusBoundId: 3,
        })
      ).toEqual([]);
    });

    it('should show if showForIsBroker=true and a broker', () => {
      // arrange
      const breadcrumbs = [{ name: 'overview', route: 'route/overview', showForIsBroker: true }];

      // assert
      expect(
        utils.placement.getFilteredBreadcrumbs({
          breadcrumbs,
          placement: { id: 1, departmentId: 21, statusId: 3 },
          isBroker: true,
          statusBoundId: 3,
        })
      ).toEqual([{ ...breadcrumbs[0], link: 'route/overview/1' }]);
    });

    it('should show if showForIsBroker=false and a broker', () => {
      // arrange
      const breadcrumbs = [{ name: 'overview', route: 'route/overview' }];

      // assert
      expect(
        utils.placement.getFilteredBreadcrumbs({
          breadcrumbs,
          placement: { id: 1, departmentId: 21, statusId: 3 },
          isBroker: false,
          statusBoundId: 3,
        })
      ).toEqual([{ ...breadcrumbs[0], link: 'route/overview/1' }]);
    });

    it('should hide if bound tab and statusId do not match', () => {
      // arrange
      const breadcrumbs = [{ name: 'bound', route: 'route/overview' }];

      // assert
      expect(
        utils.placement.getFilteredBreadcrumbs({
          breadcrumbs,
          placement: { id: 1, departmentId: 21, statusId: 3 },
          isBroker: false,
          statusBoundId: 2,
        })
      ).toEqual([]);
    });

    it('should show if bound tab and statusId not match', () => {
      // arrange
      const breadcrumbs = [{ name: 'bound', route: 'route/overview' }];

      // assert
      expect(
        utils.placement.getFilteredBreadcrumbs({
          breadcrumbs,
          placement: { id: 1, departmentId: 21, statusId: 3 },
          isBroker: false,
          statusBoundId: 3,
        })
      ).toEqual([{ ...breadcrumbs[0], link: 'route/overview/1' }]);
    });
  });
});
