import reducer from './articles.reducers';

describe('STORES › REDUCERS › articles', () => {
  const initialState = {
    list: {
      items: [],
      topics: [],
      page: 0,
      pageSize: 25,
      itemsTotal: 100,
    },
    initialLoad: false,
    isLoading: false,
  };

  it('should return the initial state', () => {
    // arrange
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('should handle ARTICLES_GET_REQUEST', () => {
    // arrange
    const expectedPayload = {
      foo: 1,
    };
    const action = {
      type: 'ARTICLES_GET_REQUEST',
      payload: expectedPayload,
    };
    const expectedState = {
      ...initialState,
      isLoading: true,
    };

    // assert
    expect(reducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle ARTICLES_GET_SUCCESS', () => {
    // arrange
    const expectedPayload = {
      items: [{ value: 1, name: 'one' }],
    };
    const action = {
      type: 'ARTICLES_GET_SUCCESS',
      payload: expectedPayload,
    };
    const expectedState = {
      ...initialState,
      isLoading: false,
      list: { ...initialState.list, ...expectedPayload },
    };

    // assert
    expect(reducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle ARTICLES_UPDATE_TOPICS_SUCCESS', () => {
    // arrange
    const expectedPayload = [{ foo: 1 }];
    const action = {
      type: 'ARTICLES_UPDATE_TOPICS_SUCCESS',
      payload: expectedPayload,
    };
    const expectedState = {
      ...initialState,
      list: { ...initialState.list, topics: expectedPayload },
    };

    // assert
    expect(reducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle ARTICLES_INITIAL_LOAD_SUCCESS', () => {
    // arrange
    const action = {
      type: 'ARTICLES_INITIAL_LOAD_SUCCESS',
    };
    const expectedState = {
      ...initialState,
      initialLoad: true,
    };

    // assert
    expect(reducer(initialState, action)).toEqual(expectedState);
  });
});
