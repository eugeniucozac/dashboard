import reducer from './referenceData.reducers';

jest.mock('../../utils/i18n/i18n');

describe('STORES › REDUCERS › referenceData', () => {
  const initialState = {
    businessTypes: [],
    capacityTypes: [],
    clients: [],
    countries: [],
    currencies: [],
    departments: [],
    insureds: [],
    markets: [],
    offices: [],
    statuses: {
      account: [],
      placement: [],
      policy: [],
      policyMarketQuote: [],
    },
    underwriters: [],
    xbInstances: [],
    documentTypes: [],
    documentTypeLookUp: [],
    businessProcesses: [],
    processTypes: [],
    rfiTypes: [],
    currencyCodes: [],
    bpmFlags: [],
    bpmStages: [],
    marketTypes: [],
    queryCodes: [],
    loaded: false,
    resolutionCode: [],
    countriesList: [],
    catCodes: [],
    thirdParty: [],
    warrantyTypes: [],
    settlementCurrency: [],
    baseCurrency: [],
  };

  const getData = {
    departments: [
      {
        id: 1,
        name: 'one',
        businessTypes: [
          { id: 3, description: 'three' },
          { id: 4, description: 'four' },
        ],
      },
      {
        id: 2,
        name: 'two',
        businessTypes: [{ id: 5, description: 'five' }],
      },
    ],
    countries: [
      { id: 100, codeAlpha2: 'CA', codeAlpha3: 'CAN', name: 'Canada' },
      { id: 101, codeAlpha2: 'FR', codeAlpha3: 'FRA', name: 'France' },
      { id: 102, codeAlpha2: '', codeAlpha3: 'ITA', name: 'Italy' },
      { id: 103, codeAlpha2: 'DE', codeAlpha3: '', name: 'Germany' },
      { id: 104, codeAlpha2: '', codeAlpha3: '', name: 'Spain' },
      { id: 105, codeAlpha2: 'US', codeAlpha3: 'USA', name: '' },
      { id: 106, codeAlpha2: '', codeAlpha3: '', name: '' },
    ],
    currencies: [
      { id: 8, name: 'eight' },
      { id: 9, name: 'nine' },
    ],
    placementStatuses: [
      { id: 10, code: 'ten' },
      { id: 11, code: 'eleven' },
    ],
    policyMarketQuoteStatuses: [{ id: 12, code: 'twelve' }],
    policyStatuses: [{ id: 13, code: 'thirteen' }],
  };

  it('should return the initial state', () => {
    // assert
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  describe('get', () => {
    it('should handle SUCCESS', () => {
      // arrange
      const action = {
        type: 'REFERENCE_DATA_GET_SUCCESS',
        payload: { ...getData },
      };
      const prevState = {
        ...initialState,
        departments: [{ id: 1, label: 'one' }],
        businessTypes: [{ id: 3, label: 'three' }],
        clients: [{ id: 10, label: 'ten' }],
        insureds: [{ id: 20, label: 'twenty' }],
        loaded: true,
      };
      const expectedState = {
        departments: getData.departments,
        businessTypes: [],
        currencies: getData.currencies,
        countries: [
          { id: 100, codeAlpha2: 'CA', codeAlpha3: 'CAN', name: 'Canada' },
          { id: 101, codeAlpha2: 'FR', codeAlpha3: 'FRA', name: 'France' },
        ],
        statuses: {
          placement: getData.placementStatuses,
          policy: getData.policyStatuses,
          policyMarketQuote: getData.policyMarketQuoteStatuses,
        },
        loaded: true,
      };

      // assert
      expect(reducer(initialState, action)).toEqual({ ...initialState, ...expectedState });
      expect(reducer(prevState, action)).toEqual({ ...prevState, ...expectedState });
    });
  });

  it('should handle FILTER_BUSINESSTYPES_BY_DEPTID', () => {
    // arrange
    const action = {
      type: 'REFERENCE_DATA_FILTER_BUSINESSTYPES_BY_DEPTID',
      payload: 1,
    };
    const prevState = {
      ...initialState,
      departments: [
        {
          label: 'one',
          id: 1,
          businessTypes: [
            { label: 'three', id: 3 },
            { label: 'four', id: 4 },
          ],
        },
        {
          label: 'two',
          id: 2,
          businessTypes: [
            { label: 'five', id: 5 },
            { label: 'six', id: 6 },
          ],
        },
      ],
      businessTypes: [],
      clients: [{ label: 'ten', id: 10 }],
      insureds: [{ label: 'twenty', id: 20 }],
    };
    const expectedState = {
      ...prevState,
      departments: [...prevState.departments],
      businessTypes: [
        { label: 'three', id: 3 },
        { label: 'four', id: 4 },
      ],
      clients: [...prevState.clients],
      insureds: [...prevState.insureds],
    };

    // assert
    expect(reducer(prevState, action)).toEqual(expectedState);
  });
});
