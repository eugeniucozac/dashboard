import reducer from './whitespace.reducers';

describe('STORES › REDUCERS › whitespace', () => {
  const initialState = {
    templates: {
      items: [],
      loading: false,
    },
  };

  const getData = ['Foo', 'Bar'];

  it('should return the initial state', () => {
    // assert
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  describe('templates get', () => {
    it('should handle REQUEST', () => {
      // arrange
      const action = {
        type: 'TEMPLATES_GET_REQUEST',
      };
      const expectedState = {
        ...initialState,
        templates: {
          ...initialState.templates,
          loading: true,
        },
      };

      // assert
      expect(reducer(initialState, action)).toEqual({ ...initialState, ...expectedState });
    });
    it('should handle SUCCESS', () => {
      // arrange
      const action = {
        type: 'TEMPLATES_GET_SUCCESS',
        payload: getData,
      };
      const expectedState = {
        ...initialState,
        templates: {
          ...initialState.templates,
          items: getData,
          loading: false,
        },
      };

      // assert
      expect(reducer(initialState, action)).toEqual({ ...initialState, ...expectedState });
    });
  });
});
