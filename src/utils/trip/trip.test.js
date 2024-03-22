import * as utils from 'utils';

describe('UTILS › trip', () => {
  const visits = [
    { id: 1 },
    { id: 2, visitingDate: 100 },
    { id: 3, visitingDate: 50, users: [{ id: 1, name: 'John' }] },
    { id: 4, visitingDate: 25, users: [{ id: 1, name: 'John Clone' }] },
    { id: 5, visitingDate: 25, users: [{ id: 2, name: 'Steve' }] },
    {
      id: 6,
      visitingDate: 300,
      users: [
        { id: 3, name: 'Carl' },
        { id: 3, name: 'Another Carl' },
        { id: 4, name: 'Simon' },
      ],
    },
  ];

  it('should export the required methods', () => {
    expect(utils.trip).toHaveProperty('getDateFrom');
    expect(utils.trip).toHaveProperty('getDateTo');
    expect(utils.trip).toHaveProperty('getBrokers');
  });

  describe('getDateFrom', () => {
    it('should return 0 if not passed a valid array of visits', () => {
      expect(utils.trip.getDateFrom()).toEqual(0);
      expect(utils.trip.getDateFrom([])).toEqual(0);
      expect(utils.trip.getDateFrom({})).toEqual(0);
      expect(utils.trip.getDateFrom(null)).toEqual(0);
      expect(utils.trip.getDateFrom(true)).toEqual(0);
      expect(utils.trip.getDateFrom(666)).toEqual(0);
      expect(utils.trip.getDateFrom('string')).toEqual(0);
    });

    it('should return the earliest date (timestamp) of all visits', () => {
      expect(utils.trip.getDateFrom(visits)).toEqual(25);
    });
  });

  describe('getDateTo', () => {
    it('should return 0 if not passed a valid array of visits', () => {
      expect(utils.trip.getDateTo()).toEqual(0);
      expect(utils.trip.getDateTo([])).toEqual(0);
      expect(utils.trip.getDateTo({})).toEqual(0);
      expect(utils.trip.getDateTo(null)).toEqual(0);
      expect(utils.trip.getDateTo(true)).toEqual(0);
      expect(utils.trip.getDateTo(666)).toEqual(0);
      expect(utils.trip.getDateTo('string')).toEqual(0);
    });

    it('should return the latest date (timestamp) of all visits', () => {
      expect(utils.trip.getDateTo(visits)).toEqual(300);
    });
  });

  describe('getBrokers', () => {
    it('should return an empty array if not passed a valid array of visits', () => {
      expect(utils.trip.getBrokers()).toEqual([]);
      expect(utils.trip.getBrokers([])).toEqual([]);
      expect(utils.trip.getBrokers({})).toEqual([]);
      expect(utils.trip.getBrokers(null)).toEqual([]);
      expect(utils.trip.getBrokers(true)).toEqual([]);
      expect(utils.trip.getBrokers(666)).toEqual([]);
      expect(utils.trip.getBrokers('string')).toEqual([]);
    });

    it('should return the latest date (timestamp) of all visits', () => {
      expect(utils.trip.getBrokers(visits)).toEqual([
        { id: 1, name: 'John' },
        { id: 2, name: 'Steve' },
        { id: 3, name: 'Carl' },
        { id: 4, name: 'Simon' },
      ]);
    });
  });
});
