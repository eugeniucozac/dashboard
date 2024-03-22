import reducer from './policy.reducers';

describe('STORES › REDUCER', () => {
  describe('policy', () => {
    const initialState = {
      selected: null,
      placement: null,
      loading: {
        selected: false,
        placement: false,
      },
    };

    const previousState = {
      selected: { id: 123 },
      placement: { id: 456 },
      loading: {
        selected: false,
        placement: false,
      },
    };

    const previousStateLoading = {
      selected: { id: 123 },
      placement: { id: 456 },
      loading: {
        selected: true,
        placement: true,
      },
    };

    it('should return the initial state', () => {
      // arrange
      expect(reducer(undefined, {})).toEqual(initialState);
    });

    it('should handle POLICY_GET_REQUEST', () => {
      // arrange
      const action = {
        type: 'POLICY_GET_REQUEST',
        payload: 1,
      };

      // assert
      expect(reducer(undefined, action)).toEqual({ ...initialState, loading: { ...initialState.loading, selected: true } });
      expect(reducer(previousState, action)).toEqual({ ...previousState, loading: { ...previousState.loading, selected: true } });
      expect(reducer(previousStateLoading, action)).toEqual({
        ...previousStateLoading,
        loading: { ...previousStateLoading.loading, selected: true },
      });
    });

    it('should handle POLICY_GET_SUCCESS', () => {
      // arrange
      const action = {
        type: 'POLICY_GET_SUCCESS',
        payload: [{ id: 'foo' }],
      };

      // assert
      expect(reducer(undefined, action)).toEqual({
        ...initialState,
        selected: { id: 'foo' },
        placement: null,
        loading: {
          ...initialState.loading,
          selected: false,
        },
      });

      expect(reducer(previousState, action)).toEqual({
        ...previousState,
        selected: { id: 'foo' },
        placement: null,
        loading: {
          ...previousState.loading,
          selected: false,
        },
      });

      expect(reducer(previousStateLoading, action)).toEqual({
        ...previousStateLoading,
        selected: { id: 'foo' },
        placement: null,
        loading: {
          ...previousStateLoading.loading,
          selected: false,
        },
      });
    });

    it('should handle POLICY_GET_FAILURE', () => {
      // arrange
      const action = {
        type: 'POLICY_GET_FAILURE',
        payload: { error: 500 },
      };

      // assert
      expect(reducer(undefined, action)).toEqual({
        ...initialState,
        selected: null,
        placement: null,
        loading: {
          ...initialState.loading,
          selected: false,
        },
      });

      expect(reducer(previousState, action)).toEqual({
        ...previousState,
        selected: null,
        placement: null,
        loading: {
          ...previousState.loading,
          selected: false,
        },
      });

      expect(reducer(previousStateLoading, action)).toEqual({
        ...previousStateLoading,
        selected: null,
        placement: null,
        loading: {
          ...previousStateLoading.loading,
          selected: false,
        },
      });
    });

    it('should handle POLICY_RESET', () => {
      // arrange
      const action = {
        type: 'POLICY_RESET',
      };

      // assert
      expect(reducer(undefined, action)).toEqual(initialState);
      expect(reducer(previousState, action)).toEqual(initialState);
      expect(reducer(previousStateLoading, action)).toEqual(initialState);
    });

    it('should handle POLICY_PLACEMENT_GET_REQUEST', () => {
      // arrange
      const action = {
        type: 'POLICY_PLACEMENT_GET_REQUEST',
        payload: 1,
      };

      // assert
      expect(reducer(undefined, action)).toEqual({
        ...initialState,
        loading: { ...initialState.loading, placement: true },
      });

      expect(reducer(previousState, action)).toEqual({
        ...previousState,
        loading: { ...previousState.loading, placement: true },
      });

      expect(reducer(previousStateLoading, action)).toEqual({
        ...previousStateLoading,
        loading: { ...previousStateLoading.loading, placement: true },
      });
    });

    it('should handle POLICY_PLACEMENT_GET_SUCCESS', () => {
      // arrange
      const action = {
        type: 'POLICY_PLACEMENT_GET_SUCCESS',
        payload: { id: 'bar' },
      };

      // assert
      expect(reducer(undefined, action)).toEqual({
        ...initialState,
        selected: null,
        placement: { id: 'bar' },
        loading: {
          ...initialState.loading,
          placement: false,
        },
      });

      expect(reducer(previousState, action)).toEqual({
        ...previousState,
        placement: { id: 'bar' },
        loading: {
          ...previousState.loading,
          placement: false,
        },
      });

      expect(reducer(previousStateLoading, action)).toEqual({
        ...previousStateLoading,
        placement: { id: 'bar' },
        loading: {
          ...previousStateLoading.loading,
          placement: false,
        },
      });
    });

    it('should handle POLICY_PLACEMENT_GET_FAILURE', () => {
      // arrange
      const action = {
        type: 'POLICY_PLACEMENT_GET_FAILURE',
        payload: { error: 500 },
      };

      // assert
      expect(reducer(undefined, action)).toEqual({
        ...initialState,
        placement: null,
        loading: {
          ...initialState.loading,
          placement: false,
        },
      });

      expect(reducer(previousState, action)).toEqual({
        ...previousState,
        placement: null,
        loading: {
          ...previousState.loading,
          placement: false,
        },
      });

      expect(reducer(previousStateLoading, action)).toEqual({
        ...previousStateLoading,
        placement: null,
        loading: {
          ...previousStateLoading.loading,
          placement: false,
        },
      });
    });
  });
});
