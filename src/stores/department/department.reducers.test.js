import reducer from './department.reducers';

describe('STORES › REDUCER › department', () => {
  const initialState = {
    markets: {
      items: [],
      loading: false,
    },
    market: {
      loading: false,
    },
  };

  const previousState = {
    markets: {
      items: [{ id: 1 }, { id: 2, __new__: true }],
      loading: false,
    },
    market: {
      id: 4,
      loading: false,
    },
  };

  const previousStateLoading = {
    markets: {
      items: [{ id: 1 }, { id: 2, __new__: true }],
      loading: true,
    },
    market: {
      id: 4,
      loading: true,
    },
  };

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  describe('markets list', () => {
    describe('get', () => {
      it('should handle DEPARTMENT_MARKETS_LIST_GET_REQUEST', () => {
        // arrange
        const action = { type: 'DEPARTMENT_MARKETS_LIST_GET_REQUEST', payload: 123 };

        // assert
        expect(reducer(initialState, action)).toEqual({
          ...initialState,
          markets: {
            ...initialState.markets,
            loading: true,
          },
        });

        expect(reducer(previousState, action)).toEqual({
          ...previousState,
          markets: {
            ...previousState.markets,
            loading: true,
          },
        });

        expect(reducer(previousStateLoading, action)).toEqual({
          ...previousStateLoading,
          markets: {
            ...previousStateLoading.markets,
            loading: true,
          },
        });
      });

      it('should handle DEPARTMENT_MARKETS_LIST_GET_SUCCESS', () => {
        // arrange
        const action = { type: 'DEPARTMENT_MARKETS_LIST_GET_SUCCESS', payload: [4, 5, 6, 7] };

        // assert
        expect(reducer(initialState, action)).toEqual({
          ...initialState,
          markets: {
            items: [4, 5, 6, 7],
            loading: false,
          },
        });

        expect(reducer(previousState, action)).toEqual({
          ...previousState,
          markets: {
            items: [4, 5, 6, 7],
            loading: false,
          },
        });

        expect(reducer(previousStateLoading, action)).toEqual({
          ...previousStateLoading,
          markets: {
            items: [4, 5, 6, 7],
            loading: false,
          },
        });
      });

      it('should handle DEPARTMENT_MARKETS_LIST_GET_FAILURE', () => {
        // arrange
        const action = { type: 'DEPARTMENT_MARKETS_LIST_GET_FAILURE' };

        // assert
        expect(reducer(initialState, action)).toEqual({
          ...initialState,
          markets: {
            ...initialState.markets,
            loading: false,
          },
        });

        expect(reducer(previousState, action)).toEqual({
          ...previousState,
          markets: {
            ...initialState.markets,
            loading: false,
          },
        });

        expect(reducer(previousStateLoading, action)).toEqual({
          ...previousStateLoading,
          markets: {
            ...initialState.markets,
            loading: false,
          },
        });
      });
    });
  });

  describe('market', () => {
    describe('get', () => {
      it('should handle DEPARTMENT_MARKET_GET_SUCCESS', () => {
        // arrange
        const action = { type: 'DEPARTMENT_MARKET_GET_SUCCESS', payload: { id: 5, name: 'five' } };

        // assert
        expect(reducer(initialState, action)).toEqual({
          ...initialState,
          market: { id: 5, name: 'five' },
        });

        expect(reducer(previousState, action)).toEqual({
          ...previousState,
          market: { id: 5, name: 'five' },
        });

        expect(reducer(previousStateLoading, action)).toEqual({
          ...previousStateLoading,
          market: { id: 5, name: 'five' },
        });
      });
    });

    describe('post', () => {
      it('should handle DEPARTMENT_MARKET_POST_SUCCESS', () => {
        // arrange
        const action = { type: 'DEPARTMENT_MARKET_POST_SUCCESS', payload: { id: 3, name: 'three' } };

        // assert
        expect(reducer(initialState, action)).toEqual({
          ...initialState,
          markets: {
            ...initialState.markets,
            items: [{ id: 3, name: 'three', __new__: true }],
          },
        });

        expect(reducer(previousState, action)).toEqual({
          ...previousState,
          markets: {
            ...previousState.markets,
            items: [{ id: 3, name: 'three', __new__: true }, ...previousState.markets.items],
          },
        });

        expect(reducer(previousStateLoading, action)).toEqual({
          ...previousStateLoading,
          markets: {
            ...previousStateLoading.markets,
            items: [{ id: 3, name: 'three', __new__: true }, ...previousStateLoading.markets.items],
          },
        });
      });
    });

    describe('put', () => {
      it('should handle DEPARTMENT_MARKET_PUT_SUCCESS', () => {
        // arrange
        const action = { type: 'DEPARTMENT_MARKET_PUT_SUCCESS', payload: { id: 1, name: 'one' } };

        // assert
        expect(reducer(initialState, action)).toEqual({
          ...initialState,
          markets: {
            ...initialState.markets,
          },
        });

        expect(reducer(previousState, action)).toEqual({
          ...previousState,
          markets: {
            ...previousState.markets,
            items: [{ id: 1, name: 'one' }, { id: 2 }],
          },
        });

        expect(reducer(previousStateLoading, action)).toEqual({
          ...previousStateLoading,
          markets: {
            ...previousStateLoading.markets,
            items: [{ id: 1, name: 'one' }, { id: 2 }],
          },
        });
      });
    });

    describe('delete', () => {
      it('should handle DEPARTMENT_MARKET_DELETE_SUCCESS', () => {
        // arrange
        const action = { type: 'DEPARTMENT_MARKET_DELETE_SUCCESS', payload: 1 };

        // assert
        expect(reducer(initialState, action)).toEqual({
          ...initialState,
          markets: {
            ...initialState.markets,
            items: [],
          },
        });

        expect(reducer(previousState, action)).toEqual({
          ...previousState,
          markets: {
            ...previousState.markets,
            items: [{ id: 2 }],
          },
        });

        expect(reducer(previousStateLoading, action)).toEqual({
          ...previousStateLoading,
          markets: {
            ...previousStateLoading.markets,
            items: [{ id: 2 }],
          },
        });
      });
    });
  });
});
