import reducer from './market.reducers';

describe('STORES › REDUCER', () => {
  describe('market', () => {
    const initialState = {
      selected: null,
    };

    const prevState = {
      selected: {
        id: 123,
        name: 'foo',
      },
    };

    it('should return the initial state', () => {
      // arrange
      expect(reducer(undefined, {})).toEqual(initialState);
    });

    it('should handle MARKET_RESET', () => {
      // arrange
      const action = { type: 'MARKET_RESET' };

      // assert
      expect(reducer(initialState, action)).toEqual({ selected: null });
      expect(reducer(prevState, action)).toEqual({ selected: null });
    });

    it('should handle MARKET_POLICY_SELECT', () => {
      // arrange
      const action = {
        type: 'MARKET_POLICY_SELECT',
        payload: { id: 1 },
      };

      // assert
      expect(reducer(initialState, action)).toEqual({ selected: { id: 1 } });
      expect(reducer(prevState, action)).toEqual({ selected: { id: 1 } });
    });

    it('should handle MARKET_LAYER_SELECT', () => {
      // arrange
      const action = {
        type: 'MARKET_LAYER_SELECT',
        payload: { id: 2 },
      };

      // assert
      expect(reducer(initialState, action)).toEqual({ selected: { id: 2 } });
      expect(reducer(prevState, action)).toEqual({ selected: { id: 2 } });
    });
  });
});
