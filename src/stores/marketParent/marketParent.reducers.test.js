import reducer from './marketParent.reducers';

describe('STORES › REDUCER', () => {
  describe('marketParent', () => {
    const initialState = {
      listAll: { items: [] },
      list: {
        items: [],
        itemsTotal: 0,
        page: 1,
        pageSize: 10,
        pageTotal: 0,
        sortBy: 'name',
        sortDirection: 'asc',
      },
      placements: [],
      selected: null,
    };

    it('should return the initial state', () => {
      // arrange
      expect(reducer(undefined, {})).toEqual(initialState);
    });

    it('should handle MARKET_PARENT_GET_SUCCESS', () => {
      // arrange
      const action = {
        type: 'MARKET_PARENT_GET_SUCCESS',
        payload: { marketParent: { id: 1 } },
      };

      const previousState = {
        ...initialState,
        placements: [{ id: 2 }],
      };

      // assert
      expect(reducer(previousState, action)).toEqual({
        ...initialState,
        placements: [],
        selected: { id: 1 },
      });
    });

    it('should handle MARKET_PARENT_EDIT_MARKETS_SUCCESS', () => {
      // arrange
      const action = {
        type: 'MARKET_PARENT_EDIT_MARKETS_SUCCESS',
        payload: { id: 1, markets: [{ id: 2 }] },
      };

      const previousState = {
        ...initialState,
        list: { items: [{ id: 1 }, { id: 2 }] },
      };

      // assert
      expect(reducer(previousState, action)).toEqual({
        ...initialState,
        list: { items: [{ id: 1, markets: [{ id: 2 }] }, { id: 2 }] },
      });
    });

    it('should handle MARKET_PARENT_LIST_ALL_GET_SUCCESS', () => {
      // arrange
      const action = {
        type: 'MARKET_PARENT_LIST_ALL_GET_SUCCESS',
        payload: [{ id: 1 }],
      };

      // assert
      expect(reducer(initialState, action)).toEqual({
        ...initialState,
        listAll: { items: [{ id: 1 }] },
      });
    });

    it('should handle MARKET_PARENT_LIST_ALL_GET_FAILURE', () => {
      // arrange
      const action = {
        type: 'MARKET_PARENT_LIST_GET_ALL_FAILURE',
        payload: [{ id: 2 }],
      };

      const previousState = {
        ...initialState,
        listAll: { items: [{ id: 1 }] },
      };

      // assert
      expect(reducer(previousState, action)).toEqual({
        ...initialState,
      });
    });

    it('should handle MARKET_PARENT_PLACEMENTS_GET_SUCCESS', () => {
      // arrange
      const action = {
        type: 'MARKET_PARENT_PLACEMENTS_GET_SUCCESS',
        payload: { marketParentId: 2, placements: [{ id: 3 }] },
      };

      const previousState = {
        ...initialState,
        listAll: { items: [{ id: 1 }, { id: 2 }] },
      };

      // assert
      expect(reducer(previousState, action)).toEqual({
        ...initialState,
        listAll: { items: [{ id: 1 }, { id: 2 }] },
        placements: [{ id: 3 }],
        selected: { id: 2 },
      });
    });
  });
});
