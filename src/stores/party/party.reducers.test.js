import reducer from './party.reducers';
import config from 'config';

describe('STORES › REDUCERS › party', () => {
  const initialState = {
    carriers: {
      items: [],
      itemsTotal: 0,
      page: 1,
      pageSize: config.ui.pagination.default,
      pageTotal: 0,
      query: '',
      sortBy: 'name',
      sortType: 'text',
      sortDirection: 'asc',
      loading: false,
    },
    clients: {
      items: [],
      itemsTotal: 0,
      page: 1,
      pageSize: config.ui.pagination.default,
      pageTotal: 0,
      query: '',
      sortBy: 'name',
      sortType: 'text',
      sortDirection: 'asc',
      loading: false,
    },
    insureds: {
      items: [],
      itemsTotal: 0,
      page: 1,
      pageSize: config.ui.pagination.default,
      pageTotal: 0,
      query: '',
      sortBy: 'name',
      sortType: 'text',
      sortDirection: 'asc',
      loading: false,
    },
    reinsureds: {
      items: [],
      itemsTotal: 0,
      page: 1,
      pageSize: config.ui.pagination.default,
      pageTotal: 0,
      query: '',
      sortBy: 'name',
      sortType: 'text',
      sortDirection: 'asc',
      loading: false,
    },
    pricerModule: {
      items: [],
    },
    notifiedUsers: {
      items: [],
      itemsTotal: 0,
      loading: false,
    },
  };

  const getData = {
    content: [
      { id: 1, name: 'Foo' },
      { id: 2, name: 'Bar' },
    ],
    pagination: {},
  };

  it('should return the initial state', () => {
    // assert
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  describe('carriers', () => {
    describe('get', () => {
      it('should handle SUCCESS', () => {
        // arrange
        const action = {
          type: 'CARRIERS_GET_SUCCESS',
          payload: getData,
        };

        const expectedState = {
          ...initialState,
          carriers: {
            ...initialState.carriers,
            items: getData.content,
          },
        };

        // assert
        expect(reducer(initialState, action)).toEqual({ ...initialState, ...expectedState });
      });
    });

    describe('post', () => {
      it('should handle SUCCESS', () => {
        // arrange
        const action = {
          type: 'CARRIER_POST_SUCCESS',
          payload: { id: 1, name: 'Foo' },
        };
        const expectedState = {
          ...initialState,
          carriers: {
            ...initialState.carriers,
            items: [{ id: 1, name: 'Foo', __new__: true }],
            itemsTotal: initialState.carriers.itemsTotal + 1,
          },
        };

        // assert
        expect(reducer(initialState, action)).toEqual({ ...initialState, ...expectedState });
      });
    });
  });

  describe('pricerModule', () => {
    describe('get', () => {
      it('should handle SUCCESS', () => {
        // arrange
        const action = {
          type: 'PRICER_MODULE_GET_SUCCESS',
          payload: [1, 2, 3],
        };

        const expectedState = {
          ...initialState,
          pricerModule: {
            ...initialState.pricerModule,
            items: [1, 2, 3],
          },
        };

        // assert
        expect(reducer(initialState, action)).toEqual({ ...initialState, ...expectedState });
      });
    });
  });

  describe('clients', () => {
    describe('get', () => {
      it('should handle SUCCESS', () => {
        // arrange
        const action = {
          type: 'CLIENTS_GET_SUCCESS',
          payload: getData,
        };

        const expectedState = {
          ...initialState,
          clients: {
            ...initialState.clients,
            items: getData.content,
          },
        };

        // assert
        expect(reducer(initialState, action)).toEqual({ ...initialState, ...expectedState });
      });
    });

    describe('post', () => {
      it('should handle SUCCESS', () => {
        // arrange
        const action = {
          type: 'CLIENT_POST_SUCCESS',
          payload: { id: 1, name: 'Foo' },
        };
        const expectedState = {
          ...initialState,
          clients: {
            ...initialState.clients,
            items: [{ id: 1, name: 'Foo', __new__: true }],
            itemsTotal: initialState.clients.itemsTotal + 1,
          },
        };

        // assert
        expect(reducer(initialState, action)).toEqual({ ...initialState, ...expectedState });
      });
    });
  });

  describe('insureds', () => {
    describe('get', () => {
      it('should handle SUCCESS', () => {
        // arrange
        const action = {
          type: 'INSUREDS_GET_SUCCESS',
          payload: getData,
        };
        const expectedState = {
          ...initialState,
          insureds: {
            ...initialState.insureds,
            items: getData.content,
          },
        };

        // assert
        expect(reducer(initialState, action)).toEqual({ ...initialState, ...expectedState });
      });
    });

    describe('post', () => {
      it('should handle SUCCESS', () => {
        // arrange
        const action = {
          type: 'INSURED_POST_SUCCESS',
          payload: { id: 1, name: 'Foo' },
        };
        const expectedState = {
          ...initialState,
          insureds: {
            ...initialState.insureds,
            items: [{ id: 1, name: 'Foo', __new__: true }],
            itemsTotal: initialState.clients.itemsTotal + 1,
          },
        };

        // assert
        expect(reducer(initialState, action)).toEqual({ ...initialState, ...expectedState });
      });
    });
  });

  describe('reinsureds', () => {
    describe('get', () => {
      it('should handle SUCCESS', () => {
        // arrange
        const action = {
          type: 'REINSUREDS_GET_SUCCESS',
          payload: getData,
        };
        const expectedState = {
          ...initialState,
          reinsureds: {
            ...initialState.reinsureds,
            items: getData.content,
          },
        };

        // assert
        expect(reducer(initialState, action)).toEqual({ ...initialState, ...expectedState });
      });
    });
  });
});
