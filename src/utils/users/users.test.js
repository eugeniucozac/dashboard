import * as utils from 'utils';

describe('UTILS › users', () => {
  it('should export the required methods', () => {
    // assert
    expect(utils.users).toHaveProperty('getWithName');
    expect(utils.users).toHaveProperty('getBrokers');
    expect(utils.users).toHaveProperty('getCobrokers');
  });

  describe('getWithName', () => {
    it('should return an empty array if array of users is falsy', () => {
      // assert
      expect(utils.users.getWithName()).toEqual([]);
      expect(utils.users.getWithName(null)).toEqual([]);
      expect(utils.users.getWithName({})).toEqual([]);
      expect(utils.users.getWithName([])).toEqual([]);
    });

    it('should remove users without names', () => {
      // arrange
      const users = [
        { id: 1, fullName: 'John Smith' },
        { id: 2, fullName: ' ' },
        { id: 3, fullName: '' },
        { id: 4, fullName: null },
        { id: 5, firstName: 'John' },
        { id: 6, firstName: ' ' },
        { id: 7, firstName: '' },
        { id: 8, firstName: null },
        { id: 9, lastName: 'Smith' },
        { id: 10, lastName: ' ' },
        { id: 11, lastName: '' },
        { id: 12, lastName: null },
        { id: 13 },
      ];

      // assert
      expect(utils.users.getWithName(users)).toEqual([
        { id: 1, fullName: 'John Smith' },
        { id: 5, firstName: 'John' },
        { id: 9, lastName: 'Smith' },
      ]);
    });
  });

  describe('getBrokers', () => {
    const users = [
      { id: 1, role: 'BROKER' },
      { id: 2, role: 'BROKER' },
      { id: 3, role: 'Broker' },
      { id: 4, role: 'broker' },
      { id: 5, role: 'COBROKER' },
      { id: 6, role: 'BROKER' },
      { id: 7, role: 'FOO' },
      { id: 8, role: '' },
      { id: 9, role: null },
    ];

    it('should return an empty array if array of users is falsy', () => {
      // assert
      expect(utils.users.getBrokers()).toEqual([]);
      expect(utils.users.getBrokers(null)).toEqual([]);
      expect(utils.users.getBrokers({})).toEqual([]);
      expect(utils.users.getBrokers([])).toEqual([]);
    });

    it('should return an array of users that are BROKER', () => {
      // assert
      expect(utils.users.getBrokers(users)).toEqual([
        { id: 1, role: 'BROKER' },
        { id: 2, role: 'BROKER' },
        { id: 6, role: 'BROKER' },
      ]);
    });

    it('should return an array of users that are BROKER including users GXB users (no role assigned)', () => {
      // assert
      expect(utils.users.getBrokers(users, { gxbUsersIncluded: true })).toEqual([
        { id: 1, role: 'BROKER' },
        { id: 2, role: 'BROKER' },
        { id: 6, role: 'BROKER' },
        { id: 8, role: '' },
        { id: 9, role: null },
      ]);
    });

    it('should return an array of only users BROKER from GXB (no role assigned)', () => {
      // assert
      expect(utils.users.getBrokers(users, { gxbUsersOnly: true })).toEqual([
        { id: 8, role: '' },
        { id: 9, role: null },
      ]);

      expect(utils.users.getBrokers(users, { gxbUsersOnly: true, gxbUsersIncluded: true })).toEqual([
        { id: 8, role: '' },
        { id: 9, role: null },
      ]);
    });
  });

  describe('getCobrokers', () => {
    const users = [
      { id: 1, role: 'BROKER' },
      { id: 2, role: 'BROKER' },
      { id: 3, role: 'Broker' },
      { id: 4, role: 'broker' },
      { id: 5, role: 'COBROKER' },
      { id: 6, role: 'COBROKER' },
      { id: 7, role: 'FOO' },
      { id: 8, role: '' },
      { id: 9, role: null },
    ];

    it('should return an empty array if array of users is falsy', () => {
      // assert
      expect(utils.users.getCobrokers()).toEqual([]);
      expect(utils.users.getCobrokers(null)).toEqual([]);
      expect(utils.users.getCobrokers({})).toEqual([]);
      expect(utils.users.getCobrokers([])).toEqual([]);
    });

    it('should return an array of users that are BROKER', () => {
      // assert
      expect(utils.users.getCobrokers(users)).toEqual([
        { id: 5, role: 'COBROKER' },
        { id: 6, role: 'COBROKER' },
      ]);
    });
  });
});
