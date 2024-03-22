import {
  selectRefDataLoaded,
  selectRefDataAccountStatuses,
  selectFormattedAccountStatusList,
  selectRefDataBusinessTypes,
  selectRefDataCapacityTypes,
  selectRefDataClients,
  selectRefDataCountriesIso2,
  selectRefDataCurrencies,
  selectRefDataCurrencyById,
  selectRefDataDepartments,
  selectRefDataDepartmentBrokers,
  selectRefDataDepartmentUsers,
  selectRefDataDepartmentById,
  selectRefDataInsureds,
  selectRefDataMarkets,
  selectRefDataStatusIdByCode,
  selectRefDataStatusKeyByCode,
  selectRefDataStatusKeyById,
  selectRefDataStatusesMarketQuote,
  selectRefDataStatusesPlacement,
  selectRefDataStatusesPolicy,
  selectRefDataUnderwriters,
  selectRefDataRationales,
  selectRefDataDeclinatures,
} from 'stores';

describe('STORES › SELECTORS › referenceData', () => {
  const statusesAccount = [{ id: 1, code: 'Restricted - C' }];

  const statusesPlacement = [
    { id: 2, code: 'Enquiry' },
    { id: 3, code: 'Bound' },
  ];

  const statusesPolicy = [
    { id: 4, code: 'Firm Order' },
    { id: 5, code: 'Cancelled' },
    { id: 6, code: 'Expired' },
  ];

  const statusesMarket = [
    { id: 7, code: 'Pending' },
    { id: 8, code: 'Quoted' },
    { id: 9, code: 'Declined' },
    { id: 10, code: 'With Space' },
    { id: 11, code: 'With_Underscore' },
  ];

  it('selectRefDataLoaded', () => {
    // assert
    expect(selectRefDataLoaded({})).toBeFalsy();
    expect(selectRefDataLoaded({ referenceData: {} })).toBeFalsy();
    expect(selectRefDataLoaded({ referenceData: { loaded: false } })).toBeFalsy();
    expect(selectRefDataLoaded({ referenceData: { loaded: null } })).toBeFalsy();
    expect(selectRefDataLoaded({ referenceData: { loaded: '' } })).toBeFalsy();
    expect(selectRefDataLoaded({ referenceData: { loaded: true } })).toBeTruthy();
  });

  it('selectRefDataBusinessTypes', () => {
    // assert
    expect(selectRefDataBusinessTypes({})).toEqual([]);
    expect(selectRefDataBusinessTypes({ referenceData: {} })).toEqual([]);
    expect(selectRefDataBusinessTypes({ referenceData: { businessTypes: [{ id: 1 }] } })).toEqual([{ id: 1 }]);
  });

  it('selectRefDataCapacityTypes', () => {
    // assert
    expect(selectRefDataCapacityTypes({})).toEqual([]);
    expect(selectRefDataCapacityTypes({ referenceData: {} })).toEqual([]);
    expect(selectRefDataCapacityTypes({ referenceData: { capacityTypes: [{ id: 1 }] } })).toEqual([{ id: 1 }]);
  });

  it('selectRefDataCountriesIso2', () => {
    // arrange
    const countryList = [
      { id: 1, codeAlpha2: 'CA', codeAlpha3: 'CAN', name: 'Canada' },
      { id: 2, codeAlpha2: 'US', codeAlpha3: 'USA', name: 'United States' },
      { id: 3, codeAlpha2: 'DE', codeAlpha3: 'DEU', name: 'Germany' },
    ];

    // assert
    expect(selectRefDataCountriesIso2({})).toEqual([]);
    expect(selectRefDataCountriesIso2({ referenceData: {} })).toEqual([]);
    expect(selectRefDataCountriesIso2({ referenceData: { countries: countryList } })).toEqual([
      { value: 'CA', label: 'Canada' },
      { value: 'US', label: 'United States' },
      { value: 'DE', label: 'Germany' },
    ]);
  });

  it('selectRefDataCurrencies', () => {
    // assert
    expect(selectRefDataCurrencies({})).toEqual([]);
    expect(selectRefDataCurrencies({ referenceData: {} })).toEqual([]);
    expect(selectRefDataCurrencies({ referenceData: { currencies: [{ id: 1 }] } })).toEqual([{ id: 1 }]);
  });

  it('selectRefDataCurrencyById', () => {
    // arrange
    const currencies = [
      { id: 1, name: 'USD' },
      { id: 2, name: 'GBP' },
      { id: 3, name: 'CAD' },
      { id: 4, name: 'EUR' },
    ];

    // assert
    expect(selectRefDataCurrencyById()({})).toBeUndefined();
    expect(selectRefDataCurrencyById()({ referenceData: {} })).toBeUndefined();
    expect(selectRefDataCurrencyById()({ referenceData: { currencies: [] } })).toBeUndefined();

    expect(selectRefDataCurrencyById(1)({})).toBeUndefined();
    expect(selectRefDataCurrencyById(1)({ referenceData: {} })).toBeUndefined();
    expect(selectRefDataCurrencyById(1)({ referenceData: { currencies: [] } })).toBeUndefined();
    expect(selectRefDataCurrencyById(1)({ referenceData: { currencies } })).toEqual({ id: 1, name: 'USD' });

    expect(selectRefDataCurrencyById(2)({})).toBeUndefined();
    expect(selectRefDataCurrencyById(2)({ referenceData: {} })).toBeUndefined();
    expect(selectRefDataCurrencyById(2)({ referenceData: { currencies: [] } })).toBeUndefined();
    expect(selectRefDataCurrencyById(2)({ referenceData: { currencies } })).toEqual({ id: 2, name: 'GBP' });

    expect(selectRefDataCurrencyById(999)({})).toBeUndefined();
    expect(selectRefDataCurrencyById(999)({ referenceData: {} })).toBeUndefined();
    expect(selectRefDataCurrencyById(999)({ referenceData: { currencies: [] } })).toBeUndefined();
    expect(selectRefDataCurrencyById(999)({ referenceData: { currencies } })).toBeUndefined();
  });

  it('selectRefDataDepartments', () => {
    // assert
    expect(selectRefDataDepartments({})).toEqual([]);
    expect(selectRefDataDepartments({ referenceData: {} })).toEqual([]);
    expect(selectRefDataDepartments({ referenceData: { departments: [{ id: 1 }] } })).toEqual([{ id: 1 }]);
  });

  it('selectRefDataDepartmentById', () => {
    // arrange
    const departments = [
      { id: 1, name: 'one' },
      { id: 2, name: 'two' },
      { id: 3, name: 'three' },
      { id: 4, name: 'four' },
    ];

    // assert
    expect(selectRefDataDepartmentById()({})).toBeUndefined();
    expect(selectRefDataDepartmentById()({ referenceData: {} })).toBeUndefined();
    expect(selectRefDataDepartmentById()({ referenceData: { departments: [] } })).toBeUndefined();

    expect(selectRefDataDepartmentById(1)({})).toBeUndefined();
    expect(selectRefDataDepartmentById(1)({ referenceData: {} })).toBeUndefined();
    expect(selectRefDataDepartmentById(1)({ referenceData: { departments: [] } })).toBeUndefined();
    expect(selectRefDataDepartmentById(1)({ referenceData: { departments } })).toEqual({ id: 1, name: 'one' });

    expect(selectRefDataDepartmentById(2)({})).toBeUndefined();
    expect(selectRefDataDepartmentById(2)({ referenceData: {} })).toBeUndefined();
    expect(selectRefDataDepartmentById(2)({ referenceData: { departments: [] } })).toBeUndefined();
    expect(selectRefDataDepartmentById(2)({ referenceData: { departments } })).toEqual({ id: 2, name: 'two' });

    expect(selectRefDataDepartmentById(999)({})).toBeUndefined();
    expect(selectRefDataDepartmentById(999)({ referenceData: {} })).toBeUndefined();
    expect(selectRefDataDepartmentById(999)({ referenceData: { departments: [] } })).toBeUndefined();
    expect(selectRefDataDepartmentById(999)({ referenceData: { departments } })).toBeUndefined();
  });

  it('selectRefDataMarkets', () => {
    // assert
    expect(selectRefDataMarkets({})).toEqual([]);
    expect(selectRefDataMarkets({ referenceData: {} })).toEqual([]);
    expect(selectRefDataMarkets({ referenceData: { markets: [{ id: 1 }] } })).toEqual([{ id: 1 }]);
  });

  it('selectRefDataUnderwriters', () => {
    // assert
    expect(selectRefDataUnderwriters({})).toEqual([]);
    expect(selectRefDataUnderwriters({ referenceData: {} })).toEqual([]);
    expect(selectRefDataUnderwriters({ referenceData: { underwriters: [{ id: 1 }] } })).toEqual([{ id: 1 }]);
  });

  it('selectRefDataClients', () => {
    // assert
    expect(selectRefDataClients({})).toEqual([]);
    expect(selectRefDataClients({ referenceData: {} })).toEqual([]);
    expect(selectRefDataClients({ referenceData: { clients: [{ id: 1 }] } })).toEqual([{ id: 1 }]);
  });

  it('selectRefDataInsureds', () => {
    // assert
    expect(selectRefDataInsureds({})).toEqual([]);
    expect(selectRefDataInsureds({ referenceData: {} })).toEqual([]);
    expect(selectRefDataInsureds({ referenceData: { insureds: [{ id: 1 }] } })).toEqual([{ id: 1 }]);
  });

  it('selectRefDataDepartmentUsers', () => {
    // assert
    expect(selectRefDataDepartmentUsers({})).toEqual([]);
    expect(selectRefDataDepartmentUsers({ referenceData: {} })).toEqual([]);
    expect(selectRefDataDepartmentUsers({ referenceData: { departments: [{ id: 1, users: [{ foo: 'bar' }] }] } })).toEqual([]);
    expect(selectRefDataDepartmentUsers({ user: { departmentSelected: 2 } })).toEqual([]);
    expect(
      selectRefDataDepartmentUsers({
        user: { departmentSelected: 2 },
        referenceData: {
          departments: [
            { id: 1, users: [{ id: 12 }] },
            { id: 2, users: [{ id: 21 }] },
          ],
        },
      })
    ).toEqual([{ id: 21 }]);
  });

  it('selectRefDataDepartmentBrokers', () => {
    // assert
    expect(selectRefDataDepartmentBrokers({})).toEqual([]);
    expect(selectRefDataDepartmentBrokers({ referenceData: {} })).toEqual([]);
    expect(selectRefDataDepartmentBrokers({ referenceData: { departments: [{ id: 1, users: [{ foo: 'bar' }] }] } })).toEqual([]);
    expect(selectRefDataDepartmentBrokers({ user: { departmentSelected: 2 } })).toEqual([]);
    expect(
      selectRefDataDepartmentBrokers({
        user: { departmentSelected: 2 },
        referenceData: {
          departments: [
            { id: 1, users: [{ id: 12 }] },
            {
              id: 2,
              users: [
                { id: 21, role: 'BROKER' },
                { id: 22, role: 'COBROKER' },
              ],
            },
          ],
        },
      })
    ).toEqual([{ id: 21, role: 'BROKER' }]);
  });

  it('selectRefDataAccountStatuses', () => {
    // assert
    expect(selectRefDataAccountStatuses({})).toEqual([]);
    expect(selectRefDataAccountStatuses({ referenceData: {} })).toEqual([]);
    expect(selectRefDataAccountStatuses({ referenceData: { statuses: {} } })).toEqual([]);
    expect(selectRefDataAccountStatuses({ referenceData: { statuses: { account: statusesAccount } } })).toEqual(statusesAccount);
  });

  it('selectFormattedAccountStatusList', () => {
    // arrange
    const statusList = [
      { id: 1, code: 'Restricted - C' },
      { id: 2, code: 'Closed - T' },
      { id: 3, code: 'Live' },
    ];
    const expected = [
      { id: 3, type: 'success', code: 'live' },
      { id: 1, type: 'alert', code: 'restrictedc' },
      { id: 2, type: 'error', code: 'closedt' },
    ];

    // assert
    expect(selectFormattedAccountStatusList({ referenceData: { statuses: { account: statusList } } })).toEqual(expected);
  });

  it('selectRefDataStatusesPlacement', () => {
    // arrange
    const statuses = {
      account: statusesAccount,
      placement: statusesPlacement,
      policy: statusesPolicy,
      policyMarketQuote: statusesMarket,
    };

    // assert
    expect(selectRefDataStatusesPlacement({})).toEqual([]);
    expect(selectRefDataStatusesPlacement({ referenceData: {} })).toEqual([]);
    expect(selectRefDataStatusesPlacement({ referenceData: { statuses: {} } })).toEqual([]);
    expect(selectRefDataStatusesPlacement({ referenceData: { statuses } })).toEqual(statusesPlacement);
  });

  it('selectRefDataStatusesPolicy', () => {
    // arrange
    const statuses = {
      account: statusesAccount,
      placement: statusesPlacement,
      policy: statusesPolicy,
      policyMarketQuote: statusesMarket,
    };

    // assert
    expect(selectRefDataStatusesPolicy({})).toEqual([]);
    expect(selectRefDataStatusesPolicy({ referenceData: {} })).toEqual([]);
    expect(selectRefDataStatusesPolicy({ referenceData: { statuses: {} } })).toEqual([]);
    expect(selectRefDataStatusesPolicy({ referenceData: { statuses } })).toEqual(statusesPolicy);
  });

  it('selectRefDataStatusesMarketQuote', () => {
    // arrange
    const statuses = {
      account: statusesAccount,
      placement: statusesPlacement,
      policy: statusesPolicy,
      policyMarketQuote: statusesMarket,
    };

    // assert
    expect(selectRefDataStatusesMarketQuote({})).toEqual([]);
    expect(selectRefDataStatusesMarketQuote({ referenceData: {} })).toEqual([]);
    expect(selectRefDataStatusesMarketQuote({ referenceData: { statuses: {} } })).toEqual([]);
    expect(selectRefDataStatusesMarketQuote({ referenceData: { statuses } })).toEqual(statusesMarket);
  });

  it('selectRefDataRationales', () => {
    // arrange
    const rationales = [
      { id: 1, name: 'one' },
      { id: 2, name: 'two' },
    ];

    // assert
    expect(selectRefDataRationales({})).toEqual([]);
    expect(selectRefDataRationales({ referenceData: {} })).toEqual([]);
    expect(selectRefDataRationales({ referenceData: { rationales: [] } })).toEqual([]);
    expect(selectRefDataRationales({ referenceData: { rationales } })).toEqual(rationales);
  });

  it('selectRefDataDeclinatures', () => {
    // arrange
    const declinatures = [
      { id: 4, name: 'four' },
      { id: 5, name: 'five' },
      { id: 6, name: 'six' },
    ];

    // assert
    expect(selectRefDataDeclinatures({})).toEqual([]);
    expect(selectRefDataDeclinatures({ referenceData: {} })).toEqual([]);
    expect(selectRefDataDeclinatures({ referenceData: { declinatures: [] } })).toEqual([]);
    expect(selectRefDataDeclinatures({ referenceData: { declinatures } })).toEqual(declinatures);
  });

  it('selectRefDataStatusIdByCode', () => {
    // arrange
    const statuses = {
      account: statusesAccount,
      placement: statusesPlacement,
      policy: statusesPolicy,
      policyMarketQuote: statusesMarket,
    };

    // assert
    expect(selectRefDataStatusIdByCode()({})).toBeUndefined();
    expect(selectRefDataStatusIdByCode()({ referenceData: {} })).toBeUndefined();
    expect(selectRefDataStatusIdByCode()({ referenceData: { statuses: {} } })).toBeUndefined();

    expect(selectRefDataStatusIdByCode('placement')({})).toBeUndefined();
    expect(selectRefDataStatusIdByCode('placement')({ referenceData: {} })).toBeUndefined();
    expect(selectRefDataStatusIdByCode('placement')({ referenceData: { statuses: {} } })).toBeUndefined();
    expect(selectRefDataStatusIdByCode('placement')({ referenceData: { statuses } })).toBeUndefined();
    expect(selectRefDataStatusIdByCode('placement', 'Enquiry')({})).toBeUndefined();
    expect(selectRefDataStatusIdByCode('placement', 'Enquiry')({ referenceData: {} })).toBeUndefined();
    expect(selectRefDataStatusIdByCode('placement', 'Enquiry')({ referenceData: { statuses: {} } })).toBeUndefined();
    expect(selectRefDataStatusIdByCode('placement', 'Enquiry')({ referenceData: { statuses } })).toBe(2);

    expect(selectRefDataStatusIdByCode('policy')({})).toBeUndefined();
    expect(selectRefDataStatusIdByCode('policy')({ referenceData: {} })).toBeUndefined();
    expect(selectRefDataStatusIdByCode('policy')({ referenceData: { statuses: {} } })).toBeUndefined();
    expect(selectRefDataStatusIdByCode('policy')({ referenceData: { statuses } })).toBeUndefined();
    expect(selectRefDataStatusIdByCode('policy', 'Cancelled')({})).toBeUndefined();
    expect(selectRefDataStatusIdByCode('policy', 'Cancelled')({ referenceData: {} })).toBeUndefined();
    expect(selectRefDataStatusIdByCode('policy', 'Cancelled')({ referenceData: { statuses: {} } })).toBeUndefined();
    expect(selectRefDataStatusIdByCode('policy', 'Cancelled')({ referenceData: { statuses } })).toBe(5);

    expect(selectRefDataStatusIdByCode('market')({})).toBeUndefined();
    expect(selectRefDataStatusIdByCode('market')({ referenceData: {} })).toBeUndefined();
    expect(selectRefDataStatusIdByCode('market')({ referenceData: { statuses: {} } })).toBeUndefined();
    expect(selectRefDataStatusIdByCode('market')({ referenceData: { statuses } })).toBeUndefined();
    expect(selectRefDataStatusIdByCode('market', 'Quoted')({})).toBeUndefined();
    expect(selectRefDataStatusIdByCode('market', 'Quoted')({ referenceData: {} })).toBeUndefined();
    expect(selectRefDataStatusIdByCode('market', 'Quoted')({ referenceData: { statuses: {} } })).toBeUndefined();
    expect(selectRefDataStatusIdByCode('market', 'Quoted')({ referenceData: { statuses } })).toBe(8);

    expect(selectRefDataStatusIdByCode('foo')({})).toBeUndefined();
    expect(selectRefDataStatusIdByCode('foo')({ referenceData: {} })).toBeUndefined();
    expect(selectRefDataStatusIdByCode('foo')({ referenceData: { statuses: {} } })).toBeUndefined();
    expect(selectRefDataStatusIdByCode('foo')({ referenceData: { statuses } })).toBeUndefined();
    expect(selectRefDataStatusIdByCode('foo', 'bar')({})).toBeUndefined();
    expect(selectRefDataStatusIdByCode('foo', 'bar')({ referenceData: {} })).toBeUndefined();
    expect(selectRefDataStatusIdByCode('foo', 'bar')({ referenceData: { statuses: {} } })).toBeUndefined();
    expect(selectRefDataStatusIdByCode('foo', 'bar')({ referenceData: { statuses } })).toBeUndefined();
  });

  it('selectRefDataStatusKeyByCode', () => {
    // arrange
    const statuses = {
      account: statusesAccount,
      placement: statusesPlacement,
      policy: statusesPolicy,
      policyMarketQuote: statusesMarket,
    };

    // assert
    expect(selectRefDataStatusKeyByCode()({})).toBeUndefined();
    expect(selectRefDataStatusKeyByCode()({ referenceData: {} })).toBeUndefined();
    expect(selectRefDataStatusKeyByCode()({ referenceData: { statuses: {} } })).toBeUndefined();

    expect(selectRefDataStatusKeyByCode('placement')({})).toBeUndefined();
    expect(selectRefDataStatusKeyByCode('placement')({ referenceData: {} })).toBeUndefined();
    expect(selectRefDataStatusKeyByCode('placement')({ referenceData: { statuses: {} } })).toBeUndefined();
    expect(selectRefDataStatusKeyByCode('placement')({ referenceData: { statuses } })).toBeUndefined();
    expect(selectRefDataStatusKeyByCode('placement', 'Enquiry')({})).toBeUndefined();
    expect(selectRefDataStatusKeyByCode('placement', 'Enquiry')({ referenceData: {} })).toBeUndefined();
    expect(selectRefDataStatusKeyByCode('placement', 'Enquiry')({ referenceData: { statuses: {} } })).toBeUndefined();
    expect(selectRefDataStatusKeyByCode('placement', 'Enquiry')({ referenceData: { statuses } })).toBe('enquiry');

    expect(selectRefDataStatusKeyByCode('policy')({})).toBeUndefined();
    expect(selectRefDataStatusKeyByCode('policy')({ referenceData: {} })).toBeUndefined();
    expect(selectRefDataStatusKeyByCode('policy')({ referenceData: { statuses: {} } })).toBeUndefined();
    expect(selectRefDataStatusKeyByCode('policy')({ referenceData: { statuses } })).toBeUndefined();
    expect(selectRefDataStatusKeyByCode('policy', 'Cancelled')({})).toBeUndefined();
    expect(selectRefDataStatusKeyByCode('policy', 'Cancelled')({ referenceData: {} })).toBeUndefined();
    expect(selectRefDataStatusKeyByCode('policy', 'Cancelled')({ referenceData: { statuses: {} } })).toBeUndefined();
    expect(selectRefDataStatusKeyByCode('policy', 'Cancelled')({ referenceData: { statuses } })).toBe('cancelled');

    expect(selectRefDataStatusKeyByCode('market')({})).toBeUndefined();
    expect(selectRefDataStatusKeyByCode('market')({ referenceData: {} })).toBeUndefined();
    expect(selectRefDataStatusKeyByCode('market')({ referenceData: { statuses: {} } })).toBeUndefined();
    expect(selectRefDataStatusKeyByCode('market')({ referenceData: { statuses } })).toBeUndefined();
    expect(selectRefDataStatusKeyByCode('market', 'Quoted')({})).toBeUndefined();
    expect(selectRefDataStatusKeyByCode('market', 'Quoted')({ referenceData: {} })).toBeUndefined();
    expect(selectRefDataStatusKeyByCode('market', 'Quoted')({ referenceData: { statuses: {} } })).toBeUndefined();
    expect(selectRefDataStatusKeyByCode('market', 'Quoted')({ referenceData: { statuses } })).toBe('quoted');
    expect(selectRefDataStatusKeyByCode('market', 'With Space')({ referenceData: { statuses } })).toBe('withspace');
    expect(selectRefDataStatusKeyByCode('market', 'With_Underscore')({ referenceData: { statuses } })).toBe('withunderscore');

    expect(selectRefDataStatusKeyByCode('foo')({})).toBeUndefined();
    expect(selectRefDataStatusKeyByCode('foo')({ referenceData: {} })).toBeUndefined();
    expect(selectRefDataStatusKeyByCode('foo')({ referenceData: { statuses: {} } })).toBeUndefined();
    expect(selectRefDataStatusKeyByCode('foo')({ referenceData: { statuses } })).toBeUndefined();
    expect(selectRefDataStatusKeyByCode('foo', 'bar')({})).toBeUndefined();
    expect(selectRefDataStatusKeyByCode('foo', 'bar')({ referenceData: {} })).toBeUndefined();
    expect(selectRefDataStatusKeyByCode('foo', 'bar')({ referenceData: { statuses: {} } })).toBeUndefined();
    expect(selectRefDataStatusKeyByCode('foo', 'bar')({ referenceData: { statuses } })).toBeUndefined();
  });

  it('selectRefDataStatusKeyById', () => {
    // arrange
    const statuses = {
      account: statusesAccount,
      placement: statusesPlacement,
      policy: statusesPolicy,
      policyMarketQuote: statusesMarket,
    };

    // assert
    expect(selectRefDataStatusKeyById()({})).toBeUndefined();
    expect(selectRefDataStatusKeyById()({ referenceData: {} })).toBeUndefined();
    expect(selectRefDataStatusKeyById()({ referenceData: { statuses: {} } })).toBeUndefined();

    expect(selectRefDataStatusKeyById('placement')({})).toBeUndefined();
    expect(selectRefDataStatusKeyById('placement')({ referenceData: {} })).toBeUndefined();
    expect(selectRefDataStatusKeyById('placement')({ referenceData: { statuses: {} } })).toBeUndefined();
    expect(selectRefDataStatusKeyById('placement')({ referenceData: { statuses } })).toBeUndefined();
    expect(selectRefDataStatusKeyById('placement', 2)({})).toBeUndefined();
    expect(selectRefDataStatusKeyById('placement', 2)({ referenceData: {} })).toBeUndefined();
    expect(selectRefDataStatusKeyById('placement', 2)({ referenceData: { statuses: {} } })).toBeUndefined();
    expect(selectRefDataStatusKeyById('placement', 2)({ referenceData: { statuses } })).toBe('enquiry');

    expect(selectRefDataStatusKeyById('policy')({})).toBeUndefined();
    expect(selectRefDataStatusKeyById('policy')({ referenceData: {} })).toBeUndefined();
    expect(selectRefDataStatusKeyById('policy')({ referenceData: { statuses: {} } })).toBeUndefined();
    expect(selectRefDataStatusKeyById('policy')({ referenceData: { statuses } })).toBeUndefined();
    expect(selectRefDataStatusKeyById('policy', 5)({})).toBeUndefined();
    expect(selectRefDataStatusKeyById('policy', 5)({ referenceData: {} })).toBeUndefined();
    expect(selectRefDataStatusKeyById('policy', 5)({ referenceData: { statuses: {} } })).toBeUndefined();
    expect(selectRefDataStatusKeyById('policy', 5)({ referenceData: { statuses } })).toBe('cancelled');

    expect(selectRefDataStatusKeyById('market')({})).toBeUndefined();
    expect(selectRefDataStatusKeyById('market')({ referenceData: {} })).toBeUndefined();
    expect(selectRefDataStatusKeyById('market')({ referenceData: { statuses: {} } })).toBeUndefined();
    expect(selectRefDataStatusKeyById('market')({ referenceData: { statuses } })).toBeUndefined();
    expect(selectRefDataStatusKeyById('market', 8)({})).toBeUndefined();
    expect(selectRefDataStatusKeyById('market', 8)({ referenceData: {} })).toBeUndefined();
    expect(selectRefDataStatusKeyById('market', 8)({ referenceData: { statuses: {} } })).toBeUndefined();
    expect(selectRefDataStatusKeyById('market', 8)({ referenceData: { statuses } })).toBe('quoted');

    expect(selectRefDataStatusKeyById('foo')({})).toBeUndefined();
    expect(selectRefDataStatusKeyById('foo')({ referenceData: {} })).toBeUndefined();
    expect(selectRefDataStatusKeyById('foo')({ referenceData: { statuses: {} } })).toBeUndefined();
    expect(selectRefDataStatusKeyById('foo')({ referenceData: { statuses } })).toBeUndefined();
    expect(selectRefDataStatusKeyById('foo', 1)({})).toBeUndefined();
    expect(selectRefDataStatusKeyById('foo', 2)({ referenceData: {} })).toBeUndefined();
    expect(selectRefDataStatusKeyById('foo', 3)({ referenceData: { statuses: {} } })).toBeUndefined();
    expect(selectRefDataStatusKeyById('foo', 4)({ referenceData: { statuses } })).toBeUndefined();
  });
});
