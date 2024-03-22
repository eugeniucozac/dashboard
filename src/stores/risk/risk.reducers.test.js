import merge from 'lodash/merge';
import reducer from './risk.reducers';

describe('STORES › REDUCER › risk', () => {
  const list = {
    items: [],
    itemsTotal: 0,
    loading: false,
    page: 1,
    pageSize: 10,
    pageTotal: 0,
    query: '',
    sortBy: 'id',
    sortType: 'numeric',
    sortDirection: 'desc',
  };
  const draftList = {
    items: [],
    itemsTotal: 0,
    loading: false,
    page: 1,
    pageSize: 10,
    pageTotal: 0,
    query: '',
    sortBy: 'id',
    sortType: 'numeric',
    sortDirection: 'desc',
  };

  const initialState = {
    list: {
      ...list,
    },
    draftList: {
      ...draftList,
    },
    products: {
      items: [],
      selected: '',
      loading: false,
    },
    productsWithReports: {
      items: [],
      loading: false,
    },
    facilities: {
      list: {
        ...list,
        sortBy: 'name',
        sortType: 'lexical',
        sortDirection: 'asc',
      },
      selected: {},
      loading: false,
      ratesLoaded: {},
      limitsLoaded: {},
    },
    definitions: {
      loading: false,
    },
    countries: {
      items: [],
      loading: false,
    },
    limits: {
      items: [],
      aggregateLimits: [],
      loading: false,
    },
    quotes: {
      items: [],
      loading: false,
    },
    selected: {
      loading: false,
    },
    download: {
      started: false,
      finished: true,
      status: null,
    },
    preBindDefinitions: {
      fields: {},
      loading: false,
    },
    coverages: {
      loading: false,
    },
    coverageDefinitions: {
      loading: false,
    },
  };

  const previousState = {
    list: {
      loading: false,
      items: [
        { id: 1, name: 'risk1', riskStatus: 'PENDING', inceptionDate: '2020-01-01', expiryDate: '2020-01-31' },
        { id: 2, name: 'risk2', riskStatus: 'DECLINED', inceptionDate: '2020-02-01', expiryDate: '2020-02-28' },
      ],
      itemsTotal: 1,
    },
    products: {
      items: [1, 2],
      selected: 'something',
      loading: false,
    },
    productsWithReports: {
      items: [],
      loading: false,
    },
    definitions: {
      BAR: {
        fields: ['ford', 'bmw', 'ferrari'],
      },
      loading: false,
    },
    facilities: {
      list: {
        items: [{ id: 1 }, { id: 2, rates: { id: 222, foo: 'bar' } }, { id: 3 }],
        itemsTotal: 2,
        page: 1,
        pageSize: 10,
        pageTotal: 1,
        query: '',
        sortBy: 'name',
        sortType: 'text',
        sortDirection: 'asc',
      },
      selected: { id: 1 },
      loading: false,
    },
    countries: {
      items: [
        { value: 'CA', label: 'Canada' },
        { value: 'MX', label: 'Mexico' },
        { value: 'US', label: 'United States' },
      ],
      loading: false,
    },
    limits: {
      items: [],
      aggregateLimits: [
        {
          fieldName: 'limitState',
          label: 'State',
          qualifier: 'com.priceforbes.edge.programmes.model.products.windhail.USState',
          valueLimits: [
            { fieldValue: 'ALABAMA', facilityLimit: 10000000, boundQuotesLimit: 1262998, alertRate: 80, label: 'Alabama' },
            { fieldValue: 'ALASKA', facilityLimit: 10000000, boundQuotesLimit: 1534694, alertRate: 80, label: 'Alaska' },
          ],
        },
        {
          fieldName: 'limitCountry',
          label: 'Country',
          qualifier: 'com.priceforbes.edge.programmes.model.products.windhail.USState',
          valueLimits: [
            { alertRate: 10, boundQuotesLimit: 167173, facilityLimit: 200000, fieldValue: 'UK', label: 'United Kingdom' },
            { alertRate: 50, boundQuotesLimit: 200000, facilityLimit: 6000000, fieldValue: 'US', label: 'United State' },
          ],
        },
      ],
      loading: false,
    },
    quotes: {
      items: [
        { id: 1, name: 'quote1', riskId: 1, premium: 1000, status: 'EXPIRED' },
        { id: 2, name: 'quote2', riskId: 2, premium: 2000, status: 'PENDING' },
      ],
      loading: false,
    },
    selected: {
      id: 1,
      name: 'risk1',
      riskStatus: 'PENDING',
      inceptionDate: '2020-01-01',
      expiryDate: '2020-01-31',
      loading: false,
    },
    limits: {
      items: [
        {
          name: 'countryLimit',
          type: 'SELECT',
          indicative: false,
          group: 'LIMIT_APPLICABLE',
          label: 'Country',
          qualifier: 'com.priceforbes.edge.programmes.model.products.windhail.USCountry',
          options: [
            {
              label: 'United Kingdom',
              value: 'UK',
            },
            {
              label: 'United States',
              value: 'US',
            },
          ],
          validation: {},
        },
      ],
      loading: false,
    },
  };

  const previousStateLoading = merge({}, previousState, {
    products: { loading: true },
    definitions: { loading: true },
    countries: { loading: true },
    limits: { loading: true },
  });

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  describe('risk', () => {
    describe('post', () => {
      it('should handle RISK_POST_SUCCESS', () => {
        // arrange
        const action = { type: 'RISK_POST_SUCCESS', payload: { id: 3, name: 'risk3' } };

        // assert
        expect(reducer(initialState, action)).toEqual({
          ...initialState,
          list: {
            ...initialState.list,
            items: [{ id: 3, name: 'risk3' }],
            itemsTotal: 1,
          },
          selected: {
            id: 3,
            name: 'risk3',
            loading: false,
          },
        });

        expect(reducer(previousState, action)).toEqual({
          ...previousState,
          list: {
            ...previousState.list,
            items: [
              { id: 3, name: 'risk3' },
              { id: 1, name: 'risk1', riskStatus: 'PENDING', inceptionDate: '2020-01-01', expiryDate: '2020-01-31' },
              { id: 2, name: 'risk2', riskStatus: 'DECLINED', inceptionDate: '2020-02-01', expiryDate: '2020-02-28' },
            ],

            itemsTotal: 2,
          },
          selected: {
            id: 3,
            name: 'risk3',
            loading: false,
          },
        });
      });
    });

    describe('other', () => {
      it('should handle RISK_SELECTED_SET', () => {
        // arrange
        const action = { type: 'RISK_SELECTED_SET', payload: { id: 1, foo: 'bar' } };

        // assert
        expect(reducer(initialState, action)).toEqual({ ...initialState, selected: { id: 1, foo: 'bar', loading: false } });

        expect(reducer(previousState, action)).toEqual({ ...previousState, selected: { id: 1, foo: 'bar', loading: false } });
      });

      it('should handle RISK_SELECTED_RESET', () => {
        // arrange
        const action = { type: 'RISK_SELECTED_RESET' };

        // assert
        expect(reducer(initialState, action)).toEqual({ ...initialState, selected: {} });

        expect(reducer(previousState, action)).toEqual({ ...previousState, selected: {} });
      });
    });
  });

  describe('risk list', () => {
    describe('get', () => {
      it('should handle RISK_LIST_GET_SUCCESS', () => {
        // arrange
        const action = {
          type: 'RISK_LIST_GET_SUCCESS',
          payload: {
            content: [{ id: 1, name: 'foo' }],
            pagination: {
              totalElements: 25,
              page: 2,
              size: 10,
              totalPages: 3,
              query: 'foobar',
            },
          },
        };

        // assert
        expect(reducer(initialState, action)).toEqual({
          ...initialState,
          list: {
            items: [{ id: 1, name: 'foo' }],
            itemsTotal: 25,
            loading: false,
            page: 2,
            pageSize: 10,
            pageTotal: 3,
            query: 'foobar',
            sortBy: 'id',
            sortType: 'numeric',
            sortDirection: 'desc',
          },
        });

        expect(reducer(previousState, action)).toEqual({
          ...previousState,
          list: {
            items: [{ id: 1, name: 'foo' }],
            itemsTotal: 25,
            loading: false,
            page: 2,
            pageSize: 10,
            pageTotal: 3,
            query: 'foobar',
          },
        });
      });

      it('should handle RISK_LIST_GET_FAILURE', () => {
        // arrange
        const action = { type: 'RISK_LIST_GET_FAILURE' };

        // assert
        expect(reducer(initialState, action)).toEqual(initialState);

        expect(reducer(previousState, action)).toEqual({
          ...previousState,
          list: {
            ...initialState.list,
          },
        });
      });
    });
  });

  describe('details', () => {
    describe('get', () => {
      it('should handle RISK_DETAILS_GET_REQUEST', () => {
        // arrange
        const action = { type: 'RISK_DETAILS_GET_REQUEST', payload: 123 };

        // assert
        expect(reducer(initialState, action)).toEqual({
          ...initialState,
          selected: {
            ...initialState.selected,
            loading: true,
          },
        });

        expect(reducer(previousState, action)).toEqual({
          ...previousState,
          selected: {
            ...previousState.selected,
            loading: true,
          },
        });
      });

      it('should handle RISK_DETAILS_GET_SUCCESS', () => {
        // arrange
        const action = { type: 'RISK_DETAILS_GET_SUCCESS', payload: { id: 123, name: 'risk134' } };

        // assert
        expect(reducer(initialState, action)).toEqual({
          ...initialState,
          selected: {
            ...action.payload,
            loading: false,
          },
        });

        expect(reducer(previousState, action)).toEqual({
          ...previousState,
          selected: {
            ...action.payload,
            loading: false,
          },
        });
      });

      it('should handle RISK_DETAILS_GET_FAILURE', () => {
        // arrange
        const action = { type: 'RISK_DETAILS_GET_FAILURE', payload: { msg: 'error' } };

        // assert
        expect(reducer(initialState, action)).toEqual(initialState);

        expect(reducer(previousState, action)).toEqual({
          ...previousState,
          selected: {
            loading: false,
          },
        });
      });
    });
  });

  describe('products', () => {
    describe('get', () => {
      it('should handle RISK_PRODUCTS_GET_REQUEST', () => {
        // arrange
        const action = { type: 'RISK_PRODUCTS_GET_REQUEST' };

        // assert
        expect(reducer(initialState, action)).toEqual({ ...initialState, products: { ...initialState.products, loading: true } });

        expect(reducer(previousState, action)).toEqual({ ...previousState, products: { ...previousState.products, loading: true } });
      });

      it('should handle RISK_PRODUCTS_GET_SUCCESS', () => {
        // arrange
        const action = {
          type: 'RISK_PRODUCTS_GET_SUCCESS',
          payload: [
            { id: 1, name: 'foo' },
            { id: 2, name: 'bar' },
          ],
        };

        // assert
        expect(reducer(initialState, action)).toEqual({
          ...initialState,
          products: { ...initialState.products, items: action.payload, loading: false },
        });

        expect(reducer(previousState, action)).toEqual({
          ...previousState,
          products: { ...previousState.products, items: action.payload, loading: false },
        });
      });

      it('should handle RISK_PRODUCTS_GET_FAILURE', () => {
        // arrange
        const action = { type: 'RISK_PRODUCTS_GET_FAILURE' };

        // assert
        expect(reducer(initialState, action)).toEqual({ ...initialState });

        expect(reducer(previousState, action)).toEqual({ ...previousState, products: initialState.products });
      });
    });

    describe('get products list with report', () => {
      it('should handle RISK_PRODUCTS_REPORTS_GET_REQUEST', () => {
        // arrange
        const action = { type: 'RISK_PRODUCTS_REPORTS_GET_REQUEST' };

        // assert
        expect(reducer(initialState, action)).toEqual({
          ...initialState,
          productsWithReports: { ...initialState.productsWithReports, loading: true },
        });

        expect(reducer(previousState, action)).toEqual({
          ...previousState,
          productsWithReports: { ...previousState.productsWithReports, loading: true },
        });
      });

      it('should handle RISK_PRODUCTS_REPORTS_GET_SUCCESS', () => {
        // arrange
        const action = {
          type: 'RISK_PRODUCTS_REPORTS_GET_SUCCESS',
          payload: [
            { id: 1, name: 'foo' },
            { id: 2, name: 'bar' },
          ],
        };

        // assert
        expect(reducer(initialState, action)).toEqual({
          ...initialState,
          productsWithReports: { ...initialState.productsWithReports, items: action.payload, loading: false },
        });

        expect(reducer(previousState, action)).toEqual({
          ...previousState,
          productsWithReports: { ...previousState.productsWithReports, items: action.payload, loading: false },
        });
      });

      it('should handle RISK_PRODUCTS_REPORTS_GET_FAILURE', () => {
        // arrange
        const action = { type: 'RISK_PRODUCTS_REPORTS_GET_FAILURE' };

        // assert
        expect(reducer(initialState, action)).toEqual({ ...initialState });

        expect(reducer(previousState, action)).toEqual({ ...previousState, productsWithReports: initialState.productsWithReports });
      });
    });

    describe('other', () => {
      it('should handle RISK_PRODUCTS_SELECT', () => {
        // arrange
        const action = { type: 'RISK_PRODUCTS_SELECT', payload: 'foo' };

        // assert
        expect(reducer(initialState, action)).toEqual({
          ...initialState,
          products: {
            ...initialState.products,
            selected: 'foo',
          },
        });

        expect(reducer(previousState, action)).toEqual({
          ...previousState,
          products: {
            ...previousState.products,
            selected: 'foo',
          },
        });
      });

      it('should handle RISK_PRODUCTS_RESET', () => {
        // arrange
        const action = { type: 'RISK_PRODUCTS_RESET' };

        // assert
        expect(reducer(initialState, action)).toEqual({
          ...initialState,
          products: {
            ...initialState.products,
          },
        });

        expect(reducer(previousState, action)).toEqual({
          ...previousState,
          products: {
            ...previousState.products,
            selected: initialState.products.selected,
          },
        });
      });
    });
  });

  describe('definitions', () => {
    describe('get', () => {
      it('should handle RISK_DEFINITIONS_GET_REQUEST', () => {
        // arrange
        const action = { type: 'RISK_DEFINITIONS_GET_REQUEST', payload: 'apple' };

        // assert
        expect(reducer(initialState, action)).toEqual({ ...initialState, definitions: { ...initialState.definitions, loading: true } });

        expect(reducer(previousState, action)).toEqual({ ...previousState, definitions: { ...previousState.definitions, loading: true } });
      });

      it('should handle RISK_DEFINITIONS_GET_SUCCESS', () => {
        // arrange
        const action = { type: 'RISK_DEFINITIONS_GET_SUCCESS', payload: { type: 'FOO', data: { product: ['apple', 'banana'] } } };

        // assert
        expect(reducer(initialState, action)).toEqual({
          ...initialState,
          definitions: {
            ...initialState.definitions,
            FOO: {
              fields: ['apple', 'banana'],
              fieldOptions: [],
            },
            loading: false,
          },
        });

        expect(reducer(previousStateLoading, action)).toEqual({
          ...previousStateLoading,
          definitions: {
            ...previousStateLoading.definitions,
            FOO: {
              fields: ['apple', 'banana'],
              fieldOptions: [],
            },
            loading: false,
          },
        });
      });

      it('should handle RISK_DEFINITIONS_GET_FAILURE', () => {
        // arrange
        const action = { type: 'RISK_DEFINITIONS_GET_FAILURE', payload: 'error msg' };

        // assert
        expect(reducer(initialState, action)).toEqual(initialState);

        expect(reducer(previousStateLoading, action)).toEqual({ ...previousStateLoading, definitions: initialState.definitions });
      });
    });
  });

  describe('facilities', () => {
    describe('get', () => {
      it('should handle RISK_FACILITIES_GET_REQUEST', () => {
        const action = { type: 'RISK_FACILITIES_GET_REQUEST', payload: { param: 1 } };

        expect(reducer(initialState, action)).toEqual({
          ...initialState,
          facilities: {
            ...initialState.facilities,
            loading: true,
            ratesLoaded: {},
          },
        });
      });

      it('should handle RISK_FACILITIES_GET_SUCCESS', () => {
        const action = {
          type: 'RISK_FACILITIES_GET_SUCCESS',
          payload: {
            content: [{ id: 1, name: 'foo' }],
            pagination: {
              totalElements: 25,
              page: 2,
              size: 10,
              totalPages: 3,
            },
          },
        };

        expect(reducer(initialState, action)).toEqual({
          ...initialState,
          facilities: {
            list: {
              items: [{ id: 1, name: 'foo' }],
              itemsTotal: 25,
              loading: false,
              page: 2,
              pageSize: 10,
              pageTotal: 3,
              query: '',
              sortBy: 'name',
              sortType: 'lexical',
              sortDirection: 'asc',
            },
            selected: {},
            loading: false,
            ratesLoaded: {},
            limitsLoaded: {},
          },
        });
      });

      it('should handle RISK_FACILITIES_GET_FAILURE', () => {
        const action = { type: 'RISK_FACILITIES_GET_FAILURE' };
        const state = {
          ...initialState,
          facilities: {},
        };
        expect(reducer(state, action)).toEqual({
          ...initialState,
          facilities: {
            ...initialState.facilities,
            ratesLoaded: {},
          },
        });
      });
    });

    describe('post', () => {
      it('should handle RISK_FACILITIES_POST_SUCCESS', () => {
        // arrange
        const action = { type: 'RISK_FACILITIES_POST_SUCCESS', payload: { id: 123, name: 'facility123' } };

        // assert
        expect(reducer(initialState, action)).toEqual({
          ...initialState,
          facilities: {
            ...initialState.facilities,
            list: {
              ...initialState.facilities.list,
              items: [{ id: 123, name: 'facility123', __new__: true }],
              itemsTotal: 1,
            },
          },
        });

        expect(reducer(previousState, action)).toEqual({
          ...previousState,
          facilities: {
            ...previousState.facilities,
            list: {
              ...previousState.facilities.list,
              items: [{ id: 123, name: 'facility123', __new__: true }, { id: 1 }, { id: 2, rates: { id: 222, foo: 'bar' } }, { id: 3 }],
              itemsTotal: 3,
            },
          },
        });
      });
    });

    describe('other', () => {
      it('should handle RISK_FACILITIES_RESET', () => {
        // arrange
        const action = { type: 'RISK_FACILITIES_RESET' };

        // assert
        expect(reducer(initialState, action)).toEqual({
          ...initialState,
          facilities: {
            ...initialState.facilities,
          },
        });

        expect(reducer(previousState, action)).toEqual({
          ...previousState,
          facilities: {
            ...initialState.facilities,
          },
        });
      });
    });
  });

  describe('facility rates', () => {
    describe('get', () => {
      it('should handle RISK_FACILITY_RATES_GET_REQUEST', () => {
        const action = { type: 'RISK_FACILITY_RATES_GET_REQUEST', payload: 123 };

        expect(reducer(initialState, action)).toEqual({
          ...initialState,
          facilities: {
            ...initialState.facilities,
            ratesLoaded: {
              123: false,
            },
          },
        });
      });

      it('should handle RISK_FACILITY_RATES_GET_SUCCESS', () => {
        const action = { type: 'RISK_FACILITY_RATES_GET_SUCCESS', payload: { id: 222, facilityId: 2, name: 'rates222' } };

        expect(reducer(initialState, action)).toEqual({
          ...initialState,
          facilities: {
            ...initialState.facilities,
            ratesLoaded: {
              2: true,
            },
          },
        });

        expect(reducer(previousState, action)).toEqual({
          ...previousState,
          facilities: {
            ...previousState.facilities,
            list: {
              ...previousState.facilities.list,
              items: [{ id: 1 }, { id: 2, rates: action.payload }, { id: 3 }],
            },
            ratesLoaded: {
              2: true,
            },
          },
        });
      });

      it('should handle RISK_FACILITY_RATES_GET_FAILURE', () => {
        const action = {
          type: 'RISK_FACILITY_RATES_GET_FAILURE',
          payload: {
            error: 'rates error',
            facilityId: 2,
          },
        };

        expect(reducer(initialState, action)).toEqual({
          ...initialState,
          facilities: {
            ...initialState.facilities,
            ratesLoaded: {
              2: true,
            },
          },
        });

        expect(reducer(previousState, action)).toEqual({
          ...previousState,
          facilities: {
            ...previousState.facilities,
            list: {
              ...previousState.facilities.list,
              items: [{ id: 1 }, { id: 2 }, { id: 3 }],
            },
            ratesLoaded: {
              2: true,
            },
          },
        });
      });
    });

    describe('post', () => {
      it('should handle RISK_FACILITY_RATES_POST_SUCCESS', () => {
        const action = { type: 'RISK_FACILITY_RATES_POST_SUCCESS', payload: { id: 222, facilityId: 2, name: 'rates222' } };

        expect(reducer(initialState, action)).toEqual({
          ...initialState,
          facilities: {
            ...initialState.facilities,
            ratesLoaded: {
              2: true,
            },
          },
        });

        expect(reducer(previousState, action)).toEqual({
          ...previousState,
          facilities: {
            ...previousState.facilities,
            list: {
              ...previousState.facilities.list,
              items: [{ id: 1 }, { id: 2, rates: action.payload }, { id: 3 }],
            },
            ratesLoaded: {
              2: true,
            },
          },
        });
      });
    });
  });

  describe('countries', () => {
    describe('get', () => {
      it('should handle RISK_COUNTRIES_GET_REQUEST', () => {
        const action = { type: 'RISK_COUNTRIES_GET_REQUEST' };

        expect(reducer(initialState, action)).toEqual({
          ...initialState,
          countries: {
            ...initialState.countries,
            loading: true,
          },
        });
      });

      it('should handle RISK_COUNTRIES_GET_SUCCESS', () => {
        const countries = [
          { value: 'DE', label: 'Germany' },
          { value: 'FR', label: 'France' },
        ];
        const action = { type: 'RISK_COUNTRIES_GET_SUCCESS', payload: countries };

        expect(reducer(initialState, action)).toEqual({
          ...initialState,
          countries: {
            ...initialState.countries,
            items: countries,
            loading: false,
          },
        });

        expect(reducer(previousState, action)).toEqual({
          ...previousState,
          countries: {
            ...previousState.countries,
            items: countries,
            loading: false,
          },
        });
      });

      it('should handle RISK_COUNTRIES_GET_FAILURE', () => {
        const action = {
          type: 'RISK_COUNTRIES_GET_FAILURE',
          payload: {
            error: 'countries error',
          },
        };

        expect(reducer(initialState, action)).toEqual({
          ...initialState,
          countries: {
            ...initialState.countries,
            items: [],
            loading: false,
          },
        });

        expect(reducer(previousState, action)).toEqual({
          ...previousState,
          countries: {
            ...previousState.countries,
            items: [],
            loading: false,
          },
        });
      });
    });
  });

  describe('quotes', () => {
    describe('get', () => {
      it('should handle RISK_QUOTES_GET_REQUEST', () => {
        const action = { type: 'RISK_QUOTES_GET_REQUEST', payload: 123 };

        expect(reducer(initialState, action)).toEqual({
          ...initialState,
          quotes: {
            ...initialState.quotes,
            loading: true,
          },
        });
      });

      it('should handle RISK_QUOTES_GET_SUCCESS', () => {
        // arrange
        const action = { type: 'RISK_QUOTES_GET_SUCCESS', payload: { items: [{ id: 3, name: 'quote3' }], riskId: 1 } };

        // assert
        expect(reducer(initialState, action)).toEqual({
          ...initialState,
          quotes: {
            items: [{ id: 3, name: 'quote3' }],
            loading: false,
          },
        });

        expect(reducer(previousState, action)).toEqual({
          ...previousState,
          quotes: {
            ...previousState.quotes,
            items: [{ id: 3, name: 'quote3' }],
            loading: false,
          },
        });
      });

      it('should handle RISK_QUOTES_GET_FAILURE', () => {
        // arrange
        const action = { type: 'RISK_QUOTES_GET_FAILURE', payload: 'error quotes' };

        // assert
        expect(reducer(initialState, action)).toEqual(initialState);

        expect(reducer(previousState, action)).toEqual({
          ...previousState,
          quotes: initialState.quotes,
        });
      });
    });

    describe('post', () => {
      it('should handle RISK_POST_QUOTE_SUCCESS', () => {
        // arrange
        const action = { type: 'RISK_POST_QUOTE_SUCCESS', payload: { id: 3, riskId: 1, name: 'quote3', status: 'QUOTED' } };

        // assert
        expect(reducer(initialState, action)).toEqual({
          ...initialState,
          quotes: {
            ...initialState.quotes,
            items: [{ id: 3, riskId: 1, name: 'quote3', __new__: true, status: 'QUOTED' }, ...initialState.quotes.items],
            loading: false,
          },
        });

        expect(reducer(previousState, action)).toEqual({
          ...previousState,
          quotes: {
            ...previousState.quotes,
            items: [{ id: 3, riskId: 1, name: 'quote3', __new__: true, status: 'QUOTED' }, ...previousState.quotes.items],
            loading: false,
          },
        });
      });
    });
  });

  describe('quote response', () => {
    describe('post', () => {
      it('should handle RISK_POST_QUOTE_RESPONSE_SUCCESS', () => {
        // arrange
        const action = {
          type: 'RISK_POST_QUOTE_RESPONSE_SUCCESS',
          payload: {
            id: 1,
            riskId: 1,
            name: 'quote1-renamed',
            status: 'QUOTED',
            premium: 10000,
            createdAt: '2021',
            response: {
              effectiveFrom: '2020-07-28',
              effectiveTo: '2021-07-28',
              responseStatus: 'BOUND',
              userId: '123456',
            },
          },
        };

        // assert
        expect(reducer(initialState, action)).toEqual({
          ...initialState,
          quotes: {
            ...initialState.quotes,
            items: [],
            loading: false,
          },
        });

        expect(reducer(previousState, action)).toEqual({
          ...previousState,
          quotes: {
            ...previousState.quotes,
            items: [
              {
                id: 1,
                name: 'quote1-renamed',
                riskId: 1,
                premium: 10000,
                status: 'QUOTED',
                createdAt: '2021',
                response: action.payload.response,
              },
              { id: 2, name: 'quote2', riskId: 2, premium: 2000, status: 'PENDING' },
            ],
            loading: false,
          },
        });
      });
    });
  });

  describe('facility limits', () => {
    describe('get', () => {
      it('should handle RISK_FACILITY_LIMITS_DEF_GET_REQUEST', () => {
        const action = { type: 'RISK_FACILITY_LIMITS_DEF_GET_REQUEST', payload: 123 };
        expect(reducer(initialState, action)).toEqual({
          ...initialState,
          limits: {
            ...initialState.limits,
            items: [],
            loading: true,
          },
        });
      });

      it('should handle RISK_FACILITY_LIMITS_DEF_GET_SUCCESS', () => {
        const action = {
          type: 'RISK_FACILITY_LIMITS_DEF_GET_SUCCESS',
          payload: [
            {
              name: 'limitState',
              type: 'SELECT',
              indicative: false,
              group: 'LIMIT_APPLICABLE',
              label: 'State',
              qualifier: 'com.priceforbes.edge.programmes.model.products.windhail.USState',
              options: [
                {
                  label: 'Alabama',
                  value: 'ALABAMA',
                },
                {
                  label: 'Alaska',
                  value: 'ALASKA',
                },
              ],
            },
          ],
        };

        expect(reducer(initialState, action)).toEqual({
          ...initialState,
          limits: {
            ...initialState.limits,
            items: action.payload,
            loading: false,
          },
        });
      });

      it('should handle RISK_FACILITY_LIMITS_DEF_GET_FAILURE', () => {
        const action = {
          type: 'RISK_FACILITY_LIMITS_DEF_GET_FAILURE',
          payload: {
            error: 'rates error',
            facilityId: 2,
          },
        };

        expect(reducer(initialState, action)).toEqual({
          ...initialState,
          limits: {
            ...initialState.limits,
            items: [],
            loading: false,
          },
        });
      });
    });
  });

  describe('aggregate Limits', () => {
    describe('get', () => {
      it('should handle RISK_FACILITY_AGGREGATE_LIMITS_GRAPH_GET_REQUEST', () => {
        const action = { type: 'RISK_FACILITY_AGGREGATE_LIMITS_GRAPH_GET_REQUEST' };

        expect(reducer(initialState, action)).toEqual({
          ...initialState,
          limits: {
            ...initialState.limits,
            loading: true,
          },
        });
      });

      it('should handle RISK_FACILITY_AGGREGATE_LIMITS_GRAPH_GET_SUCCESS', () => {
        const aggregates = [
          {
            fieldName: 'limitState',
            label: 'State',
            qualifier: 'com.priceforbes.edge.programmes.model.products.windhail.USState',
            valueLimits: [
              { fieldValue: 'ALABAMA', facilityLimit: 10000000, boundQuotesLimit: 1262998, alertRate: 80, label: 'Alabama' },
              { fieldValue: 'ALASKA', facilityLimit: 10000000, boundQuotesLimit: 1534694, alertRate: 80, label: 'Alaska' },
            ],
          },
          {
            fieldName: 'limitCountry',
            label: 'Country',
            qualifier: 'com.priceforbes.edge.programmes.model.products.windhail.USState',
            valueLimits: [
              { alertRate: 10, boundQuotesLimit: 167173, facilityLimit: 200000, fieldValue: 'UK', label: 'United Kingdom' },
              { alertRate: 50, boundQuotesLimit: 200000, facilityLimit: 6000000, fieldValue: 'US', label: 'United State' },
            ],
          },
        ];
        const action = { type: 'RISK_FACILITY_AGGREGATE_LIMITS_GRAPH_GET_SUCCESS', payload: aggregates };

        expect(reducer(initialState, action)).toEqual({
          ...initialState,
          limits: {
            ...initialState.limits,
            aggregateLimits: aggregates,
            loading: false,
          },
        });

        expect(reducer(previousState, action)).toEqual({
          ...previousState,
          limits: {
            ...previousState.limits,
            aggregateLimits: aggregates,
            loading: false,
          },
        });
      });

      it('should handle RISK_FACILITY_AGGREGATE_LIMITS_GRAPH_GET_FAILURE', () => {
        const action = {
          type: 'RISK_FACILITY_AGGREGATE_LIMITS_GRAPH_GET_FAILURE',
          payload: {
            error: 'limits error',
          },
        };

        expect(reducer(initialState, action)).toEqual({
          ...initialState,
          limits: {
            ...initialState.limits,
            aggregateLimits: [],
            loading: false,
          },
        });

        expect(reducer(previousState, action)).toEqual({
          ...previousState,
          limits: {
            ...previousState.limits,
            aggregateLimits: [],
            loading: false,
          },
        });
      });
    });
  });
});
