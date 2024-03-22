import * as utils from 'utils';

describe('UTILS › location', () => {
  describe('getTiv', () => {
    it('should return the sum of all locations TIV', () => {
      const locations = [
        { id: 0, name: 'foo' },
        { id: 1, name: 'bar', totalInsurableValues: 1000 },
        { id: 2, name: 'qwe', totalInsurableValues: 2000 },
        { id: 3, name: 'rty', totalInsurableValues: 3000, tiv: 4000 },
      ];

      expect(utils.location.getTiv()).toEqual(0);
      expect(utils.location.getTiv(null)).toEqual(0);
      expect(utils.location.getTiv([])).toEqual(0);
      expect(utils.location.getTiv(locations)).toEqual(6000);
    });
  });

  describe('isValidLocation', () => {
    it('should return true if location is valid', () => {
      const validLocations = [
        {
          id: 0,
          name: 'foo',
          totalInsurableValues: 1000,
          latitude: 20,
          longitude: 80,
          streetAddress: '',
        },
        {
          id: 1,
          name: 'foo',
          totalInsurableValues: 1000,
          latitude: -10,
          longitude: -80,
        },
        {
          id: 2,
          name: 'foo',
          totalInsurableValues: 1000,
          latitude: -90,
          longitude: -180,
          streetAddress: '5950 Woodgate Dr',
        },
        {
          id: 2,
          name: 'foo',
          totalInsurableValues: 1000,
          latitude: 0,
          longitude: 0,
          streetAddress: '5950 Woodgate Dr',
        },
      ];

      expect(utils.location.isValidLocation(validLocations[0])).toBeTruthy();
      expect(utils.location.isValidLocation(validLocations[1])).toBeTruthy();
      expect(utils.location.isValidLocation(validLocations[2])).toBeTruthy();
      expect(utils.location.isValidLocation(validLocations[3])).toBeTruthy();
    });

    it('should return false if location is invalid', () => {
      const location = [
        {
          id: 0,
          name: 'foo',
          totalInsurableValues: 1000,
          latitude: -91,
          longitude: -181,
          streetAddress: '',
        },
        {
          id: 1,
          name: 'foo',
          totalInsurableValues: 1000,
          latitude: 900000,
          longitude: 5000000,
          streetAddress: '',
        },
        {
          id: 2,
          name: 'foo',
          latitude: 20,
          longitude: 80,
          streetAddress: '',
        },
      ];

      expect(utils.location.isValidLocation(location[0])).toBeFalsy();
      expect(utils.location.isValidLocation(location[1])).toBeFalsy();
      expect(utils.location.isValidLocation(location[3])).toBeFalsy();
    });
  });
  describe('isValidTIV', () => {
    const location = [
      {
        id: 0,
        name: 'foo',
        totalInsurableValues: 1000,
        latitude: -91,
        longitude: -181,
        streetAddress: '',
      },
      {
        id: 1,
        name: 'foo',
        totalInsurableValues: -1000,
        latitude: 900000,
        longitude: 5000000,
        streetAddress: '',
      },
      {
        id: 2,
        name: 'foo',
        latitude: 20,
        longitude: 80,
        streetAddress: '',
        totalInsurableValues: 0,
      },
      {
        id: 3,
        name: 'foo',
        latitude: 20,
        longitude: 80,
        streetAddress: 'ddd',
        totalInsurableValues: 0,
      },
      {
        id: 4,
        name: 'foo',
        latitude: 20,
        longitude: 80,
        streetAddress: '',
      },
    ];

    expect(utils.location.isValidTIV(location[0])).toBeTruthy();
    expect(utils.location.isValidTIV(location[1])).toBeFalsy();
    expect(utils.location.isValidTIV(location[3])).toBeFalsy();
    expect(utils.location.isValidTIV(location[4])).toBeFalsy();
    expect(utils.location.isValidTIV(location[5])).toBeFalsy();
  });
});
