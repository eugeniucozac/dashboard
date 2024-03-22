import * as utils from 'utils';

describe('UTILS › referenceData', () => {
  describe('departments', () => {
    describe('getById', () => {
      const arr = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];

      it('return undefined if missing array of departments', () => {
        expect(utils.referenceData.departments.getById()).toBeUndefined();
        expect(utils.referenceData.departments.getById(null)).toBeUndefined();
        expect(utils.referenceData.departments.getById(undefined)).toBeUndefined();
        expect(utils.referenceData.departments.getById(false)).toBeUndefined();
        expect(utils.referenceData.departments.getById(true)).toBeUndefined();
        expect(utils.referenceData.departments.getById(1)).toBeUndefined();
        expect(utils.referenceData.departments.getById('foo')).toBeUndefined();
      });

      it('return undefined if missing dept ID', () => {
        expect(utils.referenceData.departments.getById(arr)).toBeUndefined();
        expect(utils.referenceData.departments.getById(arr, null)).toBeUndefined();
        expect(utils.referenceData.departments.getById(arr, false)).toBeUndefined();
        expect(utils.referenceData.departments.getById(arr, '')).toBeUndefined();
        expect(utils.referenceData.departments.getById(arr, 0)).toBeUndefined();
      });

      it('return the first matching department', () => {
        expect(utils.referenceData.departments.getById(arr, 1)).toEqual({ id: 1 });
        expect(utils.referenceData.departments.getById(arr, 2)).toEqual({ id: 2 });
        expect(utils.referenceData.departments.getById(arr, 999)).toBeUndefined();
      });
    });

    describe('getNameById', () => {
      const arr = [{ id: 1 }, { id: 2, name: null }, { id: 3, name: '' }, { id: 4, name: 'Foo' }];

      it('return undefined if missing array of departments', () => {
        expect(utils.referenceData.departments.getNameById()).toBe('');
        expect(utils.referenceData.departments.getNameById(null)).toBe('');
        expect(utils.referenceData.departments.getNameById(undefined)).toBe('');
        expect(utils.referenceData.departments.getNameById(false)).toBe('');
        expect(utils.referenceData.departments.getNameById(true)).toBe('');
        expect(utils.referenceData.departments.getNameById(1)).toBe('');
        expect(utils.referenceData.departments.getNameById('foo')).toBe('');
      });

      it('return undefined if missing dept ID', () => {
        expect(utils.referenceData.departments.getNameById(arr)).toBe('');
        expect(utils.referenceData.departments.getNameById(arr, null)).toBe('');
        expect(utils.referenceData.departments.getNameById(arr, false)).toBe('');
        expect(utils.referenceData.departments.getNameById(arr, '')).toBe('');
        expect(utils.referenceData.departments.getNameById(arr, 0)).toBe('');
      });

      it('return the first matching department', () => {
        expect(utils.referenceData.departments.getNameById(arr, 1)).toBe('');
        expect(utils.referenceData.departments.getNameById(arr, 2)).toBe('');
        expect(utils.referenceData.departments.getNameById(arr, 3)).toBe('');
        expect(utils.referenceData.departments.getNameById(arr, 4)).toBe('Foo');
        expect(utils.referenceData.departments.getNameById(arr, 999)).toBe('');
      });
    });

    describe('getUsers', () => {
      const arr = [{ id: 1 }, { id: 2, users: null }, { id: 3, users: [] }, { id: 4, users: [1, 2, 3] }];

      it('return undefined if missing array of departments', () => {
        expect(utils.referenceData.departments.getUsers()).toEqual([]);
        expect(utils.referenceData.departments.getUsers(null)).toEqual([]);
        expect(utils.referenceData.departments.getUsers(undefined)).toEqual([]);
        expect(utils.referenceData.departments.getUsers(false)).toEqual([]);
        expect(utils.referenceData.departments.getUsers(true)).toEqual([]);
        expect(utils.referenceData.departments.getUsers(1)).toEqual([]);
        expect(utils.referenceData.departments.getUsers('foo')).toEqual([]);
      });

      it('return undefined if missing dept ID', () => {
        expect(utils.referenceData.departments.getUsers(arr)).toEqual([]);
        expect(utils.referenceData.departments.getUsers(arr, null)).toEqual([]);
        expect(utils.referenceData.departments.getUsers(arr, false)).toEqual([]);
        expect(utils.referenceData.departments.getUsers(arr, '')).toEqual([]);
        expect(utils.referenceData.departments.getUsers(arr, 0)).toEqual([]);
      });

      it('return the users array of the first matching department', () => {
        expect(utils.referenceData.departments.getUsers(arr, 1)).toEqual([]);
        expect(utils.referenceData.departments.getUsers(arr, 2)).toEqual([]);
        expect(utils.referenceData.departments.getUsers(arr, 3)).toEqual([]);
        expect(utils.referenceData.departments.getUsers(arr, 4)).toEqual([1, 2, 3]);
        expect(utils.referenceData.departments.getUsers(arr, 999)).toEqual([]);
      });
    });

    describe('getBusinessTypes', () => {
      const arr = [{ id: 1 }, { id: 2, businessTypes: null }, { id: 3, businessTypes: [] }, { id: 4, businessTypes: [1, 2, 3] }];

      it('return undefined if missing array of departments', () => {
        expect(utils.referenceData.departments.getBusinessTypes()).toEqual([]);
        expect(utils.referenceData.departments.getBusinessTypes(null)).toEqual([]);
        expect(utils.referenceData.departments.getBusinessTypes(undefined)).toEqual([]);
        expect(utils.referenceData.departments.getBusinessTypes(false)).toEqual([]);
        expect(utils.referenceData.departments.getBusinessTypes(true)).toEqual([]);
        expect(utils.referenceData.departments.getBusinessTypes(1)).toEqual([]);
        expect(utils.referenceData.departments.getBusinessTypes('foo')).toEqual([]);
      });

      it('return undefined if missing dept ID', () => {
        expect(utils.referenceData.departments.getBusinessTypes(arr)).toEqual([]);
        expect(utils.referenceData.departments.getBusinessTypes(arr, null)).toEqual([]);
        expect(utils.referenceData.departments.getBusinessTypes(arr, false)).toEqual([]);
        expect(utils.referenceData.departments.getBusinessTypes(arr, '')).toEqual([]);
        expect(utils.referenceData.departments.getBusinessTypes(arr, 0)).toEqual([]);
      });

      it('return the users array of the first matching department', () => {
        expect(utils.referenceData.departments.getBusinessTypes(arr, 1)).toEqual([]);
        expect(utils.referenceData.departments.getBusinessTypes(arr, 2)).toEqual([]);
        expect(utils.referenceData.departments.getBusinessTypes(arr, 3)).toEqual([]);
        expect(utils.referenceData.departments.getBusinessTypes(arr, 4)).toEqual([1, 2, 3]);
        expect(utils.referenceData.departments.getBusinessTypes(arr, 999)).toEqual([]);
      });
    });
  });

  describe('businessTypes', () => {
    describe('getById', () => {
      const arr = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];

      it('return undefined if missing array of businessTypes', () => {
        expect(utils.referenceData.businessTypes.getById()).toBeUndefined();
        expect(utils.referenceData.businessTypes.getById(null)).toBeUndefined();
        expect(utils.referenceData.businessTypes.getById(undefined)).toBeUndefined();
        expect(utils.referenceData.businessTypes.getById(false)).toBeUndefined();
        expect(utils.referenceData.businessTypes.getById(true)).toBeUndefined();
        expect(utils.referenceData.businessTypes.getById(1)).toBeUndefined();
        expect(utils.referenceData.businessTypes.getById('foo')).toBeUndefined();
      });

      it('return undefined if missing businessTypes ID', () => {
        expect(utils.referenceData.businessTypes.getById(arr)).toBeUndefined();
        expect(utils.referenceData.businessTypes.getById(arr, null)).toBeUndefined();
        expect(utils.referenceData.businessTypes.getById(arr, false)).toBeUndefined();
        expect(utils.referenceData.businessTypes.getById(arr, '')).toBeUndefined();
        expect(utils.referenceData.businessTypes.getById(arr, 0)).toBeUndefined();
      });

      it('return the first matching businessTypes', () => {
        expect(utils.referenceData.businessTypes.getById(arr, 1)).toEqual({ id: 1 });
        expect(utils.referenceData.businessTypes.getById(arr, 2)).toEqual({ id: 2 });
        expect(utils.referenceData.businessTypes.getById(arr, 999)).toBeUndefined();
      });
    });

    describe('getNameById', () => {
      const arr = [{ id: 1 }, { id: 2, description: null }, { id: 3, description: '' }, { id: 4, description: 'Foo' }];

      it('return undefined if missing array of businessTypes', () => {
        expect(utils.referenceData.businessTypes.getNameById()).toEqual('');
        expect(utils.referenceData.businessTypes.getNameById(null)).toEqual('');
        expect(utils.referenceData.businessTypes.getNameById(undefined)).toEqual('');
        expect(utils.referenceData.businessTypes.getNameById(false)).toEqual('');
        expect(utils.referenceData.businessTypes.getNameById(true)).toEqual('');
        expect(utils.referenceData.businessTypes.getNameById(1)).toEqual('');
        expect(utils.referenceData.businessTypes.getNameById('foo')).toEqual('');
      });

      it('return undefined if missing businessTypes ID', () => {
        expect(utils.referenceData.businessTypes.getNameById(arr)).toEqual('');
        expect(utils.referenceData.businessTypes.getNameById(arr, null)).toEqual('');
        expect(utils.referenceData.businessTypes.getNameById(arr, false)).toEqual('');
        expect(utils.referenceData.businessTypes.getNameById(arr, '')).toEqual('');
        expect(utils.referenceData.businessTypes.getNameById(arr, 0)).toEqual('');
      });

      it('return the name of the first matching businessTypes', () => {
        expect(utils.referenceData.businessTypes.getNameById(arr, 1)).toEqual('');
        expect(utils.referenceData.businessTypes.getNameById(arr, 2)).toEqual('');
        expect(utils.referenceData.businessTypes.getNameById(arr, 3)).toEqual('');
        expect(utils.referenceData.businessTypes.getNameById(arr, 4)).toEqual('Foo');
        expect(utils.referenceData.businessTypes.getNameById(arr, 999)).toEqual('');
      });
    });
  });

  describe('markets', () => {
    describe('getById', () => {
      const arr = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];

      it('return undefined if missing array of markets', () => {
        expect(utils.referenceData.markets.getById()).toBeUndefined();
        expect(utils.referenceData.markets.getById(null)).toBeUndefined();
        expect(utils.referenceData.markets.getById(undefined)).toBeUndefined();
        expect(utils.referenceData.markets.getById(false)).toBeUndefined();
        expect(utils.referenceData.markets.getById(true)).toBeUndefined();
        expect(utils.referenceData.markets.getById(1)).toBeUndefined();
        expect(utils.referenceData.markets.getById('foo')).toBeUndefined();
      });

      it('return undefined if missing markets ID', () => {
        expect(utils.referenceData.markets.getById(arr)).toBeUndefined();
        expect(utils.referenceData.markets.getById(arr, null)).toBeUndefined();
        expect(utils.referenceData.markets.getById(arr, false)).toBeUndefined();
        expect(utils.referenceData.markets.getById(arr, '')).toBeUndefined();
        expect(utils.referenceData.markets.getById(arr, 0)).toBeUndefined();
      });

      it('return the first matching markets', () => {
        expect(utils.referenceData.markets.getById(arr, 1)).toEqual({ id: 1 });
        expect(utils.referenceData.markets.getById(arr, 2)).toEqual({ id: 2 });
        expect(utils.referenceData.markets.getById(arr, 999)).toBeUndefined();
      });
    });
  });

  describe('underwriters', () => {
    describe('getById', () => {
      const arr = [{ underwriter: { id: 1 } }, { underwriter: { id: 2 } }, { underwriter: { id: 3 } }, { underwriter: { id: 4 } }];

      it('return undefined if missing array of underwriters', () => {
        expect(utils.referenceData.underwriters.getById()).toBeUndefined();
        expect(utils.referenceData.underwriters.getById(null)).toBeUndefined();
        expect(utils.referenceData.underwriters.getById(undefined)).toBeUndefined();
        expect(utils.referenceData.underwriters.getById(false)).toBeUndefined();
        expect(utils.referenceData.underwriters.getById(true)).toBeUndefined();
        expect(utils.referenceData.underwriters.getById(1)).toBeUndefined();
        expect(utils.referenceData.underwriters.getById('foo')).toBeUndefined();
      });

      it('return undefined if missing underwriters ID', () => {
        expect(utils.referenceData.underwriters.getById(arr)).toBeUndefined();
        expect(utils.referenceData.underwriters.getById(arr, null)).toBeUndefined();
        expect(utils.referenceData.underwriters.getById(arr, false)).toBeUndefined();
        expect(utils.referenceData.underwriters.getById(arr, '')).toBeUndefined();
        expect(utils.referenceData.underwriters.getById(arr, 0)).toBeUndefined();
      });

      it('return the first matching underwriters', () => {
        expect(utils.referenceData.underwriters.getById(arr, 1)).toEqual({ underwriter: { id: 1 } });
        expect(utils.referenceData.underwriters.getById(arr, 2)).toEqual({ underwriter: { id: 2 } });
        expect(utils.referenceData.underwriters.getById(arr, 999)).toBeUndefined();
      });
    });
  });

  describe('clients', () => {
    describe('getById', () => {
      const arr = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];

      it('return undefined if missing array of clients', () => {
        expect(utils.referenceData.clients.getById()).toBeUndefined();
        expect(utils.referenceData.clients.getById(null)).toBeUndefined();
        expect(utils.referenceData.clients.getById(undefined)).toBeUndefined();
        expect(utils.referenceData.clients.getById(false)).toBeUndefined();
        expect(utils.referenceData.clients.getById(true)).toBeUndefined();
        expect(utils.referenceData.clients.getById(1)).toBeUndefined();
        expect(utils.referenceData.clients.getById('foo')).toBeUndefined();
      });

      it('return undefined if missing clients ID', () => {
        expect(utils.referenceData.clients.getById(arr)).toBeUndefined();
        expect(utils.referenceData.clients.getById(arr, null)).toBeUndefined();
        expect(utils.referenceData.clients.getById(arr, false)).toBeUndefined();
        expect(utils.referenceData.clients.getById(arr, '')).toBeUndefined();
        expect(utils.referenceData.clients.getById(arr, 0)).toBeUndefined();
      });

      it('return the first matching clients', () => {
        expect(utils.referenceData.clients.getById(arr, 1)).toEqual({ id: 1 });
        expect(utils.referenceData.clients.getById(arr, 2)).toEqual({ id: 2 });
        expect(utils.referenceData.clients.getById(arr, 999)).toBeUndefined();
      });
    });
  });

  describe('insureds', () => {
    describe('getById', () => {
      const arr = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];

      it('return undefined if missing array of insureds', () => {
        expect(utils.referenceData.insureds.getById()).toBeUndefined();
        expect(utils.referenceData.insureds.getById(null)).toBeUndefined();
        expect(utils.referenceData.insureds.getById(undefined)).toBeUndefined();
        expect(utils.referenceData.insureds.getById(false)).toBeUndefined();
        expect(utils.referenceData.insureds.getById(true)).toBeUndefined();
        expect(utils.referenceData.insureds.getById(1)).toBeUndefined();
        expect(utils.referenceData.insureds.getById('foo')).toBeUndefined();
      });

      it('return undefined if missing insureds ID', () => {
        expect(utils.referenceData.insureds.getById(arr)).toBeUndefined();
        expect(utils.referenceData.insureds.getById(arr, null)).toBeUndefined();
        expect(utils.referenceData.insureds.getById(arr, false)).toBeUndefined();
        expect(utils.referenceData.insureds.getById(arr, '')).toBeUndefined();
        expect(utils.referenceData.insureds.getById(arr, 0)).toBeUndefined();
      });

      it('return the first matching insureds', () => {
        expect(utils.referenceData.insureds.getById(arr, 1)).toEqual({ id: 1 });
        expect(utils.referenceData.insureds.getById(arr, 2)).toEqual({ id: 2 });
        expect(utils.referenceData.insureds.getById(arr, 999)).toBeUndefined();
      });
    });
  });

  describe('newRenewalBusinesses', () => {
    describe('getLabelById', () => {
      const arr = [
        { id: 1 },
        { id: 2, description: null },
        { id: 3, description: '' },
        { id: 4, description: 'Foo' },
        { id: 5, code: 1, description: 'Bar' },
      ];

      it('return undefined if missing array of businesses', () => {
        expect(utils.referenceData.newRenewalBusinesses.getLabelById()).toEqual('');
        expect(utils.referenceData.newRenewalBusinesses.getLabelById(null)).toEqual('');
        expect(utils.referenceData.newRenewalBusinesses.getLabelById(undefined)).toEqual('');
        expect(utils.referenceData.newRenewalBusinesses.getLabelById(false)).toEqual('');
        expect(utils.referenceData.newRenewalBusinesses.getLabelById(true)).toEqual('');
        expect(utils.referenceData.newRenewalBusinesses.getLabelById(1)).toEqual('');
        expect(utils.referenceData.newRenewalBusinesses.getLabelById('foo')).toEqual('');
      });

      it('return undefined if missing business ID', () => {
        expect(utils.referenceData.newRenewalBusinesses.getLabelById(arr)).toEqual('');
        expect(utils.referenceData.newRenewalBusinesses.getLabelById(arr, null)).toEqual('');
        expect(utils.referenceData.newRenewalBusinesses.getLabelById(arr, false)).toEqual('');
        expect(utils.referenceData.newRenewalBusinesses.getLabelById(arr, '')).toEqual('');
        expect(utils.referenceData.newRenewalBusinesses.getLabelById(arr, 0)).toEqual('');
      });

      it('return the label of the first matching business', () => {
        expect(utils.referenceData.newRenewalBusinesses.getLabelById(arr, 1)).toEqual('');
        expect(utils.referenceData.newRenewalBusinesses.getLabelById(arr, 2)).toEqual('');
        expect(utils.referenceData.newRenewalBusinesses.getLabelById(arr, 3)).toEqual('');
        expect(utils.referenceData.newRenewalBusinesses.getLabelById(arr, 4)).toEqual('');
        expect(utils.referenceData.newRenewalBusinesses.getLabelById(arr, 5)).toEqual('Bar');
        expect(utils.referenceData.newRenewalBusinesses.getLabelById(arr, 999)).toEqual('');
      });
    });
  });

  describe('status', () => {
    describe('getById', () => {
      const arr = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];

      it('return undefined if missing array of status', () => {
        expect(utils.referenceData.status.getById()).toBeUndefined();
        expect(utils.referenceData.status.getById(null)).toBeUndefined();
        expect(utils.referenceData.status.getById(undefined)).toBeUndefined();
        expect(utils.referenceData.status.getById(false)).toBeUndefined();
        expect(utils.referenceData.status.getById(true)).toBeUndefined();
        expect(utils.referenceData.status.getById(1)).toBeUndefined();
        expect(utils.referenceData.status.getById('foo')).toBeUndefined();
      });

      it('return undefined if missing status ID', () => {
        expect(utils.referenceData.status.getById(arr)).toBeUndefined();
        expect(utils.referenceData.status.getById(arr, null)).toBeUndefined();
        expect(utils.referenceData.status.getById(arr, false)).toBeUndefined();
        expect(utils.referenceData.status.getById(arr, '')).toBeUndefined();
        expect(utils.referenceData.status.getById(arr, 0)).toBeUndefined();
      });

      it('return the first matching status', () => {
        expect(utils.referenceData.status.getById(arr, 1)).toEqual({ id: 1 });
        expect(utils.referenceData.status.getById(arr, 2)).toEqual({ id: 2 });
        expect(utils.referenceData.status.getById(arr, 999)).toBeUndefined();
      });
    });

    describe('getByCode', () => {
      const arr = [
        { id: 1, code: 'yes' },
        { id: 2, code: 'no' },
        { id: 3, code: 'maybe' },
      ];

      it('return undefined if missing array of status', () => {
        expect(utils.referenceData.status.getByCode()).toBeUndefined();
        expect(utils.referenceData.status.getByCode(null)).toBeUndefined();
        expect(utils.referenceData.status.getByCode(undefined)).toBeUndefined();
        expect(utils.referenceData.status.getByCode(false)).toBeUndefined();
        expect(utils.referenceData.status.getByCode(true)).toBeUndefined();
        expect(utils.referenceData.status.getByCode(1)).toBeUndefined();
        expect(utils.referenceData.status.getByCode('foo')).toBeUndefined();
      });

      it('return undefined if missing status ID', () => {
        expect(utils.referenceData.status.getByCode(arr)).toBeUndefined();
        expect(utils.referenceData.status.getByCode(arr, null)).toBeUndefined();
        expect(utils.referenceData.status.getByCode(arr, false)).toBeUndefined();
        expect(utils.referenceData.status.getByCode(arr, '')).toBeUndefined();
        expect(utils.referenceData.status.getByCode(arr, 0)).toBeUndefined();
      });

      it('return the first matching status', () => {
        expect(utils.referenceData.status.getByCode(arr, 'yes')).toEqual({ id: 1, code: 'yes' });
        expect(utils.referenceData.status.getByCode(arr, 'no')).toEqual({ id: 2, code: 'no' });
        expect(utils.referenceData.status.getByCode(arr, 'fooooo')).toBeUndefined();
      });
    });

    describe('getIdByCode', () => {
      const arr = [
        { id: 1, code: 'yes' },
        { id: 2, code: 'no' },
        { id: 3, code: 'maybe' },
      ];

      it('return undefined if missing array of status', () => {
        expect(utils.referenceData.status.getIdByCode()).toBeUndefined();
        expect(utils.referenceData.status.getIdByCode(null)).toBeUndefined();
        expect(utils.referenceData.status.getIdByCode(undefined)).toBeUndefined();
        expect(utils.referenceData.status.getIdByCode(false)).toBeUndefined();
        expect(utils.referenceData.status.getIdByCode(true)).toBeUndefined();
        expect(utils.referenceData.status.getIdByCode(1)).toBeUndefined();
        expect(utils.referenceData.status.getIdByCode('foo')).toBeUndefined();
      });

      it('return undefined if missing status ID', () => {
        expect(utils.referenceData.status.getIdByCode(arr)).toBeUndefined();
        expect(utils.referenceData.status.getIdByCode(arr, null)).toBeUndefined();
        expect(utils.referenceData.status.getIdByCode(arr, false)).toBeUndefined();
        expect(utils.referenceData.status.getIdByCode(arr, '')).toBeUndefined();
        expect(utils.referenceData.status.getIdByCode(arr, 0)).toBeUndefined();
      });

      it('return the first matching status', () => {
        expect(utils.referenceData.status.getIdByCode(arr, 'yes')).toEqual(1);
        expect(utils.referenceData.status.getIdByCode(arr, 'no')).toEqual(2);
        expect(utils.referenceData.status.getIdByCode(arr, 'fooooo')).toBeUndefined();
      });
    });

    describe('getLabelById', () => {
      const arr = [
        { id: 1, code: 'In Progress' },
        { id: 2, code: 'Bound' },
        { id: 3, code: 'Auto-Bound' },
        { id: 4, code: 'NTU' },
      ];

      it('return undefined if missing array of status', () => {
        expect(utils.referenceData.status.getLabelById()).toBeUndefined();
        expect(utils.referenceData.status.getLabelById(null)).toBeUndefined();
        expect(utils.referenceData.status.getLabelById(undefined)).toBeUndefined();
        expect(utils.referenceData.status.getLabelById(false)).toBeUndefined();
        expect(utils.referenceData.status.getLabelById(true)).toBeUndefined();
        expect(utils.referenceData.status.getLabelById(1)).toBeUndefined();
        expect(utils.referenceData.status.getLabelById('foo')).toBeUndefined();
      });

      it('return undefined if missing status ID', () => {
        expect(utils.referenceData.status.getLabelById(arr)).toBeUndefined();
        expect(utils.referenceData.status.getLabelById(arr, null)).toBeUndefined();
        expect(utils.referenceData.status.getLabelById(arr, false)).toBeUndefined();
        expect(utils.referenceData.status.getLabelById(arr, '')).toBeUndefined();
        expect(utils.referenceData.status.getLabelById(arr, 0)).toBeUndefined();
      });

      it('return the first matching status', () => {
        expect(utils.referenceData.status.getLabelById(arr, 1)).toEqual('inprogress');
        expect(utils.referenceData.status.getLabelById(arr, 2)).toEqual('bound');
        expect(utils.referenceData.status.getLabelById(arr, 3)).toEqual('auto-bound');
        expect(utils.referenceData.status.getLabelById(arr, 4)).toEqual('ntu');
        expect(utils.referenceData.status.getLabelById(arr, 5)).toEqual('');
      });
    });

    describe('getKey', () => {
      it('return empty string if status object is falsy', () => {
        expect(utils.referenceData.status.getKey()).toBe('');
        expect(utils.referenceData.status.getKey(null)).toBe('');
        expect(utils.referenceData.status.getKey(undefined)).toBe('');
        expect(utils.referenceData.status.getKey(false)).toBe('');
      });

      it('return the status key, lowercase, without space', () => {
        expect(utils.referenceData.status.getKey({ id: 1, code: 'In Progress' })).toEqual('inprogress');
        expect(utils.referenceData.status.getKey({ id: 1, code: 'Bound' })).toEqual('bound');
        expect(utils.referenceData.status.getKey({ id: 1, code: 'Auto-Bound' })).toEqual('auto-bound');
        expect(utils.referenceData.status.getKey({ id: 1, code: 'NTU' })).toEqual('ntu');
      });

      it('return the status code, lowercase, without space', () => {
        expect(utils.referenceData.status.getKey({ id: 1, code: 'In Progress' })).toEqual('inprogress');
        expect(utils.referenceData.status.getKey({ id: 1, code: 'Bound' })).toEqual('bound');
        expect(utils.referenceData.status.getKey({ id: 1, code: 'Auto-Bound' })).toEqual('auto-bound');
        expect(utils.referenceData.status.getKey({ id: 1, code: 'NTU' })).toEqual('ntu');
        expect(utils.referenceData.status.getKey({ id: 1, code: 'AWAITING_APPROVAL' })).toEqual('awaitingapproval');
      });
    });
  });

  describe('countries', () => {
    describe('getOptionsIso2', () => {
      const arr = [
        { id: 1, name: 'United States', codeAlpha3: 'USA' },
        { id: 2, name: 'Canada', codeAlpha2: 'CA', codeAlpha3: 'CAN' },
        { id: 3, name: 'Germany', codeAlpha2: 'DE', codeAlpha3: 'DEU' },
        { id: 4, name: 'France', codeAlpha2: 'FR', codeAlpha3: 'FRA' },
      ];

      it('return undefined if missing array of countries', () => {
        expect(utils.referenceData.countries.getOptionsIso2()).toEqual([]);
        expect(utils.referenceData.countries.getOptionsIso2(null)).toEqual([]);
        expect(utils.referenceData.countries.getOptionsIso2(undefined)).toEqual([]);
        expect(utils.referenceData.countries.getOptionsIso2(false)).toEqual([]);
        expect(utils.referenceData.countries.getOptionsIso2(true)).toEqual([]);
        expect(utils.referenceData.countries.getOptionsIso2(1)).toEqual([]);
        expect(utils.referenceData.countries.getOptionsIso2('foo')).toEqual([]);
      });

      it('return the array of countries with value/label properties', () => {
        expect(utils.referenceData.countries.getOptionsIso2(arr)).toEqual([
          { value: undefined, label: 'United States' },
          { value: 'CA', label: 'Canada' },
          { value: 'DE', label: 'Germany' },
          { value: 'FR', label: 'France' },
        ]);
      });
    });
  });

  describe('currencies', () => {
    describe('getById', () => {
      const arr = [
        { id: 1, code: 'USD' },
        { id: 2, code: 'CAD' },
        { id: 3, code: 'EUR' },
        { id: 4, code: 'GBP' },
      ];

      it('return undefined if missing array of currencies', () => {
        expect(utils.referenceData.currencies.getById()).toEqual({});
        expect(utils.referenceData.currencies.getById(null)).toEqual({});
        expect(utils.referenceData.currencies.getById(undefined)).toEqual({});
        expect(utils.referenceData.currencies.getById(false)).toEqual({});
        expect(utils.referenceData.currencies.getById(true)).toEqual({});
        expect(utils.referenceData.currencies.getById(1)).toEqual({});
        expect(utils.referenceData.currencies.getById('foo')).toEqual({});
      });

      it('return undefined if missing currencies ID', () => {
        expect(utils.referenceData.currencies.getById(arr)).toEqual({});
        expect(utils.referenceData.currencies.getById(arr, null)).toEqual({});
        expect(utils.referenceData.currencies.getById(arr, false)).toEqual({});
        expect(utils.referenceData.currencies.getById(arr, '')).toEqual({});
        expect(utils.referenceData.currencies.getById(arr, 0)).toEqual({});
      });

      it('return the first matching currency', () => {
        expect(utils.referenceData.currencies.getById(arr, 1)).toEqual({ id: 1, code: 'USD' });
        expect(utils.referenceData.currencies.getById(arr, 2)).toEqual({ id: 2, code: 'CAD' });
        expect(utils.referenceData.currencies.getById(arr, 999)).toEqual({});
      });
    });

    describe('getByCode', () => {
      const arr = [
        { id: 1, code: 'USD' },
        { id: 2, code: 'CAD' },
        { id: 3, code: 'EUR' },
        { id: 4, code: 'GBP' },
      ];

      it('return undefined if missing array of currencies', () => {
        expect(utils.referenceData.currencies.getByCode()).toEqual({});
        expect(utils.referenceData.currencies.getByCode(null)).toEqual({});
        expect(utils.referenceData.currencies.getByCode(undefined)).toEqual({});
        expect(utils.referenceData.currencies.getByCode(false)).toEqual({});
        expect(utils.referenceData.currencies.getByCode(true)).toEqual({});
        expect(utils.referenceData.currencies.getByCode(1)).toEqual({});
        expect(utils.referenceData.currencies.getByCode('foo')).toEqual({});
      });

      it('return undefined if missing currencies ID', () => {
        expect(utils.referenceData.currencies.getByCode(arr)).toEqual({});
        expect(utils.referenceData.currencies.getByCode(arr, null)).toEqual({});
        expect(utils.referenceData.currencies.getByCode(arr, false)).toEqual({});
        expect(utils.referenceData.currencies.getByCode(arr, '')).toEqual({});
        expect(utils.referenceData.currencies.getByCode(arr, 0)).toEqual({});
      });

      it('return the first matching currency', () => {
        expect(utils.referenceData.currencies.getByCode(arr, 'USD')).toEqual({ id: 1, code: 'USD' });
        expect(utils.referenceData.currencies.getByCode(arr, 'CAD')).toEqual({ id: 2, code: 'CAD' });
        expect(utils.referenceData.currencies.getByCode(arr, 'fooooo')).toEqual({});
      });
    });
  });
});
