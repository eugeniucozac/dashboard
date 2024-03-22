import MockDate from 'mockdate';

// app
import {
  filterAccounts,
  groupAccounts,
  addMapData,
  hydratePlacements,
  hydrateAccounts,
  getEarliestInceptionDate,
  getLatestExpiryDate,
  getWithValidDate,
  getFilteredPlacements,
} from './PortfolioMap.utils';

beforeEach(() => {
  MockDate.set('2019-10-10');
});

afterEach(() => {
  MockDate.reset();
});

describe('filterAccounts', () => {
  it('should return the accounts object, filtered by placement, with previous checked state', () => {
    // arrange
    const placementIds = ['1736', '12149', '16428', '16431', '16429', '16430'];
    const allAccounts = [
      {
        id: '7873',
        checked: true,
        label: 'First Hawaiian Bank',
        color: '#f44336',
        placements: [
          { id: 1733, label: 'Baz' },
          { id: 1734, label: 'Bar' },
          { id: 1736, label: 'Foo' },
        ],
      },
      {
        id: '18002',
        checked: true,
        label: 'Ports America Group, Inc.',
        color: '#FFB399',
        placements: [
          { id: 12149, label: 'Foo' },
          { id: 11554, label: 'US Marine' },
        ],
      },
      {
        id: '24093',
        checked: true,
        label: 'First Hawaiian Bank',
        color: '#FF33FF',
        placements: [{ id: 1732, label: 'Financial Products' }],
      },
    ];
    const existingFilteredAccounts = [
      {
        id: '18002',
        checked: false,
        label: 'Ports America Group, Inc.',
        color: '#FFB399',
        placements: [
          { id: 12149, label: 'Foo' },
          { id: 11554, label: 'US Marine' },
        ],
      },
    ];
    const expectedResponse = [
      {
        id: '7873',
        checked: true,
        label: 'First Hawaiian Bank',
        color: '#f44336',
        placements: [{ id: 1736, label: 'Foo' }],
      },
      {
        id: '18002',
        checked: false,
        label: 'Ports America Group, Inc.',
        color: '#FFB399',
        placements: [{ id: 12149, label: 'Foo' }],
      },
    ];

    // act
    const response = filterAccounts(placementIds, allAccounts, existingFilteredAccounts);

    // assert
    expect(response).toEqual(expectedResponse);
  });
});

describe('groupAccounts', () => {
  it('should group placements by account, and apply map attributes', () => {
    // arrange
    const departments = [
      { id: 3, name: 'Baz' },
      { id: 4, name: 'Bar' },
      { id: 21, name: 'Foo' },
    ];

    const placements = [
      {
        id: 1733,
        departmentId: 3,
        insureds: [{ id: 7873, name: 'Foo' }],
      },
      {
        id: 1734,
        departmentId: 4,
        insureds: [{ id: 7873, name: 'Foo' }],
      },
      {
        id: 1736,
        departmentId: 21,
        insureds: [{ id: 7873, name: 'Foo' }],
      },
      {
        id: 12149,
        departmentId: 21,
        insureds: [{ id: 18002, name: 'Baz' }],
      },
      {
        id: 1735,
        departmentId: 3,
        insureds: [{ id: 7873, name: 'Foo' }],
      },
    ];
    const expectedResponse = [
      {
        id: '7873',
        checked: true,
        label: 'Foo',
        color: '#f418db',
        placements: [
          {
            id: 1733,
            label: 'Baz',
            departmentId: 3,
          },
          {
            id: 1734,
            label: 'Bar',
            departmentId: 4,
          },
          {
            id: 1736,
            label: 'Foo',
            departmentId: 21,
          },
          {
            id: 1735,
            label: 'Baz',
            departmentId: 3,
          },
        ],
      },
      {
        id: '18002',
        checked: true,
        label: 'Baz',
        color: '#044e87',
        placements: [
          {
            id: 12149,
            label: 'Foo',
            departmentId: 21,
          },
        ],
      },
    ];

    // act
    const response = groupAccounts(placements, departments);

    // assert
    expect(response).toEqual(expectedResponse);
  });
});

describe('addMapData', () => {
  it('should return locations with grouped account data', () => {
    // arrange
    const locations = [
      {
        lng: -97,
        lat: 35,
        count: 10,
        tivTotal: 950898772,
        address: 'United States',
        placements: [
          {
            placementId: 16431,
            tiv: 109623739,
          },
          {
            placementId: 1733,
            tiv: 189623739,
          },
          {
            placementId: 1734,
            tiv: 229623739,
          },
          {
            placementId: 1736,
            tiv: 329623739,
          },
          {
            placementId: 1735,
            tiv: 169623739,
          },
          {
            placementId: 1732,
            tiv: 149623739,
          },
          {
            placementId: 16430,
            tiv: 159623739,
          },
          {
            placementId: 16428,
            tiv: 429623739,
          },
          {
            placementId: 12149,
            tiv: 629623739,
          },
          {
            placementId: 11554,
            tiv: 199623739,
          },
          {
            placementId: 16429,
            tiv: 179623739,
          },
        ],
      },
    ];
    const departmentIds = [3, 21];
    const filteredAccounts = [
      {
        id: '39341',
        checked: true,
        label: 'And Another Load Of Properties',
        color: '#3366E6',
        placements: [
          {
            id: 16431,
            label: 'Foo',
            departmentId: 3,
          },
        ],
      },
      {
        id: '7873',
        checked: true,
        label: 'First Hawaiian Bank',
        color: '#f44336',
        placements: [
          {
            id: 1734,
            label: 'Bar',
            departmentId: 4,
          },
          {
            id: 1736,
            label: 'Foo',
            departmentId: 3,
          },
        ],
      },
      {
        id: '39340',
        checked: true,
        label: 'New York Residential',
        color: '#E6B333',
        placements: [
          {
            id: 16430,
            label: 'Baz',
            departmentId: 21,
          },
        ],
      },
    ];
    const expectedResponse = [
      {
        lng: -97,
        lat: 35,
        locationsFound: 10,
        tivTotal: 598871217,
        address: 'United States',
        accounts: [
          {
            color: '#f44336',
            id: '7873',
            label: 'First Hawaiian Bank',
            placements: [
              {
                id: 1736,
                label: 'Foo',
                amount: 329623739,
                departmentId: 3,
              },
            ],
          },
          {
            color: '#E6B333',
            label: 'New York Residential',
            id: '39340',
            placements: [
              {
                amount: 159623739,
                id: 16430,
                label: 'Baz',
                departmentId: 21,
              },
            ],
          },
          {
            color: '#3366E6',
            label: 'And Another Load Of Properties',
            id: '39341',
            placements: [
              {
                amount: 109623739,
                id: 16431,
                label: 'Foo',
                departmentId: 3,
              },
            ],
          },
        ],
        properties: {
          data: [329623739, 159623739, 109623739],
          backgroundColor: ['#f44336', '#E6B333', '#3366E6'],
        },
      },
    ];

    // act
    const response = addMapData(locations, filteredAccounts, departmentIds);

    // assert
    expect(response).toEqual(expectedResponse);
  });
});

describe('hydratePlacements', () => {
  it('should return placements with account data', () => {
    // arrange
    const filteredPlacements = [
      {
        placementId: 16431,
        tiv: 109623739,
      },
      {
        placementId: 1736,
        tiv: 329623739,
      },
      {
        placementId: 16430,
        tiv: 159623739,
      },
      {
        placementId: 16428,
        tiv: 429623739,
      },
      {
        placementId: 12149,
        tiv: 629623739,
      },
      {
        placementId: 16429,
        tiv: 179623739,
      },
    ];
    const filteredAccounts = [
      {
        id: '39341',
        checked: true,
        label: 'And Another Load Of Properties',
        color: '#3366E6',
        placements: [
          {
            id: 16431,
            label: 'and another',
          },
        ],
      },
      {
        id: '7873',
        checked: true,
        label: 'First Hawaiian Bank',
        color: '#f44336',
        placements: [
          {
            id: 1736,
            label: 'Foo',
          },
        ],
      },
      {
        id: '39340',
        checked: true,
        label: 'New York Residential',
        color: '#E6B333',
        placements: [
          {
            id: 16430,
            label: 'NY',
          },
        ],
      },
      {
        id: '39338',
        checked: true,
        label: 'Pacific Portfolio Hotel Group',
        color: '#00B3E6',
        placements: [
          {
            id: 16428,
            label: 'Portfolio Test',
          },
        ],
      },
      {
        id: '18002',
        checked: true,
        label: 'Ports America Group, Inc.',
        color: '#FFB399',
        placements: [
          {
            id: 12149,
            label: 'Foo',
          },
        ],
      },
      {
        id: '39339',
        checked: true,
        label: 'Some Other Foo Account',
        color: '#E6331A',
        placements: [
          {
            id: 16429,
            label: 'PortfolioMap Teat',
          },
        ],
      },
    ];
    const expectedResponse = [
      {
        color: '#3366E6',
        id: '39341',
        label: 'And Another Load Of Properties',
        placement: {
          id: 16431,
          label: 'and another',
          amount: 109623739,
        },
      },
      {
        color: '#f44336',
        id: '7873',
        label: 'First Hawaiian Bank',
        placement: {
          id: 1736,
          label: 'Foo',
          amount: 329623739,
        },
      },
      {
        color: '#E6B333',
        id: '39340',
        label: 'New York Residential',
        placement: {
          id: 16430,
          label: 'NY',
          amount: 159623739,
        },
      },
      {
        color: '#00B3E6',
        id: '39338',
        label: 'Pacific Portfolio Hotel Group',
        placement: {
          id: 16428,
          label: 'Portfolio Test',
          amount: 429623739,
        },
      },
      {
        color: '#FFB399',
        id: '18002',
        label: 'Ports America Group, Inc.',
        placement: {
          id: 12149,
          label: 'Foo',
          amount: 629623739,
        },
      },
      {
        color: '#E6331A',
        id: '39339',
        label: 'Some Other Foo Account',
        placement: {
          id: 16429,
          label: 'PortfolioMap Teat',
          amount: 179623739,
        },
      },
    ];

    // act
    const response = hydratePlacements(filteredPlacements, filteredAccounts);

    // assert
    expect(response).toEqual(expectedResponse);
  });
});

describe('hydrateAccounts', () => {
  it('should return accounts with tiv data', () => {
    // arrange
    const placements = [
      {
        placementId: 16431,
        tiv: 109623739,
      },
      {
        placementId: 1736,
        tiv: 329623739,
      },
      {
        placementId: 16430,
        tiv: 159623739,
      },
      {
        placementId: 16428,
        tiv: 429623739,
      },
      {
        placementId: 12149,
        tiv: 629623739,
      },
    ];
    const filteredAccounts = [
      {
        id: '39341',
        checked: true,
        label: 'And Another Load Of Properties',
        color: '#3366E6',
        placements: [
          {
            id: 16431,
            label: 'and another',
          },
        ],
      },
      {
        id: '7873',
        checked: true,
        label: 'First Hawaiian Bank',
        color: '#f44336',
        placements: [
          {
            id: 1736,
            label: 'Foo',
          },
        ],
      },
      {
        id: '39340',
        checked: true,
        label: 'New York Residential',
        color: '#E6B333',
        placements: [
          {
            id: 16430,
            label: 'NY',
          },
        ],
      },
      {
        id: '39338',
        checked: true,
        label: 'Pacific Portfolio Hotel Group',
        color: '#00B3E6',
        placements: [
          {
            id: 16428,
            label: 'Portfolio Test',
          },
        ],
      },
      {
        id: '18002',
        checked: true,
        label: 'Ports America Group, Inc.',
        color: '#FFB399',
        placements: [
          {
            id: 12149,
            label: 'Foo',
          },
        ],
      },
      {
        id: '39339',
        checked: true,
        label: 'Some Other Foo Account',
        color: '#E6331A',
        placements: [
          {
            id: 16429,
            label: 'PortfolioMap Teat',
          },
        ],
      },
    ];
    const expectedResponse = [
      {
        color: '#f44336',
        id: '7873',
        label: 'First Hawaiian Bank',
        placements: [
          {
            id: 1736,
            label: 'Foo',
            amount: 329623739,
          },
        ],
      },
      {
        color: '#FFB399',
        id: '18002',
        label: 'Ports America Group, Inc.',
        placements: [
          {
            id: 12149,
            label: 'Foo',
            amount: 629623739,
          },
        ],
      },
      {
        color: '#00B3E6',
        id: '39338',
        label: 'Pacific Portfolio Hotel Group',
        placements: [
          {
            id: 16428,
            label: 'Portfolio Test',
            amount: 429623739,
          },
        ],
      },
      {
        color: '#E6B333',
        id: '39340',
        label: 'New York Residential',
        placements: [
          {
            id: 16430,
            label: 'NY',
            amount: 159623739,
          },
        ],
      },
      {
        color: '#3366E6',
        id: '39341',
        label: 'And Another Load Of Properties',
        placements: [
          {
            id: 16431,
            label: 'and another',
            amount: 109623739,
          },
        ],
      },
    ];

    // act
    const response = hydrateAccounts(placements, filteredAccounts);

    // assert
    expect(response).toEqual(expectedResponse);
  });
});

describe('getEarliestInceptionDate', () => {
  it('should return earliest inception date', () => {
    expect(
      getEarliestInceptionDate({
        policies: [
          { inceptionDate: '2019-10-01' },
          { inceptionDate: '2018-10-10' },
          { inceptionDate: '2018-10-01' },
          { inceptionDate: '2018-12-01' },
        ],
      })
    ).toEqual('2018-10-01');
    expect(getEarliestInceptionDate({ policies: [{ inceptionDate: null }, { inceptionDate: '2019-10-01' }] })).toEqual('2019-10-01');
    expect(getEarliestInceptionDate({ policies: [{ inceptionDate: null }] })).toEqual(null);
    expect(getEarliestInceptionDate({ policies: [] })).toEqual(null);
  });
});

describe('getLatestExpiryDate', () => {
  it('should return latest expiry date', () => {
    expect(
      getLatestExpiryDate({
        policies: [{ expiryDate: '2017-10-01' }, { expiryDate: '2018-10-10' }, { expiryDate: '2018-10-01' }, { expiryDate: '2018-02-01' }],
      })
    ).toEqual('2018-10-10');
    expect(getLatestExpiryDate({ policies: [{ expiryDate: null }, { expiryDate: '2019-10-01' }] })).toEqual('2019-10-01');
    expect(getLatestExpiryDate({ policies: [{ expiryDate: null }] })).toEqual(null);
    expect(getLatestExpiryDate({ policies: [] })).toEqual(null);
  });
});

describe('getWithValidDate', () => {
  it('should return placement if current date is between inception and expiry', () => {
    expect(getWithValidDate({ policies: [{ inceptionDate: '2019-10-09', expiryDate: '2019-11-10' }] })).toBeTruthy();
    expect(getWithValidDate({ policies: [{ inceptionDate: '2019-10-10', expiryDate: '2019-11-10' }] })).toBeTruthy();
    expect(getWithValidDate({ policies: [{ inceptionDate: '2019-10-11', expiryDate: '2019-11-10' }] })).toBeFalsy();
    expect(getWithValidDate({ policies: [{ inceptionDate: '2019-09-10', expiryDate: '2019-10-11' }] })).toBeTruthy();
    expect(getWithValidDate({ policies: [{ inceptionDate: '2019-09-10', expiryDate: '2019-10-10' }] })).toBeFalsy();
    expect(getWithValidDate({ policies: [{ inceptionDate: null, expiryDate: '2019-10-10' }] })).toBeFalsy();
    expect(getWithValidDate({ policies: [{ inceptionDate: null, expiryDate: '2019-10-11' }] })).toBeTruthy();
    expect(getWithValidDate({ policies: [{ inceptionDate: '2019-10-10', expiryDate: null }] })).toBeTruthy();
    expect(getWithValidDate({ policies: [{ inceptionDate: '2019-10-11', expiryDate: null }] })).toBeFalsy();
    expect(getWithValidDate({ policies: [{ inceptionDate: null, expiryDate: null }] })).toBeTruthy();
    expect(getWithValidDate({ policies: [] })).toBeFalsy();
  });
});

describe('getFilteredPlacements', () => {
  it('should return filtered list of plaements', () => {
    expect(
      getFilteredPlacements([{ departmentId: 7, policies: [{ inceptionDate: '2019-10-09', expiryDate: '2019-11-10' }] }])
    ).toHaveLength(1);
    expect(
      getFilteredPlacements([{ departmentId: 6, policies: [{ inceptionDate: '2019-10-09', expiryDate: '2019-11-10' }] }])
    ).toHaveLength(0);
    expect(getFilteredPlacements([{ departmentId: 7, policies: [{ inceptionDate: null, expiryDate: '2019-10-10' }] }])).toHaveLength(0);
    expect(getFilteredPlacements([{ departmentId: 7, policies: [{ inceptionDate: '2019-10-10', expiryDate: null }] }])).toHaveLength(1);
    expect(getFilteredPlacements([{ departmentId: 7, policies: [{ inceptionDate: null, expiryDate: null }] }])).toHaveLength(1);
    expect(getFilteredPlacements([{ departmentId: 7, policies: [] }])).toHaveLength(0);
  });
});
