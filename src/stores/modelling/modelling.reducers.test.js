import reducer from './modelling.reducers';

describe('STORES › REDUCERS › modelling', () => {
  const initialState = {
    list: {
      items: [],
      itemsTotal: 0,
      page: 1,
      pageSize: 10,
      pageTotal: 0,
      sortBy: 'dueDate',
      sortDirection: 'desc',
      sortType: 'text',
    },
    selected: {},
    create: false,
  };

  it('should return the initial state', () => {
    // arrange
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('should handle MODELLING_GET_SUCCESS', () => {
    // arrange
    const expectedPayload = {
      foo: 1,
    };
    const action = {
      type: 'MODELLING_GET_SUCCESS',
      payload: expectedPayload,
    };
    const expectedState = {
      ...initialState,
      selected: expectedPayload,
    };

    // assert
    expect(reducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle MODELLING_POST_SUCCESS', () => {
    // arrange
    const expectedPayload = {
      foo: 1,
    };
    const action = {
      type: 'MODELLING_POST_SUCCESS',
      payload: expectedPayload,
    };
    const expectedState = {
      ...initialState,
      create: true,
      selected: expectedPayload,
    };

    // assert
    expect(reducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle MODELLING_PUT_SUCCESS', () => {
    // arrange
    const expectedPayload = {
      foo: 1,
    };
    const action = {
      type: 'MODELLING_PUT_SUCCESS',
      payload: expectedPayload,
    };
    const expectedState = {
      ...initialState,
      selected: expectedPayload,
    };

    // assert
    expect(reducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle MODELLING_LIST_GET_SUCCESS', () => {
    // arrange
    const action = {
      type: 'MODELLING_LIST_GET_SUCCESS',
      payload: {
        content: [{ foo: 'bar' }],
        pagination: { page: 1 },
      },
    };
    const expectedState = {
      ...initialState,
      list: {
        ...initialState.list,
        query: '',
        items: [{ foo: 'bar' }],
      },
    };

    // assert
    expect(reducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle MODELLING_RESET', () => {
    // arrange
    const action = { type: 'MODELLING_RESET' };
    const expectedState = {
      ...initialState,
      selected: {},
    };

    // assert
    expect(
      reducer(
        {
          ...initialState,
          selected: { foo: 1 },
        },
        action
      )
    ).toEqual(expectedState);
  });

  it('should handle MODELLING_LIST_RESET', () => {
    // arrange
    const action = { type: 'MODELLING_LIST_RESET' };
    const expectedState = {
      ...initialState,
      list: { ...initialState.list },
    };

    // assert
    expect(
      reducer(
        {
          ...initialState,
          list: { foo: 1 },
        },
        action
      )
    ).toEqual(expectedState);
  });
});
