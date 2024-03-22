import reducer from './search.reducers';

describe('STORES › REDUCERS › search', () => {
  const initialState = {
    term: '',
    queue: [],
    results: {},
    resultsTerm: '',
    isLoading: false,
    error: '',
  };

  it('should return the initial state', () => {
    // assert
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('should handle SEARCH_GET_REQUEST', () => {
    // arrange
    const action = {
      type: 'SEARCH_GET_REQUEST',
      queue: ['foo'],
      payload: 'foo',
    };

    const previousState = {
      ...initialState,
      queue: [1, 2],
    };

    // assert
    expect(reducer(initialState, action)).toEqual({
      ...initialState,
      term: 'foo',
      queue: ['foo'],
      isLoading: true,
    });

    expect(reducer(previousState, action)).toEqual({
      ...initialState,
      term: 'foo',
      queue: [1, 2, 'foo'],
      isLoading: true,
    });
  });

  it('should handle SEARCH_GET_SUCCESS', () => {
    // arrange
    const expectedPayload = {
      results: { 1: 'foo', 2: 'foobar' },
      term: 'foo',
    };

    const action = {
      type: 'SEARCH_GET_SUCCESS',
      payload: expectedPayload,
    };

    // simulate the state after search request was executed
    const initialSearchState = {
      ...initialState,
      term: 'foo',
      queue: ['foo'],
      isLoading: true,
    };

    // simulate a mismatch between request and success
    const previousState = {
      ...initialState,
      term: 'hello',
      queue: ['hello', 'world', 'foo'],
      results: { 666: 'ohhhh!!' },
      resultsTerm: 'hello',
    };

    // assert
    expect(reducer(initialSearchState, action)).toEqual({
      ...initialSearchState,
      term: 'foo',
      queue: [],
      results: expectedPayload.results,
      resultsTerm: 'foo',
      isLoading: false,
    });

    expect(reducer(previousState, action)).toEqual({
      ...previousState,
      term: 'hello',
      queue: ['hello', 'world'],
      results: { 666: 'ohhhh!!' },
      resultsTerm: 'hello',
      isLoading: true,
    });
  });

  it('should handle SEARCH_GET_FAILURE', () => {
    // arrange
    const action = {
      type: 'SEARCH_GET_FAILURE',
      payload: {
        error: 500,
        term: 'foo',
      },
    };

    // simulate the state after search request was executed
    const initialSearchState = {
      ...initialState,
      term: 'foo',
      queue: ['foo'],
      isLoading: true,
    };

    // simulate a mismatch between request and failure
    const previousState = {
      ...initialState,
      term: 'hello',
      queue: ['hello', 'world', 'foo'],
      results: { 666: 'ohhhh!!' },
      resultsTerm: 'hello',
    };

    // assert
    expect(reducer(initialSearchState, action)).toEqual({
      ...initialSearchState,
      queue: [],
      results: {},
      isLoading: false,
      error: 'advancedSearch.fetchError',
    });

    expect(reducer(previousState, action)).toEqual({
      ...previousState,
      term: 'hello',
      queue: ['hello', 'world'],
      results: { 666: 'ohhhh!!' },
      resultsTerm: 'hello',
      isLoading: true,
    });
  });
});
