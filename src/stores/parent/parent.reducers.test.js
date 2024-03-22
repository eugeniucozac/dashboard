import reducer from './parent.reducers';

describe('STORES › REDUCERS › parent', () => {
  const initialState = {
    selected: null,
    list: [],
    listFetched: false,
    offices: [],
    placements: [],
    placementsFetched: false,
    loading: {
      selected: false,
      list: false,
      offices: false,
      placements: false,
    },
  };

  const previousState = {
    selected: { id: 1, name: 'Parent 1' },
    list: [10, 11, 12],
    listFetched: true,
    offices: [20, 21, 23],
    placements: [30, 31, 32],
    placementsFetched: true,
    loading: {
      selected: true,
      list: true,
      offices: true,
      placements: true,
    },
  };

  it('should return the initial state', () => {
    // arrange
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  describe('get', () => {
    it('should handle PARENT_GET_REQUEST', () => {
      // arrange
      const action = {
        type: 'PARENT_GET_REQUEST',
        payload: 123,
      };

      // assert
      expect(reducer(initialState, action)).toEqual({
        ...initialState,
        loading: {
          ...initialState.loading,
          selected: true,
          offices: true,
        },
      });

      expect(reducer(previousState, action)).toEqual({
        ...previousState,
        loading: {
          ...previousState.loading,
          selected: true,
          offices: true,
        },
      });
    });

    it('should handle PARENT_GET_SUCCESS', () => {
      // arrange
      const action = {
        type: 'PARENT_GET_SUCCESS',
        payload: {
          id: 100,
          name: 'Parent 100',
          offices: ['a', 'b', 'c'],
        },
      };

      // assert
      expect(reducer(initialState, action)).toEqual({
        ...initialState,
        offices: ['a', 'b', 'c'],
        selected: { id: 100, name: 'Parent 100' },
        placements: [],
        loading: {
          ...initialState.loading,
          selected: false,
          offices: false,
        },
      });

      expect(reducer(previousState, action)).toEqual({
        ...previousState,
        offices: ['a', 'b', 'c'],
        selected: { id: 100, name: 'Parent 100' },
        placements: [],
        loading: {
          ...previousState.loading,
          selected: false,
          offices: false,
        },
      });
    });

    it('should handle PARENT_GET_FAILURE', () => {
      // arrange
      const action = {
        type: 'PARENT_GET_FAILURE',
        payload: { status: 404 },
      };

      // assert
      expect(reducer(initialState, action)).toEqual({
        ...initialState,
        loading: {
          ...initialState.loading,
          selected: false,
          offices: false,
        },
      });

      expect(reducer(previousState, action)).toEqual({
        ...previousState,
        offices: initialState.offices,
        selected: initialState.selected,
        placements: initialState.placements,
        loading: {
          ...previousState.loading,
          selected: false,
          offices: false,
        },
      });
    });
  });

  describe('get placements', () => {
    it('should handle PARENT_PLACEMENTS_GET_REQUEST', () => {
      // arrange
      const action = {
        type: 'PARENT_PLACEMENTS_GET_REQUEST',
        payload: 123,
      };

      // assert
      expect(reducer(initialState, action)).toEqual({
        ...initialState,
        placementsFetched: false,
        loading: {
          ...initialState.loading,
          placements: true,
        },
      });

      expect(reducer(previousState, action)).toEqual({
        ...previousState,
        placementsFetched: false,
        loading: {
          ...previousState.loading,
          placements: true,
        },
      });
    });

    it('should handle PARENT_PLACEMENTS_GET_SUCCESS', () => {
      // arrange
      const action = {
        type: 'PARENT_PLACEMENTS_GET_SUCCESS',
        payload: {
          content: ['aa', 'bb', 'cc'],
        },
      };

      // assert
      expect(reducer(initialState, action)).toEqual({
        ...initialState,
        placements: ['aa', 'bb', 'cc'],
        placementsFetched: true,
        loading: {
          ...initialState.loading,
          placements: false,
        },
      });

      expect(reducer(previousState, action)).toEqual({
        ...previousState,
        placements: ['aa', 'bb', 'cc'],
        placementsFetched: true,
        loading: {
          ...previousState.loading,
          placements: false,
        },
      });
    });

    it('should handle PARENT_PLACEMENTS_GET_FAILURE', () => {
      // arrange
      const action = {
        type: 'PARENT_PLACEMENTS_GET_FAILURE',
        payload: { status: 404 },
      };

      // assert
      expect(reducer(initialState, action)).toEqual({
        ...initialState,
        placementsFetched: true,
        loading: {
          ...initialState.loading,
          placements: false,
        },
      });

      expect(reducer(previousState, action)).toEqual({
        ...previousState,
        placements: initialState.placements,
        placementsFetched: true,
        loading: {
          ...previousState.loading,
          placements: false,
        },
      });
    });
  });

  describe('get list', () => {
    it('should handle PARENT_LIST_GET_REQUEST', () => {
      // arrange
      const action = { type: 'PARENT_LIST_GET_REQUEST' };

      // assert
      expect(reducer(initialState, action)).toEqual({
        ...initialState,
        listFetched: false,
        loading: {
          ...initialState.loading,
          list: true,
        },
      });

      expect(reducer(previousState, action)).toEqual({
        ...previousState,
        listFetched: false,
        loading: {
          ...previousState.loading,
          list: true,
        },
      });
    });

    it('should handle PARENT_LIST_GET_SUCCESS', () => {
      // arrange
      const action = {
        type: 'PARENT_LIST_GET_SUCCESS',
        payload: {
          content: ['aaa', 'bbb', 'ccc'],
        },
      };

      // assert
      expect(reducer(initialState, action)).toEqual({
        ...initialState,
        list: ['aaa', 'bbb', 'ccc'],
        listFetched: true,
        loading: {
          ...initialState.loading,
          list: false,
        },
      });

      expect(reducer(previousState, action)).toEqual({
        ...previousState,
        list: ['aaa', 'bbb', 'ccc'],
        listFetched: true,
        loading: {
          ...previousState.loading,
          list: false,
        },
      });
    });

    it('should handle PARENT_LIST_GET_SUCCESS received an empty list', () => {
      // arrange
      const action = {
        type: 'PARENT_LIST_GET_SUCCESS',
        payload: {
          content: [],
        },
      };

      // assert
      expect(reducer(initialState, action)).toEqual({
        ...initialState,
        listFetched: true,
        loading: {
          ...initialState.loading,
          list: false,
        },
      });

      expect(reducer(previousState, action)).toEqual({
        ...previousState,
        list: initialState.list,
        listFetched: true,
        loading: {
          ...previousState.loading,
          list: false,
        },
      });
    });

    it('should handle PARENT_LIST_GET_FAILURE', () => {
      // arrange
      const action = {
        type: 'PARENT_LIST_GET_FAILURE',
        payload: { status: 404 },
      };

      // assert
      expect(reducer(initialState, action)).toEqual({
        ...initialState,
        listFetched: true,
        loading: {
          ...initialState.loading,
          list: false,
        },
      });

      expect(reducer(previousState, action)).toEqual({
        ...previousState,
        list: initialState.list,
        listFetched: true,
        loading: {
          ...previousState.loading,
          list: false,
        },
      });
    });
  });

  describe('others', () => {
    it('should handle PARENT_DELETE_PLACEMENTS', () => {
      // arrange
      const action = { type: 'PARENT_DELETE_PLACEMENTS' };

      // assert
      expect(reducer(initialState, action)).toEqual({
        ...initialState,
        placementsFetched: false,
      });

      expect(reducer(previousState, action)).toEqual({
        ...previousState,
        placements: initialState.placements,
        placementsFetched: false,
      });
    });
  });
});
